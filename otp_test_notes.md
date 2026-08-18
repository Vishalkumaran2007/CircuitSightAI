# Live OTP Test Notes

- The initial Supabase request reached the verification screen but delivered a confirmation-link email, showing the provider connection is live.
- After the email-template change, the browser remained in the `SENDING CODE...` state while switching recipients, so the client request needs investigation before sending another OTP.
- A refreshed request for `vishalkumaran2007@gmail.com` repeated the same stalled `SENDING CODE...` state, so delivery has not been confirmed for the code-only template configuration.
- With a 15-second client timeout added, the same request now returns a clear `CODE DELIVERY FAILED` timeout rather than leaving the UI indefinitely busy. The code-only provider delivery remains blocked outside the application.
- After the user re-saved the code-only template, a fresh request to `vishalkumaran2007@gmail.com` again reached the 15-second timeout. The template update alone did not restore a provider response.
