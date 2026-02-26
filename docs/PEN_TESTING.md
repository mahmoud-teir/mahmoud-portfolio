# Penetration Testing & Security Audit Checklist
*Last Updated: 2026-02-26*

This document provides a comprehensive checklist for evaluating the security posture of the Mahmoud.Dev platform. Use these steps periodically and before major releases.

---

## 🔒 1. Authentication & Authorization

### Automated (OWASP ZAP / Burp Suite)
- [ ] **Brute Force:** Ensure login endpoints rate limit or temporarily lock out after 5-10 failed attempts.
- [ ] **Session Fixation:** Verify that new session tokens are generated upon successful login.
- [ ] **Token Expiration:** Confirm that Magic Link tokens expire within 15 minutes.
- [ ] **JWT Forgery:** Attempt to intercept and alter signed session cookies. Must fail validation.

### Manual
- [ ] **Bypass 2FA:** (If implemented) Attempt to access `/admin/dashboard` bypassing the secondary prompt.
- [ ] **Vertical Privilege Escalation (IDOR):** Change a project's `id` payload in an API request belonging to another theoretical user. The Server Action should verify `requireAuth()` and user boundaries.
- [ ] **Horizontal Privilege Escalation:** Attempt to access `POST /api/settings` using a non-authenticated session cookie.

---

## 💉 2. Input Validation (Injection & XSS)

### SQL Injection (SQLMap)
- [ ] Test the public Search Action (`app/actions/search.ts`) by injecting `' OR 1=1 --`. Expected result: Prisma safely escapes and returns zero results or literal matches.

### Cross-Site Scripting (XSS)
- [ ] **Stored XSS:** Submit a Contact Form containing `<script>alert('xss')</script>`. Verify that the React Email template neutralizes the script tags when delivered.
- [ ] **Reflected XSS:** Try returning JS payloads through the URL parameters for the `/projects` filter page.
- [ ] **CSP Verification:** Open Chrome DevTools. Inject a `<script>` tag into the DOM manually. Verify the console throws a `Content-Security-Policy` blocked error due to the missing cryptographic `nonce`.

---

## 🚪 3. API Security & Business Logic

- [ ] **Mass Assignment:** When updating a `Skill`, try injecting `{"id": "new-id"}` or `{"createdAt": "2020-01-01"}` into the JSON payload. Ensure Prisma `update` strictly defines editable fields.
- [ ] **Rate Limiting:** Spam the Contact Form Server Action. Ensure Upstash Redis successfully returns `429 Too Many Requests`.

---

## 🛠️ 4. Server & Dependency Configuration

- [ ] **Headers Analysis (SecurityHeaders.io):**
  - Verify `Strict-Transport-Security` (HSTS) is active.
  - Verify `X-Content-Type-Options: nosniff`.
  - Verify `X-Frame-Options: DENY` (prevents Clickjacking).
- [ ] **Dependency Audit:** Run `npm audit` and Snyk weekly.
- [ ] **Secret Scanning:** Ensure Trufflehog runs on all PRs to prevent leaking `DATABASE_URL` or `RESEND_API_KEY`.
