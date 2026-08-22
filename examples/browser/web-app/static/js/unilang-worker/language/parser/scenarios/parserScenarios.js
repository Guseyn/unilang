'use strict'

import addNotRecognizableCommandScenario from '/js/unilang-worker/language/parser/scenarios/addNotRecognizableCommandScenario.js'

import addCommentScenario from '/js/unilang-worker/language/parser/scenarios/addCommentScenario.js'
import addStyleScenarios from '/js/unilang-worker/language/parser/scenarios/addStyleScenarios.js'
import addMidiSettingsScenarios from '/js/unilang-worker/language/parser/scenarios/addMidiSettingsScenarios.js'
import addCompressAndStretchUnitsScenarios from '/js/unilang-worker/language/parser/scenarios/addCompressAndStretchUnitsScenarios.js'
import addHideLastMeasureScenario from '/js/unilang-worker/language/parser/scenarios/addHideLastMeasureScenario.js'
import addPageMetaScenarios from '/js/unilang-worker/language/parser/scenarios/addPageMetaScenarios.js'
import addMeasureNumbersScenarios from '/js/unilang-worker/language/parser/scenarios/addMeasureNumbersScenarios.js'
import addLyricsPositionScenarios from '/js/unilang-worker/language/parser/scenarios/addLyricsPositionScenarios.js'
import addMeasureSetupScenarios from '/js/unilang-worker/language/parser/scenarios/addMeasureSetupScenarios.js'
import addBarLineScenarios from '/js/unilang-worker/language/parser/scenarios/addBarLineScenarios.js'
import addRepeatSignScenarios from '/js/unilang-worker/language/parser/scenarios/addRepeatSignScenarios.js'
import addMeasureRestScenarios from '/js/unilang-worker/language/parser/scenarios/addMeasureRestScenarios.js'
import addMeasureSimileScenarios from '/js/unilang-worker/language/parser/scenarios/addMeasureSimileScenarios.js'
import addMeasureFermataScenarios from '/js/unilang-worker/language/parser/scenarios/addMeasureFermataScenarios.js'
import addNewLineScenarios from '/js/unilang-worker/language/parser/scenarios/addNewLineScenarios.js'
import addCrossStaveConnectionsScenarios from '/js/unilang-worker/language/parser/scenarios/addCrossStaveConnectionsScenarios.js'
import addInstrumentTitlesScenarios from '/js/unilang-worker/language/parser/scenarios/addInstrumentTitlesScenarios.js'
import addKeySignatureScenarios from '/js/unilang-worker/language/parser/scenarios/addKeySignatureScenarios.js'
import addTimeSignatureScenarios from '/js/unilang-worker/language/parser/scenarios/addTimeSignatureScenarios.js'
import addRepetitionNoteScenarios from '/js/unilang-worker/language/parser/scenarios/addRepetitionNoteScenarios.js'
import addCodaScenarios from '/js/unilang-worker/language/parser/scenarios/addCodaScenarios.js'
import addSignScenarios from '/js/unilang-worker/language/parser/scenarios/addSignScenarios.js'
import addTempoMarkScenario from '/js/unilang-worker/language/parser/scenarios/addTempoMarkScenario.js'
import addStaveSetupScenarios from '/js/unilang-worker/language/parser/scenarios/addStaveSetupScenarios.js'
import addClefScenarios from '/js/unilang-worker/language/parser/scenarios/addClefScenarios.js'
import addVoiceSetupScenarios from '/js/unilang-worker/language/parser/scenarios/addVoiceSetupScenarios.js'
import addNoteSetupScenarios from '/js/unilang-worker/language/parser/scenarios/addNoteSetupScenarios.js'
import addChordSetupScenarios from '/js/unilang-worker/language/parser/scenarios/addChordSetupScenarios.js'
import addSlurScenarios from '/js/unilang-worker/language/parser/scenarios/addSlurScenarios.js'
import addGlissandoScenarios from '/js/unilang-worker/language/parser/scenarios/addGlissandoScenarios.js'
import addTupletScenarios from '/js/unilang-worker/language/parser/scenarios/addTupletScenarios.js'
import addOctaveSignScenarios from '/js/unilang-worker/language/parser/scenarios/addOctaveSignScenarios.js'
import addCrescendoAndDiminuendoScenarios from '/js/unilang-worker/language/parser/scenarios/addCrescendoAndDiminuendoScenarios.js'
import addRepeatSimileScenarios from '/js/unilang-worker/language/parser/scenarios/addRepeatSimileScenarios.js'
import addVoltaScenarios from '/js/unilang-worker/language/parser/scenarios/addVoltaScenarios.js'
import addPunctuationScenario from '/js/unilang-worker/language/parser/scenarios/addPunctuationScenario.js'
import addGeneralEmptyLineScenario from '/js/unilang-worker/language/parser/scenarios/addGeneralEmptyLineScenario.js'

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
