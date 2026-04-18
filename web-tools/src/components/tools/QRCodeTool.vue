<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

const mode = ref('text')

// Text/URL mode
const inputText = ref('')

// Wi-Fi mode
const wifiSsid = ref('')
const wifiPassword = ref('')
const wifiSecurity = ref('WPA')
const wifiHidden = ref(false)
const showWifiPassword = ref(false)

// Shared
const label = ref('')
const size = ref(256)
const errorLevel = ref('M')
const canvasRef = ref(null)
const isEmpty = ref(true)
const showTooltip = ref(false)

let debounceTimer = null

function escapeWifi(str) {
  return str.replace(/[\\;,"':]/g, c => '\\' + c)
}

function buildContent() {
  if (mode.value === 'wifi') {
    if (!wifiSsid.value.trim()) return ''
    const s = escapeWifi(wifiSsid.value)
    const p = wifiSecurity.value !== 'nopass' ? escapeWifi(wifiPassword.value) : ''
    const h = wifiHidden.value ? 'true' : 'false'
    return `WIFI:T:${wifiSecurity.value};S:${s};P:${p};H:${h};;`
  }
  return inputText.value.trim()
}

async function generateQR() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    const content = buildContent()
    if (!content || !canvasRef.value) {
      isEmpty.value = true
      return
    }
    try {
      // Render QR to an offscreen canvas
      const offscreen = document.createElement('canvas')
      await QRCode.toCanvas(offscreen, content, {
        width: size.value,
        errorCorrectionLevel: errorLevel.value,
        margin: 2,
      })

      // Compose onto the visible canvas, adding label space if needed
      const labelText = label.value.trim()
      const labelPad = labelText ? Math.round(size.value * 0.14) : 0
      const canvas = canvasRef.value
      canvas.width = size.value
      canvas.height = size.value + labelPad

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(offscreen, 0, 0)

      if (labelText) {
        const fontSize = Math.max(12, Math.round(size.value * 0.055))
        ctx.fillStyle = '#111827'
        ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(labelText, canvas.width / 2, size.value + labelPad / 2, size.value - 20)
      }

      isEmpty.value = false
    } catch (err) {
      console.error('QR generation failed:', err)
    }
  }, 300)
}

watch(
  [mode, inputText, label, size, errorLevel, wifiSsid, wifiPassword, wifiSecurity, wifiHidden],
  generateQR
)

function downloadPNG() {
  if (!canvasRef.value || isEmpty.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 max-w-lg">

    <!-- Mode tabs -->
    <div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
      <button
        type="button"
        @click="mode = 'text'"
        :class="mode === 'text'
          ? 'flex-1 py-2 bg-blue-600 text-white transition-colors'
          : 'flex-1 py-2 text-gray-600 hover:bg-gray-50 transition-colors'"
      >Text / URL</button>
      <button
        type="button"
        @click="mode = 'wifi'"
        :class="mode === 'wifi'
          ? 'flex-1 py-2 bg-blue-600 text-white border-l border-blue-500 transition-colors'
          : 'flex-1 py-2 text-gray-600 hover:bg-gray-50 border-l border-gray-200 transition-colors'"
      >📶 Wi-Fi</button>
    </div>

    <!-- Text/URL input -->
    <div v-if="mode === 'text'">
      <label class="block text-sm font-medium text-gray-700 mb-1">Text or URL</label>
      <input
        v-model="inputText"
        type="text"
        placeholder="https://example.com"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Wi-Fi fields -->
    <div v-else class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Network Name (SSID)</label>
        <input
          v-model="wifiSsid"
          type="text"
          placeholder="My Home Network"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Security</label>
        <select
          v-model="wifiSecurity"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="WPA">WPA / WPA2 / WPA3</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (open network)</option>
        </select>
      </div>
      <div v-if="wifiSecurity !== 'nopass'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div class="relative">
          <input
            v-model="wifiPassword"
            :type="showWifiPassword ? 'text' : 'password'"
            placeholder="Enter Wi-Fi password"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            @click="showWifiPassword = !showWifiPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base leading-none"
            :aria-label="showWifiPassword ? 'Hide password' : 'Show password'"
          >{{ showWifiPassword ? '🙈' : '👁️' }}</button>
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
        <input v-model="wifiHidden" type="checkbox" class="rounded border-gray-300 accent-blue-600" />
        Hidden network (SSID is not broadcast)
      </label>
    </div>

    <!-- Label -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Label <span class="text-gray-400 font-normal">(optional — baked into the PNG)</span>
      </label>
      <input
        v-model="label"
        type="text"
        placeholder="e.g. Scan to connect"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Size slider -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Size: <span class="text-blue-600 font-semibold">{{ size }}px</span>
      </label>
      <input
        v-model.number="size"
        type="range"
        min="128"
        max="512"
        step="32"
        class="w-full accent-blue-600"
      />
      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>128px</span>
        <span>512px</span>
      </div>
    </div>

    <!-- Error correction level -->
    <div>
      <div class="flex items-center gap-1.5 mb-1">
        <label class="text-sm font-medium text-gray-700">Error Correction</label>
        <div class="relative">
          <button
            type="button"
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
            @focus="showTooltip = true"
            @blur="showTooltip = false"
            @click="showTooltip = !showTooltip"
            class="w-4 h-4 rounded-full bg-gray-200 hover:bg-blue-100 text-gray-500
                   hover:text-blue-600 text-xs font-bold flex items-center justify-center
                   transition-colors leading-none"
            aria-label="What is error correction?"
          >i</button>
          <div
            v-if="showTooltip"
            class="absolute left-6 top-0 z-10 w-64 rounded-xl bg-gray-900 text-white text-xs p-3 shadow-xl"
          >
            <p class="font-semibold mb-1.5">What is Error Correction?</p>
            <p class="text-gray-300 mb-2">Controls how much of the QR code can be damaged or covered and still scan correctly.</p>
            <ul class="space-y-1 text-gray-300">
              <li><span class="text-white font-medium">L — Low</span> · 7% recoverable · smallest code</li>
              <li><span class="text-white font-medium">M — Medium</span> · 15% · good default</li>
              <li><span class="text-white font-medium">Q — Quartile</span> · 25% · better for printing</li>
              <li><span class="text-white font-medium">H — High</span> · 30% · use when adding a logo over the QR code</li>
            </ul>
          </div>
        </div>
      </div>
      <select
        v-model="errorLevel"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="L">L — Low</option>
        <option value="M">M — Medium (recommended)</option>
        <option value="Q">Q — Quartile</option>
        <option value="H">H — High</option>
      </select>
    </div>

    <!-- Canvas preview -->
    <div class="flex flex-col items-center gap-4">
      <div
        v-if="isEmpty"
        class="flex items-center justify-center text-gray-400 text-sm border-2
               border-dashed border-gray-200 rounded-xl"
        :style="{ width: size + 'px', height: size + 'px' }"
      >
        {{ mode === 'wifi' ? 'Enter a network name above' : 'Enter text above' }}
      </div>
      <canvas
        ref="canvasRef"
        :class="{ hidden: isEmpty }"
        class="rounded-lg border border-gray-100"
      />

      <button
        @click="downloadPNG"
        :disabled="isEmpty"
        class="w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg
               hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Download PNG
      </button>
    </div>

  </div>
</template>
