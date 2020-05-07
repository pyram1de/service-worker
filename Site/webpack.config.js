const HtmlWebpackPlugin = require("html-webpack-plugin");
const ServiceWorkerAssetsPlugin = require('./plugins/ServiceWorkerAssetsPlugin');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const  CopyPlugin = require('copy-webpack-plugin')

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
            extensions: [".webpack.js", ".web.js", ".ts", ".js", ".svg", ".html", ".css"]
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
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader', options: {
                                transpileOnly: true
                            }
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
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'webpack test',
                template: './src/index.html'
            }),
            new ServiceWorkerAssetsPlugin({

            }),
            new CopyPlugin([{
                    from: path.join(__dirname, 'assets'),
                    to: path.join(__dirname, 'dist')
                },{
                from: path.join(__dirname, 'src/manifest.json'),
                to: path.join(__dirname, 'dist')
            }])
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
    ]
}]);

const developmentConfig = merge([{
    plugins: [
    ],
    devtool: 'source-maps'
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


