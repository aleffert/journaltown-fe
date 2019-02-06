import React from 'react';

import { Post } from "../../services/api/models";
import { renderNavigationPath, NavigationPath } from '../../store/navigation';
import strings from '../../strings';
import { L } from '../localization/L';
import { Icon, List, SemanticICONS } from "semantic-ui-react";
import { LocalizedString } from '../../utils';
import { Link } from 'react-router-dom';

type PostActionsProps = {
    post: Post,
    canEdit: boolean,
    onDelete: () => void
}

type PostAction =
    ({link: NavigationPath, type: 'link'} | {callback: () => void, type: 'callback'}) &
    {text: LocalizedString, icon: SemanticICONS, key: string}

export const PostActions = (props: PostActionsProps) => {
    let actions: PostAction[] = [{
        type: 'link',
        link: {
            type: 'view-post',
            id: props.post.id,
            username: props.post.author.username
        },
        text: strings.post.actions.link,
        icon: 'linkify',
        key: 'link'
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
            key: 'edit',
            icon: 'edit'
        });
        actions.push({
            type: 'callback',
            callback: props.onDelete,
            text: strings.post.actions.delete,
            key: 'delete',
            icon: 'delete'
        });
    }
    return (
        <List horizontal relaxed>{actions.map(action => {
            const Wrapper = (props: {children: JSX.Element[]}) => {
                switch(action.type) {
                    case 'link':
                        return <Link id={`action-${action.key}`} to={renderNavigationPath(action.link)}>{props.children}</Link>
                    case 'callback':
                        return <a id={`action-${action.key}`} onClick={action.callback}>{props.children}</a>
                }
            } 
            return <List.Item key={action.icon}>
                <Wrapper>
                    <Icon name={action.icon}></Icon>
                    <L>{action.text}</L>
                </Wrapper>
            </List.Item>
        })}</List>
    );
};