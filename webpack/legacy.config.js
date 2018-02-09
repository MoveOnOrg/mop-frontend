const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = merge(baseConfig, {
  resolve: {
    alias: {
      Giraffe: path.resolve(__dirname, '../src/components/legacy/'),
      Legacy: path.resolve(__dirname, '../src/components/legacy/')
    }
  }
})
