import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import { HashRouter } from 'react-router-dom'
import { useConfig } from '@dhis2/app-runtime'

const MyApp = () => {
    const { baseUrl } = useConfig()

    return (
        // <AppWrapper baseUrl={baseUrl} dataStoreKey='dataStore/semis/values'>
        //     <HashRouter>
                <Router />
        //     </HashRouter>
        // </AppWrapper>
    )
}

export default MyApp
