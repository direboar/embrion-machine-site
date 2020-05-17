'use strict'
module.exports = {
  NODE_ENV: '"production"',
  HEADER_DB : process.env.npm_config_stagingdb ? '"embriomachine_staging/header"' : '"embriomachine/header"',
  DETAIL_DB : process.env.npm_config_stagingdb ? '"embriomachine_staging/detail"' : '"embriomachine/detail"',
  FILE_UPLOAD_DIR : process.env.npm_config_stagingdb ? '"embriomachine_staging/files"' : '"embriomachine/files"',
  API_KEY : process.env.API_KEY
}

