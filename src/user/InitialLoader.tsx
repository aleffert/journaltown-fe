import React from 'react';
import { Loader } from 'semantic-ui-react';
import { FullScreen } from '../widgets/FullScreen';

export function InitialLoader(props: {}) {
    return <FullScreen>
        <Loader active size='huge'/>
    </FullScreen>

}