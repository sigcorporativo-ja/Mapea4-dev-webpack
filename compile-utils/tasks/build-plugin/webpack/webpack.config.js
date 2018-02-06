const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

const development = (config) => {

}

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
