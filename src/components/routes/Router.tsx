import React from 'react';
import { FinalResult } from '../../pages';
import { Routes, Route } from 'react-router-dom';
import WithHeaderBarLayout from '../../layout/WithHeaderBarLayout';

export default function Router() {
    return (
        <Routes>
            <Route path='/'
                element={<WithHeaderBarLayout />}
            >
                <Route key={'final-result'} path={'/'} element={<FinalResult />} />
            </Route>
        </Routes>
    );
}
