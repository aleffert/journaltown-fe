import React from 'react';
import { render, shallow, mount } from 'enzyme';
import { _ComposeForm } from './ComposeForm';
import { FormButton } from 'semantic-ui-react';
import strings from '../../strings';

describe('LoginForm', () => {
    const baseProps = {
        language: 'en' as 'en', createPostResult:undefined,
        onPost: () => {},
        onTitleChange: () => {},
        onBodyChange: () => {},
        title: '',
        body: ''
    };

    it('shows no spinner when postResult is undefined', () => {
        const w = shallow(
            <_ComposeForm {...baseProps} createPostResult={undefined}></_ComposeForm>
        );
        expect(w.find(FormButton).props().spinner).toEqual(undefined);
        expect(w.render().text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.render().text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a spinner when postResult loading', () => {
        const w = shallow(
            <_ComposeForm {...baseProps} createPostResult={{type: 'loading'}}></_ComposeForm>
        );
        expect(w.find(FormButton).props().loading).toEqual(true);
        expect(w.render().text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.render().text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a success message when postResult is success', () => {
        const w = render(
            <_ComposeForm {...baseProps} createPostResult={{type: 'success', value: {} as any}}></_ComposeForm>
        );
        expect(w.text()).toContain(strings.post.sendSuccess['en']);
        expect(w.text()).not.toContain(strings.post.sendFailure['en']);
    });

    it('shows a failure message when postResult is failure', () => {
        const w = render(
            <_ComposeForm {...baseProps} createPostResult={{type: 'failure', error: {}}}></_ComposeForm>
        );
        expect(w.text()).not.toContain(strings.post.sendSuccess['en']);
        expect(w.text()).toContain(strings.post.sendFailure['en']);
    });

    it('disables the post button when there is no body', () => {
        const w = mount(
            <_ComposeForm {...baseProps} createPostResult={undefined} body={''}></_ComposeForm>
        );
        expect(w.find(FormButton).props().disabled).toEqual(true);
    });

    it('enables the post button when there is a body', () => {
        const w = mount(
            <_ComposeForm {...baseProps} createPostResult={undefined} body={'foo'}></_ComposeForm>
        );
        expect(w.find(FormButton).props().disabled).toEqual(false);
    });
});