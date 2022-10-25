/**
 * 数据库管理模板::sqlserver odbc
 * i 数据分隔符号 => \t|\t
 */

module.exports = (arg1, arg2, arg3, arg4, arg5, arg6) => ({
  // 显示所有数据库
  show_databases: {
    _: `$connstr=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::conn}'));
    $needcolumnname=$FALSE;
    $columnsep=[char]9;
    $conn=New-Object System.Data.SqlClient.SqlConnection($connstr);
    $sql='SELECT [name] FROM master.dbo.sysdatabases ORDER BY 1';
    $command = New-Object System.Data.SqlClient.SqlCommand($sql, $conn);
    $conn.Open();
    $reader=$command.ExecuteReader();
    $sb=New-Object System.Text.StringBuilder;
    while($reader.Read()){
      $sb.AppendFormat('{0}{1}',$reader.GetString(0),$columnsep)|Out-Null;
    }
    $reader.Close();
    return $sb.ToString();`.replace(/\n\s+/g, ''),
  },
  // 显示数据库所有表
  show_tables: {
    _: `$connstr=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::conn}'));
    $dbname=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::db}'));
    $needcolumnname=$FALSE;
    $columnsep=[char]9;
    $conn=New-Object System.Data.SqlClient.SqlConnection($connstr);
    $sql="SELECT [name] FROM sysobjects WHERE xtype='U' ORDER BY 1";
    $command = New-Object System.Data.SqlClient.SqlCommand($sql, $conn);
    $conn.Open();
    $conn.ChangeDatabase($dbname);
    $reader=$command.ExecuteReader();
    $sb=New-Object System.Text.StringBuilder;
    while($reader.Read()){
      $sb.AppendFormat('{0}{1}',$reader.GetString(0),$columnsep)|Out-Null;
    }
    $reader.Close();
    return $sb.ToString();`.replace(/\n\s+/g, ''),
  },
  // 显示表字段
  show_columns: {
    _: `$connstr=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::conn}'));
    $dbname=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::db}'));
    $table=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::table}'));
    $columnsep=[char]9;
    $conn=New-Object System.Data.SqlClient.SqlConnection($connstr);
    $sql=[System.String]::Format("select b.name,c.name,c.length from sysobjects a,syscolumns b,systypes c where a.id=b.id and b.xtype=c.xtype and a.name='{0}'", $table);
    $command = New-Object System.Data.SqlClient.SqlCommand($sql, $conn);
    $conn.Open();
    $conn.ChangeDatabase($dbname);
    $reader=$command.ExecuteReader();
    $sb=New-Object System.Text.StringBuilder;
    while($reader.Read()){
      $sb.AppendFormat('{0} ({1}){2}',$reader.GetString(0), $reader.GetString(1),$columnsep)|Out-Null;
    }
    $reader.Close();
    return $sb.ToString();`.replace(/\n\s+/g, ''),
  },
  // 执行SQL语句
  query: {
    _: `$connstr=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::conn}'));
    $dbname=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::db}'));
    $needcolumnname=$TRUE;
    $columnsep=[System.String]::Format('{0}|{1}',[char]9,[char]9);
    $rowsep=[System.String]::Format('{0}{1}',[char]10,[char]13);
    $conn=New-Object System.Data.SqlClient.SqlConnection($connstr);
    $sql=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::sql}'));
    $command = New-Object System.Data.SqlClient.SqlCommand($sql, $conn);
    $conn.Open();
    $conn.ChangeDatabase($dbname);
    $reader=$command.ExecuteReader();
    $sb=New-Object System.Text.StringBuilder;
    if(($reader.HasRows -eq $FALSE) -and ($reader.VisibleFieldCount -eq 0)) {
      $sb.AppendFormat('Affect Rows{0}{1}{2}{3}{4}',$columnsep, $rowsep,[System.Convert]::ToBase64String([System.Text.Encoding]::Default.GetBytes($reader.RecordsAffected)),$columnsep, $rowsep)|Out-Null;
      return $sb.ToString();
    }
    if($needcolumnname) {
      for($i=0; $i -lt $reader.FieldCount; $i++){
        $sb.AppendFormat('{0}{1}',$reader.GetName($i),$columnsep)|Out-Null;
      }
      $sb.Append($rowsep)|Out-Null;
    }
    while($reader.Read()){
      for($i=0; $i -lt $reader.FieldCount; $i++){
        if($reader.IsDBNull($i)){
          $sb.AppendFormat('TlVMTA=={0}', $columnsep)|Out-Null;
        }else{
          $sb.AppendFormat('{0}{1}',[System.Convert]::ToBase64String([System.Text.Encoding]::Default.GetBytes($reader.GetValue($i).ToString())), $columnsep)|Out-Null;
        }
      }
      $sb.Append($rowsep)|Out-Null;
    }
    $reader.Close();
    return $sb.ToString();`.replace(/\n\s+/g, ''),
  }
})