import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Feed, FeedProps } from './Feed';
import { connect } from 'react-redux';
import { AppState, actions } from '../../store';
import { bindDispatch, pick } from '../../utils';

const mapStateToProps = (state: AppState) => pick(state, ['feed', 'user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history', 'delete']));

export function _UserFeedPage(props: FeedProps & RouteComponentProps<{username: string}>) {
    // TODO: Make this a filter to followed by user, rather than posts by user
    const filters = {username: props.match.params.username};
    return <Feed {...props} filters={filters}/>
}

export const UserFeedPage = connect(mapStateToProps, mapDispatchToProps)(_UserFeedPage);