const HtmlWebpackPlugin = require("html-webpack-plugin");
const ServiceWorkerAssetsPlugin = require('./plugins/ServiceWorkerAssetsPlugin');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const  CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = merge([
    {
        context: process.cwd(),
        entry: {
            scripts: './src/main.ts',
            sw: './src/sw.ts'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: (chunkData) => {
                if(chunkData.chunk.id === 'sw') {
                    return '[name].js';
                }
                return '[name].[hash].bundle.js';
            }
        },
        resolve: {
            alias: {
                './fonts': path.resolve(__dirname, 'fonts')
            },
            extensions: [
                ".webpack.js", ".web.js", ".ts", ".js",
                ".svg", ".html", ".css", ".sass", ".less"]
        },
        resolveLoader: {
            modules: [
                'node_modules',
                path.resolve(__dirname, 'loaders'),
            ],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'initial',
                        minChunks: 2
                    }
                }
            }
        },
        module: {
            rules: [
                {
                  test: /\.(ttf)$/,
                    loader: 'file-loader',
                    options: {
                      name: `fonts/[name].[ext]`
                    }
                },
                {
                    test: /\.sass$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: {
                                    mode: 'local',
                                    exportGlobals: true,
                                    localIdentName: '[name]__[local]--[hash:base64:5]',
                                    context: path.resolve(__dirname, 'src'),
                                    hashPrefix: 'my-custom-hash',
                                },
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        }
                    ]
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true
                            }
                        },
                        {
                          loader: 'style-urls-loader',
                        },
                        {
                            loader: 'string-replace-loader',
                            options: {
                                search: '$$version$$',
                                replace: () => {
                                    return new Date().toISOString()
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanStaleWebpackAssets: false
            }),
            new HtmlWebpackPlugin({
                title: 'webpack test',
                template: './src/index.html'
            }),
            new ServiceWorkerAssetsPlugin(),
            new CopyPlugin([{
                    from: path.join(__dirname, 'assets'),
                    to: path.join(__dirname, 'dist')
                },{
                from: path.join(__dirname, 'src/manifest.json'),
                to: path.join(__dirname, 'dist')
            }]),
            new MiniCssExtractPlugin({
                filename: 'css/styles.css'
            })
        ],
        devServer: {
            historyApiFallback: true,
            hot: false, // use to get service worker... working
            hotOnly: false,
        }
    }
])

const productionConfig = merge([{
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /environment\.ts/,
            'environment.production.ts')
    ],
    devtool: 'inline-source-map',
}]);

const developmentConfig = merge([{
    plugins: [
    ],
    devtool: 'source-map',
}]);

module.exports = (env, argv) => {
    if(argv.mode === 'production') {


        return merge([
            productionConfig,
            commonConfig
        ]);
    }

    return merge([
        developmentConfig,
        commonConfig
    ]);
}


