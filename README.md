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
3. 我们使用完全的前后端分离开发方式，后端提供可跨域的api接口。开发时，可以自己mock api. 
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

#目录结构说明

## 最外层： 
1. `scripts`里是一些发布时需要使用的脚本
2. `static` 里已经打包好的 react相关的文件 和 antd 文件。 具体的打包脚本见 [prebuild-vendor](https://github.com/jzlxiaohei/prebuild-vendor)

其他的几个含义都很明确。

## src

一. 开发的基本思路，是以页面为核心开发。
`pages`里是每个页面自己的代码，确保隔离性。比如 `pages/user/list`文件夹下，应该只有UserList页面需要的代码。一个页面一般有

1. 入口文件 比如 UserList.jsx
2. 入口文件需要用到的一些子组件，以`_`开通的jsx文件
3. models
4. scss

等等。

二. 运行过程

 `main.js` render App组件（`App.jsx`). 注意，里面设置了`mobx`使用严格模式(userStrict)。
 
 App只是简单返回`react-router`组件。
 
 路由的定义在`src/routes`文件下,使用`Plain Routes`的方式，[见react-router文档](https://github.com/ReactTraining/react-router/blob/master/docs/guides/RouteConfiguration.md)
 这样的好处，以后如果加入权限的控制，可以直接把`Plain Routes`里的配置删掉。
 
 `routes/index.js`会引用`src/Layout`组件，是所有页面公用的Layout，提供了左侧导航栏，全局loading等功能。
 
三. 其他文件说明

`components`: 公共组件.
   
`config`: 配置文件，特别是api的配置。
   
`src/infrastructure`: 基础设施，比较通用的东西，迭代稳定后，应该是可以发布到npm上，各项目公用的lib.
`src/infrastructure/makeObservable` 提供两个方法，一个用来给对象添加可以可观察的属性，一个用来添加几个常用的@action方法（因为使用的严格模式），用来set属性
 `src/infrastructure/makeObservable/validator` 一个简单的验证器
   
`src/models`: 具有通用性的models，和 pages级的 models 相区别




 



