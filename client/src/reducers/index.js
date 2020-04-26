import { combineReducers } from 'redux';
import alert from './alert';
import post from './post';
import auth from './auth';
import category from './category';
import comment from './comment';

export default combineReducers({
    alert,
    post,
    auth,
    category,
    comment,
});
