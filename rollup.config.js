'use strict'

import rollBabel from 'rollup-plugin-babel'
const babelOpts = {
  presets: [['es2015', {modules: false}]],
  plugins: ['external-helpers'],
  babelrc: false
}
export default {
  input: 'source.js',
  output: [
    {
      file: 'index.js',
      format: 'cjs'
    },
    {
      file: 'module.js',
      format: 'es'
    }
  ],
  plugins: [rollBabel(babelOpts)]
}
