# IDK Specification Implementation Plan

## Specification interpretation

The attached document is authoritative for the account/profile interaction layer. Its explicit scope is the highlighted account area and the associated flows: **Personalization → Profile → Settings → Help → Switch account → Log out**. It explicitly instructs the implementation not to redesign the sidebar or circuit-analysis interface. The existing IDK workspace, multimodal image analysis, confidence/findings model, PDF report generation, and correction-report behavior are therefore preserved.

The broader IDK goals described in the request are addressed where they are compatible with the current architecture: the assistant identity is **IDK — Intelligent Diagnostic Kernel**; recent thread messages are now supplied as conversation context; persisted personalization preferences are included in future analysis prompts; and the structured response contract remains the source for confidence, findings, uncertainty, and reports. Visual generation such as annotated images or corrected diagrams is not fabricated because the supplied specification does not define a concrete visual-generation service or data contract; the current image preview and report pipeline remain intact.

## 1. Complete implementation plan

The implementation adds a functional account popover to the authenticated workspace profile area, registers protected utility routes, persists IDK personalization preferences in the database, and connects those preferences to future multimodal analysis prompts. It also adds an honest single-session account-switch flow and uses the existing OAuth logout procedure rather than inventing account or credential behavior.

| Requirement | Implementation | Status |
|---|---|---|
| Clickable profile area | `AccountMenu` wraps avatar, name, and email in a keyboard-accessible trigger. | Implemented |
| Exact menu order | Personalization, Profile, Settings, divider, Help, divider, Switch account, Log out. | Implemented |
| Outside click and Escape | Document listeners close the popover safely. | Implemented |
| Functional navigation | Each menu item routes to its protected page. | Implemented |
| Personalization | Real persisted explanation, response, terminology, visual, improvement, and sarcasm controls. | Implemented |
| Profile | Shows available identity and account metadata without exposing secrets. | Implemented |
| Settings | Surfaces theme, accessibility, analysis, AI, notification, language, privacy, and account states honestly. | Implemented |
| Help | Documents the IDK workflow, example questions, uncertainty, and safety guidance. | Implemented |
| Switch account | Explains the single active OAuth session and offers functional logout before returning to authentication. | Implemented |
| Logout | Reuses the existing server-side session-clearing mutation and redirects to authentication. | Preserved and wired |
| Responsive behavior | Desktop and mobile styling added for the popover and utility routes. | Implemented |

## 2. Required frontend changes

The frontend changes are centered in `AccountMenu.tsx`, `AccountPageFrame.tsx`, `Workspace.tsx`, `App.tsx`, and the new protected pages. The workspace account footer now opens a native-feeling IDK popover without changing the analysis composer, history discovery, image preview, or report actions. Utility pages use a shared frame with clear routes back to the workspace, dashboard, help, and account controls.

The Personalization page uses typed segmented controls and checkboxes. Saving invokes the protected tRPC mutation and invalidates the preference query. Settings presents existing local appearance preferences and clearly distinguishes them from account-backed controls. Profile uses only identity metadata already exposed by the authenticated user session. Help contains the documented diagnostic loop and safety guidance. Switch Account does not pretend that multiple simultaneous accounts are available.

## 3. Required backend changes

The backend now exposes a protected `preferences.get` query and `preferences.update` mutation. These procedures are scoped to `ctx.user.id`, return honest defaults when no record exists, validate all enumerated values with Zod, and persist the documented personalization controls.

The circuit analysis procedure now reads the authenticated user’s IDK preferences and the most recent messages from an existing thread. It includes those values in the multimodal prompt so explanation depth, response style, terminology, visual preference, improvement suggestions, and conversational continuity influence future responses. The structured JSON response contract remains unchanged, so existing confidence scores, finding statuses, uncertainty notices, PDF exports, and reporting continue to consume the same validated analysis object.

## 4. Database changes

A new `idk_preferences` table stores one preference record per authenticated user. It includes explanation level, response style, sarcasm permission, technical terminology preference, visual explanation preference, improvement suggestions, and creation/update timestamps. The migration is non-destructive and has been applied to the connected database.

