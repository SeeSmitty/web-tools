<script setup>
import ToolCard from '../components/ToolCard.vue'

const tools = [
  {
    name: 'QR Code Generator',
    description: 'Generate a QR code from any URL or text. Download as PNG.',
    icon: '🔲',
    route: '/qr',
    color: 'blue',
  },
  // Add future tools here. A card will appear automatically.
]
</script>

<template>
  <div>
    <!-- Hero header -->
    <div class="mb-10">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-3">
        Web <span class="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Tools</span>
      </h1>
      <p class="text-gray-500 text-lg">Simple, fast, browser-based utilities. No signup required.</p>
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
    <div class="mt-12 flex items-start gap-3 rounded-2xl bg-green-50 border border-green-100 px-5 py-4 text-sm text-green-800">
      <span class="text-lg leading-tight">🔒</span>
      <div>
        <span class="font-semibold">Private by design.</span>
        Everything runs directly in your browser. No data is sent to any server, stored, or logged — not even temporarily. Once you close the tab, nothing remains.
      </div>
    </div>
  </div>
</template>
