import 'semantic-ui-css/semantic.min.css'
import './App.css';

import React from 'react';
import { Provider } from 'react-redux';
import { Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from 'redux-saga';

import { Root } from './components/Root';
import { saga, createRootReducers } from './store';
import { createBrowserHistory } from 'history';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';


const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    createRootReducers(history),
    composeEnhancers(
        applyMiddleware(sagaMiddleware, routerMiddleware(history))
    )
);

sagaMiddleware.run(saga);

export default class App extends React.Component<{}> {
    
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Route component={Root}>
                </Route>
                </ConnectedRouter>
            </Provider>
        );
    }
}
    