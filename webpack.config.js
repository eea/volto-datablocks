/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['razzle/babel'],
            // cacheDirectory: true,
            // ignore: [/cjs/],
            // presets: ['@babel/preset-env', '@babel/preset-react'],
            // plugins: [
            //   [
            //     '@babel/plugin-transform-runtime',
            //     {
            //       absoluteRuntime: false,
            //       corejs: false,
            //       helpers: false,
            //       regenerator: false,
            //       useESModules: true,
            //     },
            //   ],
            //   '@babel/plugin-proposal-object-rest-spread', // [v,] => [v]
            //   '@babel/plugin-proposal-export-default-from',
            //   '@babel/plugin-proposal-export-namespace-from',
            //   '@babel/plugin-proposal-class-properties',
            //   '@babel/plugin-transform-template-literals', // `foo${bar}` => "foo".concat(bar)
            //   [
            //     '@babel/plugin-proposal-decorators',
            //     {
            //       decoratorsBeforeExport: true,
            //     },
            //   ],
            // ],
          },
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '',
    filename: 'build.js',
    libraryTarget: 'umd',
  },
  watch: true,
};
