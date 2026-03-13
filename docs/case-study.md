# YipOnline Mobile Case Study: Product Uploader

## Overview

Build a simple Expo React Native app to let users upload up to 5 products. Each product has a name, photo, and price. When the user hits the 5-product limit, the app notifies them.

## Tech Choices

- Expo SDK 55 with React Native 0.83 and React 19
- Expo Router for navigation and linking
- Zustand for local state (persisted to AsyncStorage)
- React Hook Form + Zod for form validation
- expo-image-picker for photo selection
- expo-notifications for local notifications
- NativeWind/Tailwind for styling
- safe-area via react-native-safe-area-context

## Architecture

- Store: `src/store/products.ts` keeps a persisted list of products and enforces `MAX_PRODUCTS = 5`.
- UI: `app/index.tsx` is a single-screen flow with:
  - Add Product form
  - Grid/List toggle view
  - Product list/grid
  - Edit Modal (`src/components/EditProductModal.tsx`)
- Notifications: `src/lib/notifications.ts` requests permissions and schedules a local notification on limit.
- Styling: Tailwind classes via NativeWind with `global.css` and Metro integration in `metro.config.js`.

## State Model

```ts
type Product = {
  id: string;
  name: string;
  price: number;
  imageUri?: string | null;
  createdAt: number;
};
```

Actions: `addProduct`, `updateProduct`, `removeProduct`, `clearAll`. Persistence key: `vip-products`.

## Limit Enforcement + Notification

- The store blocks `addProduct` when `products.length >= 5`.
- The UI schedules a local notification when the list reaches 5.
- If permission is denied, the app falls back to a toast.

## Validation

- `name`: required, ≤ 80 chars
- `price`: required, decimal with up to 2 digits (e.g. `12.99`)
- Image: optional; picked from camera roll

## How to Run

1. Install dependencies: `npm install`
2. Start dev server: `npx expo start`
3. Open iOS simulator or scan QR for Expo Go 55.x
4. Add products on the home screen; try reaching 5 to trigger the notification.

## Files of Interest

- `app/index.tsx`: Product form and list
- `src/components/EditProductModal.tsx`: Modal for editing product details
- `src/store/products.ts`: State and limit logic
- `src/lib/notifications.ts`: Permission and scheduling
- `global.css`, `metro.config.js`, `babel.config.js`, `tailwind.config.js`: Styling/plumbing
- `app.json`, `app.config.ts`: App configuration and linking scheme

## Notes & Trade-offs

- Local notifications work in Expo Go; push notifications require development builds.
- Zustand chosen for minimal boilerplate and great performance; Redux is a viable alternative.
- Images are stored as local URIs; no remote upload is performed in this case study.
- The UI is intentionally simple, focusing on correctness and UX smoothness.

## Future Enhancements

- Sort and search
- Image capture via camera
- Sync to backend with Axios and React Query
