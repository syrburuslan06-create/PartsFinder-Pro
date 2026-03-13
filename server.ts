import { GoogleGenAI } from "@google/genai";
import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import xss from "xss";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = 3000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for AI Studio iframe compatibility
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.APP_URL || "*", // Restrict in production
  credentials: true
}));

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: { error: "Too many requests, please try again later." }
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { error: "Account locked for 15 minutes due to too many failed login attempts." }
});

const searchLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 5,
  message: { error: "Daily search limit reached for free plan." }
});

app.use("/api/", generalLimiter);
app.use("/api/auth/login", loginLimiter);
app.use("/api/search", searchLimiter);

// Initialize Stripe lazily
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is required");
    stripeClient = new Stripe(key, { apiVersion: "2026-02-25.clover" as any });
  }
  return stripeClient;
}

// Initialize Supabase Admin lazily
let supabaseAdmin: any = null;
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    supabaseAdmin = createClient(url, key);
  }
  return supabaseAdmin;
}

const blockedIPs = new Set<string>();

const ipBlocker = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || 'unknown';
  if (blockedIPs.has(ip)) {
    return res.status(403).json({ error: "Access denied. IP blocked due to security violations." });
  }
  next();
};

app.use(ipBlocker);

// Helper to log security events
async function logSecurityEvent(
  eventType: string,
  severity: 'ok' | 'warn' | 'alert' | 'critical',
  ipAddress: string,
  emailTried?: string,
  details?: any
) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;
    
    await supabase.from('security_events').insert({
      event_type: eventType,
      severity,
      ip_address: ipAddress,
      email_tried: emailTried,
      details
    } as any);

    if (severity === 'critical' && ipAddress !== 'unknown') {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('security_events')
        .select('id')
        .eq('ip_address', ipAddress)
        .eq('severity', 'critical')
        .gte('created_at', oneHourAgo);

      if (!error && data && data.length >= 3) {
        blockedIPs.add(ipAddress);
        console.warn(`IP ${ipAddress} blocked due to multiple critical events.`);
      }
    }
  } catch (err) {
    console.error('Failed to log security event:', err);
  }
}

// Middleware to verify Supabase JWT
const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    let supabase = getSupabaseAdmin();
    if (!supabase) {
      if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase not configured');
      }
      supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      });
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error('Invalid token');
    }

    // Fetch user profile to get role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_blocked')
      .eq('id', user.id)
      .single();

    if (profile && profile.is_blocked) {
      return res.status(401).json({ error: 'Account suspended' });
    }

    (req as any).user = { ...user, role: profile ? profile.role : undefined };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const requireRole = (roles: string[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      await logSecurityEvent('role_escalation_attempt', 'critical', req.ip || 'unknown', user?.email || 'unknown', {
        requiredRoles: roles,
        userRole: user?.role,
        path: req.path
      });
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Webhook endpoint needs raw body
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const stripe = getStripe();
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !webhookSecret) {
        await logSecurityEvent('invalid_webhook_signature', 'critical', req.ip || 'unknown', 'system', { error: 'Missing signature or secret' });
        return res.status(400).send("Webhook secret or signature missing");
      }

      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const plan = session.metadata?.plan || "individual";
        const newSeats = parseInt(session.metadata?.seats || "1", 10);

        if (userId) {
          const supabase = getSupabaseAdmin();
          if (supabase) {
            // Fetch current profile to get existing seats
            const { data: profile } = await supabase
              .from("profiles")
              .select("seats")
              .eq("id", userId)
              .single();
              
            const currentSeats = (profile && profile.seats) ? profile.seats : 0;
            const totalSeats = plan === "director" ? currentSeats + newSeats : 1;

            let nextPaymentDate = null;
            if (session.subscription) {
              try {
                const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
                nextPaymentDate = new Date(subscription.current_period_end * 1000).toISOString();
              } catch (e) {
                console.error("Could not retrieve subscription details", e);
              }
            }

            await supabase
              .from("profiles")
              .update({
                plan: plan,
                is_paid: true,
                seats: totalSeats,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                next_payment_date: nextPaymentDate,
              } as any)
              .eq("id", userId);
          } else {
            console.warn("Stripe webhook received but Supabase Admin is not configured. Cannot update user profile.");
          }
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook Error:", err.message);
      await logSecurityEvent('invalid_webhook_signature', 'critical', req.ip || 'unknown', 'system', { error: err.message });
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// Standard JSON body parser for other routes
app.use(express.json());

// Input validation and sanitization helpers
const sanitizeInput = (input: string) => xss(input);
const validateVIN = (vin: string) => /^[A-Z0-9]{17}$/i.test(vin);
const validatePartNumber = (partNumber: string) => /^[A-Z0-9-]{1,50}$/i.test(partNumber);

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const supabase = getSupabaseAdmin();

    // Check if account is locked
    let profile = null;
    if (supabase) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('locked_until, failed_login_attempts, is_blocked')
          .eq('email', email)
          .single();
        profile = data;
      } catch (e) {
        console.warn("Could not fetch security columns from profiles table. Migration might be missing.");
      }

      if (profile?.is_blocked) {
        await logSecurityEvent('blocked_user_login', 'alert', ipAddress, email);
        return res.status(401).json({ error: 'Account suspended' });
      }

      if (profile?.locked_until && new Date(profile.locked_until) > new Date()) {
        await logSecurityEvent('account_locked', 'warn', ipAddress, email);
        return res.status(403).json({ error: 'Account locked for 15 minutes due to too many failed login attempts.' });
      }
    }

    // Attempt login using regular client (not admin) to verify password
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      return res.status(500).json({ error: 'Supabase is not configured' });
    }
    const authClient: any = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Increment failed login attempts
      if (supabase) {
        const attempts = (profile?.failed_login_attempts || 0) + 1;
        let lockedUntil = null;

        if (attempts >= 5) {
          lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Lock for 15 mins
          await logSecurityEvent('account_locked', 'warn', ipAddress, email);
        } else {
          await logSecurityEvent('failed_login', 'warn', ipAddress, email, { error: error.message });
        }

        // Update profile with failed attempts
        if (profile) {
          try {
            await supabase
              .from('profiles')
              .update({
                failed_login_attempts: attempts,
                locked_until: lockedUntil
              } as any)
              .eq('email', email);
          } catch (e) {
            console.warn("Could not update security columns. Migration might be missing.");
          }
        }
      }

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    await logSecurityEvent('successful_login', 'ok', ipAddress, email);

    // Reset failed attempts
    if (supabase && profile && profile.failed_login_attempts > 0) {
      try {
        await supabase
          .from('profiles')
          .update({
            failed_login_attempts: 0,
            locked_until: null
          } as any)
          .eq('email', email);
      } catch (e) {
        console.warn("Could not reset security columns. Migration might be missing.");
      }
    }

    res.json({ session: data.session, user: data.user });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.post("/api/ai/analyze-photo", requireAuth, async (req, res) => {
  try {
    const { imageBase64, mimeType, filename } = req.body;
    
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "Image data is required" });
    }

    // Validate mime type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({ error: "Invalid file type. Only JPG, PNG, and WEBP are allowed." });
    }

    // Validate size (approximate from base64 length: length * 0.75)
    const sizeInBytes = imageBase64.length * 0.75;
    if (sizeInBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeds 5MB limit." });
    }

    // Validate filename for path traversal
    if (filename && (filename.includes('..') || filename.includes('/') || filename.includes('\\'))) {
      const userEmail = (req as any).user?.email || 'unknown';
      await logSecurityEvent('path_traversal_attempt', 'critical', req.ip || 'unknown', userEmail, { filename });
      return res.status(400).json({ error: "Invalid filename." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this car part photo. Identify the part name, potential part number, condition, and any visible damage. Return the result in a structured JSON format.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze photo" });
  }
});

