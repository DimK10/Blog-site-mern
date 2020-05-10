import { GET_ALL_USERS, USERS_ERROR } from '../actions/types';

const initialState = {
    users: [],
    error: {},
    loading: true,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_ALL_USERS:
            return {
                ...state,
                users: payload,
                loading: false,
            };
        case USERS_ERROR:
            return {
                ...state,
                error: payload,
            };
        default:
            return state;
    }
}
