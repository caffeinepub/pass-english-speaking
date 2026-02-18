# Specification

## Summary
**Goal:** Confirm the News feature remains in demo mode by default and ensure the frontend never requests, stores, or logs any external news API keys, while keeping the system modular for a future secure backend-enabled integration.

**Planned changes:**
- Ensure the frontend uses demo/placeholder News data as the default source controlled by a centralized frontend configuration toggle (no UI for switching).
- Remove/avoid any frontend API-key handling: no prompts, storage, or logging of external news API keys in the UI/client code.
- Refactor News-related code (as needed) to keep a modular boundary so real news fetching can be enabled later via secure backend settings/integrations (without frontend-provided keys), respecting the single-actor Motoko backend structure.

**User-visible outcome:** The News section continues to show demo/placeholder content with no API key prompts, and the app maintains a secure posture where keys are not handled in the frontend.
