# PartsFinder Pro: Detailed Page Prompts

This document contains high-fidelity descriptions for every page in the PartsFinder Pro ecosystem. These prompts are designed to define the UI, UX, and logic for each specific route.

---

## 1. Landing Page (`/`)
**Aesthetic**: Editorial, high-impact, cinematic. Dark background with vibrant emerald and indigo accents.
**Prompt**: Create a high-conversion landing page for a heavy-duty auto parts AI platform. Use a split-hero layout with massive typographic headlines ("RESUME OPERATIONS" or "SOURCE FASTER"). Include a "Tactile" feature grid showing the Universal Finder, Fleet Dashboard, and Real-time Analytics. Use glassmorphism for cards and motion-driven entrance animations. Add a "Get Started" CTA that leads to role selection.

## 2. Login Page (`/login`)
**Aesthetic**: Secure, minimal, "Matrix" inspired.
**Prompt**: Build a secure login portal featuring a split-screen design. The left side should show editorial branding with a "Welcome Back Commander" badge. The right side contains a clean, tactile form with email and password fields. **Logic**: Implement a 1-second simulated security delay. Include a "Super Admin" check where the email `syrburuslan06@gmail.com` redirects to `/admin`. Add a "System Lockdown" check that prevents non-admin logins when active. Show generic error messages for security.

## 3. Role Selection Page (`/register`)
**Aesthetic**: Choice-driven, balanced.
**Prompt**: Create a registration entry point where users choose between "Fleet Owner" and "Professional Mechanic." Use two large, interactive cards with distinct icons (Building for Owner, Wrench for Mechanic). Each card should highlight the specific benefits of that role (e.g., "Manage Team" vs "Source Parts").

## 4. Search Page (`/search`)
**Aesthetic**: Technical, data-dense, futuristic.
**Prompt**: Design the "Universal Finder" interface. Feature a multi-modal search bar at the top that handles VINs, Part Numbers, and Text. Include a "Vision ID" button for camera-based part identification. **Logic**: Integrate Gemini 3.1 Pro to analyze search queries. Display results in a "Grounding Matrix" showing part specs, supplier links, and compatibility scores. For owners, include a "Free Trial Tries" counter (5 searches limit).

## 5. Owner Dashboard (`/owner/dashboard`)
**Aesthetic**: Professional, analytics-focused, "Mission Control" for fleets.
**Prompt**: Build a fleet management dashboard for company owners. Top section features high-level stats: Total Mechanics, Parts Sourced this month, and Fleet Uptime. Include a "Free Trial" status card. The main area should show a "Live Feed" of mechanic search activity and a "Team Efficiency" chart. Add a sidebar for quick navigation to worker management and billing.

## 6. Admin Dashboard (`/admin`)
**Aesthetic**: Utilitarian, high-security, "God-mode" command center.
**Prompt**: Create a Super Admin "Mission Control" page. **Security**: Hardcode access to `syrburuslan06@gmail.com`. **Features**:
- **Global Stats**: Total users, active sessions, system health.
- **Management Tabs**: "Companies" (search/block owners), "Mechanics" (search/view hours/delete), and "Audit Logs" (real-time action stream).
- **Security Control**: A "System Lockdown" toggle that freezes the platform.
- **Health Monitor**: Live latency tracking for Database, AI, and Auth services.

## 7. User Home Page (`/home`)
**Aesthetic**: Welcoming, dashboard-lite.
**Prompt**: Create a personalized home hub for mechanics. Feature a "Good Morning" greeting with the user's name. Show "Recent Searches," "Saved Parts Quick-Access," and a "Daily Sourcing Goal" progress bar. Include a "Start New Search" primary action button.

## 8. Saved Parts Page (`/saved`)
**Aesthetic**: Organized, library-style.
**Prompt**: Build a personal part library for mechanics. Use a grid or list view of "Saved Parts" with high-quality images, part numbers, and custom notes. Include a "Quick Source" button for each item to re-run the AI search for current pricing.

## 9. Owner Add Worker (`/owner/add-worker`)
**Aesthetic**: Clean, form-focused.
**Prompt**: Create a team expansion page for owners. Feature a simple form to invite mechanics via email. Include a "Seat Counter" showing how many licenses are left in the current plan. Add a "Pending Invitations" list with the ability to revoke links.

## 10. Profile Page (`/profile`)
**Aesthetic**: Personal, settings-oriented.
**Prompt**: Design a user settings page. Include sections for "Account Identity" (Name, Email, Profile Photo), "Security" (Password reset), and "Preferences" (Notification toggles, Theme selection). For owners, add a "Company Profile" section.

## 11. Support Page (`/support`)
**Aesthetic**: Helpful, literary.
**Prompt**: Build a support and insights hub. Include a "Knowledge Base" search, a "Direct Support" chat trigger, and a "Platform Updates" feed. Use serif typography for articles to create a refined, editorial feel.

## 12. Payment Page (`/payment`)
**Aesthetic**: Trustworthy, minimal.
**Prompt**: Create a subscription management page. Show clear pricing tiers (Basic, Pro, Enterprise). Include a "Plan Comparison" table and a secure credit card entry form (Stripe-ready). Add a "Billing History" section at the bottom.
