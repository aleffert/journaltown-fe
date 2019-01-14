import React from 'react';

import _ from 'lodash';
import * as qs from 'query-string';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { LoginForm } from './user/LoginForm';
import { InitialLoader } from './user/InitialLoader';
import { bindDispatch } from './utils';
import { AppState, actions } from './store';
import strings from './strings';
import { L } from './localization/L';


function mapStateToProps(state: AppState) {
    return state.user;
}

const mapDispatchToProps = bindDispatch(actions.user);

type RootStateProps = ReturnType<typeof mapStateToProps>;
type RootDispatchProps = ReturnType<typeof mapDispatchToProps>;
type RootProps = RouteComponentProps & RootStateProps & RootDispatchProps;

export class _Root extends React.Component<RootProps> {
    
    constructor(props: RootProps) {
        super(props);

        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    componentDidMount() {
        const query = qs.parse(this.props.location.search);
        this.props.appStarted({query});

        const newQuery = qs.stringify(_.omit(query, 'token'));
        this.props.history.replace(Object.assign(this.props.location, {search: newQuery}));
    }
    
    onSubmitLogin(email: string) {
        this.props.submitLogin({email});
    }
    
    render() {
        // TODO: If there's a token, but loading user fails, give an opportunity to log out
        return this.props.current && this.props.current.type !== "loading"
        ? (
            this.props.current.type === "success" ? <L>{strings.login.loggedInMessage}</L>
            : <LoginForm onSubmit={this.onSubmitLogin} status={this.props.login}/>
        ) : <InitialLoader/>
    }
    
}


export const Root = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Root));