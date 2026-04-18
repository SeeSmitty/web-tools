<script setup>
import { ref, computed, watch } from 'vue'

const hex = ref('#3b82f6')
const copied = ref('')

// ── conversions ───────────────────────────────────────────────────────────────
function hexToRgb(h) {
  const r = parseInt(h.slice(1, 3), 16)
  const g = parseInt(h.slice(3, 5), 16)
  const b = parseInt(h.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function rotateHue(h, deg) {
  return hslToHex((h + deg + 360) % 360, hsl.value.s, hsl.value.l)
}

const rgb = computed(() => hexToRgb(hex.value))
const hsl = computed(() => rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b))
const rgbStr = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`)
const hslStr = computed(() => `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`)

const palettes = computed(() => {
  const { h, s, l } = hsl.value
  return {
    Complementary: [hex.value, rotateHue(h, 180)],
    Triadic: [hex.value, rotateHue(h, 120), rotateHue(h, 240)],
    Analogous: [rotateHue(h, -30), hex.value, rotateHue(h, 30)],
    'Split-Complementary': [hex.value, rotateHue(h, 150), rotateHue(h, 210)],
  }
})

async function copyText(text, key) {
  await navigator.clipboard.writeText(text)
  copied.value = key
  setTimeout(() => { if (copied.value === key) copied.value = '' }, 1500)
}
</script>

<template>
  <div class="rounded-2xl shadow-sm p-6 space-y-6 max-w-lg" style="background: #252525; border: 1px solid #434343;">

    <!-- Picker -->
    <div class="flex items-center gap-5">
      <input
        v-model="hex"
        type="color"
        class="w-20 h-20 rounded-xl cursor-pointer border-0 bg-transparent p-1"
        style="border: 2px solid #434343;"
      />
      <div class="space-y-1 flex-1">
        <p class="text-xs font-medium uppercase tracking-wide" style="color: #696969;">Selected color</p>
        <p class="text-2xl font-mono font-bold uppercase" style="color: #f0e7d5;">{{ hex }}</p>
        <input
          v-model="hex"
          type="text"
          maxlength="7"
          placeholder="#000000"
          class="w-full rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none"
          style="background: #191919; border: 1px solid #434343; color: #f0e7d5;"
        />
      </div>
    </div>

    <!-- Values -->
    <div class="space-y-2">
      <p class="text-sm font-medium" style="color: #d7cfbe;">Color Values</p>
      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="({ label, value }) in [
            { label: 'HEX', value: hex.toUpperCase() },
            { label: 'RGB', value: rgbStr },
            { label: 'HSL', value: hslStr },
          ]"
          :key="label"
          class="flex items-center justify-between rounded-lg px-3 py-2"
          style="background: #191919; border: 1px solid #434343;"
        >
          <span class="text-xs font-bold w-8" style="color: #696969;">{{ label }}</span>
          <span class="text-sm font-mono flex-1 px-2" style="color: #f0e7d5;">{{ value }}</span>
          <button
            @click="copyText(value, label)"
            class="text-xs px-2 py-0.5 rounded transition-colors"
            :style="copied === label
              ? 'background: #3a4a1a; color: #93bd20;'
              : 'background: #353535; color: #b6b6b6;'"
          >{{ copied === label ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>
    </div>

    <!-- Palettes -->
    <div class="space-y-4">
      <p class="text-sm font-medium" style="color: #d7cfbe;">Palettes</p>
      <div v-for="(colors, name) in palettes" :key="name" class="space-y-1.5">
        <p class="text-xs font-medium uppercase tracking-wide" style="color: #696969;">{{ name }}</p>
        <div class="flex gap-2">
          <div
            v-for="color in colors"
            :key="color"
            class="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
            @click="copyText(color.toUpperCase(), name + color)"
          >
            <div
              class="w-full h-12 rounded-lg transition-transform group-hover:scale-105"
              :style="{ background: color }"
            />
            <span class="text-xs font-mono" style="color: #b6b6b6;">{{ color.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
