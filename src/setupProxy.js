const { createProxyMiddleware } = require('http-proxy-middleware');
const pkg = require('../package.json');
const target = pkg.proxy;
module.exports = function(app) {
    // let a = target.replace(/^http(s?):\/\//, "ws$1://");
    // console.log(a);
    app.use(
        // Do not use `/ws` as it conflicts with create-react-app's hotrefresh socket.
        createProxyMiddleware('/websocket', {
            target: target.replace(/^http(s?):\/\//, "ws$1://"),
            ws: true,
            changeOrigin: true,
        })
    );
};