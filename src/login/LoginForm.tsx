import React from 'react';

import { Button, Form, Grid, Header, InputOnChangeData, Message } from 'semantic-ui-react';
import strings from '../strings';
import { L, LC } from '../widgets/L';
import { AsyncResult, Optional } from '../utils';
import { LoginError, LoginResponse } from '../services/api/requests';


type LoginFormProps = {
    status: Optional<AsyncResult<LoginResponse, LoginError>>,
    onSubmit(email: string): void
};

type LoginFormState = {
    email: string
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState> {

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
        const isLoading = (this.props.status && this.props.status.type === 'loading') || undefined;
        const isSuccess = this.props.status && this.props.status.type === 'success';
        const isFailure = this.props.status && this.props.status.type === 'failure';

        return <LC>{l => <div>
            <style>{`
            body > div, body > div > div {
                height: 100%;
            }
            `}</style>
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' textAlign='center'>
                {strings.login.prompt[l]}
            </Header>
            <Form size='large'>
                <Form.Input fluid icon='user' iconPosition='left' 
                    placeholder={strings.login.email_placeholder[l]}
                    onChange={this.onEmailChange}
                    />
                <Button primary loading={isLoading} disabled={isLoading} fluid size='large' onClick={this.onLogin}>
                    {<L>{strings.login.log_in}</L>}
                </Button>
            </Form>
            {isSuccess ? <Message positive><L>{strings.login.sendSuccess}</L></Message> : null}
            {isFailure ? <Message error><L>{strings.login.sendFailure}</L></Message> : null}
            </Grid.Column>
            </Grid>
        </div> }</LC>
    }
}