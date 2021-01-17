// 1. 开发环境服务器地址
var baseURL = 'http://api-breakingnews-web.itheima.net'
//2.测试环境
// 3.生产环境
$.ajaxPrefilter(function (option) {
    // 拼接对应环境的服务器地址
    option.url = baseURL + option.url;
})