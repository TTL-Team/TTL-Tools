/**
 * jspjs::rot13解码器
 */

'use strict';
const rot13encode = (s) => {
  //use a Regular Expression to Replace only the characters that are a-z or A-Z
  return s.replace(/[a-zA-Z]/g, function (c) {
    // Get the character code of the current character and add 13 to it If it is
    // larger than z's character code then subtract 26 to support wrap around.
    return String.fromCharCode((c <= "Z" ?
        90 :
        122) >= (c = c.charCodeAt(0) + 13) ?
      c :
      c - 26);
  });
};

module.exports = {
  asoutput: (tag_s, tag_e) => {
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
      return ret.replace(/[a-zA-Z]/g,function(c){
        return String.fromCharCode((c <= "Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);
      });
    }
    `.replace(/\n\s+/g, '');
  },
  decode_buff: (buff) => {
    return Buffer.from(rot13encode(buff.toString()), 'base64');
  }
}
