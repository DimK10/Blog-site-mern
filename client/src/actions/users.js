import { GET_ALL_USERS, USERS_ERROR } from './types';
import { setAlert } from './alert';
import axios from 'axios';

export const getAllUsers = () => async (dispatch) => {
    try {
        let res = await axios.get(`/api/users`);

        dispatch({
            type: GET_ALL_USERS,
            payload: res.data,
        });
    } catch (err) {
        console.error(err);
        dispatch({
            type: USERS_ERROR,
            error: true,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
