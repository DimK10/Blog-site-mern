import { GET_IMAGE, NO_IMAGE, IMAGE_ERROR } from '../actions/types';

const initialState = {
    images: [],
    loading: false,
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_IMAGE:
            return {
                ...state,
                images: [...state.images, payload],
                loading: false,
            };
        case IMAGE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case NO_IMAGE:
        default:
            return state;
    }
};
