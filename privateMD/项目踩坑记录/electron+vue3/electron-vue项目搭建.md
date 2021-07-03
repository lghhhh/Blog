# electron-vue项目搭建

vue项目使用vue-cli-plugin-electron-builder  变成一个客户端项目

1. 使用vue-cli4  创建项目

2. 直接在项目目录下是执行

   ```js
   vue add electron-builder
   ```

   如果执行缓慢或无法下载，请切换镜像。先把electron 先添加到项目中

   ```js
   npm i -s electron
   npm i -s electron-devtools-installer
   npm i -s electron-icon-builder
   npm i -s vue-cli-plugin-electron-builder
   ```

3. Electron-builder 添加了

