import { combineReducers } from 'redux';
import alert from './alert';
import post from './post';
import auth from './auth';

export default combineReducers({
    alert,
    post,
    auth,
});
