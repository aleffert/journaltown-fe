import React from 'react';
import { render, shallow, mount } from 'enzyme';
import { _ComposePostForm } from './ComposePostForm';
import { FormButton } from 'semantic-ui-react';
import strings from '../../strings';

describe('ComposePostForm', () => {
    const baseProps = {
        language: 'en' as 'en',
        onPost: () => {},
        onTitleChange: () => {},
        onBodyChange: () => {},
        title: '',
        body: '',
        isLoading: false,
        submitDisabled: false,
        submitMode: 'post' as 'post'
    };

    it('shows no spinner when isLoading is false', () => {
        const w = shallow(
            <_ComposePostForm {...baseProps} isLoading={false}></_ComposePostForm>
        );
        expect(w.find(FormButton).props().spinner).toEqual(undefined);
        expect(w.render().text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.render().text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a spinner when isLoading is true', () => {
        const w = shallow(
            <_ComposePostForm {...baseProps} isLoading={true}></_ComposePostForm>
        );
        expect(w.find(FormButton).props().loading).toEqual(true);
    });

    it('disables the send button when submitDisabled is true', () => {
        const w = mount(
            <_ComposePostForm {...baseProps} submitDisabled={true}></_ComposePostForm>
        );
        expect(w.find(FormButton).props().disabled).toEqual(true);
    });

    it('enables the send button when submitDisabled is false', () => {
        const w = mount(
            <_ComposePostForm {...baseProps} submitDisabled={false}></_ComposePostForm>
        );
        expect(w.find(FormButton).props().disabled).toEqual(false);
    });

    it('enables the send button when submitDisabled is false', () => {
        const w = mount(
            <_ComposePostForm {...baseProps} submitDisabled={false}></_ComposePostForm>
        );
        expect(w.find(FormButton).props().disabled).toEqual(false);
    });
});