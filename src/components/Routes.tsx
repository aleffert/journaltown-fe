import React from 'react';

import { Switch, Route, Redirect } from 'react-router';
import { ComposePostPage } from './posts/ComposePostPage';
import { EditPostPage } from './posts/EditPostPage';
import { FeedPage } from './posts/FeedPage';
import { PostPage } from './posts/PostPage';
import { ProfilePage } from './user/ProfilePage';
import { EditProfilePage } from './user/EditProfilePage';


export const Routes = (_: {}) => (
    <Switch>
        <Route exact path="/posts/new" component={ComposePostPage}/>
        <Route exact path="/posts" component={FeedPage}/>
        <Route exact path="/u/:username/posts/:postId" component={PostPage}/>
        <Route exact path="/u/:username/profile/" component={ProfilePage}/>
        <Route exact path="/u/:username/profile/edit" component={EditProfilePage}/>
        <Route exact path="/u/:username/posts/:postId/edit" component={EditPostPage}/>
        <Redirect exact from="/" to="/posts"> </Redirect>
    </Switch>
);