const proxy = require('http-proxy-middleware');

//var apiProxy = proxy('/api', { target: 'http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080' })
module.exports = function(app) {
  app.use(proxy('/api/**', { target: 'http://ec2-35-154-78-152.ap-south-1.compute.amazonaws.com:8080', 
  secure:false, changeOrigin: true}))
}

