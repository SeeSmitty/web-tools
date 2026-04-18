# Adding New Tools

## Overview

The app is designed so that adding a new tool requires exactly **four changes** and no modifications to shared infrastructure. This document defines the canonical pattern to follow for every new tool.

---

## The Four-Step Pattern

### Step 1 — Create the tool component

Create `src/components/tools/YourToolName.vue`.

This component is self-contained: all inputs, logic, and output live here. It should not rely on global state or emit events upward — tools are standalone widgets.

Minimal starting template:

```vue
<script setup>
// Tool logic here (refs, watchers, functions)
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 max-w-lg">
    <!-- Inputs -->
    <!-- Output / preview -->
    <!-- Action buttons -->
  </div>
</template>
```

---

### Step 2 — Create the view wrapper

Create `src/views/YourToolNameView.vue`.

The view is always a thin wrapper — a heading and the tool component. All logic stays in the tool component.

```vue
<script setup>
import YourToolName from '../components/tools/YourToolName.vue'
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Your Tool Display Name</h1>
    <YourToolName />
  </div>
</template>
```

---

### Step 3 — Add a route

Open `src/router/index.js` and add one object to the `routes` array:

```js
{
  path: '/your-tool',
  name: 'your-tool',
  component: () => import('../views/YourToolNameView.vue'),
},
```

- Use kebab-case for the path.
- Always use lazy loading (`() => import(...)`) for tool views.
- The `name` must be unique across all routes.

---

### Step 4 — Add a landing card

Open `src/views/HomeView.vue` and add one object to the `tools` array:

```js
{
  name: 'Your Tool Display Name',
  description: 'One sentence describing what this tool does.',
  icon: '🔧',
  route: '/your-tool',
},
```

The card will appear in the grid automatically. The `route` value must match the path defined in Step 3.

---

## Checklist

Use this when adding any new tool:

- [ ] `src/components/tools/NewToolName.vue` created
- [ ] `src/views/NewToolNameView.vue` created
- [ ] Route added to `src/router/index.js`
- [ ] Card entry added to `tools` array in `src/views/HomeView.vue`
- [ ] Tool tested locally with `npm run dev`
- [ ] Production build verified with `npm run build && npm run preview`
- [ ] `docs/00-overview.md` tool table updated with the new tool name and route

---

## Naming Conventions

| Thing              | Convention        | Example                     |
|--------------------|-------------------|-----------------------------|
| Component file     | PascalCase        | `ImageConverterTool.vue`    |
| View file          | PascalCase + View | `ImageConverterView.vue`    |
| Route path         | kebab-case        | `/image-converter`          |
| Route name         | kebab-case        | `image-converter`           |
| Landing card name  | Title Case        | `Image Converter`           |

---

## What NOT to change when adding a tool

- `App.vue` — the shell never changes
- `ToolCard.vue` — the card component is reusable as-is
- `vite.config.js`, `tailwind.config.js` — no changes needed

---

## Example: Hypothetical Image Converter

| Step | File modified/created |
|------|-----------------------|
| 1    | `src/components/tools/ImageConverterTool.vue` (create) |
| 2    | `src/views/ImageConverterView.vue` (create) |
| 3    | `src/router/index.js` (add route) |
| 4    | `src/views/HomeView.vue` (add card entry) |
