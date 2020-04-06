import axios from 'axios';
import { GET_IMAGE, NO_IMAGE, IMAGE_ERROR } from './types.js';

export const getImage = (postId) => async (dispatch) => {
    try {
        let res = await axios.get(`/api/post/image/${postId}`);

        console.log(JSON.stringify(res));

        // if (!image) {
        //     dispatch({
        //         type: NO_IMAGE,
        //     });
        // }

        dispatch({
            type: GET_IMAGE,
            payload: res.data,
        });
    } catch (err) {
        console.error(err.message);
        dispatch({
            type: IMAGE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
