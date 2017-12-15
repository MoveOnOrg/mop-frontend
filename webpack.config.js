var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');
var APP_ENTRY = process.env.APP_ENTRY || "main";

var config = {
  entry: {
    javascript: APP_DIR + '/apps/' + APP_ENTRY + '.js'
  },
  devServer: {
    host: "0.0.0.0",
  },
  devtool: 'sourcemap',
  output: {
    path: BUILD_DIR,
    publicPath: process.env.PUBLIC_ROOT || "/",
    //NOTE: when process.env.PROD is true this will be the minified file
    //TODO: maybe we should hash this and figure out a way to pass the hashed version to it
    filename: APP_ENTRY + '.js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        include : APP_DIR,
        loader : 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: "file-loader?name=[name].[ext]",
      }
    ]
  },
  plugins : [
    new HtmlWebpackPlugin({
      template: 'local/index.html',
      inject: 'body',
      //hash: true,
      filename: 'index.html',
      staticPath: (process.env.STATIC_ROOT || ''),
      cssPath: (process.env.NODE_ENV == 'production'
                ? 'https://s3.amazonaws.com/mop-static/css/moui.css'
                : '/css/moui.css'),
      reactJs: (process.env.LOCAL_REACT
                ? process.env.LOCAL_REACT + 'react.js'
                : 'https://unpkg.com/react@15.4.1/dist/react.js'),
      reactDomJs: (process.env.LOCAL_REACT
                   ? process.env.LOCAL_REACT + 'react-dom.js'
                   : 'https://unpkg.com/react-dom@15.4.1/dist/react-dom.js')
    }),
    ((process.env.PROD)
     ? new webpack.optimize.UglifyJsPlugin({sourceMap: true})
     : new webpack.HotModuleReplacementPlugin()),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(((process.env.PROD) ? 'production' : 'development')),
        'API_URI': JSON.stringify(process.env.API_URI ||
                                  (process.env.PROD ? '' : '/local')
                                 ),
        'API_WRITABLE': process.env.API_WRITABLE || process.env.PROD,
        'BASE_APP_PATH': JSON.stringify(process.env.BASE_APP_PATH || '/'),
        'SESSION_COOKIE_NAME': JSON.stringify(process.env.SESSION_COOKIE_NAME || 'SO_SESSION'),
        'STATIC_ROOT': JSON.stringify(process.env.STATIC_ROOT || ''),
        'TRACK_SHARE_URL': JSON.stringify(process.env.TRACK_SHARE_URL || ''),
        'PROD': process.env.PROD
      }
    })

  ]
};

module.exports = config;
