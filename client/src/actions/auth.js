import axios from 'axios';
import {
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from './types';
import { setAlert } from './alert';

// Helper function to set up token in Authorization header once
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.getItem('jwt')) {
        const jwt = localStorage.getItem('jwt');
        const token = JSON.parse(jwt).token;
        setAuthToken(token);
    }

    try {
        const res = await axios.post('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        console.error(err.message);
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
        // dispatch(loadUser());
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

// Sign up user
export const registerUser = (formData) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    try {
        const res = await axios.post('/api/signup', formData, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });

        dispatch(setAlert('You have been registered successfully!', 'success'));
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL,
        });
    }
};

// Log out
export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT,
    });
    dispatch(setAlert('You have been logged out successfully!', 'success'));
};
