ECCTooL是一款专业的椭圆曲线密码学工具，可以帮助用户更好的学习椭圆曲线加密在软件上的应用，界面简洁，操作简单，需要的朋友快来下载吧

[about]

EECTOOL is a utility implementing Elliptic Curve Cryptography(ECC).
EECTOOL is freeware for non-commercial use, may be freely distributed, unmodified. 
Copyright remains with MR.readyu. 

Author: readyu#gmail.com
Bug report is welcome.

main fuctions:
1.generate elliptic curve, compute np/order;
2.trap small ecdlp (< 64 bits), using kangaroo method;
3.generate keypairs.
4.ECDSA/ECNR sign/verify.

support curves:
1. support curve bits: 32-1024;
2. support elliptic curve over GF(p);
3. support elliptic curve over GF(2^m), with irreducible ploy:
   Trinomial: f(t)=t^m + t^a + 1, 
   Pentanomial: f(t) = t^m + t^a + t^b + t^c + 1
4. support NIST-recommended elliptic curves.

not support:
Curve over GF(2^m) with ONB (Optimal Normal Basis).

[to do]
write help file.

[history]
v1.04 2008-08-29
! fix a minor bug in kangaroo message display, when np is prime
* improve GUI

v1.03 2008-08-09
* improve ecc encrypt
! fix a minor bug in find poly

v1.02 2008-07-02
+ add NIST-curves cfg file
+ add load/save cfg
+ add sign.privkey recovery
! fix a minor bug in computing np

v1.01 2008-05-30
fisrt public version.
+ add trap ecdlp

v1.00 2008-03-08
# create project, not public.

[CHINESE INFO]
ECCTOOL v1.01
椭圆曲线类工具比较少见，因此写了这个ECCTOOL。
支持GF(P)和GF(2^m)椭圆曲线， GF(2^m)支持三项式和五项式。
包含了椭圆曲线加密最常见的两种签名算法：ECDSA和ECNR。
以及一些常用功能。

