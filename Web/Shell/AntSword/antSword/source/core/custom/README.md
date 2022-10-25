# AntSword Custom API

## Base
Code | Function | Param
:-:|:--|:--
A | `info` | `{}`
Z | `probedb`| `{}`

## FileManager

Code | Function | Param
:-:|:--|:--
B | `dir` | `{"z1": "path"}`
C | `read_file`| `{"z1": "path"}`
D | `creat_file` | `{"z1": "path", "z2": "content"}`
E | `delete` | `{"z1": "path"}`
F | `download_file` | `{"z1": "path"}`
H | `copy` | `{"z1": "path", "z2": "target"}`
I | `rename`  | `{"z1": "path", "z2": "name"}`
K | `retime` | `{"z1": "path", "z2": "time"}` 
J | `mkdir` | `{"z1": "path"}`
L | `wget`| `{"z1": "url", "z2": "path"}`
U | `upload_file` | `{"z1": "path", "z2": "buffer::content"}`
G | `filehash` | `{"z1": "path"}`

## Command

Code | Function | Param
:-:|:--|:--
M | `exec` | `{"z1": "bin", "z2": "cmd", "z3": "env"}`
Y | `listcmd` | `{"z1": "binarr"}`

# Database

Code | Function | Param
:-:|:--|:--
N | `show_databases` | `{"z0": "encode", "z1": "conn"}`
O | `show_tables` | `{"z0": "encode", "z1": "conn", "z2": "db"}`
P | `show_columns` | `{"z0": "encode", "z1": "conn", "z2": "db", "z3": "table"}`
Q | `query` | `{"z0": "encode", "z1": "conn", "z2": "sql"}`