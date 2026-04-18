<script setup>
import { ref, computed, watch } from 'vue'

const length = ref(16)
const useUpper = ref(true)
const useLower = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(false)
const password = ref('')
const copied = ref(false)

const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER   = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function generate() {
  let charset = ''
  let guaranteed = []

  if (useUpper.value)   { charset += UPPER;   guaranteed.push(UPPER[Math.floor(Math.random() * UPPER.length)]) }
  if (useLower.value)   { charset += LOWER;   guaranteed.push(LOWER[Math.floor(Math.random() * LOWER.length)]) }
  if (useNumbers.value) { charset += NUMBERS; guaranteed.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]) }
  if (useSymbols.value) { charset += SYMBOLS; guaranteed.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]) }

  if (!charset) { password.value = ''; return }

  // Fill remaining length with random chars from full charset
  const remaining = length.value - guaranteed.length
  const rand = Array.from({ length: Math.max(0, remaining) }, () =>
    charset[Math.floor(Math.random() * charset.length)]
  )

  // Shuffle guaranteed + random together using crypto for better randomness
  const all = [...guaranteed, ...rand]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  password.value = all.join('')
  copied.value = false
}

// Strength calculation based on charset size and length
const strength = computed(() => {
  let size = 0
  if (useUpper.value)   size += 26
  if (useLower.value)   size += 26
  if (useNumbers.value) size += 10
  if (useSymbols.value) size += SYMBOLS.length
  if (!size) return { label: 'None', level: 0, color: '#434343' }
  const entropy = length.value * Math.log2(size)
  if (entropy < 28) return { label: 'Very Weak', level: 1, color: '#ef4444' }
  if (entropy < 36) return { label: 'Weak',      level: 2, color: '#f97316' }
  if (entropy < 60) return { label: 'Fair',       level: 3, color: '#eab308' }
  if (entropy < 80) return { label: 'Strong',     level: 4, color: '#84cc16' }
  return                    { label: 'Very Strong',level: 5, color: '#22c55e' }
})

async function copy() {
  if (!password.value) return
  await navigator.clipboard.writeText(password.value)
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}

// At least one charset must be active — prevent unchecking the last one
function guardCheck(active, setter) {
  const active_count = [useUpper.value, useLower.value, useNumbers.value, useSymbols.value].filter(Boolean).length
  if (active_count === 1 && active) return // can't uncheck the last one
  setter(!active)
  generate()
}

watch(length, generate)
generate()
</script>

<template>
  <div class="rounded-2xl shadow-sm p-6 space-y-5 max-w-lg" style="background: #252525; border: 1px solid #434343;">

    <!-- Length -->
    <div>
      <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">
        Length: <span class="font-semibold" style="color: #ffcc00;">{{ length }}</span>
      </label>
      <input v-model.number="length" type="range" min="4" max="128" step="1" class="w-full accent-yellow-400" />
      <div class="flex justify-between text-xs mt-1" style="color: #696969;">
        <span>4</span>
        <span>128</span>
      </div>
    </div>

    <!-- Character sets -->
    <div>
      <p class="text-sm font-medium mb-2" style="color: #d7cfbe;">Character Sets</p>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="({ label, active, setter }) in [
            { label: 'Uppercase (A–Z)',  active: useUpper,   setter: v => useUpper.value   = v },
            { label: 'Lowercase (a–z)',  active: useLower,   setter: v => useLower.value   = v },
            { label: 'Numbers (0–9)',    active: useNumbers, setter: v => useNumbers.value = v },
            { label: 'Symbols (!@#…)',   active: useSymbols, setter: v => useSymbols.value = v },
          ]"
          :key="label"
          class="flex items-center gap-2 text-sm cursor-pointer select-none rounded-lg px-3 py-2"
          :style="active ? 'background:#2a2a1a;border:1px solid #6b5a00;color:#f0e7d5;' : 'background:#191919;border:1px solid #434343;color:#b6b6b6;'"
          @click="guardCheck(active, setter)"
        >
          <span
            class="w-4 h-4 rounded flex items-center justify-center text-xs shrink-0"
            :style="active ? 'background:#ffcc00;color:#1c1c1c;' : 'background:#353535;color:#696969;border:1px solid #434343;'"
          >{{ active ? '✓' : '' }}</span>
          {{ label }}
        </label>
      </div>
    </div>

    <!-- Password output -->
    <div>
      <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">Generated Password</label>
      <div class="flex gap-2">
        <input
          readonly
          :value="password"
          class="flex-1 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none"
          style="background: #191919; border: 1px solid #434343; color: #f0e7d5;"
        />
        <button
          @click="generate"
          class="px-3 py-2 rounded-lg text-lg transition-colors"
          style="background:#353535;border:1px solid #434343;color:#b6b6b6;"
          title="Regenerate"
        >↺</button>
      </div>
    </div>

    <!-- Strength meter -->
    <div v-if="password">
      <div class="flex justify-between text-xs mb-1.5">
        <span style="color: #696969;">Strength</span>
        <span class="font-semibold" :style="{ color: strength.color }">{{ strength.label }}</span>
      </div>
      <div class="flex gap-1">
        <div
          v-for="n in 5"
          :key="n"
          class="flex-1 h-1.5 rounded-full transition-all"
          :style="n <= strength.level ? { background: strength.color } : { background: '#353535' }"
        />
      </div>
    </div>

    <!-- Copy button -->
    <button
      @click="copy"
      :disabled="!password"
      class="w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :style="copied
        ? 'background:linear-gradient(#3a4a1a,#2a3a0e);border:1px solid #527f0e;color:#93bd20;'
        : 'background:linear-gradient(#93bd20,#659e10);border:1px solid #5d910b;color:white;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 3px 7px rgba(0,0,0,.7);'"
    >{{ copied ? 'Copied!' : 'Copy to Clipboard' }}</button>

  </div>
</template>
