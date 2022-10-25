/**
 * 虚拟终端命令执行
 */

module.exports = (arg1, arg2, arg3) => ({
  exec: {
    _: `$c=New-Object System.Diagnostics.ProcessStartInfo -ArgumentList '#{bin}';
    $e=New-Object System.Diagnostics.Process;
    $c.UseShellExecute=$false;
    $c.RedirectStandardInput=$true;
    $c.RedirectStandardOutput=$true;
    $c.RedirectStandardError=$true;
    $c.CreateNoWindow=$true;
    $e.StartInfo=$c;
    $c.Arguments = '/c ' + [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::cmd}'));
    $env=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::env}'));
    if($env.Length -ne 0){
      $envarr = [System.Text.RegularExpressions.Regex]::Split($env, '\\|\\|\\|asline\\|\\|\\|');
      for($i=0;$i -lt $envarr.Length;$i++){
        $ss = [System.Text.RegularExpressions.Regex]::Split($envarr[$i], '\\|\\|\\|askey\\|\\|\\|');
        if($ss.Length -ne 2){continue;};
        $c.EnvironmentVariables.Add($ss[0],$ss[1]);
      };
    };
    $aa=$e.Start();
    $OT=$e.StandardOutput;
    $ER=$e.StandardError;
    $e.Close();
    return $OT.ReadToEnd()+$ER.ReadToEnd();`.replace(/\n\s+/g, ''),
  },
  listcmd: {
    _: `$ret='';
    $Tab=[char]9;
    $Line=[char]10;
    $ss=[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::binarr}')).Split(',');
    for ($i = 0; $i -lt $ss.Length; $i++){
      $flag='0';
      if([System.IO.File]::Exists($ss[$i])){
        $flag='1';
      }
      $ret += ($ss[$i]+$Tab+$flag+$Line);
    };
    return $ret;`.replace(/\n\s+/g, '')
  }
})