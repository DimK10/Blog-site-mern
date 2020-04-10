import axios from 'axios';
import { GET_CATEGORIES, CATEGORY_ERROR } from './types';

// Get all categories (mainly used for react-select)
export const getAllCategories = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/categories');

        dispatch({
            type: GET_CATEGORIES,
            payload: res.data,
        });
    } catch (err) {
        console.error(err.message);
        dispatch({
            type: CATEGORY_ERROR,
        });
    }
};
