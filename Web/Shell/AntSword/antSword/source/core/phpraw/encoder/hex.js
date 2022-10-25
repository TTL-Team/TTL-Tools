'use strict'

module.exports = (pwd, data, ext = null) => {

  // 编码并去除多余数据
  data[pwd] = Buffer.from(data['_']).toString("hex");
  delete data['_'];
  // 返回数据
  return data;
}
