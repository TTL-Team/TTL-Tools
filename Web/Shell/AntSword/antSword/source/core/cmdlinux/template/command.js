/**
 * 虚拟终端命令执行
 */

module.exports = (arg1, arg2, arg3) => ({
  exec: {
    _: `command_exists() { command -v "$@" > /dev/null 2>&1; };
    AENVSTR="#{buffer::env}";
    if command_exists xxd; then 
      ENVSTR=$(echo -n $AENVSTR|xxd -r -p); 
    elif command_exists python3; then 
      ENVSTR=$(echo -n $AENVSTR|python3 -c "import sys, binascii; sys.stdout.buffer.write(binascii.unhexlify(input().strip()))"); 
    else 
      ENVSTR=$(echo -n $AENVSTR|sed 's/\\([0-9A-F]\\{2\\}\\)/\\\\\\\\\\\\x\\1/gI'|xargs printf); 
    fi;
    while [ $ENVSTR ]; do 
      ASLINE=\${ENVSTR%%"|||asline|||"*};
      ENVSTR=\${ENVSTR#*"|||asline|||"};
      export \${ASLINE%%"|||askey|||"*}=\${ASLINE#*"|||askey|||"};
    done; 
    #{bin} -c '#{cmd}';`.replace(/\n\s+/g, ''),
  },
  listcmd: {
    _: `CMDLIST="#{binarr}";
    OLD_IFS=$IFS;
    IFS=",";
    for v in $CMDLIST; do 
      if [ -f $v ]; then echo -e "$v\\t1"; else echo -e "$v\\t0"; fi;
    done;`.replace(/\n\s+/g, '')
  }
})