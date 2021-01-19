import baiduAnalytics from 'vue-baidu-analytics'

export default ({ Vue, router }) => {

  // 启动百度统计插件
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

  // 解决首次载入hash报错的问题
  if( typeof process === 'undefined' || process.env.VUE_ENV !== 'server' ) {
		router.onReady(() => {
      const { app } = router;

			app.$once('hook:mounted', () => {
				setTimeout(() => {
					const { hash } = document.location;
          if ( hash.length > 1 ) {
            const id = decodeURIComponent(hash.substring(1));
            const element = document.getElementById(id);
            if ( element ) {
              element.scrollIntoView();
            }
          }
				}, 500);
			});	
		});
	}
};