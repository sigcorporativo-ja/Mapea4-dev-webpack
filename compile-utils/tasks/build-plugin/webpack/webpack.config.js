const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
