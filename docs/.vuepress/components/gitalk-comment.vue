<template>
  <div class="gitalk-comment">
    <!-- Gitalk -->
    <div
      id="gitalk-container"
      class="gitalk-container"
    />
    <!-- Gitalk -->
  </div>
</template>

<script>
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import md5 from 'md5'

export default {
  name: 'comment',
  props: {
    issueId: Number
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      const gitalk = new Gitalk({
        clientID: 'b83f94a1becad40b30df',
        clientSecret: '43f498e9660b0fb385a0a139277f13e87f26074d',
        repo: 'learning-vue3',
        owner: 'chengpeiquan',
        admin: [
          'chengpeiquan'
        ],
        id: md5(location.pathname),
        number: this.issueId
      })

      gitalk.render('gitalk-container');
    }
  }
}
</script>

<style lang="stylus" scoped>
$color-green = #3eaf7c
$color-white = #fff
$color-desc = #767676
$margin = 20px

.gitalk-comment
  // 对gitalk进行主题美化
  .gitalk-container
    >>> .gt-container
      a
        color $color-green
      .gt-header-textarea
        font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
      .gt-ico
        &:not(.gt-ico-github)
          .gt-svg
            svg
              fill $color-green
      .gt-link
        border-color $color-green
      .gt-btn
        background-color $color-green
        border-color $color-green
        &.gt-btn-preview
          color $color-green
          background-color $color-white
      .gt-comments
        .gt-comments-null
          color $color-desc
      .gt-avatar
        border-radius 50%
        overflow hidden
        img
          height 100%
          object-fit cover
</style>