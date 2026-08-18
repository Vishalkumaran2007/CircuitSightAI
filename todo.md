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

# PDF Circuit Report Export

- [x] Add a PDF export action for completed circuit analyses.
- [x] Include the original uploaded circuit image and structured findings in the PDF.
- [x] Verify disabled-before-analysis behavior, PDF content generation, responsive UI, tests, and production build.

# PDF Export QA

- [x] Add a non-invasive completed-report QA state that renders the PDF export action without manual authentication.
- [x] Add reproducible responsive rendering coverage for the PDF export action at desktop and mobile breakpoints.

# PDF Export Responsive Contract

- [x] Add automated coverage for desktop and mobile PDF export action layout rules.

# Learning Loop Profile

- [x] Replace the Learning Loop placeholder alert with real navigation.
- [x] Build a responsive Learning Loop profile page with honest empty and progress states.
- [x] Verify keyboard navigation, mobile presentation, tests, and production build.

# Learning Loop Verification Follow-up

- [x] Add an explicit auth-sync loading state to the Learning Loop profile panel.
- [x] Add reproducible keyboard-accessibility coverage for Learning Loop links, buttons, and visible focus states.

# Learning Loop Accessibility Coverage

- [x] Add rendered markup assertions for Learning Loop navigation links and primary action buttons across session states.
- [x] Tie the rendered control coverage to the visible focus-style contract.

# Shared Route Loading

- [x] Add a shared destination-aware loading overlay between page transitions.
- [x] Preserve reduced-motion behavior and keyboard-safe navigation.
- [x] Verify route handoffs, responsive presentation, tests, and production build.

# Route Transition Handoff Coverage

- [x] Verify the shared loading overlay on real Home-to-auth, Learning, and Workspace route changes.
- [x] Add reproducible location-change interaction coverage for overlay appearance and dismissal.

# Real Route Transition QA

- [x] Verify Home-to-auth, Learning, and Workspace handoffs through the running route surface and browser-independent CTA integration coverage; direct browser click activation was unavailable in the sandbox.
- [x] Extend simulated transition coverage for the auth destination and dismissal behavior.

# Real App CTA Handoff Evidence

- [x] Add an integration-style test that exercises Home CTA destinations and observes the shared overlay lifecycle across route changes.
- [x] Verify the three public CTA destinations through the running Home route surface and integration coverage without relying only on the QA query state.

# Final Route Transition Evidence

- [x] Add dismissal assertions to the Home CTA integration test for all three destinations.
- [x] Document the sandbox interaction-layer limitation for live Home CTA clicks; browser-independent integration coverage and route-surface inspection are complete.

# Typography and Theme Switch

- [x] Add a distinctive display font treatment for hero and major section headings.
- [x] Add a visible persistent theme toggle for black-yellow and black-electric-blue modes.
- [x] Verify theme persistence, contrast, responsive navigation, tests, and production build.

# Theme Visual QA

- [x] Add a non-invasive theme query state for desktop and mobile visual verification.
- [x] Capture yellow and electric-blue theme previews with the toggle visible.

# Display Font QA Refinement

- [x] Tune the distinctive display face so the hero headline keeps deliberate line breaks at desktop and mobile widths.

# Theme Toggle Visibility QA

- [x] Explicitly verify the floating theme-toggle control is visible and usable in both yellow and blue desktop/mobile QA states.

# Theme Mobile Visibility Evidence

- [x] Explicitly confirm the floating theme toggle is visible and reachable in both yellow and blue mobile QA states.

# Theme Toggle Interaction Evidence

- [x] Add a direct interaction test confirming the toggle changes palette labels and remains keyboard-focusable.

# Theme Keyboard Activation Evidence

- [x] Add explicit Enter/Space activation and visible-focus contract assertions for the theme toggle.

# Typography Rollback

- [x] Restore the previous display font treatment for headings while preserving the current theme and layout behavior.
- [x] Verify the restored typography across responsive states, tests, and production build.

# Typography Responsive Evidence

- [x] Verify the restored Space Grotesk heading treatment at a mobile breakpoint in addition to desktop.

# Black Blue and White Black Themes

- [x] Make dark mode black with electric-blue accents.
- [x] Make light mode white with black text and controls.
- [x] Verify both palettes across desktop/mobile, tests, and production build.

# Theme Token Audit Follow-up

- [x] Replace remaining hardcoded dark and gray home-page surfaces with shared dark/light theme tokens.
- [x] Audit auth, workspace, dashboard, and learning surfaces for consistent black-blue and white-black styling.
- [x] Add regression coverage for key themed surfaces and light-mode contrast contracts.

# Theme Audit Evidence Follow-up

- [x] Make the exported correction report use the active semantic palette instead of legacy hardcoded colors.
- [x] Verify auth, workspace, dashboard, and learning surfaces use shared semantic theme classes/tokens.
- [x] Expand regression tests for themed surface and contrast contracts across representative routes.

# Route Theme Render Evidence

- [x] Add rendered route-level theme contract tests for auth, workspace, dashboard, and learning surfaces.
- [x] Capture explicit desktop/mobile verification evidence for representative authenticated and public screens.

# Black Lavender Dark Theme

- [x] Change dark-mode accents from electric blue to lavender while keeping the background black.
- [x] Preserve the white-black light theme and verify both palettes across desktop/mobile, tests, and production build.

# Theme Preference and High Contrast

- [x] Add a persistent preference to follow the operating system light/dark theme.
- [x] Add a persistent high-contrast accessibility mode toggle with keyboard support.
- [x] Verify preference persistence, reduced-motion compatibility, responsive controls, and contrast contracts.

# IDK Conversational AI Style

- [x] Rename the user-facing AI identity to IDK / Intelligent Diagnostic Kernel.
- [x] Preserve structured analysis data while presenting normal responses conversationally with grounded confidence and uncertainty language.
- [x] Add IDK response-style tests without changing the underlying multimodal analysis pipeline or report exports.

# Accessibility Verification Follow-up

- [x] Add mocked localStorage and matchMedia tests for system-theme changes, persistence, and DOM class synchronization.
- [x] Define and test a guaranteed contrast-safe pressed-state text token for appearance controls.
