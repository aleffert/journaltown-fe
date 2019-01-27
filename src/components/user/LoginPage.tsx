import React from 'react';
import { connect } from 'react-redux';
import { AppState, actions } from '../../store';
import { pick, bindDispatch } from '../../utils';
import { LoginForm } from './LoginForm';

const mapStateToProps = (state: AppState) => pick(state, ['user']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user']));

type LoginPageStateProps = ReturnType<typeof mapStateToProps>;
type LoginPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type LoginPageProps = LoginPageStateProps & LoginPageDispatchProps;
export class _LoginPage extends React.Component<LoginPageProps> {

    constructor(props: LoginPageProps) {
        super(props);
        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }
        
    onSubmitLogin(email: string) {
        this.props.actions.user.submitLogin({email});
    }

    render() {
        return <LoginForm onSubmit={this.onSubmitLogin} status={this.props.user.loginResult}/>
    }
}

export const LoginPage = connect(mapStateToProps, mapDispatchToProps)(_LoginPage);