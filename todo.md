# Home Route Transition

- [x] Add a short CircuitSight transition overlay before home CTA navigation.
- [x] Respect reduced-motion preferences and prevent duplicate navigation clicks.
- [x] Verify auth/workspace routing, responsive presentation, typecheck, and build.

# Mobile Composer Placeholder

- [x] Reduce the mobile workspace placeholder size while retaining the full copy on one line.
- [x] Verify the workspace composer at a mobile breakpoint and run the build.

# Verified Email and Real Data

- [ ] Configure a free-tier email OTP identity provider for live verification codes.
- [ ] Add verified-email identity fields and provider session handling.
- [ ] Implement email signup/login, OTP verification, and verification-gated workspace access.
- [ ] Replace mock thread and account data with user-specific persisted data and an honest empty state.
- [ ] Preserve only a clearly labeled sample-circuit demo that cannot be mistaken for user data.
- [ ] Verify server, database, email delivery, auth gates, tests, and responsive UI.

# OTP Template Alignment

- [ ] Change the Supabase confirmation email template from a confirmation link to a six-digit OTP token.
- [ ] Re-test code delivery, verification, and the verified workspace handoff.

# OTP Provider Replacement

- [ ] Compare free-tier email OTP providers that support secure verification.
- [ ] Select a replacement provider and document the required credentials and sender setup.
- [ ] Replace the stalled provider after user approval and verify live code delivery.

# Stytch Email OTP

- [ ] Configure and validate a Stytch Project ID and Secret.
- [ ] Replace Supabase OTP send and verify calls with server-side Stytch procedures.
- [ ] Preserve verified-user session creation and workspace access controls.
- [ ] Test Stytch code delivery, verification, responsive auth UI, and build.

# Team Portfolio Link

- [x] Make the Vishalkumaran V team card open https://vishalkumaran2007.github.io/Portfolio/ while leaving other team cards unchanged.
- [x] Add regression coverage and publish the targeted interaction change.
