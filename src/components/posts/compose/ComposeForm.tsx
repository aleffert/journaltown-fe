import React from 'react';

import { Container, Form, Grid, InputOnChangeData, Message, TextAreaProps } from 'semantic-ui-react';
import { L, withLanguage } from '../../localization/L';
import { Language, Domain } from '../../../utils';
import strings from '../../../strings';
import { actions } from '../../../store';

type ComposeFormProps = {
    onTitleChange: (event: unknown, d: InputOnChangeData) => void,
    onBodyChange: (event: unknown, d: TextAreaProps) => void,
    onPost: () => void,
    createPostResult: Domain<typeof actions.compose.setCreatePostResult>['result'],
    body: string,
    title: string,
    language: Language
}

export function _ComposeForm(props: ComposeFormProps) {
    const submitDisabled = props.body.length == 0 || !!props.createPostResult;
    const isSuccess = props.createPostResult && props.createPostResult.type === 'success';
    const isFailure = props.createPostResult && props.createPostResult.type === 'failure';
    const isLoading = (props.createPostResult && props.createPostResult.type === 'loading')  || undefined;
    return <Container text>
            <Grid>
                <Grid.Column textAlign="right">
                    <Form>
                        <Form.Input size="huge" id='title-field'
                            placeholder={strings.post.title.placeholder[props.language]}
                            onChange={props.onTitleChange}
                        />
                        <Form.TextArea size="medium" id='body-field'
                            placeholder={strings.post.body.placeholder[props.language]}
                            onChange={props.onBodyChange}
                        />
                        <Form.Button primary id='submit-button' disabled={submitDisabled} size="medium"
                            loading={isLoading}
                            onClick={props.onPost}
                        >
                        <L>{strings.post.post}</L>
                        </Form.Button>
                    </Form>
                    {isSuccess ? <Message positive><L>{strings.post.sendSuccess}</L></Message> : null}
                    {isFailure ? <Message error><L>{strings.post.sendFailure}</L></Message> : null}
                </Grid.Column>
            </Grid>
    </Container>
}

export const ComposeForm = withLanguage<ComposeFormProps, typeof _ComposeForm>(_ComposeForm);