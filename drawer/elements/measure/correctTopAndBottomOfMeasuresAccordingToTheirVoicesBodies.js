'use strict'

export default function (drawnMeasuresOnPageLine, voicesBodiesOnPageLine) {
  for (let measureIndexOnPageLine = 0; measureIndexOnPageLine < drawnMeasuresOnPageLine.length; measureIndexOnPageLine++) {
    if (voicesBodiesOnPageLine[measureIndexOnPageLine] && !voicesBodiesOnPageLine[measureIndexOnPageLine].isEmpty) {
      drawnMeasuresOnPageLine[measureIndexOnPageLine].top = Math.min(drawnMeasuresOnPageLine[measureIndexOnPageLine].top, voicesBodiesOnPageLine[measureIndexOnPageLine].top)
      drawnMeasuresOnPageLine[measureIndexOnPageLine].bottom = Math.max(drawnMeasuresOnPageLine[measureIndexOnPageLine].bottom, voicesBodiesOnPageLine[measureIndexOnPageLine].bottom)
    }
  }
}
