import React from 'react';

import { Switch, Route, Redirect } from 'react-router';
import { ComposePostPage } from './posts/ComposePostPage';
import { CreateGroupPage } from './user/CreateGroupPage';
import { EditGroupPage } from './user/EditGroupPage';
import { EditPostPage } from './posts/EditPostPage';
import { EditProfilePage } from './user/EditProfilePage';
import { HomePage } from './user/HomePage';
import { PostPage } from './posts/PostPage';
import { ProfilePage } from './user/ProfilePage';
import { UserPostsPage } from './posts/UserPostsPage';
import { UserFeedPage } from './posts/UserFeedPage';
import { renderNavigationTemplate } from '../store/navigation';

const r = renderNavigationTemplate;

type RoutesProps = {
    username: string
};

export const Routes = (props: RoutesProps) => (
    <Switch>
        <Route exact path={r({type: "post"})} component={ComposePostPage}/>
        <Route exact path={r({type: "view-posts", username: ":username"})} component={UserPostsPage}/>
        <Route exact path={r({type: "view-feed", username: ":username"})} component={UserFeedPage}/>
        <Route exact path={r({type: "view-post", username: ":username", id: ":postId"})} component={PostPage}/>
        <Route exact path={r({type: "edit-post", username: ":username", id: ":postId"})} component={EditPostPage}/>
        <Route exact path={r({type: "create-group", username: ":username"})} component={CreateGroupPage}/>
        <Route exact path={r({type: "edit-group", username: ":username", id: ":id"})} component={EditGroupPage}/>
        <Route exact path={r({type: "view-profile", username: ":username"})} component={ProfilePage}/>
        <Route exact path={r({type: "edit-profile", username: ":username"})} component={EditProfilePage}/>
        <Route exact path={r({type: "main"})} component={HomePage}/>
        <Redirect exact from={r({type: "feed"})} to={r({type: 'view-feed', username: props.username})}/>
    </Switch>
);