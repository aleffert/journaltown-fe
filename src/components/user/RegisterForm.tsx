import React from 'react';

import EmailValidator from 'email-validator';
import { Form, Grid, Header, InputOnChangeData, Message, Container } from 'semantic-ui-react';
import strings from '../../strings';
import { L, withLanguage } from '../localization/L';
import { Language, isFailure, isLoading, isSuccess } from '../../utils';
import { FullScreen } from '../widgets/FullScreen';
import { Link } from 'react-router-dom';
import { RegisterResponse, ApiAsync } from '../../services/api/requests';
import { AppError } from '../../utils/errors';

type RegisterFormProps = {
    status: ApiAsync<RegisterResponse>,
    onSubmit(email: string): void,
    language: Language
};

type RegisterFormState = {
    email: string
}

export class _RegisterForm extends React.Component<RegisterFormProps, RegisterFormState> {

    constructor(props: RegisterFormProps) {
        super(props);

        this.state = {email: ""};

        this.onRegister = this.onRegister.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
    }

    onRegister() {
        this.props.onSubmit(this.state.email);
    }

    onEmailChange(e: any, d: InputOnChangeData) {
        this.setState({email: d.value});
    }

    getError(error: AppError) {
        switch(error.type) {
            case 'email-in-use':
                return strings.login.emailInUse;
            default:
                return strings.login.sendLoginFailure;
        }
    }

    render() {
        const loading = isLoading(this.props.status);
        const success = isSuccess(this.props.status);
        const submitDisabled = loading || !EmailValidator.validate(this.state.email);

        return <div>
            <FullScreen>
                <Container text className='full-height'>
                <Grid className='full-height' verticalAlign='middle'>
                <Grid.Column>
                    <Header as='h2' textAlign='center'>
                        <L>{strings.login.registerPrompt}</L>
                    </Header>
                    <Form size='large'>
                        <Form.Input id='email-field' fluid icon='user' iconPosition='left' 
                            placeholder={strings.login.email_placeholder[this.props.language]}
                            onChange={this.onEmailChange}
                            />
                        <Form.Button id='submit-button' primary loading={loading} disabled={submitDisabled} 
                            fluid size='large'
                            onClick={this.onRegister}
                        >
                            {<L>{strings.login.signUp}</L>}
                        </Form.Button>
                    </Form>
                    {success
                        ? <Message positive><L>{strings.login.sendRegisterSuccess}</L></Message> 
                        : null
                    }
                    {isFailure(this.props.status)
                        ? <Message error><L>{this.getError(this.props.status.error)}</L></Message> 
                        : null
                    }
                    <Grid.Row>
                        <L>{strings.login.hasAccount}</L> <Link to="/login"><L>{strings.login.switchToLogin}</L></Link>
                    </Grid.Row>
                </Grid.Column>
                </Grid></Container>
            </FullScreen>
        </div>
    }
}

export const RegisterForm = withLanguage<RegisterFormProps, typeof _RegisterForm>(_RegisterForm);
