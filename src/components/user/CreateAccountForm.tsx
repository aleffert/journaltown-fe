import React from 'react';

import { Form, Grid, Header, InputOnChangeData, Message, Container } from 'semantic-ui-react';
import strings from '../../strings';
import { L, withLanguage } from '../localization/L';
import { Language, isFailure, isSuccess, isLoading } from '../../utils';
import { FullScreen } from '../widgets/FullScreen';
import { ApiAsync, CreateAccountResponse, UsernameAvailableResponse } from '../../services/api/requests';
import { AppError } from '../../utils/errors';

type CreateAccountFormProps = {
    onSubmit(email: string): void,
    language: Language,
    createAccount: {
        username: string,
        createAccountResult: ApiAsync<CreateAccountResponse>,
        checkAvailabilityResult: ApiAsync<UsernameAvailableResponse>
    }
    actions: {
        createAccount: {
            checkAvailability: (_: {username: string}) => void
        }
    }
};

export class _CreateAccountForm extends React.Component<CreateAccountFormProps> {

    constructor(props: CreateAccountFormProps) {
        super(props);

        this.state = {username: "", checkAvailabilityStatus: undefined};

        this.onRegister = this.onRegister.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
    }

    onRegister() {
        this.props.onSubmit(this.props.createAccount.username);
    }

    onUsernameChange(_: any, d: InputOnChangeData) {
        this.props.actions.createAccount.checkAvailability({username: d.value});
    }

    getError(error: AppError) {
        switch(error.type) {
            case 'invalid-fields':
                return strings.login.invalidUsername;
            default:
                return strings.login.createAccountFailure;
        }
    }

    buttonMessage() {
        if(!this.props.createAccount.username || !this.props.createAccount.checkAvailabilityResult) {
            return strings.login.createAccount;
        }
        // Remove once we're on react-scripts ^3.0.1
        // eslint-disable-next-line
        switch(this.props.createAccount.checkAvailabilityResult.type) {
            case 'success':
                return strings.login.createAccount;
            case 'failure':
                return strings.login.unavailable(this.props.createAccount.username);
            case 'loading':
                return strings.login.checkingAvailability;
        }
    }

    render() {
        const checkingAvailability = isLoading(this.props.createAccount.checkAvailabilityResult);
        const loading = isLoading(this.props.createAccount.createAccountResult) || checkingAvailability;
        const submitDisabled = loading || this.props.createAccount.username.length === 0 || isFailure(this.props.createAccount.checkAvailabilityResult);

        return <div>
            <FullScreen>
                <Container text className='full-height'>
                <Grid className='full-height' verticalAlign='middle'>
                <Grid.Column>
                    <Header as='h2' textAlign='center'>
                        <L>{strings.login.createAccountPrompt}</L>
                    </Header>
                    <Form size='large'>
                        <Form.Input id='username-field' fluid icon='user' iconPosition='left' 
                            placeholder={strings.login.username_placeholder[this.props.language]}
                            onChange={this.onUsernameChange}
                            />
                        <Form.Button id='submit-button' primary loading={loading} disabled={submitDisabled} 
                            fluid size='large'
                            onClick={this.onRegister}
                        >
                            {<L>{this.buttonMessage()}</L>}
                        </Form.Button>
                    </Form>
                    {isSuccess(this.props.createAccount.createAccountResult)
                        ? <Message positive><L>{strings.login.sendRegisterSuccess}</L></Message> 
                        : null
                    }
                    {isFailure(this.props.createAccount.createAccountResult)
                        ? <Message error><L>{this.getError(this.props.createAccount.createAccountResult.error)}</L></Message> 
                        : null
                    }
                </Grid.Column>
                </Grid></Container>
            </FullScreen>
        </div>
    }
}

export const CreateAccountForm = withLanguage<CreateAccountFormProps, typeof _CreateAccountForm>(_CreateAccountForm);
