import 'semantic-ui-css/semantic.min.css'
import './App.css';

import React from 'react';
import { LocaleContext } from './utils';
import { Services, ServiceContext } from './services';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { PageWrapper } from './login/PageWrapper';


type AppProps = {};

export default class App extends React.Component<AppProps> {
    
    services = new Services();
    
    constructor(props: AppProps) {
        super(props);

        this.services = new Services();
    }
    
    
    render() {
        return (
            <LocaleContext.Provider value="en">
            <ServiceContext.Provider value={this.services}>
                <Router>
                    <Route path="/" component={PageWrapper}>
                </Route>
                </Router>
            </ServiceContext.Provider>
            </LocaleContext.Provider>
        );
    }
}
    