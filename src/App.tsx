import 'semantic-ui-css/semantic.min.css'

import React, { Component } from 'react';
import './App.css';
import { LocaleContext } from './utils';
import { LoginForm } from './login/LoginForm';
import { Services } from './services';
import { loginRequest, LoginResponse, LoginError } from './services/api-service';
import { AsyncResult, Optional } from './utils/';


type AppProps = {};

type AppState = {loginResult: Optional<AsyncResult<LoginResponse, LoginError>>};

class App extends Component<AppProps, AppState> {

  services = new Services();

  constructor(props: AppProps) {
    super(props);

    this.state = {loginResult: undefined};
    this.onSubmitLogin = this.onSubmitLogin.bind(this);
  }

  async onSubmitLogin(email: string) {
    this.setState({loginResult: {type: 'loading'}});
    const result = await this.services.api.request(loginRequest({email: email}));
    this.setState({loginResult: result});
  }

  render() {
    return (
      <LocaleContext.Provider value="en">
        <LoginForm onSubmit={this.onSubmitLogin} status={this.state.loginResult}></LoginForm>
      </LocaleContext.Provider>
    );
  }
}

export default App;
