import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Signin from '../auth/Signin';
import Alert from '../layout/Alert';

const Routes = () => {
    return (
        <section className='container'>
            <Alert />
            <Switch>
                <Route exact path='/signin' component={Signin} />
            </Switch>
        </section>
    );
};

export default Routes;
