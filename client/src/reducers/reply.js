import {
    ADD_REPLY,
    UPDATE_REPLY,
    START_UPDATING_REPLY,
    // DELETE_REPLY,
    START_DELETING_REPLY,
} from '../actions/types';

const initialState = {
    replies: [],
    loadingOnDelete: false,
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case START_DELETING_REPLY:
            return {
                ...state,
                loadingOnDelete: true,
            };
        case START_UPDATING_REPLY:
            return {
                ...state,
                loadingOnUpdate: true,
            };
        case REPLY_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case ADD_REPLY:
        case UPDATE_REPLY:
        default:
            return state;
    }
}
