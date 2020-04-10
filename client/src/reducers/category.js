import { GET_CATEGORIES, CATEGORY_ERROR } from '../actions/types';

const initialState = {
    categories: [],
    category: null,
    options: [],
    error: {},
    loading: true,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: payload,
                options: [
                    ...payload.map((category) => ({
                        value: category._id,
                        label: category.title,
                    })),
                ],
                loading: false,
            };
        case CATEGORY_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };

        default:
            return state;
    }
}
