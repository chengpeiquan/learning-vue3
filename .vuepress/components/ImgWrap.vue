<template>
  <div class="img-wrap">
    <img class="img" :src="imgUrl" :alt="alt || 'Vue3'" />

    <p class="desc" v-if="alt">
      {{ alt }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  src: string
  dark?: string
  alt?: string
}>()

// 判断是否绑定了暗黑模式样式的节点
const element = ref<HTMLElement>()

// 当前是否暗黑模式
const isDark = ref<boolean>(false)

// 动态切换的图片地址
const imgUrl = computed(() =>
  isDark.value && props.dark ? props.dark : props.src
)

// 侦听器
const observer = ref<MutationObserver>()

/**
 * 初始化侦听
 * @description 用于侦听暗黑模式切换，动态切换配套的图片
 */
function init() {
  element.value = document.querySelector('html')
  if (!element.value) return

  // 包含该样式说明处于暗黑模式中
  isDark.value = element.value.classList.contains('dark')

  // 初始化侦听器
  observer.value = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const { type, target } = mutation
      if (type === 'attributes') {
        isDark.value = target.classList.contains('dark')
        console.log(isDark.value)
      }
    })
  })

  // 绑定侦听
  observer.value.observe(element.value, {
    subtree: false,
    attributes: true,
    attributeFilter: ['class'],
  })
}
onMounted(() => {
  init()
})

onUnmounted(() => {
  observer.value.disconnect()
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
