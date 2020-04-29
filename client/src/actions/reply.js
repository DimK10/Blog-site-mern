import axios from 'axios';
import {
    ADD_REPLY,
    UPDATE_REPLY,
    START_UPDATING_REPLY,
    // DELETE_REPLY,
    REPLY_ERROR,
} from './types.js';
import { setAlert } from './alert.js';
import { getComments } from './comment.js';

// Add a reply to a comment
export const addReply = (text, commentId, postId, userId) => async (
    dispatch
) => {
    try {
        const body = { text };
        await axios.post(`/api/reply/${commentId}/${userId}`, body);

        dispatch({
            type: ADD_REPLY,
        });

        dispatch(setAlert('Your reply was added successfully!', 'success'));

        dispatch(getComments(postId));
    } catch (err) {
        dispatch({
            type: REPLY_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const updateReply = (replyId, postId, userId, text) => async (
    dispatch
) => {
    try {
        dispatch({
            type: START_UPDATING_REPLY,
        });

        const body = { text };
        await axios.put(`/api/reply/update/${replyId}/${userId}`);

        dispatch({
            type: UPDATE_REPLY,
        });

        dispatch(setAlert('Your reply was added successfully!', 'success'));

        dispatch(getComments(postId));
    } catch (err) {
        console.error(err.message);
        dispatch({
            type: REPLY_ERROR,
        });
    }
};

// Delete reply from comment
export const deleteReply = (replyId, postId, userId) => async (dispatch) => {
    try {
        dispatch({
            type: START_UPDATING_REPLY,
        });

        await axios.delete(`/api/reply/delete/${replyId}/${userId}`);

        // dispatch({
        //     type: DELETE_REPLY,
        //     payload: { id: replyId },
        // });

        dispatch(setAlert('reply deleted successfully!', 'success'));

        dispatch(getComments(postId));
    } catch (err) {
        console.error(err.message);
        dispatch({
            type: REPLY_ERROR,
        });
    }
};
