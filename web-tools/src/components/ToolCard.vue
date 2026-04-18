<script setup>
defineProps({
  name: String,
  description: String,
  icon: String,
  route: String,
  color: { type: String, default: 'blue' },
})

const gradients = {
  blue:   'from-blue-400 to-indigo-600',
  green:  'from-emerald-400 to-teal-600',
  purple: 'from-purple-400 to-violet-600',
  orange: 'from-orange-400 to-amber-500',
  pink:   'from-pink-400 to-rose-600',
  teal:   'from-teal-400 to-cyan-600',
}
</script>

<template>
  <RouterLink
    :to="route"
    class="group block rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    style="background: #252525; border: 1px solid #434343;"
  >
    <!-- Gradient banner with icon -->
    <div
      :class="`bg-gradient-to-br ${gradients[color] ?? gradients.blue} flex items-center justify-center h-28`"
    >
      <span class="text-5xl drop-shadow-md">{{ icon }}</span>
    </div>

    <!-- Text -->
    <div class="p-5">
      <h2 class="text-base font-semibold transition-colors" style="color: #e8e8e8;">
        {{ name }}
      </h2>
      <p class="text-sm mt-1" style="color: #b6b6b6;">{{ description }}</p>
    </div>
  </RouterLink>
</template>
