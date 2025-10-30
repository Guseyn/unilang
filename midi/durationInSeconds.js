'use strict'

module.exports = (durationInQuarters, quatersPerMinute = 120) => {
  const quatersPerSecond = quatersPerMinute / 60
  return durationInQuarters / quatersPerSecond
}
