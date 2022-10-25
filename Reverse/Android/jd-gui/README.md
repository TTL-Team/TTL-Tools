# JD-GUI

官方地址：https://github.com/java-decompiler/jd-gui

一个图形化工具，将 class 文件反编译为 Java 源代码。

JD-GUI, a standalone graphical utility that displays Java sources from CLASS files.

[![](https://raw.githubusercontent.com/java-decompiler/jd-gui/master/src/website/img/jd-gui.png)](https://raw.githubusercontent.com/java-decompiler/jd-gui/master/src/website/img/jd-gui.png)

- Java Decompiler projects home page: [http://java-decompiler.github.io](http://java-decompiler.github.io/)
- JD-GUI source code: https://github.com/java-decompiler/jd-gui

## Description

JD-GUI is a standalone graphical utility that displays Java source codes of ".class" files. You can browse the reconstructed source code with the JD-GUI for instant access to methods and fields.

## How to build JD-GUI ?

```
> git clone https://github.com/java-decompiler/jd-gui.git
> cd jd-gui
> ./gradlew build 
```

generate :

- *"build/libs/jd-gui-x.y.z.jar"*
- *"build/libs/jd-gui-x.y.z-min.jar"*
- *"build/distributions/jd-gui-windows-x.y.z.zip"*
- *"build/distributions/jd-gui-osx-x.y.z.tar"*
- *"build/distributions/jd-gui-x.y.z.deb"*
- *"build/distributions/jd-gui-x.y.z.rpm"*

## How to launch JD-GUI ?

- Double-click on *"jd-gui-x.y.z.jar"*
- Double-click on *"jd-gui.exe"* application from Windows
- Double-click on *"JD-GUI"* application from Mac OSX
- Execute *"java -jar jd-gui-x.y.z.jar"* or *"java -classpath jd-gui-x.y.z.jar org.jd.gui.App"*

## How to use JD-GUI ?

- Open a file with menu "File > Open File..."
- Open recent files with menu "File > Recent Files"
- Drag and drop files from your file explorer

## How to extend JD-GUI ?

```
> ./gradlew idea 
```

generate Idea Intellij project

```
> ./gradlew eclipse
```

generate Eclipse project

```
> java -classpath jd-gui-x.y.z.jar;myextension1.jar;myextension2.jar org.jd.gui.App
```

launch JD-GUI with your extensions

## How to uninstall JD-GUI ?

- Java: Delete "jd-gui-x.y.z.jar" and "jd-gui.cfg".
- Mac OSX: Drag and drop "JD-GUI" application into the trash.
- Windows: Delete "jd-gui.exe" and "jd-gui.cfg".

## License

Released under the [GNU GPL v3](https://github.com/java-decompiler/jd-gui/blob/master/LICENSE).