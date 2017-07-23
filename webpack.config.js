var path = require('path');
var webpack = require('webpack');
//var extract_text = require('extract-text-webpack-plugin');
//var html = require('html-webpack-plugin');

module.exports = {
    module: {
        loaders: [
            {
                loader: "babel-loader",
                // Skip any files outside of your project's `src` directory
                include: [path.resolve(__dirname, "src")],
                exclude: [path.resolve(__dirname, "node_modules/"),
                    path.resolve(__dirname, "public/")],

                // Only run `.js` and `.jsx` files through Babel
                test: /\.jsx?$/,
                // Options to configure babel with
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'react'],
                }
            },
            {
                test: /\.json$/, loader: 'json-loader'
            }
        ]
    },
    /*plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],*/
    output: {
        path: path.resolve(__dirname, "public"),
        filename: './index.js'
    },
    entry: ['./src/index.js'],
    node: {
        console: true,
        global: true,
        __filename: true,
        __dirname: true,
        net: 'empty',
        fs: 'empty',
        tls: 'empty'
    },

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 8080,
        historyApiFallback: { index: 'index.html' }
        //hot: true
    }
};
