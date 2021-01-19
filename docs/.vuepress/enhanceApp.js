import baiduAnalytics from 'vue-baidu-analytics'
import fixScrollIntoViewBug from './libs/fixScrollIntoViewBug'
import setChangeIcon from './libs/setChangeIcon'

export default ({ Vue, router }) => {

  /** 
   * 启动百度统计插件
   */
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

  /** 
   * 解决首次载入hash描点报错的问题
   */
  fixScrollIntoViewBug(router);

  /** 
   * 设置更新icon（侧边栏和标题）
   */
  router.afterEach( () => {
    setChangeIcon();
  })
  
};