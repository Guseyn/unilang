const worker = new Worker('/js/e-msq/msq-worker/worker.js', { type: 'module' })

export default worker
