import 'semantic-ui-css/semantic.min.css'
import './App.css';

import React from 'react';
import { LanguageContext } from './utils';
import { Services, ServiceContext } from './services';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Root } from './Root';
import { Provider } from 'react-redux';

import { createStore } from "redux";
import { reducers } from './store';

const store = createStore(reducers);

export default class App extends React.Component<{}> {
    
    services = new Services();
    
    constructor(props: {}) {
        super(props);

        this.services = new Services();
    }
    
    
    render() {
        return (
            <Provider store={store}>
            <LanguageContext.Provider value={store.getState().localization.language}>
            <ServiceContext.Provider value={this.services}>
                <Router>
                    <Route component={Root}>
                </Route>
                </Router>
            </ServiceContext.Provider>
            </LanguageContext.Provider>
            </Provider>
        );
    }
}
    