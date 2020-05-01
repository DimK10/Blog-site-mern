import {
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    CREATE_POST,
    GET_POST_IMAGE,
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
        case GET_POST_IMAGE:
            return {
                ...state,
                post: { ...state.post, image: payload },
                loading: false,
            };
        case CREATE_POST:
            return {
                ...state,
                post: payload,
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };

        default:
            return state;
    }
}
