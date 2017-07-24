const path = require('path'); // You have to set absulute path, it's not needed everywhere (depends on version of webpack ....)
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'app/js'), // This is our entry point it requires absolute path, __dirname says to get current directory we are in > Entries have to resolve to files! They rely on Node convention by default so if a directory contains *index.js*, it resolves to that. 
    build: path.join(__dirname, 'build'), // Build point same as above
};

const commonConfig = merge([
    {
        entry: {
            app: PATHS.app,
        },
        output: {
            path: PATHS.build,
            filename: 'js/[name].js',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'app/index.html',
            }),
        ],
    },
    parts.lintJavaScript({ include: PATHS.app }),
    parts.lintCSS({ include: PATHS.app }),
    parts.loadImagesInHTML(),
    parts.loadFonts({
        options: {
            name: '[name].[ext]',
        },
    }),
]);

const productionConfig = merge([

    parts.extractCSS({
        use: ['css-loader', 'sass-loader', parts.autoprefix()],
    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
    }),
    parts.loadImages({
        options: {
            limit: 30000,
            name: './images/[name].[ext]',
        },
        query: {
            mozjpeg: {
                progressive: true,
                quality: 70,
            },
            gifsicle: {
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            pngquant: {
                quality: '65-90',
                speed: 3,
            },
        },
    }),
]);

const developmentConfig = merge([
    parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.loadCSS(),
    parts.loadImages(),
]);

module.exports = (env) => {
    if (env === 'production') {
        return merge(commonConfig, productionConfig);
    }

    return merge(commonConfig, developmentConfig);
};


// Komandu ispod korirstis ako oces da ispravis neke greske > npm indent i tako to > konfiguracija ti se nalazi u .eslintrc.js
// npm run lint:js -- --fix      > da popravis automatski

// Komandu ispod koristis ako oces da vidis da li imas greske u css sintaksi > pravila se nalaze u .stylelintrc
// npm run lint:style  >  ima i verzija koja ne prikazuje nepotrebne errore > npm run lint:style --silent  ili   npm run lint:style -s
// npm run lint:style -- --fix       > da popravis automatski