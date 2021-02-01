<template>
  <div class="google-adsense">
    <ins
      class="adsbygoogle"
      style="display:inline-block; width:728px; height:90px"
      data-ad-client="ca-pub-7109929923549092"
      data-ad-slot="8310105795"
    >
    </ins>
  </div>
</template>

<script>
export default {
  name: 'google-adsense',
  data () {
    return {
      lib: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      try {
        const url = window.location.href;
        if ( url.includes('localhost') ) {
          return false;
        }

        const script = document.createElement('script');
        script['async'] = true;
        script['src'] = this.lib;

        script.onload = () => {
          this.push();
        }
    
        if ( document.head.querySelector(`script[src='${this.lib}']`) ) {
          this.push();
        }
        else {
          document.head.appendChild(script);
        }
      } catch (e) {
        console.log(e);
      }
    },
    push () {
      setTimeout(() => {
        (adsbygoogle = window.adsbygoogle || []).push({});
      }, 1000);
    }
  }
}
</script>

<style lang="stylus" scoped>
.google-adsense
  width 100%
  max-height 90px !important
  overflow hidden !important
</style>