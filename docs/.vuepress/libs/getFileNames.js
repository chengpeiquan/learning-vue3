const fs = require('fs');

/** 
 * 读取目录下的文件列表
 * 优点：无需配置config的sidebar目录
 * 缺点：文件顺序不可控…
 */
const getFileNames = (parentFileName) => {
  const RESULT = [];
  const FILE_LIST = fs.readdirSync(`./docs${parentFileName}`);
  
  FILE_LIST.forEach( file => {
    const RESULT_ITEM = 'README.md'.includes(file) ? parentFileName : file;
    RESULT.push(RESULT_ITEM);
  });

  return RESULT;
};

module.exports = getFileNames;