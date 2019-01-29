import React from 'react';

import EmailValidator from 'email-validator';
import { Form, Grid, Header, InputOnChangeData, Message, Container } from 'semantic-ui-react';
import strings from '../../strings';
import { L, withLanguage } from '../localization/L';
import { AsyncResult, Optional, Language, LocalizedString, isSuccess, isFailure, isLoading } from '../../utils';
import { LoginError, LoginResponse, RegisterError } from '../../services/api/requests';
import { FullScreen } from '../widgets/FullScreen';
import { Link } from 'react-router-dom';

type LoginFormProps = {
    status: Optional<AsyncResult<LoginResponse, LoginError>>,
    onSubmit(email: string): void,
    language: Language
};

type LoginFormState = {
    email: string
}

export class _LoginForm extends React.Component<LoginFormProps, LoginFormState> {

    constructor(props: LoginFormProps) {
        super(props);

        this.state = {email: ""};

        this.onLogin = this.onLogin.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
    }

    onLogin() {
        this.props.onSubmit(this.state.email);
    }

    onEmailChange(e: any, d: InputOnChangeData) {
        this.setState({email: d.value});
    }

    errorMessage(error: RegisterError): LocalizedString {
        switch(error) {
            default:
            return strings.login.sendRegisterFailure;
        }
    }

    render() {
        const loading = isLoading(this.props.status);
        const submitDisabled = loading || !EmailValidator.validate(this.state.email);

        return <div>
            <FullScreen>
                <Container text className='full-height'>
                <Grid className='full-height' verticalAlign='middle'>
                <Grid.Column>
                    <Header as='h2' textAlign='center'>
                        <L>{strings.login.loginPrompt}</L>
                    </Header>
                    <Form size='large'>
                        <Form.Input id='email-field' fluid icon='user' iconPosition='left' 
                            placeholder={strings.login.email_placeholder[this.props.language]}
                            onChange={this.onEmailChange}
                            />
                        <Form.Button id='submit-button' primary loading={loading} disabled={submitDisabled} 
                            fluid size='large'
                            onClick={this.onLogin}
                        >
                            {<L>{strings.login.logIn}</L>}
                        </Form.Button>
                    </Form>
                    {isSuccess(this.props.status)
                        ? <Message positive><L>{strings.login.sendLoginSuccess}</L></Message> 
                        : null}
                    {isFailure(this.props.status)
                        ? <Message negative><L>{strings.login.sendLoginFailure}</L></Message> 
                        : null
                    }
                    <Grid.Row>
                        <L>{strings.login.noAccount}</L> <Link to="/register"><L>{strings.login.signUpPrompt}</L></Link>
                    </Grid.Row>
                </Grid.Column>
                </Grid></Container>
            </FullScreen>
        </div>
    }
}

export const LoginForm = withLanguage<LoginFormProps, typeof _LoginForm>(_LoginForm);
