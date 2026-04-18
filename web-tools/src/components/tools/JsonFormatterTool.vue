<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')
const mode = ref('format')   // 'format' | 'minify'
const copied = ref(false)

function process() {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) return
  try {
    const parsed = JSON.parse(input.value)
    output.value = mode.value === 'format'
      ? JSON.stringify(parsed, null, 2)
      : JSON.stringify(parsed)
  } catch (e) {
    error.value = e.message
  }
}

function setMode(m) {
  mode.value = m
  process()
}

async function copy() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}

// Syntax-highlight output
function highlight(json) {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^"\\])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      match => {
        if (/^"/.test(match)) {
          return /:$/.test(match)
            ? `<span style="color:#ffcc00">${match}</span>`   // key
            : `<span style="color:#93bd20">${match}</span>`   // string value
        }
        if (/true|false/.test(match)) return `<span style="color:#38bdf8">${match}</span>`
        if (/null/.test(match))       return `<span style="color:#f87171">${match}</span>`
        return `<span style="color:#fb923c">${match}</span>`  // number
      }
    )
}
</script>

<template>
  <div class="rounded-2xl shadow-sm p-6 space-y-5 max-w-2xl" style="background: #252525; border: 1px solid #434343;">

    <!-- Format / Minify tabs -->
    <div class="flex rounded-lg overflow-hidden text-sm font-medium" style="border: 1px solid #434343;">
      <button
        type="button"
        @click="setMode('format')"
        :style="mode === 'format'
          ? 'flex:1;padding:8px;background:#ffcc00;color:#1c1c1c;'
          : 'flex:1;padding:8px;color:#b6b6b6;background:#1c1c1c;'"
      >Format</button>
      <button
        type="button"
        @click="setMode('minify')"
        :style="mode === 'minify'
          ? 'flex:1;padding:8px;background:#ffcc00;color:#1c1c1c;border-left:1px solid #93870a;'
          : 'flex:1;padding:8px;color:#b6b6b6;background:#1c1c1c;border-left:1px solid #434343;'"
      >Minify</button>
    </div>

    <!-- Input -->
    <div>
      <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">JSON Input</label>
      <textarea
        v-model="input"
        @input="process"
        rows="8"
        placeholder='{"key": "value"}'
        class="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none resize-y"
        style="background: #191919; border: 1px solid #434343; color: #f0e7d5; min-height: 120px;"
      />
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="flex items-start gap-2 text-sm px-3 py-2 rounded-lg"
      style="background:#3a1a1a;color:#f87171;border:1px solid #7f1d1d;"
    >
      <span class="font-bold shrink-0">✕</span>
      <span class="font-mono">{{ error }}</span>
    </div>

    <!-- Valid indicator -->
    <p
      v-else-if="input.trim() && !output"
      class="text-sm"
      style="color: #696969;"
    >Enter JSON above to see output.</p>
    <p
      v-else-if="output"
      class="text-xs font-medium"
      style="color: #93bd20;"
    >✓ Valid JSON</p>

    <!-- Output -->
    <div v-if="output">
      <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">
        {{ mode === 'format' ? 'Formatted' : 'Minified' }} Output
      </label>
      <div
        v-if="mode === 'format'"
        class="rounded-lg px-3 py-2 text-sm font-mono overflow-auto"
        style="background: #191919; border: 1px solid #434343; color: #f0e7d5; max-height: 320px; white-space: pre;"
        v-html="highlight(output)"
      />
      <textarea
        v-else
        readonly
        :value="output"
        rows="3"
        class="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none resize-none"
        style="background: #191919; border: 1px solid #434343; color: #f0e7d5;"
      />
      <button
        @click="copy"
        class="mt-2 w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors"
        :style="copied
          ? 'background:linear-gradient(#3a4a1a,#2a3a0e);border:1px solid #527f0e;color:#93bd20;'
          : 'background:linear-gradient(#93bd20,#659e10);border:1px solid #5d910b;color:white;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 3px 7px rgba(0,0,0,.7);'"
      >{{ copied ? 'Copied!' : 'Copy Output' }}</button>
    </div>

  </div>
</template>
