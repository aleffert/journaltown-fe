import React from 'react';
import { mount } from 'enzyme';
import { _ComposePostPage } from './ComposePostPage';
import { merge } from 'lodash';
import strings from '../../strings';

describe('ComposePostPage', () => {

    const baseProps = {
        compose: {
            title: '',
            body: ''
        }
    } as any;

    it('shows a success message when a post succeeds', () => {
        const props = merge({}, baseProps, {compose: {createPostResult: {type: 'success', value: {} as any}}});
        const w = mount(<_ComposePostPage {...props} />);
        expect(w.html()).toContain(strings.compose.sendSuccess['en']);
        expect(w.html()).not.toContain(strings.compose.sendFailure['en']);
    });

    it('shows a failure message when a post fails', () => {
        const props = merge({}, baseProps, {compose: {createPostResult: {type: 'failure', error: {} as any}}});
        const w = mount(<_ComposePostPage {...props} />);
        expect(w.html()).not.toContain(strings.compose.sendSuccess['en']);
        expect(w.html()).toContain(strings.compose.sendFailure['en']);
    });

    it('emits an update action when you change the title', () => {
        const spy = jest.fn();
        const props = merge({}, baseProps, {actions: {
            compose: {
                setTitle: spy
            }
        }});
        const w = mount(<_ComposePostPage {...props} />);
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
        const w = mount(<_ComposePostPage {...props} />);
        w.find('#body-field').hostNodes().simulate('change', {target: {value: 'some body'}});
        expect(spy.mock.calls[0][0]).toEqual('some body');
    });

    it('emits a post action with the current data on post', () => {
        const spy = jest.fn();
        const props = merge({}, baseProps, {
            actions: {
                compose: {
                    post: spy
                }
            },
            compose: {
                title: 'title',
                body: 'body'
            }
        });
        const w = mount(<_ComposePostPage {...props} />);
        w.find('#submit-button').hostNodes().simulate('click');
        expect(spy.mock.calls[0][0]).toEqual(props.compose);
    });
});