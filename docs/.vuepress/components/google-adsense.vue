<template>
  <div class="google-adsense">
    <ins
      class="adsbygoogle"
      style="display:inline-block;width:728px;height:90px"
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
    this.loadGoogleAd();
  },
  methods: {
    loadGoogleAd () {
      try {
        const script = document.createElement('script');
        script['async'] = true;
        script['src'] = this.lib;

        script.onload = () => {
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
    
        if ( document.head.querySelector(`script[src='${this.lib}']`) ) {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          document.head.appendChild(script);
        }
      } catch (e) {
        console.log(e);
      }
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