const path = require('path');
const cssnano = require('cssnano');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ModernizrPlugin = require('modernizr-webpack-plugin');

module.exports = {
  entry: {
    main: [
      './public/_js/main.js',
      './public/_scss/main.scss',
    ],
    vendor: [
      'bootstrap',
      'jquery',
    ],
  },

  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: '[name].js',
  },

  module: {
    rules: [{
      test: /\.(scss)$/,
      loaders: ExtractTextPlugin.extract({
        fallback: 'style-loader', // in case the ExtractTextPlugin is disabled, inject CSS to <HEAD>
        use: [{
          loader: 'css-loader', // translates CSS into CommonJS modules
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            sourceMap: true,
            plugins() { // post css plugins, can be exported to postcss.config.js
              return [
                postcssFlexbugsFixes,
                autoprefixer,
                cssnano,
              ];
            },
          },
        }, {
          loader: 'sass-loader', // compiles SASS to CSS
          options: {
            sourceMap: true,
          },
        }],
      }),
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader', // transpile to ES5
        options: {
          presets: ['es2015'],
        },
      }],
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    }],
  },

  plugins: [
    new webpack.ProvidePlugin({ // inject ES5 modules as global vars
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // in case bootstrap's modules were imported individually, they must also be provided here:
      // Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
    new webpack.optimize.CommonsChunkPlugin({ // seperate vendor chunks
      name: ['vendor', 'manifest'],
    }),
    new ExtractTextPlugin('../css/[name].css'),
    new WebpackCleanupPlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new ModernizrPlugin({
      minify: true,
      options: [
        'addTest',
        'setClasses',
      ],
      'feature-detects': [],
    }),
  ],
};
