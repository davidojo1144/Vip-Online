# Vip-Online Expo App

## Summary
This repository contains an Expo React Native app scaffolded for YipOnline’s case study. It implements a product uploader with a hard limit of 5 products, local notifications on limit, and a clean Tailwind-powered UI with grid/list layouts and editing capabilities.

## What Was Implemented
- Expo Router set up with typed routes and root providers (Auth, Query, Toast).
- NativeWind/Tailwind configured with Babel preset, Metro integration, and global.css.
- Absolute imports via Babel module-resolver and TypeScript paths (@/).
- Zustand stores:
  - `src/store/auth.ts` basic auth outline.
  - `src/store/products.ts` persisted products with max 5 limit.
- Networking setup: centralized Axios client with auth interceptor (`src/lib/api.ts`).
- AsyncStorage helpers and SecureStore for sensitive tokens.
- Notifications: local notifications via `expo-notifications` (`src/lib/notifications.ts`).
- Image picking: `expo-image-picker` for photo selection.
- Safe area with `react-native-safe-area-context`.
- EAS build profiles (`eas.json`) and app config linking scheme (`viponline`).
- ESLint (flat) and Prettier, with scripts: `npm run lint`, `npm run format`.

## Case Study Feature
### Products Screen ([app/index.tsx](./app/index.tsx))
- **Add Product**: Form with validation (name required, price required/decimal) and photo picker.
- **View Options**: Toggle between List (single column) and Grid (two columns) layouts.
- **Edit Product**: Modal to update name, price, and photo for existing items.
- **Limit Enforcement**: Maximum of 5 products; “Add” button disables at limit.
- **Notifications**: Local notification triggered when the 5th product is added.
- **Persistence**: Products saved locally via AsyncStorage; persist across app restarts.

### Store ([src/store/products.ts](./src/store/products.ts))
- Persists products in AsyncStorage with Zustand `persist`.
- API:
  - `addProduct({ name, price, imageUri })`
  - `updateProduct(id, { name, price, imageUri })`
  - `removeProduct(id)`
  - `clearAll()`
- Constant: `MAX_PRODUCTS = 5`

### Notifications ([src/lib/notifications.ts](./src/lib/notifications.ts))
- `ensureNotificationPermission()` requests permissions.
- `notifyProductLimitReached()` schedules a local notification.
> Note: Push notifications require development builds; local notifications work in Expo Go.

## Styling
- Tailwind/NativeWind:
  - [global.css](./global.css) loaded in [app/_layout.tsx](./app/_layout.tsx)
  - [metro.config.js](./metro.config.js) uses `withNativeWind` integration.
  - [babel.config.js](./babel.config.js) sets `jsxImportSource: 'nativewind'` in `babel-preset-expo` and includes `nativewind/babel`.
  - [tailwind.config.js](./tailwind.config.js) includes `nativewind/preset` and paths `./app` and `./src`.

## Config
- [app.json](./app.json): adds scheme `viponline`, plugins `expo-router`, `expo-image`, `expo-secure-store`, `expo-notifications`.
- [app.config.ts](./app.config.ts): environment variables and extra config.
- [tsconfig.json](./tsconfig.json): types for Expo Router and NativeWind; alias `@/*` → `src/*`.

## Run
1. Install deps: `npm install`
2. Start dev server: `npx expo start`
3. Open the iOS simulator or scan the QR to open in Expo Go (SDK 55 compatible).

## Lint & Types
- `npm run lint`
- `npx tsc --noEmit`

## Walkthrough PDF
- Markdown walkthrough: [docs/case-study.md](./docs/case-study.md)
- HTML export: [docs/case-study.html](./docs/case-study.html)
- PDF generation script (requires Puppeteer Chromium download; may be restricted in some environments):
  - `node scripts/generate-pdf.js` (outputs `docs/case-study.pdf`)

## Notes
- If Tailwind classes don’t apply immediately after changes, refresh the app; NativeWind hot-reload can occasionally require a manual reload.
- Linking scheme is set; deep linking can be configured later for universal links/app links.
