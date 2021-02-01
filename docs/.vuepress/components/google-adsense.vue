<template>
  <div class="google-adsense">
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-7109929923549092"
      data-ad-slot="8310105795"
      data-ad-format="auto"
      data-full-width-responsive="true"
    >
    </ins>
  </div>
</template>

<script>
export default {
  name: 'google-adsense',
  mounted () {
    this.loadGoogleAd();
  },
  methods: {
    loadGoogleAd () {
      try {
        const script = document.createElement('script');
        script['async'] = true;
        script['src'] = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

        script.onload = () => {
          (adsbygoogle = window.adsbygoogle || []).push({});
        }
    
        document.head.appendChild(script);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>