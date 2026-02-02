# How new users get their password

## 1. Landlord onboarded tenant

When a landlord **onboards a tenant** (e.g. creates a tenant account from the property/tenant flow):

- The backend generates a **temporary password** (6-digit code from `generateConfirmationCode()`).
- The tenant account is created with that password (stored hashed).
- An email is sent to the tenant’s address with:
  - **Subject:** “Your landlord has onboarded you on Naija Rent Verify”
  - **Body:** Their **temporary password**, their **email**, and a **sign-in link** (from `FRONTEND_URL/sign-in`).
  - A note to change their password after first login.

So the new user **knows their password from this email**. They use that email + password to sign in, then can change the password in settings.

---

## 2. Verification-first flow (no account yet)

When a tenant completes **verification via the invite link** (without signing up):

- No account or password is created at that step.
- When we prompt “Create an account to track your applications”, the tenant goes to **sign-up** and **chooses their own password**.
- So they know their password because **they set it** during registration.

---

## 3. Sign-up (self-registration)

When a user signs up on their own (tenant or landlord):

- They **choose their password** on the sign-up form.
- They know it because they created it.

---

## Summary

| Flow                         | How they get their password                          |
|-----------------------------|------------------------------------------------------|
| Landlord onboarded tenant   | Email with temporary password + sign-in link         |
| Verification then sign-up   | They set it when creating their account              |
| Self sign-up                | They set it on the sign-up form                      |
