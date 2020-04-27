import {
    GET_COMMENTS,
    COMMENTS_ERROR,
    ADD_COMMENT,
    COMMENT_ERROR,
    DELETE_COMMENT,
    START_DELETING_COMMENT,
    START_LOADING_COMMENTS,
    UPDATE_COMMENT,
    START_UPDATING_COMMENT,
} from '../actions/types';

const initialState = {
    comments: [],
    comment: {},
    loading: true,
    loadingOnUpdate: false,
    loadingOnDelete: false,
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_COMMENTS:
            return {
                ...state,
                comments: payload,
                loading: false,
            };
        case START_LOADING_COMMENTS:
            return {
                ...state,
                loading: true,
            };
        case START_DELETING_COMMENT:
            return {
                ...state,
                loadingOnDelete: true,
            };
        case START_UPDATING_COMMENT:
            return {
                ...state,
                loadingOnUpdate: true,
            };
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(
                    (comment) => comment._id !== payload.id
                ),
                loading: false,
                loadingOnDelete: false,
            };
        case COMMENT_ERROR:
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
        case ADD_COMMENT:
        case UPDATE_COMMENT:
        default:
            return state;
    }
}
