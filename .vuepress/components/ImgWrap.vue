<template>
  <div class="img-wrap">
    <img
      class="img"
      :src="src"
      :alt="alt || 'Vue3'"
    />

    <p class="desc" v-if="alt">
      {{ alt }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
}>()
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
