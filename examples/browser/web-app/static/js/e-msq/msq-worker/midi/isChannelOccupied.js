'use strict'

export default function (instrumentsMappedWithChannels, channelNumber) {
  for (const instrumentMidiNumber in instrumentsMappedWithChannels) {
    if (instrumentsMappedWithChannels[instrumentMidiNumber] === channelNumber) {
      return true
    }
  }
  return false
}
