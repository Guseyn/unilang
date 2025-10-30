'use strict'

module.exports = (topOffset, staveIndex, intervalBetweenStaves, intervalBetweenStaveLines, numberOfStaveLines) => {
  return topOffset + staveIndex * (intervalBetweenStaves + intervalBetweenStaveLines * (numberOfStaveLines - 1))
}
