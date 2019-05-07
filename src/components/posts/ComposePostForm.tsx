import React from 'react';

import { Form, InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { L, withLanguage } from '../localization/L';
import { Language } from '../../utils';
import strings from '../../strings';

type ComposeSubmitMode = 'post' | 'update';

type ComposePostFormProps = {
    onTitleChange: (event: unknown, d: InputOnChangeData) => void,
    onBodyChange: (event: unknown, d: TextAreaProps) => void,
    onPost: () => void,
    body: string,
    title: string,
    language: Language,
    isLoading: boolean,
    submitDisabled: boolean,
    submitMode: ComposeSubmitMode
}

export function _ComposePostForm(props: ComposePostFormProps) {
    return <Form>
        <Form.Input size="huge" id='title-field'
            value={props.title}
            placeholder={strings.compose.title.placeholder[props.language]}
            onChange={props.onTitleChange}
        />
        <Form.TextArea size="medium" id='body-field'
            value={props.body}
            placeholder={strings.compose.body.placeholder[props.language]}
            onChange={props.onBodyChange}
        />
        <Form.Button primary id='submit-button' disabled={props.submitDisabled} size="medium"
            loading={props.isLoading}
            onClick={props.onPost}
        >
        <L>{props.submitMode === 'post' ? strings.compose.post : strings.edit.update}</L>
        </Form.Button>
    </Form>;
}

export const ComposePostForm = withLanguage<ComposePostFormProps, typeof _ComposePostForm>(_ComposePostForm);