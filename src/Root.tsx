import React from 'react';

import _ from 'lodash';
import * as qs from 'query-string';
import { connect } from 'react-redux';

import { LoginForm } from './user/LoginForm';
import { InitialLoader } from './user/InitialLoader';
import { bindDispatch, historyActions } from './utils';
import { AppState, actions } from './store';
import strings from './strings';
import { L } from './localization/L';
import { isString } from 'util';


const mapStateToProps = (state: AppState) => ({user: state.user, router: state.router});
const mapDispatchToProps = historyActions(bindDispatch(actions.user));

type RootStateProps = ReturnType<typeof mapStateToProps>;
type RootDispatchProps = ReturnType<typeof mapDispatchToProps>;
type RootProps = RootStateProps & RootDispatchProps;

export class _Root extends React.Component<RootProps> {
    
    constructor(props: RootProps) {
        super(props);

        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    componentDidMount() {
        const query = qs.parse(this.props.router.location.search);
        this.props.actions.loadUserIfPossible({token: isString(query.token) ? query.token : undefined});

        const newQuery = qs.stringify(_.omit(query, 'token'));
        this.props.history.replace(Object.assign(this.props.router.location, {search: newQuery}));
    }
    
    onSubmitLogin(email: string) {
        this.props.actions.submitLogin({email});
    }
    
    render() {
        // TODO: If there's a token, but loading user fails, give an opportunity to log out
        return this.props.user.current && this.props.user.current.type !== "loading"
        ? (
            this.props.user.current.type === "success" ? <L>{strings.login.loggedInMessage}</L>
            : <LoginForm onSubmit={this.onSubmitLogin} status={this.props.user.login}/>
        ) : <InitialLoader/>
    }
    
}


export const Root = connect(mapStateToProps, mapDispatchToProps)(_Root as any);