import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserRoute from './UserRoute';
import Signin from '../auth/Signin';
import Signup from '../auth/Signup';
import Post from '../post/Post';
import CreatePost from '../post/CreatePost';
import UpdatePost from '../post/UpdatePost';
import Community from '../etc/Community';

const Routes = () => {
    return (
        <div className='container'>
            <Switch>
                <UserRoute exact path='/post/create' component={CreatePost} />
                <UserRoute
                    exact
                    path='/post/update/:id'
                    component={UpdatePost}
                />
                <UserRoute exact path='/community' component={Community} />

                <Route exact path='/signin' component={Signin} />
                <Route exact path='/signup' component={Signup} />
                <Route path='/post/:id' component={Post} />
            </Switch>
        </div>
    );
};

export default Routes;
