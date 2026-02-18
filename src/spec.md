# Specification

## Summary
**Goal:** Improve the UPSC Interview mic/speaking experience for clarity and usability, and refresh the app UI with a vibrant glassmorphism dashboard, updated typography, and test-result animations.

**Planned changes:**
- Update the UPSC Interview “interview” step UI to include a large, prominent microphone button fixed at the bottom center that toggles recording, with a small green active/ready status indicator, and ensure older mic controls are not confusingly duplicated.
- Add a “Listening…” active mic state with an animated wave effect near the mic, plus a live speech-to-text chat-bubble display that shows interim updates and commits final results; handle unsupported/denied mic cases via existing toast behavior and revert to inactive UI.
- Add a separate AI “Speak” (or “Speak Question”) control to play the current question via existing browser-only text-to-speech utilities, reflecting a speaking state without hiding the mic control.
- Redesign the Home dashboard with a light-blue to soft-purple gradient background and glassmorphism button cards; update the 6 buttons to use the specified emoji icons (📰 🤖 📚 🏆 📈 🏛️) and per-button vibrant color palette while keeping existing English labels and routes.
- Apply a bold, rounded font (Poppins or Montserrat) as the primary typography across key pages.
- Add test result animations: confetti on perfect score (200/200) and a gentle red shake effect on failure (<200), without blocking navigation/actions.

**User-visible outcome:** The UPSC Interview screen will have clear mic recording, live “Listening…” feedback, on-screen speech-to-text, and an explicit “Speak” control for hearing questions; the Home dashboard will look modern and vibrant with glassmorphism styling and emoji-enhanced buttons; the app will use a rounded bold font; Day 1 test results will show celebratory confetti for 200/200 or a gentle red shake on failure.
