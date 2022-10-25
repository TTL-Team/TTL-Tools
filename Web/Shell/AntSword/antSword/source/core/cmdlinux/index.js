/**
 * CMDLinux 服务端脚本模板
 */
'use strict';

// import Base from '../base';
const Base = require('../base');

class CMDLINUX extends Base {
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
      'database/mysql',
      'database/sqlite3',
    ].map((_) => {
      this.parseTemplate(`./cmdlinux/template/${_}`);
    });
    // 解析编码器
    this
      .encoders
      .map((_) => {
        this.parseEncoder(`./cmdlinux/encoder/${_}`);
      });
    this
      .decoders
      .map((_) => {
        this.parseDecoder(`./cmdlinux/decoder/${_}`);
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
    data['_'] = `export PATH=$PATH:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin;TAGS="${tag_s.substr(0,tag_s.length/2)}""${tag_s.substr(tag_s.length/2)}";TAGE="${tag_e.substr(0,tag_e.length/2)}""${tag_e.substr(tag_e.length/2)}";${asencCode}asexec() { ${tmpCode} };echo -n "$TAGS";asexec|asenc;echo -n "$TAGE";`;

    // 使用编码器进行处理并返回
    return this.encodeComplete(tag_s, tag_e, data);
  }
}

module.exports = CMDLINUX;