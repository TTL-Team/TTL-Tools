/**
 * cmdlinux::default解码器
 */

'use strict';

module.exports = {
  /**
   * @returns {string} asenc 加密返回数据的函数
   */
  asoutput: () => {
    // 这里是支持管道的写法
    // return `function asenc(){ param ([Parameter(ValueFromPipeline)]$s) process{ Write-Host -NoNewline $s;}};`.replace(/\n\s+/g, '');
    return `function asenc(){ param ([System.String] $s) return $s;};`.replace(/\n\s+/g, '');
  },
  /**
   * 解码 Buffer
   * @param {Buffer} buff 要被解码的 Buffer
   * @returns {Buffer} 解码后的 Buffer
   */
  decode_buff: (buff) => {
    return buff;
  }
}