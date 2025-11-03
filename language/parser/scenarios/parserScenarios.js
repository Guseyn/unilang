'use strict'

import addNotRecognizableCommandScenario from './addNotRecognizableCommandScenario.js'

import addCommentScenario from './addCommentScenario.js'
import addStyleScenarios from './addStyleScenarios.js'
import addMidiSettingsScenarios from './addMidiSettingsScenarios.js'
import addCompressAndStretchUnitsScenarios from './addCompressAndStretchUnitsScenarios.js'
import addHideLastMeasureScenario from './addHideLastMeasureScenario.js'
import addPageMetaScenarios from './addPageMetaScenarios.js'
import addMeasureNumbersScenarios from './addMeasureNumbersScenarios.js'
import addLyricsPositionScenarios from './addLyricsPositionScenarios.js'
import addMeasureSetupScenarios from './addMeasureSetupScenarios.js'
import addBarLineScenarios from './addBarLineScenarios.js'
import addRepeatSignScenarios from './addRepeatSignScenarios.js'
import addMeasureRestScenarios from './addMeasureRestScenarios.js'
import addMeasureSimileScenarios from './addMeasureSimileScenarios.js'
import addMeasureFermataScenarios from './addMeasureFermataScenarios.js'
import addNewLineScenarios from './addNewLineScenarios.js'
import addCrossStaveConnectionsScenarios from './addCrossStaveConnectionsScenarios.js'
import addInstrumentTitlesScenarios from './addInstrumentTitlesScenarios.js'
import addKeySignatureScenarios from './addKeySignatureScenarios.js'
import addTimeSignatureScenarios from './addTimeSignatureScenarios.js'
import addRepetitionNoteScenarios from './addRepetitionNoteScenarios.js'
import addCodaScenarios from './addCodaScenarios.js'
import addSignScenarios from './addSignScenarios.js'
import addTempoMarkScenario from './addTempoMarkScenario.js'
import addStaveSetupScenarios from './addStaveSetupScenarios.js'
import addClefScenarios from './addClefScenarios.js'
import addVoiceSetupScenarios from './addVoiceSetupScenarios.js'
import addNoteSetupScenarios from './addNoteSetupScenarios.js'
import addChordSetupScenarios from './addChordSetupScenarios.js'
import addSlurScenarios from './addSlurScenarios.js'
import addGlissandoScenarios from './addGlissandoScenarios.js'
import addTupletScenarios from './addTupletScenarios.js'
import addOctaveSignScenarios from './addOctaveSignScenarios.js'
import addCrescendoAndDiminuendoScenarios from './addCrescendoAndDiminuendoScenarios.js'
import addRepeatSimileScenarios from './addRepeatSimileScenarios.js'
import addVoltaScenarios from './addVoltaScenarios.js'
import addPunctuationScenario from './addPunctuationScenario.js'
import addGeneralEmptyLineScenario from './addGeneralEmptyLineScenario.js'

const addMainScenarious = (scenarios) => {
  addCommentScenario(scenarios)
  addStyleScenarios(scenarios)
  addMidiSettingsScenarios(scenarios)
  addCompressAndStretchUnitsScenarios(scenarios)
  addHideLastMeasureScenario(scenarios)
  addPageMetaScenarios(scenarios)
  addMeasureNumbersScenarios(scenarios)
  addLyricsPositionScenarios(scenarios)
  addMeasureSetupScenarios(scenarios)
  addBarLineScenarios(scenarios)
  addRepeatSignScenarios(scenarios)
  addMeasureRestScenarios(scenarios)
  addMeasureSimileScenarios(scenarios)
  addMeasureFermataScenarios(scenarios)
  addNewLineScenarios(scenarios)
  addCrossStaveConnectionsScenarios(scenarios)
  addInstrumentTitlesScenarios(scenarios)
  addKeySignatureScenarios(scenarios)
  addTimeSignatureScenarios(scenarios)
  addRepetitionNoteScenarios(scenarios)
  addCodaScenarios(scenarios)
  addSignScenarios(scenarios)
  addTempoMarkScenario(scenarios)
  addStaveSetupScenarios(scenarios)
  addClefScenarios(scenarios)
  addVoiceSetupScenarios(scenarios)
  addSlurScenarios(scenarios)
  addGlissandoScenarios(scenarios)
  addTupletScenarios(scenarios)
  addOctaveSignScenarios(scenarios)
  addCrescendoAndDiminuendoScenarios(scenarios)
  addRepeatSimileScenarios(scenarios)
  addVoltaScenarios(scenarios)
  addNoteSetupScenarios(scenarios)
  addChordSetupScenarios(scenarios)
  addPunctuationScenario(scenarios)
  addGeneralEmptyLineScenario(scenarios)
}

export default function () {
  const scenarios = {}
  addMainScenarious(scenarios)
  addNotRecognizableCommandScenario(scenarios)
  return scenarios
}
