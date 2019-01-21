import React from 'react';

import { Switch, Route, Redirect } from 'react-router';
import { ComposePostPage } from './posts/ComposePostPage';
import { EditPostPage } from './posts/EditPostPage';
import { FeedPage } from './posts/FeedPage';
import { PostPage } from './posts/PostPage';


export const Routes = (_: {}) => (
    <Switch>
        <Route exact path="/posts/new" component={ComposePostPage}/>
        <Route exact path="/posts" component={FeedPage}/>
        <Route exact path="/u/:authorId/posts/:postId" component={PostPage}/>
        <Route exact path="/u/:authorId/posts/:postId/edit" component={EditPostPage}/>
        <Redirect exact from="/" to="/posts"> </Redirect>
    </Switch>
);