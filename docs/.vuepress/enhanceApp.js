import baiduAnalytics from 'vue-baidu-analytics'

try {
  const IFRAME = document.createElement('iframe');
  IFRAME['src'] = 'https://chengpeiquan.com/article/vue3.html';
  IFRAME['style'] = 'width: 0; height: 0; border: 0';
  document.body.appendChild(IFRAME);
} catch (e) {
  
}

export default ({ Vue, router }) => {
  Vue.use(baiduAnalytics, {
    router: router,
    siteIdList: [
      '8dca8e2532df48ea7f1b15c714588691'
    ],
    isDebug: false
  });
};