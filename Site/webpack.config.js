const HtmlWebpackPlugin = require("html-webpack-plugin");
const Visualizer = require('webpack-visualizer-plugin');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = merge([
    {
        context: process.cwd(),
        entry: {
            scripts: './src/main.ts'
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'index.js'
        },
        resolve: {
            extensions: [".webpack.js", ".web.js", ".ts", ".js", ".svg", ".html", ".css"]
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
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'webpack test',
                template: './src/index.html'
            })
        ],
        devServer: {
            historyApiFallback: true
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
        new Visualizer()
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


