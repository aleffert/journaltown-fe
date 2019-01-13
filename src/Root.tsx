import React from 'react';

import { LoginForm } from './user/LoginForm';
import { InitialLoader } from './user/InitialLoader';
import { Services, withServices, ApiErrors } from './services';
import { loginRequest, currentUserRequest, exchangeTokenRequest } from './services/api/requests';
import { isString, bindDispatch } from './utils';
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

type RootProps = {services: Services} & RouteComponentProps & RootStateProps & RootDispatchProps;

class _Root extends React.Component<RootProps> {
    
    constructor(props: RootProps) {
        super(props);

        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    async componentDidMount() {
        const query = qs.parse(this.props.location.search);
        if(query.token && isString(query.token)) {
            this.props.setValidating(true);
            const result = await this.props.services.api.request(exchangeTokenRequest({token: query.token}));
            if(result.type === "success") {
                this.props.services.storage.setToken(result.value.token);
            }
            this.props.setValidating(false);

            // TODO: remove token from url
        }

        const token = this.props.services.storage.getToken();
        if(token) {
            this.props.setCurrent({type: 'loading'});
            const result = await this.props.services.api.request(currentUserRequest());
            this.props.setCurrent(result);
        }
        else {
            this.props.setCurrent({type: 'failure', error: ApiErrors.noTokenError});
        }
    }
    
    async onSubmitLogin(email: string) {
        this.props.setLoginState({type: 'loading'});
        const result = await this.props.services.api.request(loginRequest({email: email}));
        this.props.setLoginState(result);
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


export const Root = connect(mapStateToProps, mapDispatchToProps)(withRouter(withServices(_Root)));