/**
 * 数据库管理模板::mssql
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $T=@mssql_connect($hst,$usr,$pwd);
      $q=@mssql_query("select [name] from master.dbo.sysdatabases order by 1",$T);
      while($rs=@mssql_fetch_row($q)){
        echo(trim($rs[0]).chr(9));
      }
      @mssql_free_result($q);
      @mssql_close($T);`.replace(/\n\s+/g, ''),
  },
  // 显示数据库所有表
  show_tables: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      $T=@mssql_connect($hst,$usr,$pwd);
      @mssql_select_db($dbn,$T);
      $q=@mssql_query("SELECT [name] FROM sysobjects WHERE xtype='U' ORDER BY 1",$T);
      while($rs=@mssql_fetch_row($q)){
        echo(trim($rs[0]).chr(9));
      }
      @mssql_free_result($q);
      @mssql_close($T);`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      $tab=base64_decode("#{base64::table}");
      $T=@mssql_connect($hst,$usr,$pwd);
      @mssql_select_db($dbn,$T);
      $q=@mssql_query("SELECT TOP 1 * FROM {$tab}",$T);
      while($rs=@mssql_fetch_field($q)){
        echo(trim($rs->name)." ({$rs->type}({$rs->max_length}))".chr(9));
      }
      @mssql_free_result($q);
      @mssql_close($T);`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `
      $hst=base64_decode("#{base64::host}");
      $usr=base64_decode("#{base64::user}");
      $pwd=base64_decode("#{base64::passwd}");
      $dbn=base64_decode("#{base64::db}");
      $sql=base64_decode("#{base64::sql}");
      $T=@mssql_connect($hst,$usr,$pwd);
      @mssql_select_db($dbn,$T);
      $q=@mssql_query($sql,$T);
      if(is_bool($q)){
        echo("Status\\t|\\tAffect Rows\\t|\\t\\r\\n".($q?"VHJ1ZQ==":"RmFsc2U=")."\\t|\\t".base64_encode(@mssql_rows_affected($T)." row(s)")."\\t|\\t\\r\\n");
      }else{
        $i=0;
        while($rs=@mssql_fetch_field($q)){
          echo($rs->name."\\t|\\t");
          $i++;
        }
        echo("\\r\\n");
        while($rs=@mssql_fetch_row($q)){
          for($c=0;$c<$i;$c++){
            echo(base64_encode(trim($rs[$c])));
            echo("\\t|\\t");
          }
          echo("\\r\\n");
        }
        @mssql_free_result($q);
      }
      @mssql_close($T);`.replace(/\n\s+/g, ''),
  }
})