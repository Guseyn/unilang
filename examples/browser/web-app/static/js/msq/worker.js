const worker = new Worker('/js/msq/msq-worker/worker.js', { type: 'module' })

export default worker
