# Implementation Plan - Edit Modal & Grid Layout

## 1. Update Product Store
- **File:** `src/store/products.ts`
- **Task:** Add `updateProduct` action to the Zustand store.
- **Details:**
  - `updateProduct` should take `id` and `updates` (Partial Product).
  - It should update the product in the `products` array while preserving `id` and `createdAt`.

## 2. Create Edit Product Modal Component
- **File:** `src/components/EditProductModal.tsx` (New File)
- **Task:** Create a reusable modal component for editing products.
- **Details:**
  - Props: `isVisible`, `onClose`, `product`.
  - UI:
    - Modal container with blur or overlay.
    - Form fields: Name (TextInput), Price (TextInput), Photo (ImagePicker).
    - "Save Changes" and "Cancel" buttons.
  - Logic:
    - Use `react-hook-form` + `zod` for validation (similar to the add form).
    - Pre-fill values from the `product` prop.
    - Call `updateProduct` from store on submit.

## 3. Enhance Home Screen (Grid Layout & UI)
- **File:** `app/index.tsx`
- **Task:** Refactor the main screen to support grid view and integrate the edit modal.
- **Details:**
  - **State:**
    - `isGridView`: boolean (default false).
    - `editingProduct`: Product | null (to control modal visibility).
  - **Header Enhancements:**
    - Add a toggle button (icon) to switch between List (1 column) and Grid (2 columns) views.
  - **List Implementation:**
    - Use `FlatList` with dynamic `numColumns` and `key` (to force re-render when switching layouts).
    - Create two render styles:
      - **List Item:** Row layout (Image Left, Text Middle, Actions Right).
      - **Grid Item:** Card layout (Image Top, Text Below, Actions Bottom).
  - **Actions:**
    - Add an "Edit" button (Pencil icon) next to the "Delete" button.
    - Pressing "Edit" sets `editingProduct` and opens the modal.
  - **UI Polish:**
    - Improve the "Add Product" section styling (maybe collapsible or card-styled).
    - Ensure safe area handling and consistent spacing.

## 4. Verification
- Test adding a product.
- Test switching between Grid and List views.
- Test editing a product (name, price, image).
- Test deleting a product.
- Verify persistence (reload app).
