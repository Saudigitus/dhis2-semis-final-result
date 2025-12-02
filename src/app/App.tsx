import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import { useConfig } from '@dhis2/app-runtime'
import { HashRouter } from 'react-router-dom'
import { D2I18n } from 'dhis2-semis-types'
import translator from '../locales/index';

const MyApp = ({ i18n }: { i18n: D2I18n }) => {
    const { baseUrl } = useConfig()
    const translation: any = i18n ? i18n : translator

    return (
        <AppWrapper
            baseUrl={baseUrl}
            dataStoreKey="dataStore/semis/values"
            schoolCalendarKey='dataStore/semis/schoolCalendar'
        >
            <HashRouter>
                <Router i18n={i18n as unknown as any} />
            </HashRouter >
        </AppWrapper>
    )
}

export default MyApp
