'use strict'
module.exports = {
  NODE_ENV: '"production"',
  HEADER_DB : process.env.npm_config_devdb ? '"embriomachine-dev/header"' : '"embriomachine/header"',
  DETAIL_DB : process.env.npm_config_devdb ? '"embriomachine-dev/detail"' : '"embriomachine/detail"',
  FILE_UPLOAD_DIR : process.env.npm_config_devdb ? '"embriomachine-dev/files"' : '"embriomachine/files"'
}

