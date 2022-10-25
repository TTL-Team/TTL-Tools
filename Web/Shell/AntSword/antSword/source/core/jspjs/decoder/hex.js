/**
 * jspjs::reverse解码器
 */

'use strict';

module.exports = {
  /**
 * @returns {string} asenc 将返回数据反转
 */
  asoutput: () => {
    return `function asenc(str){
      var h = "0123456789ABCDEF";
      var bytes = str.getBytes(cs);
      var sb = new StringBuilder(bytes.length * 2);
      for (var i = 0; i < bytes.length; i++) {
        sb.append(h.charAt((bytes[i] & 0xf0) >> 4));
        sb.append(h.charAt((bytes[i] & 0x0f) >> 0));
      }
      return sb.toString();
    }
    `.replace(/\n\s+/g, '');
  },
  /**
 * 解码 Buffer
 * @param {Buffer} buff 要被解码的 Buffer
 * @returns {Buffer} 解码后的 Buffer
 */
  decode_buff: (buff) => {
    return Buffer.from(buff.toString(), 'hex');
  }
}
