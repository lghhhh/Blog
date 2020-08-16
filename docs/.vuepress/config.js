// .vuepress/config.js
module.exports = {
  // base: '/blog/',
  themeConfig: {
    logo: '/logo.jpg', // 左上角logo
    nav: [
      { text: 'Blog', link: '/blog/' },
    ],
    displayAllHeaders: true , // 默认值：false
    sidebar: {
      '/blog/':[
        {
          "title": "记录",
          'path': 'live/',
          "children": [
             "",
              "video"
              
          ]
      }
      ]
    },
    sidebarDepth :2
  }
}
