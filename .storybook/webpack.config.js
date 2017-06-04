var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var path = require('path');

process.browser = true;

var exp = {
    devServer: {
        host: '0.0.0.0',
        port: 8090,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        historyApiFallback: {
            index: 'index.html'
        }
    },
    entry: {
        bundle: ['babel-polyfill', './public/index.jsx']
    },
    output: {
        path: path.join(__dirname, 'assets'),
        filename: '[name].js',
        publicPath: '/assets/'
    },
    devtool: 'eval',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                'syntax-async-functions',
                                'transform-regenerator',
                                'transform-class-properties',
                                'transform-object-rest-spread'
                            ],
                            presets: [
                                'es2015',
                                'react'
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif?)/,
                use: 'url-loader'
            },
            {
                test: /\.(html|eot|svg|ttf|otf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                use: 'url-loader'
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                    precss()
                ]
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    performance: {
        hints: false
    }
};

// if (process.argv && process.argv.indexOf('--production') != -1) {
//     exp.plugins.push(
//         new webpack.DefinePlugin({
//             'process.env': {
//                 NODE_ENV: JSON.stringify('production')
//             }
//         })
//     );
// }
// else {
//     exp.entry.webpack = 'webpack-dev-server/client?http://0.0.0.0:8090';
//     exp.entry.webpackHot = 'webpack/hot/only-dev-server';
// }

module.exports = exp;