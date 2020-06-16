// .vuepress/config.js
module.exports = {
  // base: '/blog/',
  themeConfig: {
    logo: '/logo.jpg', // 左上角logo
    nav: [
      { text: 'Home', link: '/' },
      { text: '博客', link: '/blog/' },
      {
        text: '记录', link: '/mark/',
        items: [
          { text: 'live', link: '/mark/live/' },
          { text: 'book', link: '/mark/book/' }
        ]
      },
      { text: '外链', link: 'http://www.bing.com', target: '_self' }
    ],
    displayAllHeaders: true , // 默认值：false
    sidebar: {
      '/mark/':[
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
