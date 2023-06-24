import { inBrowser } from 'vitepress'
import { loadRes } from '@bassist/utils'

interface Config {
  hot: string
  new: string
}

// 标记
const markConfig: Config = {
  hot: ' ~hot',
  new: ' ~new',
}

// 图标
const iconConfig: Config = {
  hot: '<i class="sidebar__icon--default sidebar__icon--hot"></i>',
  new: '<i class="sidebar__icon--default sidebar__icon--new"></i>',
}

/**
 * 设置图标样式
 */
export function setSymbolStyle() {
  if (!inBrowser) return
  try {
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
    `

    loadRes({
      type: 'style',
      id: 'symbol-plugin',
      resource: CSS,
    }).catch((e) => {
      console.log(e)
    })
  } catch (e) {
    console.log(e)
  }
}

/**
 * 执行标记替换
 */
export function replaceSymbol() {
  if (!inBrowser) return
  setTimeout(() => {
    try {
      // 获取 DOM
      const sidebarLinks =
        document.querySelectorAll('.aside-container nav .outline-link') || []
      const h2s = document.querySelectorAll('.content-container h2') || []
      const h3s = document.querySelectorAll('.content-container h3') || []
      const h4s = document.querySelectorAll('.content-container h4') || []
      const doms = [...sidebarLinks, ...h2s, ...h3s, ...h4s]

      // 替换标记成图标
      doms.forEach((item) => {
        let html = item.innerHTML

        for (const key in markConfig) {
          if (Object.hasOwnProperty.call(markConfig, key)) {
            const k = key as keyof Config
            const mark = markConfig[k]
            const icon = iconConfig[k]
            const reg = new RegExp(mark, 'img')

            // 只处理包含标记的元素
            if (html.includes(mark)) {
              // 部分元素不显示图标
              const { nodeName } = item
              switch (nodeName) {
                case 'H2':
                case 'H3':
                case 'H4':
                  html = html.replace(reg, '')
                  break
                default:
                  html = html.replace(reg, icon)
              }

              // 渲染
              item.innerHTML = html
            }
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }, 100)
}
