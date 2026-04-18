<script setup>
import ToolCard from '../components/ToolCard.vue'

const tools = [
  {
    name: 'QR Code Generator',
    description: 'Generate a QR code from any URL or text. Supports Wi-Fi credentials. Download as PNG.',
    icon: '🔲',
    route: '/qr',
    color: 'blue',
  },
  {
    name: 'Color Picker',
    description: 'Pick a color and get HEX, RGB, and HSL values. Generate complementary, triadic, and analogous palettes.',
    icon: '🎨',
    route: '/color-picker',
    color: 'purple',
  },
  {
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text or files to Base64, or decode Base64 back to text. Includes image preview.',
    icon: '🔤',
    route: '/base64',
    color: 'orange',
  },
  {
    name: 'UUID Generator',
    description: 'Bulk-generate v4 UUIDs using the browser crypto API. Copy one or all with a click.',
    icon: '🪪',
    route: '/uuid',
    color: 'teal',
  },
  {
    name: 'Password Generator',
    description: 'Generate secure passwords with custom length and character sets. Includes entropy-based strength meter.',
    icon: '🔑',
    route: '/password',
    color: 'green',
  },
  {
    name: 'JSON Formatter',
    description: 'Format or minify JSON with syntax highlighting and inline validation.',
    icon: '📋',
    route: '/json',
    color: 'pink',
  },
  // Add future tools here. A card will appear automatically.
]
</script>

<template>
  <div>
    <!-- Hero header -->
    <div class="mb-10">
      <h1 class="text-4xl font-extrabold mb-3" style="color: #e8e8e8;">
        Web <span style="color: #ffcc00;">Tools</span>
      </h1>
      <p class="text-lg" style="color: #b6b6b6;">Simple, fast, browser-based utilities. No signup required.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard
        v-for="tool in tools"
        :key="tool.route"
        :name="tool.name"
        :description="tool.description"
        :icon="tool.icon"
        :route="tool.route"
        :color="tool.color"
      />
    </div>

    <!-- Privacy notice -->
    <div class="mt-12 flex items-start gap-3 rounded-2xl px-5 py-4 text-sm" style="background: #252525; border: 1px solid #434343; color: #f0e7d5;">
      <span class="text-lg leading-tight">🔒</span>
      <div>
        <span class="font-semibold">Private by design.</span>
        Everything runs directly in your browser. No data is sent to any server, stored, or logged — not even temporarily. Once you close the tab, nothing remains.
      </div>
    </div>
  </div>
</template>
