const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',  // 匹配所有以 /api 开头的请求
    createProxyMiddleware({
      target: 'http://192.168.43.75:8080',  // 后端服务器地址
      changeOrigin: true,  // 修改请求头中的 Origin 字段，防止跨域问题
      pathRewrite: {
        '^/api': '',  // 删除路径中的 /api 前缀，避免后端无法识别
      },
    })
  );
};
