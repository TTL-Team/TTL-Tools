/**
 * 文件管理模板
 */

module.exports = (arg1, arg2, arg3) => ({
  dir: {
    _: `Get-ChildItem -ErrorAction Stop -Force -Path '#{path}'|ForEach-Object{
      $Tab=[char]9;
      $ISDir='';
      if($_.Mode.StartsWith('d')){
        $ISDir='/';
      };
      $_.Name+$ISDIR+$Tab+$_.LastWriteTime+$Tab+$_.Length+$Tab+$_.Mode
    }|Out-String;`.replace(/\n\s+/g, ''),
  },

  delete: {
    _: `Remove-Item -Recurse -Force -LiteralPath '#{path}' -ErrorAction Stop;
    return '1';
    `.replace(/\n\s+/g, ''),
  },

  create_file: {
    // 不建议使用  New-Item 方式来写入文件, -Encoding 参数只在 v5 以上版本才有
    // _: `try { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('#{base64::content}'))|New-Item -ItemType File -Force -Path '#{path}' -ErrorAction Stop|Out-Null;'1';}catch{'0';}`.replace(/\n\s+/g, ''),
    _: `$C=[byte[]] -split ('#{buffer::content}' -replace '..', '0x$& ');
    [System.IO.File]::WriteAllBytes('#{path}',$C);
    return '1';
    `.replace(/\n\s+/g, ''),
  },

  read_file: {
    _: `Get-Content -ErrorAction Stop -LiteralPath '#{path}'|Out-String;`
  },

  copy: {
    _: `Copy-Item -Recurse -Force -LiteralPath '#{path}' -Destination '#{target}' -ErrorAction Stop; return '1';`.replace(/\n\s+/g, '')
  },

  download_file: {
    /* 这里下载二进制文件时会不正常, 扩展ASCII问题导致的
    暂时还没想到好的解决方案, 后期考虑改造 request download 机制来解决编码问题
    error eg: 
    origin:   ff d8 ff e0 00 10 4a 46
    download: ff 3f 3f 10 4a 46 49 46
    */
    _: `[System.Text.Encoding]::Default.GetString([System.IO.File]::ReadAllBytes('#{path}'));`.replace(/\n\s+/g, '')
  },

  upload_file: {
    _: `$C=[byte[]] -split ('#{buffer::content}' -replace '..', '0x$& ');
    $FS=[System.IO.File]::Open('#{path}',[System.IO.FileMode]::Append);
    $FS.Write($C,0,$C.Length);
    $FS.Close();
    return '1';
    `.replace(/\n\s+/g, ''),
  },

  rename: {
    _: `Rename-Item -Force -LiteralPath '#{path}' -NewName '#{name}' -ErrorAction Stop; return '1';`.replace(/\n\s+/g, '')
  },

  retime: {
    _: `$F=(Get-Item -Force '#{path}' -ErrorAction Stop);
    $F.CreationTime=('#{time}');
    $F.LastAccessTime=('#{time}');
    $F.LastWriteTime=('#{time}');
    return '1';
    `.replace(/\n\s+/g, '')
  },

  chmod: {
    // 这段代码没测试 $F=(Get-Item '#{path}');$F.Mode=('#{mode}');'1'}catch{'0'}

    // 以下是 windows 上给文件/目录设置 只读、隐藏、系统 属性
    // 在 windows 上也没多大意义, 一般可能会修改 IsReadOnly 和 IsHidden 这两个属性
    // https://docs.microsoft.com/en-us/dotnet/api/system.io.fileattributes?view=netcore-1.0
    // https://docs.microsoft.com/zh-cn/previous-versions/powershell/module/microsoft.powershell.management/set-itemproperty?view=powershell-3.0
    // darhs
    // 是否是目录
    // Directory        d----
    // Archive(File)    -a---
    // ReadOnly Archive -ar--
    // Hidden Archive   -a-h-
    // System File      -a-h-s
    _: `
    if([System.Environment]::OSVersion.VersionString.ToLower().Contains('windows') -eq $False){
      return 'ERROR:// not support';
    };
    $M='#{mode}'.ToLower();
    $P='#{path}';
    if($M.Length -ne 5){ return 'ERROR:// File Mode Pattern length not equals 5, eg: -arh-';};
    $F=(Get-Item -Force -LiteralPath $P -ErrorAction Stop);
    $FM=$F.Mode.ToLower();
    if($FM[2] -ne $M[2]){$F.Attributes=$F.Attributes -bxor [System.IO.FileAttributes]::ReadOnly};
    if($FM[3] -ne $M[3]){$F.Attributes=$F.Attributes -bxor [System.IO.FileAttributes]::Hidden};
    if($FM[4] -ne $M[4]){$F.Attributes=$F.Attributes -bxor [System.IO.FileAttributes]::System};
    return '1';
    `.replace(/\n\s+/g, '')
  },

  mkdir: {
    _: `New-Item -ItemType Directory -Path '#{path}' -ErrorAction Stop|Out-Null;return '1';`,
  },

  wget: {
    _: `Invoke-WebRequest -ErrorAction Stop -URI '#{url}' -OutFile '#{path}'; return '1';`.replace(/\n\s+/g, '')
  },

  filehash: {
    _: `$ret='';
    $Tab=[char]9;
    $Line=[char]10;
    $hashlist=@('MD5','SHA1');
    for($i=0;$i -lt $hashlist.Length; $i++){
      $FH=(Get-FileHash -LiteralPath '#{path}' -Algorithm $hashlist[$i] -ErrorAction Stop);
      $ret+=$FH.Algorithm+$Tab+$FH.Hash+$Line;
    };
    return $ret;
    `.replace(/\n\s+/g, ''),
  },
})