'use strict'

import addNotRecognizableCommandScenario from '#unilang/language/parser/scenarios/addNotRecognizableCommandScenario.js'

import addCommentScenario from '#unilang/language/parser/scenarios/addCommentScenario.js'
import addStyleScenarios from '#unilang/language/parser/scenarios/addStyleScenarios.js'
import addMidiSettingsScenarios from '#unilang/language/parser/scenarios/addMidiSettingsScenarios.js'
import addCompressAndStretchUnitsScenarios from '#unilang/language/parser/scenarios/addCompressAndStretchUnitsScenarios.js'
import addHideLastMeasureScenario from '#unilang/language/parser/scenarios/addHideLastMeasureScenario.js'
import addPageMetaScenarios from '#unilang/language/parser/scenarios/addPageMetaScenarios.js'
import addMeasureNumbersScenarios from '#unilang/language/parser/scenarios/addMeasureNumbersScenarios.js'
import addLyricsPositionScenarios from '#unilang/language/parser/scenarios/addLyricsPositionScenarios.js'
import addMeasureSetupScenarios from '#unilang/language/parser/scenarios/addMeasureSetupScenarios.js'
import addBarLineScenarios from '#unilang/language/parser/scenarios/addBarLineScenarios.js'
import addRepeatSignScenarios from '#unilang/language/parser/scenarios/addRepeatSignScenarios.js'
import addMeasureRestScenarios from '#unilang/language/parser/scenarios/addMeasureRestScenarios.js'
import addMeasureSimileScenarios from '#unilang/language/parser/scenarios/addMeasureSimileScenarios.js'
import addMeasureFermataScenarios from '#unilang/language/parser/scenarios/addMeasureFermataScenarios.js'
import addNewLineScenarios from '#unilang/language/parser/scenarios/addNewLineScenarios.js'
import addCrossStaveConnectionsScenarios from '#unilang/language/parser/scenarios/addCrossStaveConnectionsScenarios.js'
import addInstrumentTitlesScenarios from '#unilang/language/parser/scenarios/addInstrumentTitlesScenarios.js'
import addKeySignatureScenarios from '#unilang/language/parser/scenarios/addKeySignatureScenarios.js'
import addTimeSignatureScenarios from '#unilang/language/parser/scenarios/addTimeSignatureScenarios.js'
import addRepetitionNoteScenarios from '#unilang/language/parser/scenarios/addRepetitionNoteScenarios.js'
import addCodaScenarios from '#unilang/language/parser/scenarios/addCodaScenarios.js'
import addSignScenarios from '#unilang/language/parser/scenarios/addSignScenarios.js'
import addTempoMarkScenario from '#unilang/language/parser/scenarios/addTempoMarkScenario.js'
import addStaveSetupScenarios from '#unilang/language/parser/scenarios/addStaveSetupScenarios.js'
import addClefScenarios from '#unilang/language/parser/scenarios/addClefScenarios.js'
import addVoiceSetupScenarios from '#unilang/language/parser/scenarios/addVoiceSetupScenarios.js'
import addNoteSetupScenarios from '#unilang/language/parser/scenarios/addNoteSetupScenarios.js'
import addChordSetupScenarios from '#unilang/language/parser/scenarios/addChordSetupScenarios.js'
import addSlurScenarios from '#unilang/language/parser/scenarios/addSlurScenarios.js'
import addGlissandoScenarios from '#unilang/language/parser/scenarios/addGlissandoScenarios.js'
import addTupletScenarios from '#unilang/language/parser/scenarios/addTupletScenarios.js'
import addOctaveSignScenarios from '#unilang/language/parser/scenarios/addOctaveSignScenarios.js'
import addCrescendoAndDiminuendoScenarios from '#unilang/language/parser/scenarios/addCrescendoAndDiminuendoScenarios.js'
import addRepeatSimileScenarios from '#unilang/language/parser/scenarios/addRepeatSimileScenarios.js'
import addVoltaScenarios from '#unilang/language/parser/scenarios/addVoltaScenarios.js'
import addPunctuationScenario from '#unilang/language/parser/scenarios/addPunctuationScenario.js'
import addGeneralEmptyLineScenario from '#unilang/language/parser/scenarios/addGeneralEmptyLineScenario.js'

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
