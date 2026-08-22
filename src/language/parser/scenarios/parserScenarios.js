'use strict'

import addNotRecognizableCommandScenario from '#repertoire/language/parser/scenarios/addNotRecognizableCommandScenario.js'

import addCommentScenario from '#repertoire/language/parser/scenarios/addCommentScenario.js'
import addStyleScenarios from '#repertoire/language/parser/scenarios/addStyleScenarios.js'
import addMidiSettingsScenarios from '#repertoire/language/parser/scenarios/addMidiSettingsScenarios.js'
import addCompressAndStretchUnitsScenarios from '#repertoire/language/parser/scenarios/addCompressAndStretchUnitsScenarios.js'
import addHideLastMeasureScenario from '#repertoire/language/parser/scenarios/addHideLastMeasureScenario.js'
import addPageMetaScenarios from '#repertoire/language/parser/scenarios/addPageMetaScenarios.js'
import addMeasureNumbersScenarios from '#repertoire/language/parser/scenarios/addMeasureNumbersScenarios.js'
import addLyricsPositionScenarios from '#repertoire/language/parser/scenarios/addLyricsPositionScenarios.js'
import addMeasureSetupScenarios from '#repertoire/language/parser/scenarios/addMeasureSetupScenarios.js'
import addBarLineScenarios from '#repertoire/language/parser/scenarios/addBarLineScenarios.js'
import addRepeatSignScenarios from '#repertoire/language/parser/scenarios/addRepeatSignScenarios.js'
import addMeasureRestScenarios from '#repertoire/language/parser/scenarios/addMeasureRestScenarios.js'
import addMeasureSimileScenarios from '#repertoire/language/parser/scenarios/addMeasureSimileScenarios.js'
import addMeasureFermataScenarios from '#repertoire/language/parser/scenarios/addMeasureFermataScenarios.js'
import addNewLineScenarios from '#repertoire/language/parser/scenarios/addNewLineScenarios.js'
import addCrossStaveConnectionsScenarios from '#repertoire/language/parser/scenarios/addCrossStaveConnectionsScenarios.js'
import addInstrumentTitlesScenarios from '#repertoire/language/parser/scenarios/addInstrumentTitlesScenarios.js'
import addKeySignatureScenarios from '#repertoire/language/parser/scenarios/addKeySignatureScenarios.js'
import addTimeSignatureScenarios from '#repertoire/language/parser/scenarios/addTimeSignatureScenarios.js'
import addRepetitionNoteScenarios from '#repertoire/language/parser/scenarios/addRepetitionNoteScenarios.js'
import addCodaScenarios from '#repertoire/language/parser/scenarios/addCodaScenarios.js'
import addSignScenarios from '#repertoire/language/parser/scenarios/addSignScenarios.js'
import addTempoMarkScenario from '#repertoire/language/parser/scenarios/addTempoMarkScenario.js'
import addStaveSetupScenarios from '#repertoire/language/parser/scenarios/addStaveSetupScenarios.js'
import addClefScenarios from '#repertoire/language/parser/scenarios/addClefScenarios.js'
import addVoiceSetupScenarios from '#repertoire/language/parser/scenarios/addVoiceSetupScenarios.js'
import addNoteSetupScenarios from '#repertoire/language/parser/scenarios/addNoteSetupScenarios.js'
import addChordSetupScenarios from '#repertoire/language/parser/scenarios/addChordSetupScenarios.js'
import addSlurScenarios from '#repertoire/language/parser/scenarios/addSlurScenarios.js'
import addGlissandoScenarios from '#repertoire/language/parser/scenarios/addGlissandoScenarios.js'
import addTupletScenarios from '#repertoire/language/parser/scenarios/addTupletScenarios.js'
import addOctaveSignScenarios from '#repertoire/language/parser/scenarios/addOctaveSignScenarios.js'
import addCrescendoAndDiminuendoScenarios from '#repertoire/language/parser/scenarios/addCrescendoAndDiminuendoScenarios.js'
import addRepeatSimileScenarios from '#repertoire/language/parser/scenarios/addRepeatSimileScenarios.js'
import addVoltaScenarios from '#repertoire/language/parser/scenarios/addVoltaScenarios.js'
import addPunctuationScenario from '#repertoire/language/parser/scenarios/addPunctuationScenario.js'
import addGeneralEmptyLineScenario from '#repertoire/language/parser/scenarios/addGeneralEmptyLineScenario.js'

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
