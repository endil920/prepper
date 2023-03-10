module.exports = {
    entry: './public/scripts/verses.js',
    output: {
        path: './',
        filename: './public/scripts/bundle.js'
    },
    module: {
                loaders: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel', // 'babel-loader' is also a legal name to reference
                    query: {
                        presets: ['es2015']
                    }
                }
                ]
            }
}
