const path = require('path');

module.exports = {
    entry: './src/chessbuff.js',
    output: {
        filename: 'chessbuff.js',
        path: path.resolve(__dirname, 'dist'),
    },
};