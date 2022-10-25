/**
 * ASPXCsharp服务端脚本模板
 * 开写：2021/11/09
 * 更新：-
 * 作者：yzddMr6 <https://github.com/yzddmr6>
 *
 */
"use strict";

// import Base from '../base';
const Base = require("../base");

class ASPXCSHARP extends Base {
  constructor(opts) {
    super(opts);
    // 解析模板
    [
      "base",
      "command",
      "filemanager",
      'database/sqlserver',
      'database/mysql',
      'database/oracle'
    ].map((_) => {
      this.parseTemplate(`./aspxcsharp/template/${_}`);
    });
    // 解析编码器
    this.encoders.map((_) => {
      this.parseEncoder(`./aspxcsharp/encoder/${_}`);
    });
    this.decoders.map((_) => {
      this.parseDecoder(`./aspxcsharp/decoder/${_}`);
    });
  }

  /**
   * 获取编码器列表
   * @return {array} 编码器列表
   */
  get encoders() {
    return [];
  }

  get decoders() {
    return ["default"];
  }

  /**
   * HTTP请求数据组合函数
   * @param  {Object} data 通过模板解析后的代码对象
   * @return {Promise}     返回一个Promise操作对象
   */
  complete(data, force_default = false) {
    // 分隔符号
    let tag_s, tag_e;
    // if (this.__opts__['otherConf'].hasOwnProperty('use-custom-datatag') && this.__opts__['otherConf']['use-custom-datatag'] == 1 && this.__opts__['otherConf']['custom-datatag-tags']) {
    //   tag_s = this.__opts__['otherConf']['custom-datatag-tags'];
    // } else {
    //   tag_s = Math.random().toString(16).substr(2, parseInt(Math.random() * 8 + 5)); // "->|";
    // }
    // if (this.__opts__['otherConf'].hasOwnProperty('use-custom-datatag') && this.__opts__['otherConf']['use-custom-datatag'] == 1 && this.__opts__['otherConf']['custom-datatag-tage']) {
    //   tag_e = this.__opts__['otherConf']['custom-datatag-tage'];
    // } else {
    //   tag_e = Math.random().toString(16).substr(2, parseInt(Math.random() * 8 + 5)); // "|<-";
    // }
    tag_s = "->|";
    tag_e = "|<-";

    let aspxencode = this.__opts__["encode"];

    switch (this.__opts__["encode"]) {
      case "UTF8":
        aspxencode = "UTF-8";
        break;
      default:
        break;
    }

    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = ASPXCSHARP;
