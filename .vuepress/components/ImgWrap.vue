<template>
  <div class="img-wrap">
    <img class="img" :src="imgUrl" :alt="alt || 'Vue3'" />

    <p class="desc" v-if="alt">
      {{ alt }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  src: string
  dark?: string
  alt?: string
}>()

// 判断是否绑定了暗黑模式样式的节点
const html = document.querySelector('html')

// 当前是否暗黑模式
const isDark = ref<boolean>(false)
isDark.value = html.classList.contains('dark')

// 动态切换的图片地址
const imgUrl = computed(() =>
  isDark.value && props.dark ? props.dark : props.src
)

// 节点侦听器
const MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver

// 初始化侦听器
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const { type, target } = mutation
    if (type === 'attributes') {
      isDark.value = target.classList.contains('dark')
      console.log(isDark.value)
    }
  })
})

// 绑定侦听
observer.observe(html, {
  subtree: false,
  attributes: true,
  attributeFilter: ['class'],
})
</script>

<style scoped>
.img-wrap {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}
.img-wrap .img {
  width: auto;
  height: auto;
  max-width: 100%;
  border-radius: 4px;
}
.img-wrap .desc {
  font-size: 14px;
  color: #999;
  margin: 0;
}
</style>
