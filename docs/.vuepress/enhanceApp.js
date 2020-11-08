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

try {
  fetch('https://chengpeiquan.com/article/vue3.html')
} catch (e) {
  log(e);
}