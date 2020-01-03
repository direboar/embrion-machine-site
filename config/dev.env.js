'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //HEADER_DB : '"embriomachine/header"',
  //DETAIL_DB : '"embriomachine/detail"',
  //FILE_UPLOAD_DIR : '"embriomachine/files"'
  HEADER_DB : '"embriomachine_staging/header"',
  DETAIL_DB : '"embriomachine_staging/detail"',
  FILE_UPLOAD_DIR : '"embriomachine_staging/files"'
})
