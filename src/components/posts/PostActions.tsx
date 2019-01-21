import React from 'react';

import { Post } from "../../services/api/models";
import { renderNavigationAction, NavigationPath } from '../../store/navigation';
import strings from '../../strings';
import { L } from '../localization/L';
import { Icon, List, SemanticICONS } from "semantic-ui-react";
import { LocalizedString } from '../../utils';

type PostActionsProps = {
    post: Post,
    canEdit: boolean
}
export const PostActions = (props: PostActionsProps) => {
    let actions: [{action: NavigationPath, text: LocalizedString, icon: SemanticICONS}] = [{
        action: {
            type: 'view-post',
            id: props.post.id,
            username: props.post.author.username
        },
        text: strings.post.actions.link,
        icon: "linkify"
    }];
    if(props.canEdit) {
        actions.push({
            action: {
                'type': 'edit-post',
                id: props.post.id,
                username: props.post.author.username
            },
            text: strings.post.actions.edit,
            icon: "edit"
        })
    }
    return (
        <List horizontal relaxed>{actions.map(action => <List.Item key={action.icon}><a href={renderNavigationAction(action.action).pathname}>
            <Icon name={action.icon}></Icon><L>{action.text}</L></a></List.Item>)
        }</List>
    );
};