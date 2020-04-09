import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Posts from './components/posts/Posts';
import Routes from './components/routing/Routes';
import Signin from './components/auth/Signin';

// Redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Switch>
                        <Route exact path='/' component={Posts} />
                        <Route component={Routes} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
