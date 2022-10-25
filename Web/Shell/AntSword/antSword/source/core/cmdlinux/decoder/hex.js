/**
 * cmdlinux::hex解码器
 */

 'use strict';

 module.exports = {
   /**
    * @returns {string} asenc 加密返回数据的函数
    */
   asoutput: () => {
     return `asenc(){ 
      command_exists() { command -v "$@" > /dev/null 2>&1; };
      if command_exists xxd; then 
        xxd -ps "$@";
      elif command_exists python3; then 
        echo -n "$@"|python3 -c "import sys, binascii; sys.stdout.buffer.write(binascii.hexlify(input().strip().encode()))"; 
      fi
     };`.replace(/\n\s+/g, '')
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