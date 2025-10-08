import { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

interface OrgUnit {
    id: string;
    displayName: string;
    path: string;
}

interface OrgUnitsResponse {
    orgUnits: {
        organisationUnits: OrgUnit[];
    };
}

const ORG_UNITS_QUERY = {
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,displayName,path',
            userDataViewFallback: true,
            paging: false
        }
    }
};

export const useAccessibleOrgUnits = () => {
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const { loading, data, refetch } = useDataQuery<OrgUnitsResponse>(ORG_UNITS_QUERY, {
        onError: (err) => setError(err)
    });

    useEffect(() => {
        if (data?.orgUnits?.organisationUnits) {
            setOrgUnits(data.orgUnits.organisationUnits);
        }
    }, [data]);

    const retry = () => {
        setError(null);
        refetch();
    };

    return {
        orgUnits,
        loading,
        error,
        retry,
        hasOrgUnits: orgUnits.length > 0
    };
};
