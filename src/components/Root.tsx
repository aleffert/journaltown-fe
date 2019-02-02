import React from 'react';

import * as qs from 'query-string';
import { connect } from 'react-redux';
import { omit } from 'lodash';

import { InitialLoader } from './user/InitialLoader';
import { bindDispatch, pick } from '../utils';
import { AppState, actions } from '../store';
import { isString } from 'util';
import { Header } from './Header';
import { Routes } from './Routes';
import { Container } from 'semantic-ui-react';
import { Switch, Route } from 'react-router';
import { LoginPage } from './user/LoginPage';
import { RegisterPage } from './user/RegisterPage';


const mapStateToProps = (state: AppState) => pick(state, ['user', 'router']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user', 'navigation', 'history']));

type RootStateProps = ReturnType<typeof mapStateToProps>;
type RootDispatchProps = ReturnType<typeof mapDispatchToProps>;
type RootProps = RootStateProps & RootDispatchProps;

export class _Root extends React.Component<RootProps> {
    
    constructor(props: RootProps) {
        super(props);

        this.onLogout = this.onLogout.bind(this);
        this.onPost = this.onPost.bind(this);
        this.onProfile = this.onProfile.bind(this);
    }

    componentDidMount() {
        const query = qs.parse(this.props.router.location.search);
        this.props.actions.user.loadIfPossible({token: isString(query.token) ? query.token : undefined});

        const newQuery = qs.stringify(omit(query, 'token'));
        this.props.actions.history.replace(Object.assign(this.props.router.location, {search: newQuery}));
    }


    onLogout() {
        this.props.actions.user.logout();
    }

    onPost() {
        this.props.actions.navigation.to({type: 'new-post'});
    }

    onProfile(username: string) {
        this.props.actions.navigation.to({type: 'view-profile', username})
    }
    
    render() {
        // TODO: If there's a token, but loading user fails, give an opportunity to log out
        // TODO: Allow non-authed pages
        return this.props.user.currentUserResult && this.props.user.currentUserResult.type !== "loading"
        ? (
            this.props.user.currentUserResult.type === "success"
            ? (
                <>
                    <Header
                        user={this.props.user.currentUserResult.value}
                        onPost={this.onPost}
                        onProfile={this.onProfile}
                        onLogout={this.onLogout}>
                    </Header>
                    <Container text className='page-body'>
                        <Routes/>
                    </Container>
                </>
            )
            : <Switch>
                <Route path='/register' component={RegisterPage}/>
                <Route path='/*' component={LoginPage}/>
            </Switch>
        ) : <InitialLoader/>
    }
    
}


export const Root = connect(mapStateToProps, mapDispatchToProps)(_Root);