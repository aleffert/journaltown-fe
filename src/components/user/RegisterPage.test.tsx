import React from 'react';
import { mount } from 'enzyme';
import { _RegisterPage } from './RegisterPage';
import { merge } from 'lodash';
import { CreateAccountForm } from './CreateAccountForm';
import { RegisterForm } from './RegisterForm';
import { MemoryRouter } from 'react-router';
import { makeSuccess } from '../../utils';

describe('RegisterPage', () => {

    const baseProps = {
        user: {},
        createAccount: {
            username: ''
        },
        actions: {
            createAccount: {
                checkAvailability: () => {}
            }
        }
    } as any;

    it('shows the email entry form when there is no registration token', () => {
        const props = merge({}, baseProps, {
            router: {
                location: {
                    search: ''
                }
            }
        });
        const w = mount(<MemoryRouter>
            <_RegisterPage {...props}/>
        </MemoryRouter>);
        expect(w.find(RegisterForm).exists()).toBe(true);
        expect(w.find(CreateAccountForm).exists()).toBe(false);
    });

    it('shows the create account form when there is a registration token', () => {
        const props = merge({}, baseProps, {
            router: {
                location: {
                    search: 'reg_token=abc123'
                }
            }
        });
        const w = mount(<MemoryRouter>
            <_RegisterPage {...props}/>
        </MemoryRouter>);
        expect(w.find(CreateAccountForm).exists()).toBe(true);
        expect(w.find(RegisterForm).exists()).toBe(false);
    });

    it('emits an account when register is chosen', () => {
        const spy = jest.fn();
        const email = "to@example.com";
        const props = merge({}, baseProps, {
            router: {
                location: {
                    search: ''
                }
            },
            actions: {
                user: {
                    submitRegister: spy
                }
            }
        });
        const w = mount(<MemoryRouter>
            <_RegisterPage {...props}/>
        </MemoryRouter>);
        w.find('#email-field').hostNodes().simulate('change', {target: {value: email}});
        w.find('#submit-button').hostNodes().simulate('click');
        expect(spy.mock.calls[0]).toEqual([{email}]);
    });

    it('sends a create account request when asked to', () => {
        const spy = jest.fn();
        const token = "abc123";
        const username = "someuser";
        const props = merge({}, baseProps, {
            router: {
                location: {
                    search: `reg_token=${token}`
                }
            },
            createAccount: {
                checkAvailabilityResult: makeSuccess({}),
                username: username
            },
            actions: {
                createAccount: {
                    submitCreateAccount: spy
                }
            }
        });
        const w = mount(<MemoryRouter>
            <_RegisterPage {...props}/>
        </MemoryRouter>);
        w.find('#submit-button').hostNodes().simulate('click');
        expect(spy.mock.calls[0]).toEqual([{token, username}]);
    });
});