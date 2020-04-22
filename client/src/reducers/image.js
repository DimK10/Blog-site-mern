import { GET_IMAGE, IMAGE_ERROR } from '../actions/types';
const initialState = {
    image: '',
    loading: true,
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_IMAGE:
            return {
                ...state,
                image: payload,
                loading: false,
            };
        case IMAGE_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}
