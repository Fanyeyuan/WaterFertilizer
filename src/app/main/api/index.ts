import process, { send } from 'process'

import cp from 'child_process'

// const process = require('process')
interface ApiInterface {
  event: string;
  message: any;
}

function csend (event: string, message: any) {
  process.send({
    event,
    message
  })
}
