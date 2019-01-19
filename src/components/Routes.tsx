import React from 'react';

import { Switch, Route, Redirect } from 'react-router';
import { ComposePage } from './posts/ComposePage';
import { FeedPage } from './posts/FeedPage';


export const Routes = (_: {}) => (
    <Switch>
        <Route exact path="/posts/new" component={ComposePage}/>
        <Route exact path="/posts" component={FeedPage}/>
        <Redirect exact from="/" to="/posts"> </Redirect>
    </Switch>
);