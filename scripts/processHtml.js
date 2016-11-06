var path = require('path');
var fs = require('fs');
var fsExtra = require('fs-extra');
var _ = require('lodash');
var glob = require('glob-all');
var parse5 = require('parse5');
var htmlMinify = require('html-minifier').minify;

var htmlSrcBase = path.join(__dirname, '../src');
var htmlDistBase = path.join(__dirname, '../dist');
var globPattern = path.join(htmlSrcBase, '**/*.html');
var allHtmlFiles = glob.sync(globPattern);

var needReplaceNodeNameList = [
  'script',
  'link'
];

function walk(dom, processFn) {
  if (typeof processFn != 'function') {
    return console.warn('processFn should be provided')
  }
  processFn(dom);

  if (dom.childNodes) {
    dom.childNodes.forEach(function (child) {
      walk(child, processFn);
    })
  }
}

function replaceSrc(dom, AssetsReplaceMap) {
  if (dom && dom.attrs && _.includes(needReplaceNodeNameList, dom.nodeName)) {
    dom.attrs.forEach(function (attr) {
      if (attr.name == 'src' || attr.name == 'href') {
        var key = attr.value;
        if (key in AssetsReplaceMap) {
          attr.value = AssetsReplaceMap[key];
        }
      }
    })
  }
}

function processHtml(htmlStr, AssetsReplaceMap) {
  var rootDom = parse5.parse(htmlStr);
  walk(rootDom, function (dom) {
    replaceSrc(dom, AssetsReplaceMap)
  });
  return parse5.serialize(rootDom);
}

module.exports = function (AssetsReplaceMap) {

  allHtmlFiles.forEach(function (htmlFile) {
    var content = fs.readFileSync(htmlFile, 'utf8');
    var prodContent = processHtml(content, AssetsReplaceMap);
    console.log(prodContent);
    var minProdContent = htmlMinify(prodContent, {
      minifyCSS: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true
    });
    var relativePath = path.relative(htmlSrcBase, htmlFile);
    fsExtra.outputFileSync(path.join(htmlDistBase, relativePath), minProdContent);
  });
}
