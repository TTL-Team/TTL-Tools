/**
 * 基础信息模板
 * ? 获取系统信息、当前用户、当前路径、盘符列表
 */

module.exports = () => ({
  info: {
    // [System.IO.DriveInfo]::GetDrives()|Where-Object{$_.DriveType -eq 3}|ForEach-Object{$ADRIVERS+=$_.Name.substring(0,2)};
    // Write-Output $ACWD$TAB$ADRIVERS$TAB$AUNAME$TAB$AUSER;
    _: `$ret='';
    $Tab=[char]9;
    $ACWD=$pwd.Path;
    $AUSER=[System.Security.Principal.WindowsIdentity]::GetCurrent().Name;
    $AUNAME=[System.Environment]::OSVersion.VersionString;
    $ADRIVERS='';
    $c=[System.IO.DriveInfo]::GetDrives();
    for($i=0;$i -lt $c.Length;$i++){
      if($c[$i].DriveType -eq 3){
        $ADRIVERS+=$c[$i].Name.Substring(0,2);
      }
    };
    $ret=$ACWD+$TAB+$ADRIVERS+$TAB+$AUNAME+$TAB+$AUSER;
    return $ret;
    `.replace(/\n\s+/g, '')
  },
  probedb: { // 检测数据库函数支持
    _: `$ret='';
    $TAB=[char]9;
    $Line=[char]10;
    $OP='HKLM:/HKEY_LOCAL_MACHINE/SOFTWARE/ODBC/ODBCINST.INI/ODBC Drivers';
    $ODBC=(Get-Item -Force -LiteralPath $OP);$ODBC.Property|ForEach-Object{
      $ret+='[ODBC Drivers]'+$_+$TAB;
      if($ODBC.GetValue($_).Equals('Installed')){
        $ret+='1';
      }else{
        $ret+='0';
      };
      $ret+=$Line;
    };
    return $ret;
    `.replace(/\n\s+/g, '')
  }
})