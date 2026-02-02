# Tenant Verification: Session & Account Setup

## How session is handled

- **Verification routes** (`/dashboard/tenant/verification`, `/dashboard/tenant/verification/personal-info`, etc.) are wrapped with `VerificationRouteGuard`:
  - **Has session** (user signed in, `nrv-user` in localStorage) → allow access.
  - **No session but has `verificationId` in URL** (invite link from landlord) → allow access so the tenant can complete verification without signing up.
  - **No session and no `verificationId`** → redirect to sign-in with `returnUrl` so they can sign in and come back (or use the link from the email).

- **Other tenant dashboard routes** (properties, messages, settings, etc.) use `ProtectedRoute` and require a signed-in user.

- **Verification “requests”** (`/dashboard/tenant/verification/requests`) lists requests by the logged-in user’s email, so it effectively requires sign-in (the guard allows access only when there is a session or a `verificationId`; without either, the user is redirected to sign-in).

---

## Should account setup precede verification?

Two options:

### Option A: Verification first (current behavior)

- Tenant gets email with link: `.../dashboard/tenant/verification?verificationId=...`
- They open the link and complete verification **without creating an account** (email comes from the verification request and is stored in sessionStorage for the flow).
- After completion, you can prompt: “Create an account to track your applications” and link to sign-up with email pre-filled.

**Pros:** Less friction, higher completion rate.  
**Cons:** Verification is not tied to a user until they sign up; you may want to link the verification response to the user later (e.g. when they sign up with the same email).

### Option B: Account setup first

- Tenant clicks the link → redirect to sign-up (pre-fill email from verification request) or sign-in.
- After they have an account, they go to verification and complete the form (email comes from session).

**Pros:** Every verification is tied to a user from the start.  
**Cons:** More friction; some tenants may drop off before completing verification.

---

## Recommendation

Use **verification first (Option A)** and keep the current flow:

1. Invite link works without sign-in; tenant completes verification using the request’s email.
2. After they submit (e.g. on the final step), show a CTA: “Create an account to track your applications and get updates” → sign-up with email pre-filled from the form/request.
3. On sign-up (or first sign-in after verification), optionally link the verification response to the user (e.g. by matching email and `verificationId` or response id) so it appears under “My Verification” when they’re logged in.

---

## Linking verification to a new account (optional)

When the tenant signs up after completing verification:

1. Sign-up page can read `verification-request-email` from sessionStorage (or accept `?email=...` from the CTA link) and pre-fill the email.
2. Backend: when a user is created or first logs in, you can associate existing verification responses with that user (e.g. by `email` and optionally `verificationId` / response id) so that `GET /verification/response/user/:userId` or “My Verification” returns their submission.

This keeps “verification first” while still tying the submission to the user once they have an account.
