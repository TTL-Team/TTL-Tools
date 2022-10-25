/**
 * 数据库管理模板::mysql
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `APWD="#{passwd}";
    if [ -z $APWD ]; then MYSQLPWD=""; else MYSQLPWD="-p\${APWD}"; fi;
    mysql --raw -N -B -h#{host} -u#{user} $MYSQLPWD -e "show databases;"|while read DBRES; do echo -n "$DBRES\t"; done;`,
  },
  // 显示数据库所有表
  show_tables: {
    _: `APWD="#{passwd}";
    if [ -z $APWD ]; then MYSQLPWD=""; else MYSQLPWD="-p\${APWD}"; fi;
    mysql --raw -N -B -h#{host} -u#{user} $MYSQLPWD -D#{db} -e "show tables;"|while read DBRES; do echo -n "$DBRES\t"; done;`
  },
  // 显示表字段
  show_columns: {
    _: `APWD="#{passwd}";
    if [ -z $APWD ]; then MYSQLPWD=""; else MYSQLPWD="-p\${APWD}"; fi;
    mysql --raw -N -B -h#{host} -u#{user} $MYSQLPWD -D#{db} -e "select concat(column_name,0x2028,column_type,0x29) from information_schema.COLUMNS where TABLE_SCHEMA=0x#{buffer::db} and TABLE_NAME=0x#{buffer::table};"|while read DBRES; do echo -n "$DBRES\t"; done;`
  },
  // 执行SQL语句
  query: {
    _: `APWD="#{passwd}";
    if [ -z $APWD ]; then MYSQLPWD=""; else MYSQLPWD="-p\${APWD}"; fi;
    mysql --xml --raw -B -h#{host} -u#{user} $MYSQLPWD -D#{db} <<'EOF'
#{sql};
SELECT ROW_COUNT() as "Affected Rows";
EOF
    `
  }
})