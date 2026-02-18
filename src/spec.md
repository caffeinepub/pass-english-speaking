# Specification

## Summary
**Goal:** Fix repetitive AI chat replies and update the assistant to consistently act as an English Learning Companion with distinct Friend/Teacher personalities and Hindi/Hinglish-aware responses.

**Planned changes:**
- Update the chat reply generation logic to avoid repetitive “tell me more” template responses, especially for short messages and questions.
- Revise system/persona instructions so the assistant identifies as an “English Learning Companion” and prioritizes English-learning help (corrections, better phrasing, vocabulary suggestions) across modes.
- Improve context awareness so replies are grounded in the user’s message content and provide a specific next step (direct answer, correction, example, or targeted follow-up question).
- Add Hindi/Hinglish detection (Devanagari and common Hinglish patterns) to produce mixed Hindi+English explanations when appropriate, while keeping English-only replies for English-only input.
- Ensure Friend mode is funny/light and Teacher mode is helpful/structured, with clearly different tone/structure and reduced reliance on repeated templates.

**User-visible outcome:** Chat replies feel more varied and relevant, Friend and Teacher modes behave distinctly, and Hindi/Hinglish messages (e.g., “Tum kaun ho”) receive mixed Hindi+English replies that still include English-learning guidance.
