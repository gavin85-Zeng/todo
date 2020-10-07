const path = require('path');

module.exports = {
    mode: 'none',
    entry: {
        bundle: path.join(__dirname, 'src', 'index.tsx')
    },
    resolve: {
        extensions: ['ts','.tsx','.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env', '@babel/preset-typescript'],
                    }
                },
                exclude: '/node_modules'
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}