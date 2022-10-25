/**
 * cmdlinux::base64解码器
 */

'use strict';

module.exports = {
  /**
   * @returns {string} asenc 加密返回数据的函数
   */
  asoutput: () => {
    // return `function asenc(){ param ([Parameter(ValueFromPipeline)]$s) process{ [System.Convert]::ToBase64String([System.Text.Encoding]::Default.GetBytes($s));}};`
    return `function asenc(){ param ([System.String] $s) return [System.Convert]::ToBase64String([System.Text.Encoding]::Default.GetBytes($s));};`
  },
  /**
   * 解码 Buffer
   * @param {Buffer} buff 要被解码的 Buffer
   * @returns {Buffer} 解码后的 Buffer
   */
  decode_buff: (buff) => {
    console.log(Buffer.from(buff.toString(), 'base64'));
    return Buffer.from(buff.toString(), 'base64');
  }
}