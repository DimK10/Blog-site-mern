import axios from 'axios';
import {
    GET_COMMENTS,
    COMMENTS_ERROR,
    ADD_COMMENT,
    COMMENT_ERROR,
    DELETE_COMMENT,
    UPDATE_COMMENT,
} from './types';

import { setAlert } from './alert';

// Get post's comments
export const getComments = (postId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/post/comments/${postId}`);

        dispatch({
            type: GET_COMMENTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: COMMENTS_ERROR,
        });
    }
};

// Add comment to post
export const addComment = (postId, userId, text) => async (dispatch) => {
    try {
        const body = { text };
        await axios.post(`/api/comment/create/${postId}/${userId}`, body);

        dispatch({
            type: ADD_COMMENT,
        });

        dispatch(getComments(postId));
    } catch (err) {
        dispatch({
            type: COMMENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Update post comment
export const updateComment = (commentId, postId, userId, text) => async (
    dispatch
) => {
    try {
        const body = { text };
        await axios.put(`/api/comment/update/${commentId}/${userId}`, body);

        dispatch({
            type: UPDATE_COMMENT,
        });

        dispatch(setAlert('Your comment was updated successfully!', 'success'));

        dispatch(getComments(postId));
    } catch (err) {
        console.error(err.message);
        dispatch({
            type: COMMENT_ERROR,
        });
    }
};
// Delete comment from post
export const deleteComment = (commentId, postId, userId) => async (
    dispatch
) => {
    try {
        await axios.delete(`/api/comment/delete/${commentId}/${userId}`);

        dispatch({
            type: DELETE_COMMENT,
            payload: { id: commentId },
        });

        dispatch(setAlert('comment deleted successfully!', 'success'));

        dispatch(getComments(postId));
    } catch (err) {
        console.error(err.message);
        dispatch({
            type: COMMENT_ERROR,
        });
    }
};
