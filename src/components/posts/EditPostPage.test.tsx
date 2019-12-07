import React from 'react';
import { mount } from 'enzyme';
import { _EditPostPage } from './EditPostPage';
import { merge } from 'lodash';
import strings from '../../strings';
import { FactoryBot } from 'factory-bot-ts';
import { Post } from '../../services/api/models';
import { InitialLoader } from '../user/InitialLoader';
import { ErrorView } from '../widgets/ErrorView';
import { makeSuccess, makeFailure } from '../../utils';
import { AppErrors } from '../../utils/errors';

describe('EditPostPage', () => {

    const post = FactoryBot.build<Post>('post');

    const baseProps = {
        compose: {
            title: '',
            body: '',
            existingPostResult: makeSuccess(post)
        },
        actions: {
            compose: {
                startEditingPost: () => {}
            }
        },
        match: {
            params: {
                id: '1',
                username: 'someone'
            }
        }
    } as any;

    it('shows a loader when the post is not loaded', () => {
        const props = merge({}, baseProps, {compose: {existingPostResult: {type: 'loading'}}});
        const w = mount(<_EditPostPage {...props} />);
        expect(w.find(InitialLoader).exists()).toBe(true);
    });

    it('shows an when loading fails', () => {
        const props = merge({}, baseProps, {compose: {existingPostResult: makeFailure(AppErrors.notFoundError)}});
        const w = mount(<_EditPostPage {...props} />);
        expect(w.find(ErrorView).exists()).toBe(true);
    });

    it('shows a success message when a post succeeds', () => {
        const props = merge({}, baseProps, {compose: {updatePostResult: makeSuccess({} as any)}});
        const w = mount(<_EditPostPage {...props} />);
        expect(w.html()).toContain(strings.edit.sendSuccess['en']);
        expect(w.html()).not.toContain(strings.edit.sendFailure['en']);
    });

    it('shows a failure message when a post fails', () => {
        const props = merge({}, baseProps, {compose: {updatePostResult: makeFailure({} as any)}});
        const w = mount(<_EditPostPage {...props} />);
        expect(w.html()).not.toContain(strings.edit.sendSuccess['en']);
        expect(w.html()).toContain(strings.edit.sendFailure['en']);
    });

    it('emits an update action when you change the title', () => {
        const spy = jest.fn();
        const props = merge({}, baseProps, {actions: {
            compose: {
                setTitle: spy
            }
        }});
        const w = mount(<_EditPostPage {...props} />);
        w.find('#title-field').hostNodes().simulate('change', {target: {value: 'some title'}});
        expect(spy.mock.calls[0][0]).toEqual('some title');
    });

    it('emits an update action when you change the body', () => {
        const spy = jest.fn();
        const props = merge({}, baseProps, {actions: {
            compose: {
                setBody: spy
            }
        }});
        const w = mount(<_EditPostPage {...props} />);
        w.find('#body-field').hostNodes().simulate('change', {target: {value: 'some body'}});
        expect(spy.mock.calls[0][0]).toEqual('some body');
    });
});