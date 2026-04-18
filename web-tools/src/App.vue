<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          Web Tools
        </RouterLink>
      </div>
    </nav>

    <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <RouterView />
    </main>

    <footer class="text-center text-sm text-gray-400 py-4">
      Web Tools by SeeSmitty
    </footer>
  </div>
</template>
