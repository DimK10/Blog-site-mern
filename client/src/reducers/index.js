import { combineReducers } from 'redux';
import alert from './alert';
import post from './post';

export default combineReducers({
    alert,
    post,
});
