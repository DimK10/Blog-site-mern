import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Avatar = ({ url }) => {
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        let fetchAvatar = async () => {
            try {
                const config = {
                    responseType: 'arrayBuffer',
                };
                let res = await axios.get(url, config);

                let base64Url = new Buffer(res.data, 'binary').toString(
                    'base64'
                );

                setAvatar(base64Url);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    console.error(err);
                }
            }
        };

        fetchAvatar();

        // Clean up function
        return () => {
            source.cancel();
        };
    }, [url]);
    return (
        <Fragment>
            <img
                className='d-flex mr-3 rounded-circle'
                src={`data:image/jpeg;base64,${avatar}`}
                alt=''
            />
        </Fragment>
    );
};

Avatar.propTypes = {
    url: PropTypes.string.isRequired,
};

export default Avatar;
