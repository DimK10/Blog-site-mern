import axios from 'axios';
import {
    GET_POSTS,
    POST_ERROR,
    GET_POST,
    GET_COMMENTS,
    COMMENTS_ERROR,
    ADD_COMMENT,
    COMMENT_ERROR,
} from './types';

// Get posts
export const getPosts = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/posts/all');

        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get post
export const getPost = (postId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/post/${postId}`);

        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

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
