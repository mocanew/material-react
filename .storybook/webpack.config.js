var autoprefixer = require('autoprefixer');
var precss = require('precss');
var path = require('path');

var exp = {
    devServer: {
        host: '0.0.0.0',
        port: 8090,
        historyApiFallback: {
            index: '/'
        }
    },
    devtool: 'source-map',
    amd: {
        jQuery: true
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'postcss', 'sass']
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css', 'postcss']
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                loader: 'url-loader'
            }
        ]
    },
    postcss: function () {
        return [autoprefixer, precss];
    },
    externals: {},
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

module.exports = exp;