No changes were made to circuit threads or circuit messages. Existing saved analysis data remains compatible. Profile data continues to come from the authenticated `users` record because the current OAuth model does not expose a safe profile-edit endpoint.

## 5. AI prompt and system-prompt updates

IDK is explicitly identified as **Intelligent Diagnostic Kernel** in the analysis prompt. The system guidance now requires continuity with recent thread context, adaptive terminology, preference-aware response depth, clarifying questions when evidence is insufficient, and grounded conclusions based only on visible circuit data and user-provided information.

The prompt also names supported reasoning contexts—schematics, breadboards, PCB layouts, analog, digital, and mixed-signal circuits—without claiming that a format is understood when the supplied image cannot establish the relevant evidence. The existing uncertainty language remains mandatory, and IDK is instructed not to invent components, connections, measurements, or electrical behavior.

## 6. Vision-analysis improvements

The existing multimodal image path is preserved: uploaded images remain high-detail image content, and structured analysis still distinguishes verified, uncertain, and not-visible findings. The updated prompt asks IDK to identify current-path and signal-path reasoning when the evidence supports it and to ask for better images or clarification when perspective, occlusion, glare, or missing labels prevents reliable diagnosis.

Annotated circuit images, fault overlays, corrected diagrams, flow visualizations, and original-versus-corrected comparisons are not fabricated in this implementation because the authoritative attachment does not define an image-generation contract or a safe visual-grounding pipeline for those artifacts. The existing original-image preview and PDF report pipeline remain available as the reliable visual/reporting baseline.

## 7. UI/UX improvements

The account menu follows the existing IDK visual language: black-and-white technical surfaces, sharp borders, compact spacing, small utility icons, restrained hover states, visible focus behavior, and responsive repositioning. The menu opens above the workspace account footer on desktop and is constrained to the viewport on smaller screens.

Utility pages use the same diagnostic vocabulary as the workspace: `IDK / PERSONALIZATION`, `IDK / PROFILE`, `IDK / SETTINGS`, and `IDK / HELP & SUPPORT`. Each page has a clear return path, explicit empty or unsupported states, and no placeholder actions that falsely imply backend functionality.

## 8. Limitations and risks

The current OAuth integration supports one active account per browser session. Switch Account therefore logs out first and returns to authentication instead of pretending that multiple accounts can be switched instantaneously. Profile editing is intentionally unavailable because the current identity provider does not expose a safe edit procedure.

Notifications and language selection are documented as honest unavailable states rather than non-functional toggles. Visual generation is limited to the existing uploaded-image preview and correction-report export until a grounded image-generation contract, storage policy, and validation workflow are added. As with all image-based diagnosis, electrical continuity and safety cannot be confirmed from an arbitrary photograph when relevant evidence is obscured.

## 9. Step-by-step development roadmap

1. Add a grounded visual-generation contract for annotated images and corrected diagrams, including evidence coordinates, provenance, storage, and a refusal path when the image is insufficient.
2. Add explicit user feedback actions such as “IDK misunderstood this” and persist correction events separately from ordinary chat messages.
3. Expand the analysis schema with optional current-path, signal-path, and clarification-question fields while keeping backward compatibility with existing reports.
4. Add an expertise profile beyond explanation depth if user research shows that beginner, student, and engineer should have distinct vocabularies and examples.
5. Add account-level notification and language backends only when delivery and localization services are configured.
6. Add end-to-end browser coverage for authenticated account-menu interactions, logout redirects, and preference persistence across a refreshed session.

## Validation completed

The implementation has typechecked successfully. Focused coverage validates the account menu, protected preference procedures, adaptive analysis prompt context, and dark/light rendering of all new routes. Desktop and mobile visual checks cover the opened account popover, workspace, Personalization, Profile, Settings, Help, and responsive utility layouts. Full-suite and production-build validation remain the final release gate before the checkpoint is saved.
