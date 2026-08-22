const worker = new Worker('/js/unilang-worker/worker.js', { type: 'module' })

export default worker
