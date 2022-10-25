/**
 * cmdlinux::hex解码器
 */

'use strict';

module.exports = {
  /**
   * @returns {string} asenc 加密返回数据的函数
   */
  asoutput: () => {
    return `function asenc(){ param ([System.String] $s) return [System.BitConverter]::ToString([System.Text.Encoding]::Default.GetBytes($s)).Replace('-','');};`.replace(/\n\s+/g, '')
  },
  /**
   * 解码 Buffer
   * @param {Buffer} buff 要被解码的 Buffer
   * @returns {Buffer} 解码后的 Buffer
   */
  decode_buff: (buff) => {
    return Buffer.from(buff.toString().replace(/\n/g, ''), 'hex');
  }
}