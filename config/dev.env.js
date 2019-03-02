'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HEADER_DB : '"embriomachine_dev/header"',
  DETAIL_DB : '"embriomachine_dev/detail"',
  FILE_UPLOAD_DIR : '"embriomachine_dev_files"'
})
