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
  </div>
</template>
