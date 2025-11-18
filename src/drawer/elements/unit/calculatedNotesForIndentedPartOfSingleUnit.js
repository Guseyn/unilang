'use strict'

export default function (sortedNotes, stemDirection) {
  const notesForIndentedPartOfUnit = []
  let lastWholeToneIsMet = false
  if (stemDirection === 'up') {
    const lastNoteIndex = sortedNotes.length - 1
    for (let i = lastNoteIndex; i >= 0; i--) {
      if (sortedNotes[i - 1] !== undefined) {
        if (sortedNotes[i].positionNumber - sortedNotes[i - 1].positionNumber === 0.5 && sortedNotes[i].stave === sortedNotes[i - 1].stave) {
          if (!lastWholeToneIsMet) {
            sortedNotes[i - 1].indented = true
            notesForIndentedPartOfUnit.push(sortedNotes[i - 1])
          } else {
            sortedNotes[i - 1].indented = false
          }
          lastWholeToneIsMet = !lastWholeToneIsMet
        } else {
          lastWholeToneIsMet = false
          sortedNotes[i - 1].indented = false
        }
      }
    }
    for (let i = 0; i < sortedNotes.length; i++) {
      if (sortedNotes[i].indented) {
        sortedNotes[i].isOnTheRightSideOfUnit = true
        sortedNotes[i].isOnTheLeftSideOfUnit = false
      } else {
        sortedNotes[i].isOnTheRightSideOfUnit = false
        sortedNotes[i].isOnTheLeftSideOfUnit = true
      }
    }
  } else {
    for (let i = 0; i < sortedNotes.length; i++) {
      if (sortedNotes[i + 1] !== undefined) {
        if (sortedNotes[i + 1].positionNumber - sortedNotes[i].positionNumber === 0.5 && sortedNotes[i + 1].stave === sortedNotes[i].stave) {
          if (!lastWholeToneIsMet) {
            sortedNotes[i + 1].indented = true
            notesForIndentedPartOfUnit.push(sortedNotes[i + 1])
          } else {
            sortedNotes[i + 1].indented = false
          }
          lastWholeToneIsMet = !lastWholeToneIsMet
        } else {
          lastWholeToneIsMet = false
          sortedNotes[i + 1].indented = false
        }
      }
    }
    for (let i = 0; i < sortedNotes.length; i++) {
      if (notesForIndentedPartOfUnit.length === 0) {
        sortedNotes[i].isOnTheRightSideOfUnit = false
        sortedNotes[i].isOnTheLeftSideOfUnit = true
      } else {
        if (sortedNotes[i].indented) {
          sortedNotes[i].isOnTheRightSideOfUnit = false
          sortedNotes[i].isOnTheLeftSideOfUnit = true
        } else {
          sortedNotes[i].isOnTheRightSideOfUnit = true
          sortedNotes[i].isOnTheLeftSideOfUnit = false
        }
      }
    }
  }
  return notesForIndentedPartOfUnit
}
