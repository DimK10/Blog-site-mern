import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserRoute from './UserRoute';
import Signin from '../auth/Signin';
import Signup from '../auth/Signup';
import Post from '../post/Post';
import CreatePost from '../post/CreatePost';
import UpdatePost from '../post/UpdatePost';

const Routes = () => {
    return (
        <section className='container'>
            <Switch>
                <UserRoute exact path='/post/create' component={CreatePost} />
                <UserRoute exact path='/post/update' component={UpdatePost} />
                <Route exact path='/signin' component={Signin} />
                <Route exact path='/signup' component={Signup} />
                <Route path='/post/:id' component={Post} />
            </Switch>
        </section>
    );
};

export default Routes;
