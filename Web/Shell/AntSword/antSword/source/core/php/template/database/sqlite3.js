/**
 * 数据库管理模板:: sqlite3
 * i 数据分隔符号 => \\t|\\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $dbh=new SQLite3($hst);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR".SQLite3::lastErrorMsg());
      }else{
        echo("main".chr(9));
        $dbh->close();
      }`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}'
  },
  // 显示数据库所有表
  show_tables: {
    _: `$m=get_magic_quotes_gpc();
      $hst=$m?stripslashes($_POST["${arg1}"]):$_POST["${arg1}"];
      $dbh=new SQLite3($hst);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR".SQLite3::lastErrorMsg());
      }else{
        $query="select tbl_name from sqlite_master where type='table' order by tbl_name;";
        $stmt=$dbh->prepare($query);
        $result=$stmt->execute();
        while($res=$result->fetchArray(SQLITE3_ASSOC)){
          echo(trim($res['tbl_name']).chr(9));
        }
        $dbh->close();
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
      $dbh=new SQLite3($hst);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR".SQLite3::lastErrorMsg());
      }else{
        $query="pragma table_info('{$tab}');";
        $stmt=$dbh->prepare($query);
        $result=$stmt->execute();
        while($res=$result->fetchArray(SQLITE3_ASSOC)){
          echo(trim($res['name'])." ({$res['type']})".chr(9));
        }
        $dbh->close();
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
      $dbh=new SQLite3($hst);
      if(!$dbh){
        echo("ERROR://CONNECT ERROR".SQLite3::lastErrorMsg());
      }else{
        $stmt=$dbh->prepare($sql);
        if(!$stmt){
          echo("Status\\t|\\t\\r\\n");
          echo(base64_encode("ERROR://".$dbh->lastErrorMsg())."\\t|\\t\\r\\n");
        } else {
          $result=$stmt->execute();
          if(!$result){
            echo("Status\\t|\\t\\r\\n");
            echo(base64_encode("ERROR://".$dbh->lastErrorMsg())."\\t|\\t\\r\\n");
          }else{
            $bool=True;
            while($res=$result->fetchArray(SQLITE3_ASSOC)){
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
              if(!$result->numColumns()){
                echo("Affect Rows\\t|\\t\\r\\n".base64_encode($dbh->changes())."\\t|\\t\\r\\n");
              }else{
                echo("Status\\t|\\t\\r\\n");
                echo(base64_encode("ERROR://Table is empty.")."\\t|\\t\\r\\n");
              }
            }
          }
        }
        $dbh->close();
      }`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}',
    [arg4]: '#{db}',
    [arg5]: '#{base64::sql}',
    [arg6]: '#{encode}'
  }
})