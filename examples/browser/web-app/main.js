import fs from 'fs'
import cluster from '#nodes/cluster.js'

process.env.ENV = process.env.ENV || 'local'

const config = JSON.parse(
  fs.readFileSync(
    `./examples/browser/web-app/env/${process.env.ENV}.json`
  )
)

cluster(
  'examples/browser/web-app/primary.js',
  'examples/browser/web-app/worker.js'
)({
  config
})
