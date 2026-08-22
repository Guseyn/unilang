'use strict'

export default {
  'whole': 'whole',
  'half': 'half',
  'quarter': 'quarter',
  'eighth': 'eighth',
  'sixteenth': 'sixteenth',
  'thirty\\s+second': 'thirtySecond',
  'sixty\\s+fourth': 'sixtyFourth',
  '1(?!\\d|/)': 'whole',
  '1/2(?!\\d|/)': 'half',
  '1/4(?!\\d|/)': 'quarter',
  '1/8(?!\\d|/)': 'eighth',
  '1/16(?!\\d|/)': 'sixteenth',
  '1/32(?!\\d|/)': 'thirtySecond',
  '1/64(?!\\d|/)': 'sixtyFourth'
}
