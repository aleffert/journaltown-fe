import React from 'react';

import { Switch, Route } from 'react-router';
import { ComposePage } from './posts/compose/ComposePage';


export const Routes = (_: {}) => (
    <Switch>
        <Route exact path="/posts/new" component={ComposePage}/>
    </Switch>
);