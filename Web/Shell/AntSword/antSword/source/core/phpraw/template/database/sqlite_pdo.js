/**
 * 数据库管理模板:: sqlite3 pdo
 * i 数据分隔符号 => \\t|\\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
      if(!$dbh){
        echo("ERROR:// CONNECT ERROR");
      }else{
        echo("main".chr(9));
        $dbh=null;
      }`.replace(/\n\s+/g, ''),
  },
  // 显示数据库所有表
  show_tables: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
      if(!$dbh){
        echo("ERROR:// CONNECT ERROR");
      }else{
        $query="select tbl_name from sqlite_master where type='table' order by tbl_name;";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['tbl_name']).chr(9));
        }
        $dbh=null;
      }`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $dbn=base64_decode("#{base64::db}");
      $tab=base64_decode("#{base64::table}");
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
      if(!$dbh){
        echo("ERROR:// CONNECT ERROR");
      }else{
        $query="pragma table_info('{$tab}');";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['name'])." ({$res['type']})".chr(9));
        }
        $dbh = null;
      }`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $dbn=base64_decode("#{base64::db}");
      $sql=base64_decode("#{base64::sql}");
      $encode=base64_decode("#{base64::encode}");
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
      if(!$dbh){
        echo("ERROR:// CONNECT ERROR");
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