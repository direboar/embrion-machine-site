'use strict'
module.exports = {
  NODE_ENV: '"production"',
  HEADER_DB : process.env.npm_package_HEADER_DB ? process.env.npm_package_HEADER_DB : '"embriomachine/header"',
  DETAIL_DB : process.env.npm_package_DETAIL_DB ? process.env.npm_package_DETAIL_DB : '"embriomachine/detail"',
  FILE_UPLOAD_DIR : process.env.npm_package_FILE_UPLOAD_DIR ? process.env.npm_package_FILE_UPLOAD_DIR : '"embriomachine/files"'
}

