const path = require('path');
const webpack = require('webpack');
const pro = process.env.NODE_ENV =='production' ? true : false;  //  区别是生产环境和开发环境
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index:'./src/index.js',
        index2:'./src/index2.js',
    },    // 入口文件
    output: {
        filename: '[name].[hash:4].js',      // 打包后的文件名称
        path: path.resolve('dist')  // 打包后的目录，必须是绝对路径
    },
    module:{
        rules: [
            {
                test:/\.js$/,
                use:'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            },
            {
                test: /\.less$/,     // 解析less
                use:ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    fallback: "style-loader",
                    use:['css-loader','postcss-loader','less-loader'] // 从右向左解析
               }) 
            },
            {
                test: /\.scss$/,     // 解析scss
                use:ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    fallback: "style-loader",
                    use:['css-loader','postcss-loader','sass-loader'] // 从右向左解析
               }) 
            },
            {
                test: /\.css$/,     // 解析css
                use: ExtractTextWebpackPlugin.extract({
                     // 将css用link的方式引入就不再需要style-loader了
                     fallback: "style-loader",
                     use:['css-loader','postcss-loader']
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/'   // 图片打包后存放的目录
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader' // 打包页面img引用图片
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,  //  打包字体图片和svg图片
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            hash:true, // 会在打包好的bundle.js后面加上hash串
            chunks:['vendor','index','utils']  //  引入需要的chunk
        }),
        // 拆分后会把css文件放到dist目录下的css/style.css
        new ExtractTextWebpackPlugin('css/style.css'),
        new ExtractTextWebpackPlugin('css/reset.css'),
        new CleanWebpackPlugin('dist'),
        new webpack.HotModuleReplacementPlugin(),  // 热更新，热更新不是刷新
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost',      // 默认是localhost
        port: 3000,             // 端口
        open: true,             // 自动打开浏览器
        hot: true               // 开启热更新
    },
    resolve: {
        // 别名
        alias: {
            
        },
        // 省略后缀
        extensions: ['.js', '.jsx','.json', '.css','.scss','.less']
    },
    //  提取公共代码
    optimization:{
        splitChunks: {
                cacheGroups: {
                    vendor: {   // 抽离第三方插件
                        test: /node_modules/,   // 指定是node_modules下的第三方包
                        chunks: 'initial',
                        name: 'vendor',  // 打包后的文件名，任意命名    
                        // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                        priority: 10    
                    },
                    utils:{
                        // 抽离自己写的公共代码，utils这个名字可以随意起
                        chunks:'initial',
                        name:'utils',  //  任意命名
                        minSize: 0    // 只要超出0字节就生成一个新包
                    }
            }
        }
    }
}