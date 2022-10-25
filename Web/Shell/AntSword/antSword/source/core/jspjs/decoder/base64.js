/**
 * jspjs::base64解码器
 */

 'use strict';

 module.exports = {
   /**
    * @returns {string} asenc 将返回数据base64编码
    */
   asoutput: () => {
     return `function asenc(str){
      importPackage(Packages.sun.misc);
      importPackage(Packages.java.util);
      var ret = "";
      try {
        ret = new Base64().getEncoder().encodeToString(str.getBytes());
      } catch (e) {
        ret = new BASE64Encoder().encode(str.getBytes());
      }
      ret = ret.replaceAll("\\r|\\n", "");
      return ret;
    }`.replace(/\n\s+/g, '');
   },
   /**
    * 解码 Buffer
    * @param {Buffer} buff 要被解码的 Buffer
    * @returns {Buffer} 解码后的 Buffer
    */
   decode_buff: (buff) => {
     return Buffer.from(buff.toString(), 'base64');
   }
 }