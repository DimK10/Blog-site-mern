import axios from 'axios';
import { USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL } from './types';
import { setAlert } from './alert';

// Helper function to set up token in Authorization header once
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadUser = (userId) => async (dispatch) => {
    if (localStorage.getItem('jwt')) {
        const jwt = localStorage.getItem('jwt');
        const { token, id } = JSON.parse(jwt);
        setAuthToken(token);
    }

    try {
        const res = await axios.get(`/api/user/${userId}`);

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// Login user
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/signin', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser(res.data.user));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAIL,
        });
    }
};
