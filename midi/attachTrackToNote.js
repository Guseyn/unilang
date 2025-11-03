'use strict'

import instrumentForCurrentStaveInMidiFormat from './instrumentForCurrentStaveInMidiFormat.js'
import instrumentTitleInMidiFormatByInstrumentOriginalName from './instrumentTitleInMidiFormatByInstrumentOriginalName.js'
import isChannelOccupied from './isChannelOccupied.js'
import noteHasSomeArticulations from './noteHasSomeArticulations.js'

const PIZZICATO_ARTICULATIONS = [ 'leftHandPizzicato', 'snapPizzicato', 'naturalHarmonic' ]

const instrumentCanBeReassigned = (note) => {
  return !noteHasSomeArticulations(note, PIZZICATO_ARTICULATIONS) && !note.isGhost
}

export default function (midi, note, midiSettings, instrumentTitleParamsForCurrentMeasure, tracksForEachInstrumentOnEachStaveInEachVoice, instrumentsMappedWithChannels, currentInstrumentsForEachStaveOnEachVoice) {
  const staveVoiceKey = `${note.staveIndexConsideringStavePosition}-${note.voiceIndex}`
  const defaultInstrumentInMidiFormat = 0
  const instrumentMidiNumberByParams = instrumentForCurrentStaveInMidiFormat(instrumentTitleParamsForCurrentMeasure, note)
  const instrumentMidiNumber = instrumentMidiNumberByParams ?? currentInstrumentsForEachStaveOnEachVoice[staveVoiceKey] ?? instrumentTitleInMidiFormatByInstrumentOriginalName[midiSettings.defaultInstrument] ?? defaultInstrumentInMidiFormat
  const instrumentStaveVoiceKey = `${instrumentMidiNumber}-${note.staveIndexConsideringStavePosition}-${note.voiceIndex}`
  if (instrumentCanBeReassigned(note) && (currentInstrumentsForEachStaveOnEachVoice[staveVoiceKey] === undefined && instrumentMidiNumber !== undefined)) {
    currentInstrumentsForEachStaveOnEachVoice[staveVoiceKey] = instrumentMidiNumber
  }
  if (!tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey]) {
    tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey] = midi.addTrack()
    tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey].instrument.number = instrumentMidiNumber
    const trackInstrumentMidiNumber = tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey].instrument.number
    tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey].name = `track-${instrumentStaveVoiceKey}`
    const trackChannelNumber = instrumentsMappedWithChannels[trackInstrumentMidiNumber]
    if (trackChannelNumber !== undefined) {
      tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey].channel = trackChannelNumber 
    } else {
      for (let channelIndex = 0; channelIndex < 16; channelIndex++) {
        if ((channelIndex === 9) || (channelIndex === 10)) {
          continue
        }
        if (!isChannelOccupied(instrumentsMappedWithChannels, channelIndex)) {
          instrumentsMappedWithChannels[trackInstrumentMidiNumber] = channelIndex
          tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey].channel = channelIndex
          break
        }
      }
    }
    note.track = tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey]
  } else {
    note.track = tracksForEachInstrumentOnEachStaveInEachVoice[instrumentStaveVoiceKey]
  }
}
