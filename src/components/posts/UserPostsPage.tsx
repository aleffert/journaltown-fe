import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Feed, FeedProps } from './Feed';
import { connect } from 'react-redux';
import { AppState, actions } from '../../store';
import { bindDispatch, pick, Omit } from '../../utils';

const mapStateToProps = (state: AppState) => pick(state, ['feed', 'user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['feed', 'history', 'delete']));

export function _UserPostsPage(props: Omit<FeedProps, 'filters'> & RouteComponentProps<{username: string}>) {
    const filters = {username: props.match.params.username};
    return <Feed {...props} filters={filters}/>
}

export const UserPostsPage = connect(mapStateToProps, mapDispatchToProps)(_UserPostsPage);