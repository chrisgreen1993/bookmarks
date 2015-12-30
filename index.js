require('babel-register');
global.appRoot = __dirname;
require('./server').start('development');
