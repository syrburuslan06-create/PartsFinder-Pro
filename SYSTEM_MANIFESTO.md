# PartsFinder Pro: System Manifesto & Technical Specification

## 1. Executive Summary
**PartsFinder Pro** is a high-performance, AI-driven sourcing platform designed for the heavy-duty automotive and fleet management industry. It bridges the gap between mechanics in the shop and fleet owners in the office, providing a single source of truth for part identification, procurement, and team oversight.

---

## 2. Platform Architecture (What it Has)

### 2.1. The Universal Finder (AI Search Engine)
The core of the platform is a multi-modal search interface that accepts:
- **Text Input**: Part numbers, names, or vague descriptions (e.g., "alternator for a 2018 Peterbilt").
- **VIN Decoding**: Instant extraction of vehicle specs (engine, transmission, year) from a 17-digit VIN.
- **Visual ID (Computer Vision)**: Image analysis of broken parts to identify replacements.
- **Browse Mode**: A categorized directory of over 4.2 million parts.

### 2.2. The Fleet Dashboard (Owner Oversight)
A dedicated management layer for company owners to:
- **Track Mechanic Activity**: Real-time view of what parts are being searched for and by whom.
- **Efficiency Metrics**: Visualization of time spent on sourcing vs. repair.
- **Team Management**: Invite mechanics via secure links and manage seat licenses.

### 2.3. Super Admin Mission Control (Platform Headquarters)
A secure, "God-mode" dashboard for the platform owner to:
- **Global Analytics**: Monitor total users, active sessions, and platform growth.
- **User Control**: Search, block, or delete any company or mechanic account instantly.
- **System Health**: Real-time monitoring of database latency, AI API status, and auth gateways.
- **Audit Logs**: A chronological record of every significant action taken on the platform.

---

## 3. Core Functionality (What it Does)

### 3.1. Part Identification & Sourcing
The platform identifies parts with 99.9% accuracy by combining user input with **Gemini 3.1 Pro**'s reasoning capabilities. It doesn't just find a part; it verifies compatibility with the specific vehicle configuration.

### 3.2. Role-Based Access Control (RBAC)
The system enforces strict security boundaries:
- **Mechanics**: Access to search, saved parts, and shop tools.
- **Owners**: Access to team data, billing, and fleet-wide search history.
- **Super Admin**: Exclusive access to platform-wide security, user management, and system configuration.

### 3.3. Security Hardening
- **Lockdown Mode**: A "kill switch" that freezes all platform access except for the Super Admin.
- **Failed Attempt Tracking**: Silent logging of unauthorized login attempts for forensic analysis.
- **Identity Verification**: Super Admin access is hardcoded to a specific verified email address.

---

## 4. Operational Flow (How it Works)

1.  **Input**: A mechanic provides a part number or photo of a broken component.
2.  **AI Analysis**: The system uses Gemini 3.1 Pro to interpret the input and vehicle context (VIN).
3.  **Database Cross-Reference**: The AI queries a virtual matrix of 4.2M+ parts.
4.  **Grounding**: Results are verified against real-world supplier data and compatibility charts.
5.  **Action**: The mechanic saves the part; the owner sees the search in their dashboard; the admin monitors the system health.

---

## 5. Visual Demonstration & Video Capability
PartsFinder Pro is built with a high-impact, "Tactile" design aesthetic (Dark Mode, Glassmorphism, and Motion animations). This makes it ideal for:
- **Marketing Videos**: The interface is designed to look professional and futuristic on camera.
- **Training Tutorials**: The intuitive layout allows the owner to create screen-recording videos to train new users quickly.
- **Live Demos**: Fast response times and smooth transitions ensure a high-quality experience during live presentations.

---

## 6. Technical Stack
- **Frontend**: React 18, Vite, TypeScript.
- **Styling**: Tailwind CSS (Utility-first).
- **Animations**: Motion (Framer Motion).
- **AI Engine**: Google Gemini 3.1 Pro (via @google/genai).
- **Backend**: Express + Vite (Full-stack architecture).
- **Auth**: Firebase (Integrated & Configurable).
