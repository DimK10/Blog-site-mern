import axios from 'axios';
import { GET_IMAGE, IMAGE_ERROR } from './types';

// Get Image of post

export const getPostImage = (postId) => async (dispatch) => {
    try {
        const config = { responseType: 'arraybuffer' };

        const res = await axios.get(`/api/post/image/${postId}`, config);

        let base64Url = new Buffer(res.data, 'binary').toString('base64');

        dispatch({
            type: GET_IMAGE,
            payload: base64Url,
        });
    } catch (err) {
        dispatch({
            type: IMAGE_ERROR,
        });
    }
};
