const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        // Enable history API fallback so HTML5 History API based
        // routing works. Good for complex setups.
        historyApiFallback: true,

        // Display only errors to reduce the amount of output.
        stats: 'errors-only',
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        overlay: {
            errors: true,
            warnings: true,
        },
    },
});

exports.lintJavaScript = ({ include, exclude, options }) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                enforce: 'pre',

                loader: 'eslint-loader',
                options,
            },
        ],
    },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.scss$/, // This will make our loader run only on scss files
                include,
                exclude,

                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
});

exports.extractCSS = ({ include, exclude, use }) => {
    // Output extracted CSS to a file 
    const plugin = new ExtractTextPlugin({
        filename: 'css/[name].css',
    });

    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,  // I've changes this to .scss so it can work with sass
                    include,
                    exclude,

                    use: plugin.extract({
                        use,
                        fallback: 'style-loader',
                        publicPath: '.',
                    }),
                },
            ],
        },
        plugins: [ plugin ],
    };
};
// Export css wasnt working > it lacked one dot > so I needed to add publicPath: '.' to make it work > this thread pointed to me to right solution https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27


exports.autoprefix = () => ({
    loader: 'postcss-loader',
    options: {
        plugins: () => ([
            require('autoprefixer')(),
        ]),
    },
});

exports.purifyCSS = ({ paths }) => ({
    plugins: [
        new PurifyCSSPlugin({ paths }),
    ],
});

exports.lintCSS = () => ({
    module: {
        rules: [
            {
                test: /\.scss$/,
                enforce: 'pre',

                loader: 'postcss-loader',
                options: {
                    plugins: () => ([
                        require('stylelint')(),
                    ]),
                },
            },
        ],
    },
});
// I deleted inlude and exclude from lintCSS because I could not work otherwise with scss > it was to strict

exports.loadImages = ({ include, exclude, options,query } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                include,
                exclude,

                use: [
                    { loader: 'url-loader', options},
                    { loader: 'image-webpack-loader', query},
                ],
            },
        ],
    },
});

exports.loadImagesInHTML = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.html$/,
                include,
                exclude,

                use: [
                    'html-loader',
                ],
            },
        ],
    },
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                // Capture eot, ttf, woff, and woff2
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                include,
                exclude,

                use: {
                    loader: 'file-loader',
                    options,
                },
            },
        ],
    },
});