const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');

// Transpile the TS helper to CommonJS, as Vite would bundle it.
function loadTs(file) {
    const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    const compiled = new Module(file);
    compiled.filename = file;
    compiled._compile(js, file);
    return compiled.exports;
}

const { newUid, refusedEnrollments } = loadTs(path.join(__dirname, '../src/utils/promote/promotionReport.ts'));

const sent = [{ trackedEntity: 'teiA', enrollment: 'enrA' }, { trackedEntity: 'teiB', enrollment: 'enrB' }];

test('the new enrollment id is a DHIS2 uid (SEMIS-225)', () => {
    for (let i = 0; i < 200; i++) assert.match(newUid(), /^[a-zA-Z][a-zA-Z0-9]{10}$/);
});

test('a refused enrollment is reported with the server reason, the saved one is not (SEMIS-225)', () => {
    const report = { status: 'OK', validationReport: { errorReports: [
        { trackerType: 'ENROLLMENT', uid: 'enrA', errorCode: 'E1020', message: 'Enrollment date: `2027-01-10` cannot be a future date' },
    ] } };
    assert.deepEqual(refusedEnrollments(report, sent), { teiA: 'Enrollment date: `2027-01-10` cannot be a future date' });
});

test('a refusal of the learner itself leaves the enrollment unsaved (SEMIS-225)', () => {
    const report = { validationReport: { errorReports: [{ trackerType: 'TRACKED_ENTITY', uid: 'teiB', message: 'No access' }] } };
    assert.deepEqual(refusedEnrollments(report, sent), { teiB: 'No access' });
});

test('errors of other objects (events) do not count as a refused enrollment (SEMIS-225)', () => {
    const report = { validationReport: { errorReports: [{ trackerType: 'EVENT', uid: 'ev1', message: 'Event error' }] } };
    assert.deepEqual(refusedEnrollments(report, sent), {});
});

test('the report of a failed request (error details) is read too; no report, nothing refused here (SEMIS-225)', () => {
    const details = { response: { validationReport: { errorReports: [{ trackerType: 'ENROLLMENT', uid: 'enrB', message: 'E1021' }] } } };
    assert.deepEqual(refusedEnrollments(details, sent), { teiB: 'E1021' });
    assert.deepEqual(refusedEnrollments(undefined, sent), {});
});
