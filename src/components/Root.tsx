import React from 'react';

import _ from 'lodash';
import * as qs from 'query-string';
import { connect } from 'react-redux';

import { LoginForm } from './user/LoginForm';
import { InitialLoader } from './user/InitialLoader';
import { bindDispatch, pick } from '../utils';
import { AppState, actions } from '../store';
import { isString } from 'util';
import { Header } from './Header';
import { Routes } from './Routes';
import { Container } from 'semantic-ui-react';


const mapStateToProps = (state: AppState) => pick(state, ['user', 'router']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user', 'navigation', 'history']));

type RootStateProps = ReturnType<typeof mapStateToProps>;
type RootDispatchProps = ReturnType<typeof mapDispatchToProps>;
type RootProps = RootStateProps & RootDispatchProps;

export class _Root extends React.Component<RootProps> {
    
    constructor(props: RootProps) {
        super(props);

        this.onSubmitLogin = this.onSubmitLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onPost = this.onPost.bind(this);
    }

    componentDidMount() {
        const query = qs.parse(this.props.router.location.search);
        this.props.actions.user.loadIfPossible({token: isString(query.token) ? query.token : undefined});

        const newQuery = qs.stringify(_.omit(query, 'token'));
        this.props.actions.history.replace(Object.assign(this.props.router.location, {search: newQuery}));
    }
    
    onSubmitLogin(email: string) {
        this.props.actions.user.submitLogin({email});
    }

    onLogout() {
        this.props.actions.user.logout();
    }

    onPost() {
        this.props.actions.navigation.toNewPost();
    }
    
    render() {
        // TODO: If there's a token, but loading user fails, give an opportunity to log out
        return this.props.user.current && this.props.user.current.type !== "loading"
        ? (
            this.props.user.current.type === "success"
            ? (
                <>
                    <Header
                        user={this.props.user.current.value}
                        onPost={this.onPost}
                        onLogout={this.onLogout}>
                    </Header>
                    <Container className='page-body'>
                        <Routes/>
                    </Container>
                </>
            )
            : <LoginForm onSubmit={this.onSubmitLogin} status={this.props.user.login}/>
        ) : <InitialLoader/>
    }
    
}


export const Root = connect(mapStateToProps, mapDispatchToProps)(_Root);