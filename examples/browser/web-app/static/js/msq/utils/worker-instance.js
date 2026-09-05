const worker = new Worker('/js/msq/worker/worker.js', { type: 'module' })

export default worker
