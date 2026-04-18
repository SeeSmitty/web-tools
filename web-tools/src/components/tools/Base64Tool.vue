<script setup>
import { ref, computed } from 'vue'

const mode = ref('encode')        // 'encode' | 'decode'
const inputType = ref('text')     // 'text' | 'file'
const textInput = ref('')
const output = ref('')
const error = ref('')
const fileDataUrl = ref('')
const fileName = ref('')
const isImage = ref(false)
const copied = ref(false)

function processText() {
  error.value = ''
  output.value = ''
  if (!textInput.value) return
  try {
    if (mode.value === 'encode') {
      output.value = btoa(unescape(encodeURIComponent(textInput.value)))
    } else {
      output.value = decodeURIComponent(escape(atob(textInput.value.trim())))
    }
  } catch {
    error.value = mode.value === 'decode'
      ? 'Invalid Base64 — could not decode.'
      : 'Could not encode input.'
  }
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  fileName.value = file.name
  isImage.value = file.type.startsWith('image/')
  const reader = new FileReader()
  reader.onload = ev => {
    const dataUrl = ev.target.result
    fileDataUrl.value = isImage.value ? dataUrl : ''
    // dataUrl is already "data:<mime>;base64,<b64>" — strip the prefix for raw base64
    output.value = dataUrl.split(',')[1]
    error.value = ''
  }
  reader.readAsDataURL(file)
}

async function copyOutput() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}

function downloadDecoded() {
  // For file mode this button isn't shown; only text decode triggers this
  const blob = new Blob([output.value], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'decoded.txt'
  a.click()
  URL.revokeObjectURL(a.href)
}

function switchMode(m) {
  mode.value = m
  textInput.value = ''
  output.value = ''
  error.value = ''
  fileDataUrl.value = ''
  fileName.value = ''
}

function switchInputType(t) {
  inputType.value = t
  textInput.value = ''
  output.value = ''
  error.value = ''
  fileDataUrl.value = ''
  fileName.value = ''
}
</script>

<template>
  <div class="rounded-2xl shadow-sm p-6 space-y-5 max-w-lg" style="background: #252525; border: 1px solid #434343;">

    <!-- Encode / Decode tabs -->
    <div class="flex rounded-lg overflow-hidden text-sm font-medium" style="border: 1px solid #434343;">
      <button
        type="button"
        @click="switchMode('encode')"
        :style="mode === 'encode'
          ? 'flex:1;padding:8px;background:#ffcc00;color:#1c1c1c;'
          : 'flex:1;padding:8px;color:#b6b6b6;background:#1c1c1c;'"
      >Encode</button>
      <button
        type="button"
        @click="switchMode('decode')"
        :style="mode === 'decode'
          ? 'flex:1;padding:8px;background:#ffcc00;color:#1c1c1c;border-left:1px solid #93870a;'
          : 'flex:1;padding:8px;color:#b6b6b6;background:#1c1c1c;border-left:1px solid #434343;'"
      >Decode</button>
    </div>

    <!-- Text / File tabs (only shown for encode) -->
    <div v-if="mode === 'encode'" class="flex gap-2">
      <button
        type="button"
        @click="switchInputType('text')"
        class="text-xs px-3 py-1 rounded-full transition-colors"
        :style="inputType === 'text'
          ? 'background:#353535;color:#ffcc00;border:1px solid #ffcc00;'
          : 'background:transparent;color:#b6b6b6;border:1px solid #434343;'"
      >Text</button>
      <button
        type="button"
        @click="switchInputType('file')"
        class="text-xs px-3 py-1 rounded-full transition-colors"
        :style="inputType === 'file'
          ? 'background:#353535;color:#ffcc00;border:1px solid #ffcc00;'
          : 'background:transparent;color:#b6b6b6;border:1px solid #434343;'"
      >File</button>
    </div>

    <!-- Text input -->
    <div v-if="inputType === 'text' || mode === 'decode'">
      <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">
        {{ mode === 'encode' ? 'Text to encode' : 'Base64 to decode' }}
      </label>
      <textarea
        v-model="textInput"
        @input="processText"
        rows="4"
        :placeholder="mode === 'encode' ? 'Enter text…' : 'Paste Base64 string…'"
        class="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none resize-none"
        style="background: #191919; border: 1px solid #434343; color: #f0e7d5;"
      />
    </div>

    <!-- File input -->
    <div v-else>
      <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">File to encode</label>
      <input
        type="file"
        @change="onFileChange"
        class="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
        style="color: #b6b6b6; file:background: #353535; file:color: #f0e7d5;"
      />
      <img
        v-if="fileDataUrl"
        :src="fileDataUrl"
        class="mt-3 max-h-36 rounded-lg object-contain"
        style="border: 1px solid #434343;"
        :alt="fileName"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="text-sm px-3 py-2 rounded-lg" style="background:#3a1a1a;color:#f87171;border:1px solid #7f1d1d;">
      {{ error }}
    </p>

    <!-- Output -->
    <div v-if="output">
      <label class="block text-sm font-medium mb-1" style="color: #d7cfbe;">
        {{ mode === 'encode' ? 'Base64 output' : 'Decoded text' }}
      </label>
      <textarea
        readonly
        :value="output"
        rows="4"
        class="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none resize-none"
        style="background: #191919; border: 1px solid #434343; color: #f0e7d5;"
      />
      <button
        @click="copyOutput"
        class="mt-2 w-full py-2 px-4 text-sm font-semibold rounded-lg transition-colors"
        :style="copied
          ? 'background:linear-gradient(#3a4a1a,#2a3a0e);border:1px solid #527f0e;color:#93bd20;'
          : 'background:linear-gradient(#93bd20,#659e10);border:1px solid #5d910b;color:white;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 3px 7px rgba(0,0,0,.7);'"
      >{{ copied ? 'Copied!' : 'Copy to Clipboard' }}</button>
    </div>

  </div>
</template>
