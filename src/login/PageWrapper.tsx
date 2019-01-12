import React from 'react';

import { LoginForm } from './LoginForm';
import { InitialLoader } from './InitialLoader';
import { Services, withServices, NoTokenError } from '../services';
import { loginRequest, LoginResponse, LoginError, CurrentUserResponse, currentUserRequest, exchangeTokenRequest } from '../services/api/requests';
import { AsyncResult, isString } from '../utils/';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as qs from 'query-string';

type PageWrapperProps = {services: Services} & RouteComponentProps;
type PageWrapperState = {
    user: AsyncResult<CurrentUserResponse, {}>
    loginResult: AsyncResult<LoginResponse, LoginError | NoTokenError>
    validating: boolean
};

class _PageWrapper extends React.Component<PageWrapperProps, PageWrapperState, {}> {
    
    constructor(props: PageWrapperProps) {
        super(props);

        this.state = {
            validating: false,
            user: undefined,
            loginResult: undefined
        };

        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    async componentDidMount() {
        const query = qs.parse(this.props.location.search);
        if(query.token && isString(query.token)) {
            this.setState({validating: true});
            const result = await this.props.services.api.request(exchangeTokenRequest({token: query.token}));
            if(result.type === "success") {
                this.props.services.storage.setToken(result.value.token);
            }

            this.setState({validating: false});
            // TODO: remove token from url
        }

        const token = this.props.services.storage.getToken();
        if(token) {
            this.setState({user: {type: 'loading'}});
            const result = await this.props.services.api.request(currentUserRequest());
            this.setState({user: result});
        }
        else {
            this.setState({user: {type: 'failure', error: 'no-token'}})
        }
    }
    
    async onSubmitLogin(email: string) {
        this.setState({loginResult: {type: 'loading'}});
        const result = await this.props.services.api.request(loginRequest({email: email}));
        this.setState({loginResult: result});
    }
    
    render() {
        // TODO: If there's a token, but loading user fails, give an opportunity to log out
        return this.state.user && this.state.user.type !== "loading"
        ? (
            this.state.user.type === "success" ? "Logged In"
            : <LoginForm onSubmit={this.onSubmitLogin} status={this.state.loginResult}></LoginForm>
        ) : <InitialLoader/>
    }
    
}

export const PageWrapper = withRouter(withServices(_PageWrapper));