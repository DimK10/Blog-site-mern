import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT,
} from '../actions/types';

const token = JSON.parse(localStorage.getItem('jwt'))
    ? JSON.parse(localStorage.getItem('jwt')).token
    : null;

// FIXME - Maybe i need to have the user data persist after reload
const initialState = {
    token,
    isAuthenticated: null,
    loading: true,
    user: null,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('jwt', JSON.stringify(payload));
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case LOGOUT:
        case AUTH_ERROR:
            localStorage.removeItem('jwt');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false,
            };
        default:
            return state;
    }
}
