# Specification

## Summary
**Goal:** Fix the /news page so each supported region loads news independently (no Israel gating), India is shown first by default, and each region has its own loading/empty-state behavior.

**Planned changes:**
- Remove the Israel-first gating/locking behavior so India, Dubai, West Bengal, and Israel regions load immediately and independently on /news.
- Reorder the News page regions so India appears first, followed by Dubai, West Bengal, and Israel.
- Add backend support to fetch and cache India top headlines using the provided GNews endpoint, exposing a backend method so the API key is not embedded in the frontend.
- Update the frontend region-news fetching pipeline (when NEWS_DATA_SOURCE is set to `backend`) so each region calls the backend, parses the GNews response, and renders results per region.
- Implement per-region error/empty handling so a failure or empty response in one region shows an empty state for that region only, without blocking other regions.

**User-visible outcome:** On the /news page, India appears first and all regions load and render independently; if a specific region fails or has no articles, only that region shows an empty-state message while other regions still display their news.
