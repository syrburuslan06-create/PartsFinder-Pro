# 📄 TRUCKSAVER / PartsFinder Pro — Unified Enterprise Documentation (v2.0)

---

## 1. PRODUCT OVERVIEW

**Mission**: Instant and accurate heavy-duty automotive parts search for mechanics (Workers), fleet owners (Directors), and platform administrators (Super Admins), supporting 1M+ users.

**Core Value**: Fast, reliable part identification, team management, and real-time analytics.

**Target Users**:
- **Workers**: Mechanics with a $49.99/mo subscription, full access to search and shop tools.
- **Directors**: Fleet owners, free registration, management of workers and real-time analytics.
- **Super Admin**: Platform headquarters, controlling growth, revenue, and system security.

---

## 2. CORE FEATURES — SEARCH SYSTEM

### 2.1 Search Integration
- **Live AI Search**: Powered by Gemini 3.1 Pro via `searchParts` in `geminiService.ts`.
- **Data Sources**: Real-time grounding using Google Search + authorized US suppliers (FleetPride, TruckPro, etc.).
- **Multi-Modal Input**: Supports Text (Part #, descriptions), VIN Decoding, and Visual ID (Computer Vision).

### 2.2 Trust Scoring (The "Trust Score Formula")
Each search result features a **Trust Score badge** (0-100%) based on:
- **Part Number Match (30%)**: Direct match vs. compatible alternative.
- **Price Competitiveness (20%)**: Comparison against market averages.
- **Supplier Reliability (20%)**: Historical performance and verification status.
- **Historical Success (10%)**: Past successful orders for this specific part.
- **User Rating (10%)**: Community feedback from other mechanics.
- **AI Confidence (10%)**: Gemini's internal certainty of the match.

**Breakdown Modal**: Users can click the Trust Score to see exactly how the score was calculated, ensuring total transparency.

### 2.3 UI/UX Enhancements
- **Loading States**: High-fidelity skeleton loaders during AI processing.
- **Error Handling**: Robust states for network or API failures with retry logic.
- **Compare Feature**: Side-by-side comparison of up to 3 parts (Price, Trust Score, Availability).
- **Save Part Functionality**: Persistent storage in Supabase, synced across devices.
- **Contextual Onboarding**: Interactive tooltips and walkthroughs for new users, with contextual tips for Compare and Save features.
- **Offline Support & Sync**: PWA capabilities allowing Workers to access saved parts and search history offline. Automatic synchronization of changes (saved parts, comparisons) upon reconnection.

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Frontend
- **React 18 + Vite + TypeScript**.
- **Tailwind CSS**: Utility-first styling with a "Tactile" aesthetic (Dark Mode, Glassmorphism).
- **Motion**: Fluid animations for transitions and interactive elements.

### 3.2 Backend / Services
- **Express + Vite**: Full-stack architecture.
- **Supabase**: Primary data store for Auth, Realtime, and persistent Saved Parts.
- **Gemini 3.1 Pro**: Core AI engine for VIN decoding and grounded parts search.
- **Stripe**: Integrated for Worker subscriptions and Director billing.

### 3.3 Performance & Scalability (1M+ Users)
- **AI Request Caching (Redis)**:
    - **TTL**: 24-hour default Time-To-Live for search results.
    - **Invalidation**: Automated cache purging upon supplier data updates or price fluctuations > 5%.
- **Dynamic Rate-Limiting**: Intelligent throttling that scales limits based on fleet size and peak system loads.
- **Monitoring & Alerting**:
    - **Stack**: Prometheus/Grafana for real-time metrics.
    - **SLA Alerting**: Automated alerts if AI response latency exceeds 1.5s or error rates spike > 1%.

---

## 4. ROLES & PERMISSIONS (RBAC)

| Role | Access | Restrictions |
| :--- | :--- | :--- |
| **Worker** | Full search, saved parts, shop tools. | Limited to their own activity. |
| **Director** | Team management, fleet analytics, search history. | Cannot perform searches (must use workers). |
| **Super Admin** | Platform-wide security, user control, global analytics. | Exclusive access to system-wide settings. |

**Role Escalation Logging**: Every permission change or role assignment is logged with a timestamp and the initiating user ID for audit trails.

---

## 5. SECURITY & COMPLIANCE

### 5.1 Identity & Access
- **MFA (Multi-Factor Authentication)**: Mandatory for Directors and Super Admins.
- **Session Management**: Secure JWT with refresh tokens and automatic session expiration.
- **Lockdown Mode**: A "kill switch" to freeze platform access in case of emergency.

### 5.2 Data Protection
- **Encryption**: Full AES-256 encryption-at-rest for all user data and TLS 1.3 encryption-in-transit.
- **End-to-End Encryption**: Applied to all PWA photo uploads (Visual ID requests) to ensure privacy of shop data.
- **UID Protection**: Strict Row Level Security (RLS) on all Supabase tables.
- **Audit Logs**: Chronological record of all significant platform actions.

### 5.3 Compliance Roadmap
- **SOC2/ISO 27001**:
    - **Phase 1**: Internal gap analysis and policy documentation (Q3 2026).
    - **Phase 2**: External audit and certification (Q1 2027).
    - **Responsibility**: Designated Security Officer (CISO).

---

## 6. AI RELIABILITY & FUTURE-PROOFING

### 6.1 Reliability
- **Fallback Hierarchy**:
    1. **Redis Cache**: Return cached results if valid.
    2. **Local DB**: Search indexed compatibility tables.
    3. **Partial AI**: Use faster, lower-cost models for basic identification.
    4. **Full AI Search**: Trigger Gemini 3.1 Pro + Google Search grounding.
- **Scoring Audit Dashboard**: A dedicated view for Directors to monitor Trust Score deviations and receive procurement recommendations.

### 6.2 Future Roadmap
- **Modular API & Webhooks**:
    - **Webhooks**: Standardized templates for notifying external systems of price changes or new part availability.
- **Predictive Restocking**: 30-day inventory forecasts for Directors, combining user search patterns with global supplier trends.
- **Cross-Part Compatibility**: Advanced AI mapping for universal part alternatives across different truck makes.

---

## 7. DEPLOYMENT GUIDELINES (Cloud Run)

For 1M+ users, the following deployment strategy is mandatory:
- **Auto-scaling**: Configure Cloud Run with `min-instances: 5` and `max-instances: 1000` based on CPU/Request utilization.
- **Global Load Balancing**: Use Google Cloud Load Balancing with CDN enabled for static asset delivery.
- **Database Scaling**: Supabase (PostgreSQL) with connection pooling (PgBouncer) and read replicas for analytics.
- **Secrets Management**: All API keys (Gemini, Stripe, Supabase) must be stored in Google Cloud Secret Manager.

---

## ✅ CTO NOTE
The platform is now **fully enterprise-ready (v2.0)** for 1M+ users. By combining multi-layered fallback logic, robust security protocols, and a clear scalability roadmap, TRUCKSAVER / PartsFinder Pro is positioned as the definitive heavy-duty sourcing solution.
