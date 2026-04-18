<script setup>
import { ref } from 'vue'

const count = ref(5)
const uuids = ref([])
const copiedIndex = ref(null)
const copiedAll = ref(false)

function generate() {
  uuids.value = Array.from({ length: count.value }, () => crypto.randomUUID())
  copiedIndex.value = null
  copiedAll.value = false
}

async function copyOne(uuid, i) {
  await navigator.clipboard.writeText(uuid)
  copiedIndex.value = i
  setTimeout(() => { if (copiedIndex.value === i) copiedIndex.value = null }, 1500)
}

async function copyAll() {
  await navigator.clipboard.writeText(uuids.value.join('\n'))
  copiedAll.value = true
  setTimeout(() => copiedAll.value = false, 1500)
}

// Generate on load
generate()
</script>

<template>
  <div class="rounded-2xl shadow-sm p-6 space-y-5 max-w-lg" style="background: #252525; border: 1px solid #434343;">

    <!-- Controls -->
    <div class="flex items-end gap-4">
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">
          Count: <span class="font-semibold" style="color: #ffcc00;">{{ count }}</span>
        </label>
        <input
          v-model.number="count"
          type="range"
          min="1"
          max="50"
          step="1"
          class="w-full accent-yellow-400"
        />
        <div class="flex justify-between text-xs mt-1" style="color: #696969;">
          <span>1</span>
          <span>50</span>
        </div>
      </div>
      <button
        @click="generate"
        class="py-2 px-4 text-sm font-semibold rounded-lg transition-colors"
        style="background:linear-gradient(#93bd20,#659e10);border:1px solid #5d910b;color:white;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 3px 7px rgba(0,0,0,.7);"
      >Generate</button>
    </div>

    <!-- UUID list -->
    <div class="space-y-2">
      <div
        v-for="(uuid, i) in uuids"
        :key="uuid"
        class="flex items-center justify-between rounded-lg px-3 py-2 gap-3"
        style="background: #191919; border: 1px solid #434343;"
      >
        <span class="text-sm font-mono flex-1 truncate" style="color: #f0e7d5;">{{ uuid }}</span>
        <button
          @click="copyOne(uuid, i)"
          class="text-xs px-2 py-0.5 rounded shrink-0 transition-colors"
          :style="copiedIndex === i
            ? 'background:#3a4a1a;color:#93bd20;'
            : 'background:#353535;color:#b6b6b6;'"
        >{{ copiedIndex === i ? 'Copied!' : 'Copy' }}</button>
      </div>
    </div>

    <!-- Copy all -->
    <button
      v-if="uuids.length > 1"
      @click="copyAll"
      class="w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors"
      :style="copiedAll
        ? 'background:linear-gradient(#3a4a1a,#2a3a0e);border:1px solid #527f0e;color:#93bd20;'
        : 'background:linear-gradient(#93bd20,#659e10);border:1px solid #5d910b;color:white;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 3px 7px rgba(0,0,0,.7);'"
    >{{ copiedAll ? 'Copied All!' : `Copy All ${uuids.length} UUIDs` }}</button>

  </div>
</template>
