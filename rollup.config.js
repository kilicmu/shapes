const path = require("path")
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const pkg = require("./package.json")
const server = require("rollup-plugin-serve")
const alias = require('@rollup/plugin-alias')
const {uglify} = require('rollup-plugin-uglify')
const livereload = require("rollup-plugin-livereload")

const extensions = ['.js']
const isProd = () => process.env.NODE_ENV === "production"
const resolve = (...args) => path.resolve(__dirname, ...args)

const config = {
    // input: resolve('./libs/index.js'),
    input: resolve('./main.js'),
    output: {
        format: 'umd',
        file: resolve(pkg.main),
        // name: pkg.name,
        sourcemap: !isProd()
    },
    plugins: [
        nodeResolve({
            extensions,
            modulesOnly: true
        }),
        alias({
            entries: [
                {find: '@libs', replacement: resolve('./libs')},
                {find: '@dist', replacement: resolve('./dist')},
            ]
        }),
        isProd() ? uglify() : null,
        !isProd() ?server({
            open: true,
            openPage: '/dist/index.html',
            port: 3000,
            contentBase: [resolve('./public'), resolve('./dist')],
         }) : null,
        !isProd() ? livereload(): null
    ]
}
module.exports = config