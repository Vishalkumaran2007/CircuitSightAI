# Home Route Transition

- [x] Add a short CircuitSight transition overlay before home CTA navigation.
- [x] Respect reduced-motion preferences and prevent duplicate navigation clicks.
- [x] Verify auth/workspace routing, responsive presentation, typecheck, and build.

# Mobile Composer Placeholder

- [x] Reduce the mobile workspace placeholder size while retaining the full copy on one line.
- [x] Verify the workspace composer at a mobile breakpoint and run the build.

# Verified Email and Real Data

- [x] Configure a free-tier email OTP identity provider for live verification codes. Superseded by the decision to remove email OTP login.
- [x] Add verified-email identity fields and provider session handling. Superseded by the decision to remove email OTP login.
- [x] Implement email signup/login, OTP verification, and verification-gated workspace access. Superseded by the decision to remove email OTP login.
- [x] Replace mock thread and account data with user-specific persisted data and an honest empty state.
- [x] Preserve only a clearly labeled sample-circuit demo that cannot be mistaken for user data.
- [x] Verify server, database, auth gates, tests, and responsive UI. Email delivery was superseded by the decision to remove email OTP login.
- [x] Re-verify database-backed users, threads, and messages plus authenticated dashboard/workspace rendering after the OAuth-only authentication change.

# OTP Template Alignment

- [x] Change the Supabase confirmation email template from a confirmation link to a six-digit OTP token. Superseded by the decision to remove email OTP login.
- [x] Re-test code delivery, verification, and the verified workspace handoff. Superseded by the decision to remove email OTP login.

# OTP Provider Replacement

- [x] Compare free-tier email OTP providers that support secure verification. Superseded by the decision to remove email OTP login.
- [x] Select a replacement provider and document the required credentials and sender setup. Superseded by the decision to remove email OTP login.
- [x] Replace the stalled provider after user approval and verify live code delivery. Superseded by the decision to remove email OTP login.

# Stytch Email OTP

- [x] Configure and validate a Stytch Project ID and Secret. Superseded by the decision to remove email OTP login.
- [x] Replace Supabase OTP send and verify calls with server-side Stytch procedures. Superseded by the decision to remove email OTP login.
- [x] Preserve verified-user session creation and workspace access controls. Superseded by the decision to remove email OTP login.
- [x] Test Stytch code delivery, verification, responsive auth UI, and build. Superseded by the decision to remove email OTP login.

# Simplified Authentication

- [x] Remove the email OTP sign-up and login experience from CircuitSight.
- [x] Remove Stytch and Supabase OTP endpoints, credentials references, and provider tests.
- [x] Preserve the retained authentication method and protected workspace access.

# Saved Analysis Discovery

- [x] Add a search control for real saved circuit analyses.
- [x] Add a date-based filter with an honest zero-results state.
- [x] Verify responsive history discovery controls, tests, and production build.

# Browser-Independent Validation

- [x] Validate saved-analysis discovery using the accessible preview and real persisted history without browser sign-in.
- [x] Extend automated coverage for search, recency filters, reset behavior, and zero-results messaging.
- [x] Add reproducible component-level rendering tests for saved-analysis controls and zero-results messaging.

# Circuit Image Preview

- [x] Add a preview action for uploaded circuit images before analysis.
- [x] Add a preview action for the sample demo circuit image.
- [x] Verify keyboard access, responsive preview presentation, tests, and production build.

# Preview Verification Follow-up

- [x] Add reproducible rendered coverage for home/workspace preview triggers and the opened dialog state.
- [x] Verify the opened preview dialog presentation at desktop and mobile breakpoints without manual authentication.

# Verifiable Preview QA

- [x] Add a non-invasive sample-preview QA state for desktop and mobile visual verification.
- [x] Add reproducible responsive stylesheet coverage for the opened preview dialog.
