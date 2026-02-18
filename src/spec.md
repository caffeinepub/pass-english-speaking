# Specification

## Summary
**Goal:** Convert Button 4 (Day 1 test) into a day-wise, 200-mark testing system aligned to the same-day learning topics, including an essay section and updated 150/200 passing + feedback/unlock rules.

**Planned changes:**
- Update the Day 1 test page (`/day1-test`) to show a single, scrollable list of all questions (not one-question-per-page), each preceded by a visible topic label in the format `[Topic: …]`, and allow in-place answering with a submit action at the bottom.
- Implement day-wise question generation for Button 4 so the Day 1 test pulls questions only from Day 1 topics taught in Button 3 (using existing Day 1 learning hub content) and excludes unrelated topics.
- Add an “Essay Writing” section at the end of the Day 1 test with a large text area, and include the essay as part of scoring worth exactly 20 marks.
- Update scoring and results rules so total marks are exactly 200, passing is `>= 150/200` to unlock the next day, and show exact English feedback strings for `score < 50` and `score >= 150`.
- Update backend submission and course progress logic to persist attempts/scores and unlock the next day when `score >= 150/200`, including safe migration if stored state structures change.
- Revise Button 4 UI copy that references perfect-score unlocking to reflect the new 150/200 passing criteria and updated feedback behavior.

**User-visible outcome:** Users can take the Day 1 test as a clear list of topic-labeled questions plus an essay, submit once from the bottom, receive updated pass/fail feedback in English, and unlock Day 2 when scoring at least 150/200.