app.post("/api/search", requireAuth, requireRole(['mechanic', 'super_admin']), searchLimiter, async (req, res) => {
  try {
    let { vin, partNumber, description } = req.body;
    
    // Sanitize inputs
    if (vin) {
      vin = sanitizeInput(vin).toUpperCase();
      if (!validateVIN(vin)) {
        return res.status(400).json({ error: "Invalid VIN format. Must be exactly 17 alphanumeric characters." });
      }
    }
    
    if (partNumber) {
      partNumber = sanitizeInput(partNumber).toUpperCase();
      if (!validatePartNumber(partNumber)) {
        return res.status(400).json({ error: "Invalid part number format. Max 50 characters, alphanumeric and dashes only." });
      }
    }
    
    if (description) {
      description = sanitizeInput(description);
    }

    // Perform search logic here (e.g., query database or external API)
    // For now, return a mock response
    res.json({ results: [] });
  } catch (error: any) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "An error occurred during search" });
  }
});

app.get("/api/admin", requireAuth, requireRole(['super_admin']), (req, res) => {
  res.json({ message: "Welcome to Super Admin Dashboard" });
});

app.get("/api/director-dashboard", requireAuth, requireRole(['director', 'owner', 'super_admin']), (req, res) => {
  res.json({ message: "Welcome to Director Dashboard" });
});

app.post("/api/create-checkout-session", requireAuth, async (req, res) => {
  try {
    const { plan, userId, seats = 1, successUrl, cancelUrl } = req.body;
    const stripe = getStripe();
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    // Define prices (in production these would be Stripe Price IDs)
    const prices = {
      individual: 4999, // $49.99
      director: 4999 * seats, // $49.99 per seat
    };

    const amount = prices[plan as keyof typeof prices] || 4999;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `PartsFinder Pro ${plan === "director" ? "Fleet" : "Individual"} Plan`,
              description: plan === "director" ? `${seats} Worker Seats` : "Full Access",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Using payment mode for simplicity, use 'subscription' for recurring
      success_url: successUrl || `${appUrl}/payment?success=true`,
      cancel_url: cancelUrl || `${appUrl}/payment?canceled=true`,
      client_reference_id: userId,
      metadata: {
        plan,
        seats: seats.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Catch-all for /api/* to prevent Vite from serving HTML for missing API routes
app.all("/api/*", (req, res) => {
  console.log(`Unmatched API request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API route not found" });
});

async function startServer() {
  // Add error handler for API routes to always return JSON
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API Error:", err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
