import 'semantic-ui-css/semantic.min.css'
import './App.css';

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from 'redux-saga';

import { LanguageContext } from './utils';
import { Root } from './Root';
import { reducers, saga } from './store';



const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(saga);

export default class App extends React.Component<{}> {
    
    constructor(props: {}) {
        super(props);
    }
    
    render() {
        return (
            <Provider store={store}>
            <LanguageContext.Provider value={store.getState().localization.language}>
                <Router>
                    <Route component={Root}>
                </Route>
                </Router>
            </LanguageContext.Provider>
            </Provider>
        );
    }
}
    