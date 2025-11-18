'use strict'

import brace from '#unilang/drawer/elements/connection/braceConnection.js'
import bracket from '#unilang/drawer/elements/connection/bracketConnection.js'
import group from '#unilang/drawer/elements/basic/group.js'
import moveElement from '#unilang/drawer/elements/basic/moveElement.js'
import addPropertiesToElement from '#unilang/drawer/elements/basic/addPropertiesToElement.js'

const connections = {
  brace,
  bracket
}

export default function (connectionsParams, numberOfStaves, numberOfStaveLines, isFirstMeasureOnPageLine, measureIndexInGeneral) {
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
