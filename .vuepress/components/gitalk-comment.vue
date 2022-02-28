<template>
  <div class="gitalk-comment">
    <!-- Gitalk -->
    <div id="gitalk-container" class="gitalk-container" />
    <!-- Gitalk -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import md5 from 'md5'
import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'

const props = defineProps<{
  issueId: number
}>()

function init() {
  const gitalk = new Gitalk({
    clientID: 'b83f94a1becad40b30df',
    clientSecret: '43f498e9660b0fb385a0a139277f13e87f26074d',
    repo: 'learning-vue3',
    owner: 'chengpeiquan',
    admin: ['chengpeiquan'],
    id: md5(location.pathname),
    number: props.issueId,
  })

  gitalk.render('gitalk-container')
}

onMounted(init)
</script>

<style scoped>
.gt-comment .gt-container >>> .gt-container a {
  color: var(--c-brand) !important;
}
.gt-comment .gt-container >>> .gt-container .gt-header-textarea {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}
.gt-comment
  .gt-container
  >>> .gt-container
  .gt-ico:not(.gt-ico-github)
  .gt-svg
  svg {
  fill: var(--c-brand);
}
.gt-comment .gt-container >>> .gt-container .gt-link {
  border-color: var(--c-brand);
}
.gt-comment .gt-container >>> .gt-container .gt-btn {
  background-color: var(--c-brand);
  border-color: var(--c-brand);
}
.gt-comment .gt-container >>> .gt-container .gt-btn.gt-btn-preview {
  color: var(--c-brand);
  background-color: var(--c-bg);
}
.gt-comment
  .gt-container
  >>> .gt-container
  .gt-comments
  .gt-comments-null {
  color: #767676;
}
.gt-comment
  .gt-container
  >>> .gt-container
  .gt-comment-admin
  .gt-comment-content {
  background-color: rgba(62, 175, 124, 0.04);
}
.gt-comment .gt-container >>> .gt-container .gt-avatar {
  border-radius: 50%;
  overflow: hidden;
}
.gt-comment .gt-container >>> .gt-container .gt-avatar img {
  height: 100%;
  object-fit: cover;
}
</style>
