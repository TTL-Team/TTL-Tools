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
      list($hst, $port) = explode(":", $hst);
      $port == "" ? $port = "3306" : $port;
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      $q=@mysqli_query($T,"SHOW DATABASES");
      while($rs=@mysqli_fetch_row($q)){
        echo(trim($rs[0]).chr(9));
      }
      @mysqli_close($T);`.replace(/\n\s+/g, ''),
  },
  // 显示数据库所有表
  show_tables: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      list($hst, $port) = explode(":", $hst);
      $port == "" ? $port = "3306" : $port;
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      $q=@mysqli_query($T, "SHOW TABLES FROM \`{$dbn}\`");
      while($rs=@mysqli_fetch_row($q)){
        echo(trim($rs[0]).chr(9));
      }
      @mysqli_close($T);`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      $tab=base64_decode("#{base64::table}");
      list($hst, $port) = explode(":", $hst);
      $port == "" ? $port = "3306" : $port;
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      @mysqli_select_db($T, $dbn);
      $q=@mysqli_query($T, "SHOW COLUMNS FROM \`{$tab}\`");
      while($rs=@mysqli_fetch_row($q)){
        echo(trim($rs[0])." (".$rs[1].")".chr(9));
      }
      @mysqli_close($T);`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      $sql=base64_decode("#{base64::sql}");
      list($hst, $port) = explode(":", $hst);
      $port == "" ? $port = "3306" : $port;
      $T=@mysqli_connect($hst,$usr,$pwd,"",$port);
      @mysqli_query($T,"SET NAMES ".base64_decode("#{base64::encode}"));
      @mysqli_select_db($T,$dbn);
      $q=@mysqli_query($T,$sql);
      if(is_bool($q)){
        echo("Status\\t|\\t\\r\\n".($q?"VHJ1ZQ==":"RmFsc2U=")."\\t|\\t\\r\\n");
      }else{
        $i=0;
        while($col=@mysqli_fetch_field($q)){echo($col->name."\t|\t");
        $i++;
      }
      echo("\\r\\n");
      while($rs=@mysqli_fetch_row($q)){
        for($c=0;$c<$i;$c++){
          echo(base64_encode(trim($rs[$c])));
          echo("\\t|\\t");
        }
        echo("\\r\\n");
      }
    }
    @mysqli_close($T);`.replace(/\n\s+/g, ''),
  }
})