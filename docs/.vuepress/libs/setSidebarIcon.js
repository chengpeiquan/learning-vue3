/** 
 * 设置侧边栏的更新icon，用于凸显重要的更新内容
 */
class SetSidebarIcon {

  /** 
   * 一些基本配置
   */
  constructor (router) {
    // 路由
    this.router = router;

    // 标记
    this.markInfo = {
      hot: '{hot}',
      new: '{new}'
    };

    // 图标
    this.iconInfo = {
      hot: '<svg t="1611121936538" class="sidebar__icon--default sidebar__icon--hot" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="876" width="18" height="18"><path d="M702.08 558.72a469.12 469.12 0 0 0-50.56-210.56 776.64 776.64 0 0 0-105.6-186.56A778.24 778.24 0 0 0 467.2 86.4c-10.88-9.6-37.76-27.2-58.88-44.16S384 28.16 384 50.88c22.72 248-217.92 433.28-261.44 540.16-83.2 208.32 27.2 366.4 224 397.12 26.24 4.16 29.44-4.8 9.92-20.16a192 192 0 0 1-75.52-224c29.44-86.08 103.04-111.04 131.52-250.56 4.48-22.4 22.08-27.52 40.64-11.2a768 768 0 0 1 173.44 234.88c25.92 74.88 38.4 151.36-101.44 248.96-20.48 14.4 8.64 27.52 35.2 24.96C746.88 972.8 930.56 800 928 653.44c0-53.76-51.2-168-112.32-256-13.76-19.52-28.8-16.32-32 6.4-6.08 64-8.32 110.72-56 164.16-15.04 18.88-26.88 13.44-25.6-9.28z" fill="#da5961" p-id="877"></path></svg>',
      new: '<svg t="1611076639079" class="sidebar__icon--default sidebar__icon--new" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2648" width="18" height="18"><path d="M965.76 576l-74.56-78.08a107.2 107.2 0 0 1-19.84-105.6l40.96-99.84a40.96 40.96 0 0 0-39.68-60.8l-107.84-0.64a107.2 107.2 0 0 1-88.64-60.48l-41.6-99.52a40.96 40.96 0 0 0-71.04-14.72l-78.08 74.24a107.2 107.2 0 0 1-105.6 19.84L280 109.76a40.96 40.96 0 0 0-60.8 39.68L216.96 256a107.2 107.2 0 0 1-60.48 88.64l-99.52 41.6a40.96 40.96 0 0 0-14.72 71.04l74.56 78.08a107.52 107.52 0 0 1 19.84 105.6L96 741.76a40.96 40.96 0 0 0 39.68 60.8l107.84 2.56A107.2 107.2 0 0 1 331.84 864l41.6 99.52a40.96 40.96 0 0 0 71.04 14.72l78.08-74.56a107.2 107.2 0 0 1 105.6-19.84l99.84 40.96a40.96 40.96 0 0 0 60.8-39.68l2.56-107.84a107.2 107.2 0 0 1 60.48-88.64l99.52-41.6a40.96 40.96 0 0 0 14.4-71.04z m-309.44 128c-18.56 3.2-43.2 0-79.36-34.56-25.28-24.96-102.72-118.08-154.88-181.12l37.76 187.52a73.92 73.92 0 0 1-1.92 39.68 51.84 51.84 0 0 1-65.6 29.12A64 64 0 0 1 352 686.72l-50.56-288A59.52 59.52 0 0 1 311.68 352a64 64 0 0 1 43.52-21.76A55.36 55.36 0 0 1 416 352c26.24 29.76 52.16 59.84 77.76 89.92 32 36.8 61.12 73.92 91.52 110.72l-39.04-195.52a64 64 0 0 1 3.2-37.12 48.64 48.64 0 0 1 39.04-32 52.8 52.8 0 0 1 40.96 9.28 71.36 71.36 0 0 1 24.64 47.04L704 630.72A55.68 55.68 0 0 1 656.32 704z" fill="#3eaf7c" p-id="2649"></path></svg>'
    };
  }

  /** 
   * 设置图标样式
   */
  setStyle () {
    const ID = 'sidebar__icon';
    const CSS = `.sidebar__icon--default { width: 16px; height: 18px; vertical-align: middle; margin-left: 5px; }`;

    const STYLE = document.createElement('style');
    STYLE['type '] = 'text/css';
    STYLE['id'] = ID;

    try{
      STYLE.appendChild(document.createTextNode(CSS));
    } catch(e) {
      STYLE.styleSheet.cssText = CSS;
    }
    
    const IS_SET = document.querySelector(`#${ID}`);
    if ( !IS_SET ) {
      document.head.appendChild(STYLE);
    }
  }

  /** 
   * 执行标记替换
   */
  replace () {
    setTimeout(() => {
      // 获取DOM
      const SIDEBAR_LINKS = document.querySelectorAll('.sidebar-links .sidebar-link') || [];
      const H2S = document.querySelectorAll('.theme-default-content h2') || [];
      const H3S = document.querySelectorAll('.theme-default-content h3') || [];
      const DOMS = [...SIDEBAR_LINKS, ...H2S, ...H3S];
  
      // 替换标记成图标
      DOMS.forEach( item => {
        const TEXT = item.innerText;
        const NODE_NAME = item.nodeName;
  
        for (const key in this.markInfo) {
          if (Object.hasOwnProperty.call(this.markInfo, key)) {
            const mark = this.markInfo[key];
            const icon = this.iconInfo[key];
  
            // 只处理包含标记的元素
            if ( TEXT.includes(mark) ) {
  
              // 部分元素不显示图标
              switch (NODE_NAME) {
                case 'H2':
                case 'H3':
                  item.innerHTML = TEXT.replace(mark, '');
                  break;
                default:
                  item.innerHTML = TEXT.replace(mark, icon);
              }
  
            }
          }
        }
      });
  
    }, 100);
  }

  /** 
   * 初始化
   */
  init () {
    this.setStyle();

    this.router.afterEach( () => {
      try {
        this.replace();
      } catch (e) {
        // console.log(e);
      }
    });
  }
}
 
export default SetSidebarIcon;