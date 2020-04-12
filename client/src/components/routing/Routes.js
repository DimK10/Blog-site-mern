import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Signin from '../auth/Signin';
import Signup from '../auth/Signup';
import Post from '../post/Post';

const Routes = () => {
    return (
        <section className='container'>
            <Switch>
                <Route exact path='/signin' component={Signin} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/post/:id' component={Post} />
            </Switch>
        </section>
    );
};

export default Routes;
