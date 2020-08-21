// .vuepress/config.js
const utils = require('./utils')
module.exports = {
  base: '/blog/',
  themeConfig: {
    logo: '/logo.jpg', // 左上角logo
    nav: [
      { text: 'Blog', link: '/blog/' },
    ],
    displayAllHeaders: true , // 默认值：false
    sidebar: {
      '/blog/':[
        {
          "title": "ts笔记",
          "children": [
            //  '',
             'TSLearn'
          ]
      }
      ]
    },
    // sidebar: utils.inferSiderbars(),
    sidebarDepth :2,
  }
}
