import React from 'react'
import { useProgramsKeys } from 'dhis2-semis-components'
import { RulesEngineWrapper } from 'dhis2-semis-functions'

function InitializeWrapper({ children }: { children: React.ReactNode }) {
  const programs = useProgramsKeys()
  return (
    <RulesEngineWrapper programs={[programs?.map((program) => program.id).join(',')]}>
      {children}
    </RulesEngineWrapper>
  )
}

export default InitializeWrapper