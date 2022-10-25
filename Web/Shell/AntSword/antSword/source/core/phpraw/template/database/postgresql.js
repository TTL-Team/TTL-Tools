/**
 * 数据库管理模板::postgresql
 * i 数据分隔符号 => \\t|\\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      list($host,$port,$dbn) = explode(":", $hst);
      $port == "" ? $port = "5432" : $port;
      $dbn == "" ? $dbn = "postgres" : $dbn;
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'user'=>$usr,
        'password'=>$pwd,
        'dbname'=>$dbn
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
     }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T,"SELECT datname FROM pg_database where datistemplate='f';");
        if(!$q){
          echo("ERROR://".@pg_last_error());
        }else{
          while($rs=@pg_fetch_row($q)){
            echo(trim($rs[0]).chr(9));
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
  },
  // 显示数据库所有表
  show_tables: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      list($host, $port) = explode(":", $hst);
      $port == "" ? $port = "5432" : $port;
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'user'=>$usr,
        'password'=>$pwd,
        'dbname'=>$dbn,
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
     }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T,"SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');");
        if(!q){
          echo("ERROR://".@pg_last_error());
        }else{
          while($rs=@pg_fetch_row($q)){
            echo(trim($rs[0]).chr(9));
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      $tab=base64_decode("#{base64::table}");
      list($host, $port) = explode(":", $hst);
      $port == "" ? $port = "5432" : $port;
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'user'=>$usr,
        'password'=>$pwd,
        'dbname'=>$dbn,
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
     }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T,"SELECT column_name,udt_name,character_maximum_length FROM information_schema. COLUMNS WHERE TABLE_NAME = '{$tab}';");
        if(!$q){
          echo("ERROR://".@pg_last_error());
        }else{
          while($rs=@pg_fetch_row($q)){
            $len=$rs[2]?$rs[2]:"0";
            echo(trim($rs[0])." ({$rs[1]}({$len}))".chr(9));
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      $sql=base64_decode("#{base64::sql}");
      $encode=base64_decode("#{base64::encode}");
      list($host, $port) = explode(":", $hst);
      $port == "" ? $port = "5432" : $port;
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'user'=>$usr,
        'password'=>$pwd,
        'dbname'=>$dbn,
      );
      $cs='';
      foreach($arr as $k=>$v) {
        if(empty($v)){
            continue;
        }
        $cs .= "$k=$v ";
      }
      $T=@pg_connect($cs);
      if(!$T){
        echo("ERROR://".@pg_last_error());
      }else{
        $q=@pg_query($T, $sql);
        if(!$q){
          echo("ERROR://".@pg_last_error());
        }else{
          $n=@pg_num_fields($q);
          if($n===NULL){
            echo("Status\\t|\\t\\r\\n");
            echo(base64_encode("ERROR://".@pg_last_error())."\\t|\\t\\r\\n");
          }elseif($n===0){
            echo("Affect Rows\\t|\\t\\r\\n".base64_encode(@pg_affected_rows($q))."\\t|\\t\\r\\n");
          }else{
            for($i=0;$i<$n;$i++){
              echo(@pg_field_name($q,$i)."\\t|\\t");
            }
            echo "\\r\\n";
            while($row=@pg_fetch_row($q)){
              for($i=0;$i<$n;$i++){
                echo(base64_encode($row[$i]!==NULL?$row[$i]:"NULL")."\\t|\\t");
              }
              echo "\\r\\n";
            }
          }
          @pg_free_result($q);
        }
        @pg_close($T);
      }`.replace(/\n\s+/g, ''),
  }
})