/* eslint-disable */
const merge = require('merge');

const prod = process.env.NODE_ENV === 'production';
const config = {
    wpyExt: '.wpy',
    eslint: true,
    cliLogs: !prod,
    compilers: {
        sass: {
            outputStyle: 'expanded',
        },
        babel: {
            sourceMap: !prod,
            presets: ['stage-2', 'env'],
            plugins: ['babel-plugin-transform-class-properties', 'transform-export-extensions', 'syntax-export-extensions'],
        },
    },
    plugins: {
        parsecss: {
            base64Config: {
                maxSize: 60,
                basePath: `${__dirname}/bgimages`,
            },
            autoprefixerConfig: {
                browsers: ['> 0.1%'],
            },
        },
    },
    appConfig: {
        noPromiseAPI: ['createSelectorQuery'],
    },
};
if (prod) {
    merge.recursive(false, config, {   
        compilers: {
            sass: {
                // outputStyle: 'compressed',
            },
            babel: {
                sourceMap: false,
            },
        },
        plugins: {
            uglifyjs: {
                filter: /\.js$/,
                config: {},
            },
            imagemin: {
                filter: /\.(jpg|png|jpeg)$/,
                config: {
                    jpg: {
                        quality: 80,
                    },
                    png: {
                        quality: 80,
                    },
                },
            },
        },
    });
}
// console.log(JSON.stringify(config, null, '\t'));
module.exports = config;
