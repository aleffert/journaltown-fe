import React from 'react';
import { Header } from './Header';
import { MemoryRouter as Router } from 'react-router';
import { mount } from 'enzyme';
import { FactoryBot } from 'factory-bot-ts';
import { CurrentUser } from '../services/api/models';

describe('Header', () => {
    it('executes a callback when the profile is chosen', () => {
        const props = {
            user: FactoryBot.build<CurrentUser>('currentUser'),
            onLogout: () => {},
            onPost: () => {},
            onProfile: jest.fn(),
            language: 'en'
        }
        const w = mount(<Router><Header {...props} /></Router>);
        w.find('.header-profile-item').hostNodes().simulate('click');
        expect(props.onProfile.mock.calls).toHaveLength(1);
    });
});