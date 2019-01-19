import React from 'react';

import { connect } from 'react-redux';
import EmailValidator from 'email-validator';
import { Button, Form, Grid, Header, InputOnChangeData, Message, Container } from 'semantic-ui-react';
import strings from '../../strings';
import { L, LC, withLanguage } from '../localization/L';
import { AsyncResult, Optional, Language, pick, resultIsLoading } from '../../utils';
import { LoginError, LoginResponse } from '../../services/api/requests';
import { FullScreen } from '../widgets/FullScreen';
import { Omit } from 'react-router';

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

    render() {
        const isLoading = resultIsLoading(this.props.status);
        const isSuccess = this.props.status && this.props.status.type === 'success';
        const isFailure = this.props.status && this.props.status.type === 'failure';
        const submitDisabled = isLoading || !EmailValidator.validate(this.state.email);

        return <div>
            <FullScreen>
                <Container text className='full-height'>
                <Grid className='full-height' verticalAlign='middle'>
                <Grid.Column>
                    <Header as='h2' textAlign='center'>
                        <L>{strings.login.prompt}</L>
                    </Header>
                    <Form size='large'>
                        <Form.Input id='email-field' fluid icon='user' iconPosition='left' 
                            placeholder={strings.login.email_placeholder[this.props.language]}
                            onChange={this.onEmailChange}
                            />
                        <Form.Button id='submit-button' primary loading={isLoading} disabled={submitDisabled} 
                            fluid size='large'
                            onClick={this.onLogin}
                        >
                            {<L>{strings.login.logIn}</L>}
                        </Form.Button>
                    </Form>
                    {isSuccess ? <Message positive><L>{strings.login.sendSuccess}</L></Message> : null}
                    {isFailure ? <Message error><L>{strings.login.sendFailure}</L></Message> : null}
                </Grid.Column>
                </Grid></Container>
            </FullScreen>
        </div>
    }
}

export const LoginForm = withLanguage<LoginFormProps, typeof _LoginForm>(_LoginForm);
