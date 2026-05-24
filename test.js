console.log('main1')
console.log('main2')
console.log('main3')
setImmediate(() => {
  console.log('now')
})
queueMicrotask(() => {
  console.log('micro1')
})
queueMicrotask(() => {
  console.log('micro2')
})
queueMicrotask(() => {
  console.log('micro3')
})
console.log('main4')
console.log('main5')
console.log('main6')
setTimeout(function() {
  console.log('timeout0')
}, 0)
setTimeout(function() {
  console.log('timeout1')
}, 10)
setTimeout(function() {
  console.log('timeout2')
}, 10)
