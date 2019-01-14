import React from 'react';
import App from './App';
import { shallow } from 'enzyme';

describe('App', () => {
  it('renders without crashing', () => {
    const w = shallow(<App/>, {disableLifecycleMethods: true});
    expect(w.exists()).toBe(true);
  });
});
