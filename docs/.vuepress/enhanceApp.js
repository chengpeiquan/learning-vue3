import baiduAnalytics from 'vue-baidu-analytics'

// 给主站入口文章上报阅读量
try {
  const IFRAME = document.createElement('iframe');
  IFRAME['src'] = 'https://chengpeiquan.com/article/vue3.html?from=vue3';
  IFRAME['style'] = 'width: 0; height: 0; border: 0';
  document.body.appendChild(IFRAME);
} catch (e) {}

// 执行百度统计代码
export default ({ Vue, router }) => {
  Vue.use(baiduAnalytics, {
    router: router,
    siteIdList: [
      // 主站
      '8dca8e2532df48ea7f1b15c714588691',
      // 本站
      '025e7d9acbc7359afa71bdae5aa03f33'
    ],
    isDebug: false
  });
};