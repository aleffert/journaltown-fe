import React from 'react';

import { Post } from "../../services/api/models";
import { renderNavigationAction, NavigationPath } from '../../store/navigation';
import strings from '../../strings';
import { L } from '../localization/L';
import { Icon, List, SemanticICONS } from "semantic-ui-react";
import { LocalizedString } from '../../utils';

type PostActionsProps = {
    post: Post,
    canEdit: boolean,
    onDelete: () => void
}

type PostAction =
    ({link: NavigationPath, type: 'link'} | {callback: () => void, type: 'callback'}) &
    {text: LocalizedString, icon: SemanticICONS}

export const PostActions = (props: PostActionsProps) => {
    let actions: PostAction[] = [{
        type: 'link',
        link: {
            type: 'view-post',
            id: props.post.id,
            username: props.post.author.username
        },
        text: strings.post.actions.link,
        icon: "linkify"
    }];
    if(props.canEdit) {
        actions.push({
            type: 'link',
            link: {
                type: 'edit-post',
                id: props.post.id,
                username: props.post.author.username
            },
            text: strings.post.actions.edit,
            icon: "edit"
        });
        actions.push({
            type: 'callback',
            callback: props.onDelete,
            text: strings.post.actions.delete,
            icon: "delete"
        });
    }
    return (
        <List horizontal relaxed>{actions.map(action => {
            const aprops = action.type === 'link' ? {href: renderNavigationAction(action.link).pathname} : {onClick: action.callback};
            return <List.Item key={action.icon}>
                <a {...aprops}>
                    <Icon name={action.icon}></Icon>
                    <L>{action.text}</L>
                </a></List.Item>
        })}</List>
    );
};