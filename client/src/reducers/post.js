import {
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    CREATE_POST,
    GET_POST_IMAGE,
    UPDATE_POST,
    START_GETTING_POST,
    DELETE_POST,
    GET_USER_POSTS,
} from '../actions/types';

const initialPostValues = {
    comments: [],
    categories: [],
    _id: null,
    imageId: '',
    title: '',
    description: '',
    author: null,
    created_at: '',
    updatedAt: '',
    image: null,
    loading: true,
};

const initialState = {
    posts: [],
    post: initialPostValues,
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
        case GET_USER_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false,
            };
        case START_GETTING_POST:
            return {
                ...state,
                post: { ...state.post, loading: true },
            };
        case GET_POST:
            return {
                ...state,
                post: { ...payload, loading: false },
            };
        case GET_POST_IMAGE:
            return {
                ...state,
                post: { ...state.post, image: payload, loading: false },
            };
        case CREATE_POST:
            return {
                ...initialState,
                post: payload,
            };
        case DELETE_POST:
            return {
                ...initialState,
            };
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case UPDATE_POST:
        default:
            return state;
    }
}
