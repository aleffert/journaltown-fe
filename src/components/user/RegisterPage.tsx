import React from 'react';
import { connect } from 'react-redux';
import { AppState, actions } from '../../store';
import { pick, bindDispatch, isString } from '../../utils';
import { RegisterForm } from './RegisterForm';
import { CreateAccountForm } from './CreateAccountForm';
import * as qs from 'query-string';

const mapStateToProps = (state: AppState) => pick(state, ['user', 'router', 'createAccount']);
const mapDispatchToProps = bindDispatch(pick(actions, ['user', 'createAccount']));

type RegisterPageStateProps = ReturnType<typeof mapStateToProps>;
type RegisterPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
type RegisterPageProps = RegisterPageStateProps & RegisterPageDispatchProps;
export class _RegisterPage extends React.Component<RegisterPageProps> {

    constructor(props: RegisterPageProps) {
        super(props);
        this.onSubmitRegister = this.onSubmitRegister.bind(this);
    }
        
    onSubmitRegister(email: string) {
        this.props.actions.user.submitRegister({email});
    }

    onSubmitCreateAccount(username: string, token: string) {
        this.props.actions.createAccount.submitCreateAccount({username, token});
    }

    render() {
        const params = qs.parse(this.props.router.location.search);
        const token = params.reg_token;
        if(isString(token)) {
            return <CreateAccountForm 
                onSubmit={(username => this.onSubmitCreateAccount(username, token))}
                actions={pick(this.props.actions, ['createAccount'])}
                createAccount={this.props.createAccount}
                />
        }
        else {
            return <RegisterForm onSubmit={this.onSubmitRegister} status={this.props.user.registerResult}/>
        }
    }
}

export const RegisterPage = connect(mapStateToProps, mapDispatchToProps)(_RegisterPage);