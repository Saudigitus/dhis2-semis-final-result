import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import { HashRouter } from 'react-router-dom'

const MyApp = () => {

    return (
        <AppWrapper dataStoreKey='dataStore/semis/values'>
            <HashRouter>
                <Router />
            </HashRouter>
        </AppWrapper>
    )
}

export default MyApp
