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
      hot: '<i class="sidebar__icon--default sidebar__icon--hot"></i>',
      new: '<i class="sidebar__icon--default sidebar__icon--new"></i>'
    };
  }

  /** 
   * 设置图标样式
   */
  setStyle () {
    const ID = 'sidebar__icon';
    const CSS = `
      .sidebar__icon--default {
        position: relative;
        display: inline-block;
        width: 18px;
        height: 18px;
        color: #fff;
        font-size: 13px;
        font-weight: bold;
        font-style: normal;
        vertical-align: middle;
        margin: 0 5px;
        transform: scale(0.7) rotate(30deg);
      }
      .sidebar__icon--default:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        transform: rotate(135deg);
      }
      .sidebar__icon--hot {
        background-color: #da5961;
      }
      .sidebar__icon--hot:before {
        content: "H";
        background-color: #da5961;
      }
      .sidebar__icon--new {
        background-color: #3eaf7c;
      }
      .sidebar__icon--new:before {
        content: "N";
        background-color: #3eaf7c;
      }
    `;

    const STYLE = document.createElement('style');
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
        let html = item.innerHTML;
  
        for (const key in this.markInfo) {
          if (Object.hasOwnProperty.call(this.markInfo, key)) {
            const mark = this.markInfo[key];
            const icon = this.iconInfo[key];
            const reg = new RegExp(mark, 'img');
  
            // 只处理包含标记的元素
            if ( html.includes(mark) ) {
  
              // 部分元素不显示图标
              const NODE_NAME = item.nodeName;
              switch (NODE_NAME) {
                case 'H2':
                case 'H3':
                  html = html.replace(reg, '');
                  break;
                default:
                  html = html.replace(reg, icon);
              }

              // 渲染
              item.innerHTML = html;
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
    if( typeof process === 'undefined' || process.env.VUE_ENV !== 'server' ) {
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
}
 
export default SetSidebarIcon;