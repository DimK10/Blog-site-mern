import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';
import Navbar from './components/layout/Navbar';
import Posts from './components/posts/Posts';
import Alert from './components/layout/Alert';
import Routes from './components/routing/Routes';
import UserRoute from './components/routing/UserRoute';
import ProfilePage from './components/profile/ProfilePage';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

if (localStorage.getItem('jwt')) {
    const token = JSON.parse(localStorage.getItem('jwt')).token;

    setAuthToken(token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <div className='container'>
                        <Alert />
                    </div>
                    <Switch>
                        <Route exact path='/' component={Posts} />
                        <UserRoute
                            exact
                            path='/my-profile'
                            component={ProfilePage}
                        />
                        <Route component={Routes} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
