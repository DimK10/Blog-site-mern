import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Signin from '../auth/Signin';

const Routes = () => {
    return (
        <section className='container'>
            {/* TODO - Creae Alert - alerts */}
            <Switch>
                <Route exact path='/signin' component={Signin} />
            </Switch>
        </section>
    );
};

export default Routes;
