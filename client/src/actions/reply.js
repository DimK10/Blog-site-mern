import axios from 'axios';
import { ADD_REPLY, UPDATE_REPLY, DELETE_REPLY, REPLY_ERROR } from './types.js';
import { setAlert } from './alert.js';
import { getComments } from './comment.js';

// Add a reply to a comment
export const addReply = (text, commentId, postId, userId) => async (
    dispatch
) => {
    try {
        const body = { text };
        const res = await axios.post(`/api/reply/${commentId}/${userId}`, body);

        dispatch({
            type: ADD_REPLY,
        });

        dispatch(setAlert('Your reply was added successfully!', 'success'));

        dispatch(getComments(postId));
    } catch (err) {}
};
