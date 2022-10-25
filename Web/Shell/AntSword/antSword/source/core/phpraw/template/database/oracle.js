/**
 * 数据库管理模板::oracle
 * i 数据分隔符号 => \\t|\\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `
    $sid=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $H=@Ora_Logon("\${usr}/\${pwd}@\${sid}","");
    if(!$H){
      echo("ERROR:// Login Failed!");
    }else{
      $T=@ora_open($H);
      @ora_commitoff($H);
      $q=@ora_parse($T,"SELECT USERNAME FROM ALL_USERS ORDER BY 1");
      if(ora_exec($T)){
        while(ora_fetch($T)){
          echo(trim(ora_getcolumn($T,0)).chr(9));
        }
      }
      @ora_close($T);
    };`.replace(/\n\s+/g, ''),
    [arg1]: '#{host}',
    [arg2]: '#{user}',
    [arg3]: '#{passwd}'
  },
  // 显示数据库所有表
  show_tables: {
    _: `
    $sid=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $dbn=base64_decode("#{base64::db}");
    $H=@ora_plogon("{$usr}@{$sid}","{$pwd}");
    if(!$H){
      echo("ERROR:// Login Failed!");
    }else{
      $T=@ora_open($H);
      @ora_commitoff($H);
      $q=@ora_parse($T,"SELECT TABLE_NAME FROM (SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER='{$dbn}' ORDER BY 1)");
      if(ora_exec($T)){
        while(ora_fetch($T)){
          echo(trim(ora_getcolumn($T,0)).chr(9));
        }
      }
      @ora_close($T);
    };`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `
    $sid=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $tab=base64_decode("#{base64::table}");
    $H=@ora_plogon("{$usr}@{$sid}","{$pwd}");
    if(!$H){
      echo("ERROR:// Login Failed!");
    }else{
      $T=@ora_open($H);
      @ora_commitoff($H);
      $q=@ora_parse($T,"SELECT COLUMN_NAME,DATA_TYPE FROM ALL_TAB_COLUMNS WHERE TABLE_NAME='{$tab}' ORDER BY COLUMN_ID");
      if(ora_exec($T)){
        while(ora_fetch($T)){
          echo(trim(ora_getcolumn($T,0))." (".ora_getcolumn($T,1).")".chr(9));
        }
      }
      @ora_close($T);
    };`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `
    $sid=base64_decode("#{base64::host}");
    $usr=base64_decode("#{base64::user}");
    $pwd=base64_decode("#{base64::passwd}");
    $dbn=base64_decode("#{base64::db}");
    $sql=base64_decode("#{base64::sql}");
    $H=@ora_plogon("{$usr}@{$sid}","{$pwd}");
    if(!$H){
      echo("ERROR:// Login Failed!");
    }else{
      $T=@ora_open($H);
      @ora_commitoff($H);
      $q=@ora_parse($T,"{$sql}");
      $R=ora_exec($T);
      if($R){
        $n=ora_numcols($T);
        for($i=0;$i<$n;$i++){
          echo(Ora_ColumnName($T,$i)."\\t|\\t");
        }
        echo("\\r\\n");
        while(ora_fetch($T)){
          for($i=0;$i<$n;$i++){
            echo(base64_encode(trim(ora_getcolumn($T,$i))));
            echo("\\t|\\t");
          }echo("\\r\\n");
        }
      }else{
        echo("Status\\t|\\t\\r\\n".($q?"VHJ1ZQ==":"RmFsc2U=")."\\t|\\t\\r\\n");
      }
      @ora_close($T);
    };`.replace(/\n\s+/g, ''),
  }
})