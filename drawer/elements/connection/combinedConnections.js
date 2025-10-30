'use strict'

const connections = {
  brace: require('./braceConnection'),
  bracket: require('./bracketConnection')
}
const group = require('./../basic/group')
const moveElement = require('./../basic/moveElement')
const addPropertiesToElement = require('./../basic/addPropertiesToElement')

module.exports = (connectionsParams, numberOfStaves, numberOfStaveLines, isFirstMeasureOnPageLine, measureIndexInGeneral) => {
  return (styles, leftOffset, topOffset) => {
    const combinedAllConnections = []
    for (let connectionIndex = 0; connectionIndex < connectionsParams.length; connectionIndex++) {
      const connectionParams = connectionsParams[connectionIndex]
      const drawnConnection = connections[connectionParams.name](
        connectionParams.staveStartNumber,
        connectionParams.staveEndNumber,
        numberOfStaves,
        numberOfStaveLines
      )(styles, leftOffset, topOffset)
      addPropertiesToElement(
        drawnConnection,
        {
          'ref-ids': `cross-stave-connection-${measureIndexInGeneral + 1}-${connectionIndex + 1}`
        }
      )
      if (isFirstMeasureOnPageLine && connectionParams.forEachLineId !== undefined) {
        addPropertiesToElement(
          drawnConnection,
          {
            'ref-ids': `cross-stave-connection-for-each-line-${connectionParams.forEachLineId}`
          }
        )
      }
      combinedAllConnections.push(drawnConnection)
    }
    const tmpGourpedConnections = group(
      'tmpCombinedConnections',
      combinedAllConnections
    )
    for (let connectionIndex = 0; connectionIndex < combinedAllConnections.length; connectionIndex++) {
      const connection = combinedAllConnections[connectionIndex]
      moveElement(
        connection,
        tmpGourpedConnections.right - connection.right
      )
    }
    return group(
      'combinedConnections',
      combinedAllConnections
    )
  }
}
