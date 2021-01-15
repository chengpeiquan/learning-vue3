import baiduAnalytics from 'vue-baidu-analytics'

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