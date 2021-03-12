const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

// App files location
const PATHS = {
  app: path.resolve(__dirname, '../frontend/js'),
  commons_frontend: path.resolve(__dirname, '../node_modules/@natlibfi/melinda-ui-commons/dist/frontend'),
  commons_styles: path.resolve(__dirname, '../node_modules/@natlibfi/melinda-ui-commons/dist/frontend/styles'),
  commons_server: path.resolve(__dirname, '../node_modules/@natlibfi/melinda-ui-commons/dist/server'),
  styles: path.resolve(__dirname, '../frontend/styles'),
  images: path.resolve(__dirname, '../frontend/images'),
  build: path.resolve(__dirname, '../dist/public')
};

const plugins = [
  // Shared code
  new webpack.optimize.CommonsChunkPlugin({ name:'vendor', filename: 'js/vendor.bundle.js' }),
  // Avoid publishing files when compilation fails
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.DATA_PROTECTION_CONSENT_URL': JSON.stringify('https://www.kiwi.fi/download/attachments/93205241/melinda-verkkok%C3%A4ytt%C3%B6liittym%C3%A4t%20asiantuntijoille.pdf?api=v2'),
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
    __PROD__: JSON.stringify(true)
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // This plugin moves all the CSS into a separate stylesheet
  new ExtractTextPlugin('css/app.css', { allChunks: true })
];

module.exports = {
  entry: {
    app: path.resolve(PATHS.app, 'main.js'),
  },
  output: {
    path: PATHS.build,
    filename: 'js/[name].js',
    publicPath: '/'
  },
  stats: {
    colors: true
  },
  resolve: {
    alias: {
      commons: path.resolve(PATHS.commons_frontend, 'js'),
      styles: PATHS.commons_styles,
      transformations: path.resolve(PATHS.commons_server, 'record-transformations'),
    },
    // We can now require('file') instead of require('file.jsx')
    extensions: ['.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /translit\.js$/,
        loaders: ['shebang-loader'],
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: [PATHS.app, PATHS.commons_frontend, PATHS.commons_server]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          { loader: 'postcss-loader', options: { config: { path: 'postcss.config' } } },
          'sass-loader?outputStyle=compressed'
        ]
      },
      {
        test: /\.css$/,
        include: [PATHS.styles, PATHS.commons_styles],
        use: [
          'style-loader',
          'css-loader',
          { loader: 'postcss-loader', options: { config: { path: 'postcss.config' } } }
        ]
      },
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader?limit=8192&name=images/[name].[ext]?[hash]'
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=8192&name=fonts/[name].[ext]?[hash]'
      }
    ]
  },
  plugins: plugins,
  devtool: 'source-map'
};
