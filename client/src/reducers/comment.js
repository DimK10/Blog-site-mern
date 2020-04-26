import {
    GET_COMMENTS,
    COMMENTS_ERROR,
    ADD_COMMENT,
    COMMENT_ERROR,
    DELETE_COMMENT,
} from '../actions/types';

const initialState = {
    comments: [],
    comment: {},
    loading: true,
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
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(
                    (comment) => comment._id !== payload.id
                ),
                loading: false,
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
        default:
            return state;
    }
}
