/**
 * 基础信息模板
 * ? 获取系统信息、当前用户、当前路径、盘符列表
 */

module.exports = () => ({
  info: {
    _: `ACWD=$(pwd);
    AUNAME=$(uname -a);
    AUSER=$(whoami);
    echo -n "$ACWD\t/\t$AUNAME\t$AUSER";`.replace(/\n\s+/g, '')
  },
  probedb: { // 检测数据库函数支持
    _: `command_exists() { command -v "$@" > /dev/null 2>&1; };
    DBLIST="mysql psql sqlite3";
    for v in $DBLIST; do 
      if command_exists $v; then echo -n "$v\t1"; else echo -n "$v\t0"; fi;
    done;`.replace(/\n\s+/g, '')
  }
})