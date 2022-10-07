import { inBrowser } from 'vitepress'

/**
 * 重定向的 Map 表
 */
export const redirectMap = {
  update: 'upgrade',
}

/**
 * 根据页面 URL 提取路由名称
 */
export function getRouteName() {
  if (!inBrowser) return ''
  const { pathname } = window.location
  const routeName = pathname.slice(1).replace('.html', '')
  return routeName
}

/**
 * 判断是否无效路由
 */
export function isInvalidRoute() {
  if (!inBrowser) return false
  const routeName = getRouteName()
  const keys = Object.keys(redirectMap)
  return keys.includes(routeName)
}

/**
 * 获取重定向目标
 */
export function redirectTarget() {
  if (!inBrowser) return '/'
  const routeName = getRouteName()
  return `/${redirectMap[routeName]}.html` || '/'
}

/**
 * 重定向
 */
export function redirect() {
  if (!inBrowser) return
  window.location.replace(redirectTarget())
}
