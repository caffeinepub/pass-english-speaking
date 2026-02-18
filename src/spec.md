# Specification

## Summary
**Goal:** Improve the News empty state with a per-region in-app URL fallback, and enhance the Interview feature with uploads, speech-to-text answering, and saved performance reports in Progress.

**Planned changes:**
- In News regions with an empty list (and not loading/error), show a labeled URL input with an "Open" action and validate http/https URLs before opening an in-app embedded view.
- Persist the fallback News URL per region so the input restores on return; allow updating and clearing per region.
- Rename the Home button/feature text from "UPSC Interview" to "Interview" across all user-facing UI labels for this feature.
- Add Interview upload support for PDF and image files; extract text from uploads to generate questions and show the generated questions before starting the interview; if image text extraction fails, prompt for manual text input.
- In Interview answering, add an answer text area plus a mic button (with an upload icon) to capture speech-to-text into the answer box (including interim and final transcripts).
- Save the final Interview performance analysis/report for logged-in users and display (at minimum) the most recent saved Interview report in a dedicated section on the Progress page; show an English message when login is required to save.

**User-visible outcome:** When News is empty for a region, users can paste and reopen a saved per-region URL inside the app; the Interview feature is renamed, supports PDF/image uploads to generate questions, allows typed or speech-to-text answers, and stores performance reports for later viewing in Progress (when logged in).
