import React from 'react';

import { Switch, Route, Redirect } from 'react-router';
import { ComposePostPage } from './posts/ComposePostPage';
import { EditPostPage } from './posts/EditPostPage';
import { PostPage } from './posts/PostPage';
import { ProfilePage } from './user/ProfilePage';
import { EditProfilePage } from './user/EditProfilePage';
import { HomePage } from './user/HomePage';
import { renderNavigationPath } from '../store/navigation';
import { UserPostsPage } from './posts/UserPostsPage';
import { UserFeedPage } from './posts/UserFeedPage';

type RoutesProps = {
    username: string
};

export const Routes = (props: RoutesProps) => (
    <Switch>
        <Route exact path="/post" component={ComposePostPage}/>
        <Route exact path="/u/:username/" component={UserPostsPage}/>
        <Route exact path="/u/:username/feed" component={UserFeedPage}/>
        <Route exact path="/u/:username/p/:postId" component={PostPage}/>
        <Route exact path="/u/:username/p/:postId/edit" component={EditPostPage}/>
        <Route exact path="/u/:username/profile/" component={ProfilePage}/>
        <Route exact path="/u/:username/profile/edit" component={EditProfilePage}/>
        <Route exact path="/" component={HomePage}/>
        <Redirect exact from="/feed" to={renderNavigationPath({type: 'view-feed', username: props.username})}/>
    </Switch>
);