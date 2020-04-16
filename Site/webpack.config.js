const HtmlWebpackPlugin = require("html-webpack-plugin");
const Visualizer = require('webpack-visualizer-plugin');
const path = require('path');

module.exports = {
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
                exclude: /node_modules/,
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
        }),
        new Visualizer()
    ],
    devServer: {
        historyApiFallback: true
    }
}
