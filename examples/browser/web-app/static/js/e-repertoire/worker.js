const worker = new Worker('/js/e-repertoire/repertoire-worker/worker.js', { type: 'module' })

export default worker
