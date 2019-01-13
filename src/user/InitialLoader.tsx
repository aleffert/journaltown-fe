import React from 'react';
import { Loader } from 'semantic-ui-react';

export function InitialLoader(props: {}) {
    return <div>
        <style>{`
        body > div,
        `}</style>
        <Loader active size='huge'/>

    </div>

}