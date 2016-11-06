# Mobx + antd for Admin

# 使用

  开发环境
  
    yarn install // or npm install
    node dev-server
    
  prod:
  
    // maybe run `npm run clean_dist` first 
    
    npm run build_prod // or build_stg for test server
    
    // then app prod file in dist folder. 
    

# 说明
我们使用 react + react-router + ant.design + mobx + axios 来开发后台项目。经过两个项目的迭代，积累一些通用的东西.

项目依然在迭代中，有群友也选用这套方案，想参考一下。所以先整理一些。

0. `react-hot-loader` 对于组件的更改，并不生效，看issue, 也没啥好的解决方法。 改style文件，可以即时生效
1. 左侧导航栏，在`src/layout/NavConfig`中配置，可以收起和打开，并把配置保持在localStorage中
2. 使用`axios`进行ajax请求，并包装了一个有一定通用性的工具类`src/utils/ajax`. config 文件下的js文件，会根据环境变量，选择一个编译（见webpack配置）。可以在这里配置不同环境的api
3. 我们使用完全的前后端分离开发方式，后端提供可跨越的api接口。开发时，可以自己mock api. 
只要`mock_server/index.js`的文件有任何变动，`dev-server`都会重新加载 mock api. 不需要重启dev-server
4. 暴露一些全局状态，见`src/models/global/index`. 
项目跑起来后，可以在控制台中键入:`$globalStore.UiState.lockScreen()`加载全局loading,
`$globalStore.UiState.unLockScreen()` 隐藏。还有Session相关的状态，这个需要根据具体的验证系统，进行改写
5. 提供了一个`Pagination`的model，可以和`ant.design`的Table配合，迅速写出带分页功能的列表。但是model的处理，有很强的字段级的假设。具体看代码
6. 没有使用ant.design自带的验证机制(和mobx一起用不太和谐），提供了另一方式的验证机制。具体使用方式见 `src/pages/_Form.jsx`
7. 先熟悉ant.design 的 `Table,Form`等组件，以及`mobx`的基本用法后，再使用本项目作为starter。

8. 没有使用 `html-webpack-plugin`, 开发时直接使用`src/index.html`，发布时，通过parse5解析dom，替换相应的资源文件地址
9. 配合`webpack`的`externals`, react，react-router,antd 是通过 script引入到页面的。这样会大大加快开发时的编译速度。并可以充分使用cdn，并减小`main.js`的大小。
10. 线上的`main.js`发布时，没有使用文件hash的方式命名，而是加了git的commit 和 日期等信息。
因为单文件，又是后台项目，没必要做这样的缓存，紧急情况下，迅速确认线上版本更重要。



 



