<template>
  <div class="google-adsense">
    <ins
      class="adsbygoogle"
      style="display: inline-block; width: 728px; height: 90px"
      data-ad-client="ca-pub-7109929923549092"
      data-ad-slot="8310105795"
    >
    </ins>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const lib = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

function init() {
  try {
    const url = window.location.href
    if (url.includes('localhost')) {
      return false
    }

    const script = document.createElement('script')
    script['async'] = true
    script['src'] = lib

    script.onload = () => {
      push()
    }

    if (document.head.querySelector(`script[src='${lib}']`)) {
      push()
    } else {
      document.head.appendChild(script)
    }
  } catch (e) {
    console.log(e)
  }
}

function push() {
  setTimeout(() => {
    ;(adsbygoogle = window.adsbygoogle || []).push({})
  }, 1000)
}

onMounted(init)
</script>

<style scoped>
.google-adsense {
  width: 100%;
  max-height: 90px !important;
  overflow: hidden !important;
}
</style>
