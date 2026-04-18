<script setup>
defineProps({
  name: String,
  description: String,
  icon: String,
  route: String,
})
</script>

<template>
  <RouterLink
    :to="route"
    class="group block bg-white rounded-2xl border border-gray-200 shadow-sm p-6
           hover:shadow-md hover:border-blue-300 transition-all duration-200"
  >
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h2 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
      {{ name }}
    </h2>
    <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
  </RouterLink>
</template>
