import React from 'react';

import { LoginForm } from './user/LoginForm';
import { InitialLoader } from './user/InitialLoader';
import { bindDispatch } from './utils';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as qs from 'query-string';
import { connect } from 'react-redux';
import { AppState, actions } from './store';


function mapStateToProps(state: AppState) {
    return state.user;
}

const mapDispatchToProps = bindDispatch(actions.user);

type RootStateProps = ReturnType<typeof mapStateToProps>;
type RootDispatchProps = ReturnType<typeof mapDispatchToProps>;

type RootProps = RouteComponentProps & RootStateProps & RootDispatchProps;

class _Root extends React.Component<RootProps> {
    
    constructor(props: RootProps) {
        super(props);

        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    async componentDidMount() {
        const query = qs.parse(this.props.location.search);
        this.props.appStarted({query});
        // TODO: remove token from url
    }
    
    onSubmitLogin(email: string) {
        this.props.submitLogin({email});
    }
    
    render() {
        // TODO: If there's a token, but loading user fails, give an opportunity to log out
        return this.props.current && this.props.current.type !== "loading"
        ? (
            this.props.current.type === "success" ? "Logged In"
            : <LoginForm onSubmit={this.onSubmitLogin} status={this.props.login}></LoginForm>
        ) : <InitialLoader/>
    }
    
}


export const Root = connect(mapStateToProps, mapDispatchToProps)(withRouter(_Root));