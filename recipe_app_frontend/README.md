# Recipe Explorer Frontend (LightningJS/Blits)

A LightningJS (Blits) application for browsing, searching, and managing recipes. It follows the Ocean Professional theme: blue primary (#2563EB), amber secondary (#F59E0B), error (#EF4444), text (#111827), background (#f9fafb), surface (#ffffff).

Features:
- Top search bar (keyboard-simulated typing with Left/Right; Enter triggers search feedback)
- Recipe grid/cards with image, title, tags, cook time, favorite toggle
- Recipe detail view (modal) with ingredients and steps
- Favorites panel (sidebar) with quick open/remove
- Local persistence for favorites via localStorage
- Optional API fetch if VITE_API_BASE or VITE_BACKEND_URL is configured; otherwise uses mock data

Run:
- npm install
- npm run dev

Environment variables (set via .env):
- VITE_API_BASE
- VITE_BACKEND_URL
- VITE_FRONTEND_URL
- VITE_WS_URL
- VITE_NODE_ENV
- VITE_NEXT_TELEMETRY_DISABLED
- VITE_ENABLE_SOURCE_MAPS
- VITE_PORT
- VITE_TRUST_PROXY
- VITE_LOG_LEVEL
- VITE_HEALTHCHECK_PATH
- VITE_FEATURE_FLAGS
- VITE_EXPERIMENTS_ENABLED

Assets:
Place recipe images in public/assets/*.jpg. Mock expects:
- public/assets/recipe1.jpg
- public/assets/recipe2.jpg
- public/assets/recipe3.jpg
- public/assets/recipe_placeholder.jpg
