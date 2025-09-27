const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);

const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build
  include: [
    path.resolve(appDirectory, 'index.web.js'), // Entry to your application
    path.resolve(appDirectory, 'src'), // Source code
    path.resolve(appDirectory, 'App.tsx'), // App component
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/react-native-safe-area-context'),
    path.resolve(appDirectory, 'node_modules/react-native-screens'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['@babel/preset-react', '@babel/preset-env'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime'
      ]
    }
  }
};

const tsLoaderConfiguration = {
  test: /\.(ts|tsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'ts-loader',
    options: {
      configFile: path.resolve(appDirectory, 'tsconfig.json')
    }
  }
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]'
    }
  }
};

const fontLoaderConfiguration = {
  test: /\.ttf$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: 'fonts/'
    }
  }
};

module.exports = {
  entry: path.resolve(appDirectory, 'index.web.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
      'react-native-vector-icons/MaterialIcons': 'react-native-vector-icons/dist/MaterialIcons',
    },
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      tsLoaderConfiguration,
      imageLoaderConfiguration,
      fontLoaderConfiguration,
      svgLoaderConfiguration
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'public/index.html')
    })
  ],
  devServer: {
    static: {
      directory: path.resolve(appDirectory, 'public'),
    },
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true
  },
  mode: 'development'
};