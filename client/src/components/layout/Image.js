import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import pulseLoading from '../../images/loading/Pulse-1s-200px.gif';

const Image = ({ url }) => {
    const [img, setImg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        let fetchImg = async () => {
            try {
                const config = {
                    responseType: 'arraybuffer',
                    cancelToken: source.token,
                };

                let res = await axios.get(url, config);

                let base64Url = new Buffer(res.data, 'binary').toString(
                    'base64'
                );

                setImg(base64Url);
                setLoading(false);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error(error);
                }
            }
        };

        fetchImg();

        // Clean up function
        return () => {
            source.cancel();
        };
    }, [url]);

    return (
        <Fragment>
            {!loading ? (
                <img
                    className='card-img-top'
                    src={`data:image/jpeg;base64,${img}`}
                    alt=''
                />
            ) : (
                <div className='card-img-top'>
                    <img
                        className='rounded mx-auto d-block'
                        src={pulseLoading}
                        alt=''
                    />
                </div>
            )}
        </Fragment>
    );
};

Image.propTypes = {
    url: PropTypes.string.isRequired,
};

export default Image;
