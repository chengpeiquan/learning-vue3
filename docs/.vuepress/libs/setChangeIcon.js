/** 
 * 设置更新icon，用于凸显重要的更新内容
 */
const setChangeIcon = () => {
  // 替换标记
  const CHANGE_MARK = '{change}';

  // 更新图标
  const CHANGE_TAG = '<svg t="1611076639079" class="icon-change" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2648" width="18" height="18"><path d="M965.76 576l-74.56-78.08a107.2 107.2 0 0 1-19.84-105.6l40.96-99.84a40.96 40.96 0 0 0-39.68-60.8l-107.84-0.64a107.2 107.2 0 0 1-88.64-60.48l-41.6-99.52a40.96 40.96 0 0 0-71.04-14.72l-78.08 74.24a107.2 107.2 0 0 1-105.6 19.84L280 109.76a40.96 40.96 0 0 0-60.8 39.68L216.96 256a107.2 107.2 0 0 1-60.48 88.64l-99.52 41.6a40.96 40.96 0 0 0-14.72 71.04l74.56 78.08a107.52 107.52 0 0 1 19.84 105.6L96 741.76a40.96 40.96 0 0 0 39.68 60.8l107.84 2.56A107.2 107.2 0 0 1 331.84 864l41.6 99.52a40.96 40.96 0 0 0 71.04 14.72l78.08-74.56a107.2 107.2 0 0 1 105.6-19.84l99.84 40.96a40.96 40.96 0 0 0 60.8-39.68l2.56-107.84a107.2 107.2 0 0 1 60.48-88.64l99.52-41.6a40.96 40.96 0 0 0 14.4-71.04z m-309.44 128c-18.56 3.2-43.2 0-79.36-34.56-25.28-24.96-102.72-118.08-154.88-181.12l37.76 187.52a73.92 73.92 0 0 1-1.92 39.68 51.84 51.84 0 0 1-65.6 29.12A64 64 0 0 1 352 686.72l-50.56-288A59.52 59.52 0 0 1 311.68 352a64 64 0 0 1 43.52-21.76A55.36 55.36 0 0 1 416 352c26.24 29.76 52.16 59.84 77.76 89.92 32 36.8 61.12 73.92 91.52 110.72l-39.04-195.52a64 64 0 0 1 3.2-37.12 48.64 48.64 0 0 1 39.04-32 52.8 52.8 0 0 1 40.96 9.28 71.36 71.36 0 0 1 24.64 47.04L704 630.72A55.68 55.68 0 0 1 656.32 704z" fill="#3eaf7c" p-id="2649"></path></svg>';

  // 执行更新
  setTimeout(() => {
    const SIDEBAR_LINKS = document.querySelectorAll('.sidebar-links .sidebar-link') || [];
    SIDEBAR_LINKS.forEach( item => {
      const TEXT = item.innerText;
      if ( TEXT.includes(CHANGE_MARK) ) {
        item.innerHTML = TEXT.replace(CHANGE_MARK, CHANGE_TAG);
      }
    });

    const PAGE_CONTENT = document.querySelector('.theme-default-content');
    const H3S = PAGE_CONTENT.querySelectorAll('h3');
    H3S.forEach( item => {
      const TEXT = item.innerText;
      const HTML = item.innerHTML;
      
      if ( TEXT.includes(CHANGE_MARK) ) {
        // 更新文本
        item.innerHTML = HTML.replace(CHANGE_MARK, CHANGE_TAG);
      }
    })
  }, 100);
}

module.exports = setChangeIcon;