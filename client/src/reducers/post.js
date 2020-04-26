import {
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    GET_COMMENTS,
    COMMENTS_ERROR,
} from '../actions/types';
const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false,
            };
        case GET_POST:
            return {
                ...state,
                post: payload,
                loading: false,
            };
        case GET_COMMENTS:
            return {
                ...state,
                comments: payload,
                loading: false,
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case COMMENTS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
