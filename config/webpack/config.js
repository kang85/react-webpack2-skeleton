const paths = require('../paths');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = 'production';

module.exports = {

    context: paths.context,

    entry: [paths.appIndexJs,  paths.appStyle],

    output: {
        path: paths.appBuild,
        filename: 'assets/[name].bundle.js'
    },

    module: {
        rules: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.(css|scss)$/,
                    /\.json$/
                ],
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'assets/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { 
                        presets: ['react-app'] ,
                        plugins: ['transform-es2015-destructuring',
                            'transform-object-rest-spread']
                    }
                }],
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer'),
                                        require('cssnano')
                                    ];
                                }
                            }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer'),
                                        require('cssnano')
                                    ];
                                }
                            }
                        },
                        'sass-loader'
                    ]
                })
            }
        ],
    },
    plugins: [

        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new ExtractTextPlugin('assets/[name].css'),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'assets/vendor.js',
            minChunks: 2,
        }),
        new webpack.NormalModuleReplacementPlugin(
            /^\.\/routes\/Routes$/,
            './routes/RoutesAsync'
        )

    ],

    resolve: {
        modules: [
            paths.context,
            'node_modules'
        ]
    }
};

/*
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false
          },
          mangle: {
            screw_ie8: true
          },
          output: {
            comments: false,
            screw_ie8: true
          }
        }),
        */