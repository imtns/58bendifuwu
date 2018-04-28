const merge = require('merge');

const prod = process.env.NODE_ENV === 'production'

const config = {
  wpyExt: '.wpy',
  eslint: false,
  cliLogs: !prod,
  compilers: {
    sass: {
      outputStyle: 'expanded'
    },
    babel: {
      'sourceMap': true,
      'presets': [
        'env'
      ],
      'plugins': [
        'babel-plugin-transform-class-properties',
        'transform-export-extensions',
        'syntax-export-extensions'
      ]
    }
  },
  plugins: {
    parsecss: {
      filter: /\.(wxss|css)$/,
      base64Config: {
        maxSize: 60,
        basePath: __dirname + '/bgimages'
      },
      autoprefixerConfig: {
        browsers: ['last 11 iOS versions']
      }
    }
  },
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}

if (prod) {
  merge.recursive(false, config, {
    compilers: {
      sass: {
        outputStyle: 'compressed'
      },
      babel: {
        sourceMap: false,
      }
    },
    plugins: {
      uglifyjs: {
        filter: /\.js$/,
        config: {
        }
      },
      imagemin: {
        filter: /\.(jpg|png|jpeg)$/,
        config: {
          'jpg': {
            quality: 80
          },
          'png': {
            quality: 80
          }
        }
      }
    }
  })
}

// console.log(JSON.stringify(config, null, '\t'));

module.exports = config;