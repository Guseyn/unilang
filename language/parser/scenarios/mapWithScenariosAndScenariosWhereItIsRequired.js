'use strict'

module.exports = (parserScenarios) => {
  const resultMap = {
    common: []
  }
  for (const scenarioName in parserScenarios) {
    const scenario = parserScenarios[scenarioName]
    if (scenario.requiredCommandProgression) {
      if (!resultMap[scenario.requiredCommandProgression]) {
        resultMap[scenario.requiredCommandProgression] = [ ]
      }
      resultMap[scenario.requiredCommandProgression].push(scenarioName)
    } else {
      resultMap.common.push(scenarioName)
    }
  }
  return resultMap
}
