# QR Code Tool

## Overview

The QR Code tool runs entirely in the browser. It uses the `qrcode` npm package to render a QR code to an HTML `<canvas>` element in real time. The user can download the result as a PNG.

**No network requests are made.** All processing is local.

---

## Library

**Package:** [`qrcode`](https://www.npmjs.com/package/qrcode)

Install: `npm install qrcode`

The key API used is `QRCode.toCanvas(canvasElement, text, options)`, which renders directly to a `<canvas>` DOM element.

---

## Inputs

| Input              | Type     | Range / Options         | Default  |
|--------------------|----------|-------------------------|----------|
| Text / URL field   | Text     | Any string              | —        |
| Size               | Slider   | 128px – 512px           | 256px    |
| Error correction   | Select   | L, M, Q, H              | M        |

### Error correction levels explained

| Level | Recovery capacity | Use case                        |
|-------|-------------------|---------------------------------|
| L     | ~7%               | Clean digital display           |
| M     | ~15%              | General use (default)           |
| Q     | ~25%              | Printed with potential damage   |
| H     | ~30%              | Logos overlaid on the QR code   |

---

## Output

- A `<canvas>` element that updates on every input change (debounced 300ms to avoid thrashing)
- A "Download PNG" button that converts the canvas to a data URL and triggers a file download

---

## File: `src/components/tools/QRCodeTool.vue`

```vue
<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

const inputText = ref('')
const size = ref(256)
const errorLevel = ref('M')
const canvasRef = ref(null)
const isEmpty = ref(true)

let debounceTimer = null

function generateQR() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    if (!inputText.value.trim() || !canvasRef.value) {
      isEmpty.value = true
      return
    }
    try {
      await QRCode.toCanvas(canvasRef.value, inputText.value.trim(), {
        width: size.value,
        errorCorrectionLevel: errorLevel.value,
        margin: 2,
      })
      isEmpty.value = false
    } catch (err) {
      console.error('QR generation failed:', err)
    }
  }, 300)
}

watch([inputText, size, errorLevel], generateQR)

function downloadPNG() {
  if (!canvasRef.value || isEmpty.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 max-w-lg">

    <!-- Text input -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Text or URL</label>
      <input
        v-model="inputText"
        type="text"
        placeholder="https://example.com"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Size slider -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Size: <span class="text-blue-600 font-semibold">{{ size }}px</span>
      </label>
      <input
        v-model.number="size"
        type="range"
        min="128"
        max="512"
        step="32"
        class="w-full accent-blue-600"
      />
      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>128px</span>
        <span>512px</span>
      </div>
    </div>

    <!-- Error correction level -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Error Correction</label>
      <select
        v-model="errorLevel"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="L">L — Low (~7% recovery)</option>
        <option value="M">M — Medium (~15% recovery)</option>
        <option value="Q">Q — Quartile (~25% recovery)</option>
        <option value="H">H — High (~30% recovery)</option>
      </select>
    </div>

    <!-- Canvas preview -->
    <div class="flex flex-col items-center gap-4">
      <div
        v-if="isEmpty"
        class="flex items-center justify-center text-gray-400 text-sm border-2
               border-dashed border-gray-200 rounded-xl"
        :style="{ width: size + 'px', height: size + 'px' }"
      >
        Enter text above
      </div>
      <canvas
        ref="canvasRef"
        :class="{ hidden: isEmpty }"
        class="rounded-lg border border-gray-100"
      />

      <button
        @click="downloadPNG"
        :disabled="isEmpty"
        class="w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg
               hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Download PNG
      </button>
    </div>

  </div>
</template>
```

---

## Behaviour Notes

- The `watch` on `[inputText, size, errorLevel]` triggers `generateQR` any time any input changes.
- A 300ms debounce prevents QR re-generation on every keystroke during fast typing.
- The canvas is hidden (not destroyed) when empty so the `ref` stays valid.
- The placeholder dashed box matches the current size slider value so the layout doesn't jump when a QR code first appears.
- `downloadPNG` uses `canvas.toDataURL()` — fully client-side, no server upload.

---

## Next Step

Proceed to [06-adding-new-tools.md](./06-adding-new-tools.md) to understand the pattern for adding future tools.
