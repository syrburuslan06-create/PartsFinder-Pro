# 🚀 TRUCKSAVER / PartsFinder Pro — Launch Readiness Checklist (Tier-1)

This checklist ensures that the platform meets the enterprise standards defined in **SYSTEM_MANIFESTO.md v2.0** for a global launch supporting 1M+ users.

---

## 🛠️ DEVOPS CHECKLIST (Infrastructure & Scalability)

### 1. Cloud Run & Auto-scaling
- [ ] **Instance Limits**: Set `min-instances: 5` and `max-instances: 1000`.
- [ ] **Resource Allocation**: Configure CPU (2 vCPU min) and Memory (4GB min) per instance.
- [ ] **Concurrency**: Set max concurrent requests per instance to 80.

### 2. Networking & Delivery
- [ ] **Load Balancing**: Deploy Google Cloud Load Balancing (GCLB).
- [ ] **CDN**: Enable Cloud CDN for `/assets/*` and static files.
- [ ] **TLS**: Enforce TLS 1.3 for all endpoints.

### 3. Database & Caching
- [ ] **Supabase Scaling**: Enable connection pooling (PgBouncer).
- [ ] **Read Replicas**: Provision read replicas for heavy analytics queries (Director Dashboard).
- [ ] **Redis Provisioning**: Deploy a managed Redis instance for AI request caching.
- [ ] **Cache Logic**: Verify 24h TTL and automated invalidation triggers.

### 4. Security & Secrets
- [ ] **Secret Manager**: Migrate all API keys (Gemini, Stripe, Supabase) to Google Cloud Secret Manager.
- [ ] **MFA**: Enable mandatory Multi-Factor Authentication for `Director` and `Super Admin` roles.
- [ ] **Logging**: Verify that **Role Escalation Logging** is active and writing to a secure audit sink.
- [ ] **Encryption**: Confirm AES-256 encryption-at-rest is active for the database.

### 5. Monitoring & Alerting
- [ ] **Metrics**: Deploy Prometheus/Grafana dashboard.
- [ ] **SLA Alerts**: Configure alerts for:
    - AI Response Latency > 1.5s
    - System Error Rate > 1%
    - Redis Cache Miss Rate > 40% (Threshold for audit)

### 6. CI/CD & Deployment
- [ ] **Automation**: Full build/lint/test/deploy pipeline via GitHub Actions or Cloud Build.
- [ ] **Canary Release**: Configure traffic splitting (5-10%) for initial deployment.
- [ ] **Rollback Plan**: Documented and tested one-click rollback procedure.
- [ ] **Smoke Tests**: Automated post-deployment tests for AI Search, Trust Score, and Save/Compare.

### 7. Observability & Logging
- [ ] **Centralized Logging**: Configure Cloud Logging (Stackdriver) or Grafana Loki.
- [ ] **Log Filters**: Create saved views/alerts for:
    - AI Errors & Fallback Events
    - RBAC Violations (Unauthorized access attempts)
    - Offline Sync Conflicts

### 8. Disaster Recovery
- [ ] **Backups**: Automated database (Supabase) and cache (Redis) backups every 6 hours.
- [ ] **Recovery Plan**: Documented RTO (Recovery Time Objective) and RPO (Recovery Point Objective).
- [ ] **Drill**: Successfully performed a full system restoration from backup.

---

## 🧪 QA CHECKLIST (Reliability & UX)

### 1. AI Search & Trust Score
- [ ] **Fallback Hierarchy**: Simulate AI downtime and verify fallback to `Local DB` and `Redis Cache`.
- [ ] **Trust Score Accuracy**: Verify that the Trust Score breakdown modal displays correct data for 50+ test scenarios.
- [ ] **Grounding Check**: Confirm that search results are correctly grounded in real-world supplier data.

### 2. Performance & Load Testing
- [ ] **Stress Test**: Simulate 100k concurrent users to verify auto-scaling behavior.
- [ ] **Latency Check**: Ensure 95th percentile latency remains < 2.0s under load.
- [ ] **Memory Leak Test**: Run the app for 24h under constant load to check for server-side memory leaks.

### 3. UX & Interaction
- [ ] **Onboarding**: Verify that interactive tooltips appear correctly for first-time users.
- [ ] **Skeleton Loaders**: Confirm that skeletons are visible and stable during AI processing.
- [ ] **Compare Feature**: Test side-by-side comparison with various part types and edge cases (missing data).

### 4. Offline & PWA
- [ ] **Offline Access**: Verify that saved parts are accessible without an internet connection.
- [ ] **Sync Logic**: Perform changes offline and verify they sync correctly upon reconnection.
- [ ] **E2E Encryption**: Verify that photo uploads for Visual ID are encrypted before transmission.

### 5. Security & RBAC
- [ ] **Boundary Testing**: Attempt to access `Super Admin` routes as a `Worker`.
- [ ] **RLS Verification**: Verify that a `Worker` cannot read another worker's saved parts via direct API calls.
- [ ] **Audit Trail**: Perform a "Lockdown" and verify it is recorded in the audit logs.

### 6. Metrics & KPI Tracking
- [ ] **Performance KPIs**: Track average AI request time and cache hit ratios.
- [ ] **Trust Score Monitoring**: Dashboard for tracking Trust Score deviations across suppliers.
- [ ] **Business KPIs**: Track daily active Workers/Directors and Save/Compare feature usage.

---

## ✅ FINAL SIGN-OFF
- [ ] **DevOps Lead Signature**: ____________________
- [ ] **QA Lead Signature**: ____________________
- [ ] **CTO Approval**: ____________________
