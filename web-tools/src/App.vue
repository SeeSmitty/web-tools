<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: linear-gradient(#2a2a29, #1c1c1c); background-attachment: fixed;">
    <nav style="background: #353535; border-bottom: 4px solid #434343; box-shadow: 0 1px 3px rgba(0,0,0,.25);">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="text-xl font-bold transition-colors hover:text-[#ffcc00]" style="color: #e8e8e8;">
          Web Tools
        </RouterLink>
      </div>
    </nav>

    <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <RouterView />
    </main>

    <footer class="text-center text-sm py-4" style="color: #696969;">
      Web Tools by SeeSmitty
    </footer>
  </div>
</template>
