import { combineReducers } from 'redux';
import alert from './alert';
import post from './post';
import auth from './auth';
import category from './category';
import comment from './comment';
import users from './users';

export default combineReducers({
    alert,
    post,
    auth,
    category,
    comment,
    users,
});
