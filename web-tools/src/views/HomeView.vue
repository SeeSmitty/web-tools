<script setup>
import ToolCard from '../components/ToolCard.vue'

const tools = [
  {
    name: 'QR Code Generator',
    description: 'Generate a QR code from any URL or text. Download as PNG.',
    icon: '⬛',
    route: '/qr',
  },
  // Add future tools here. A card will appear automatically.
]
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Tools</h1>
    <p class="text-gray-500 mb-8">Pick a tool to get started.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard
        v-for="tool in tools"
        :key="tool.route"
        :name="tool.name"
        :description="tool.description"
        :icon="tool.icon"
        :route="tool.route"
      />
    </div>
  </div>
</template>
