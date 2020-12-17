import baiduAnalytics from 'vue-baidu-analytics'

export default ({ Vue, router }) => {
  Vue.use(baiduAnalytics, {
    router: router,
    siteIdList: [
      '8dca8e2532df48ea7f1b15c714588691'
    ],
    isDebug: false
  });
};

(function(){
  try {
    const iframe = document.createElement('iframe');
    iframe['width'] = 0;
    iframe['height'] = 0;
    iframe['frameBorder'] = 0;
    iframe['src'] = 'https://chengpeiquan.com/article/vue3.html';
    document.querySelector('body').appendChild(iframe);
  } catch (e) {
    console.log(e);
  }
})();