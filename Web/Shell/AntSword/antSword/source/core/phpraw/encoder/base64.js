'use strict';

module.exports = (pwd, data, ext = null) => {
  data[pwd] = Buffer.from(data['_']).toString('base64');
  delete data['_'];
  return data;
}
