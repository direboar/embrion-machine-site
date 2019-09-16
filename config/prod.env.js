'use strict'
module.exports = {
  NODE_ENV: '"production"',
  HEADER_DB : process.env.npm_config_HEADER_DB ? 'process.env.npm_config_HEADER_DB' : '"embriomachine/header"',
  DETAIL_DB : process.env.npm_config_DETAIL_DB ? 'process.env.npm_config_DETAIL_DB' : '"embriomachine/detail"',
  FILE_UPLOAD_DIR : process.env.npm_config_FILE_UPLOAD_DIR ? 'process.env.npm_config_FILE_UPLOAD_DIR' : '"embriomachine/files"'
}

