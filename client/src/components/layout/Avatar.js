import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import pulse from '../../images/loading/Pulse-1s-200px.gif';

const Avatar = ({ url, width = '5em', height = '5em', withFlex = true }) => {
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        let fetchAvatar = async () => {
            try {
                const config = {
                    responseType: 'arraybuffer',
                    cancelToken: source.token,
                };
                setLoading(true);
                let res = await axios.get(url, config);
                setLoading(false);

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
            {!loading ? (
                <img
                    className={`${
                        withFlex ? 'd-flex mr-3' : ''
                    } rounded-circle`}
                    src={`data:image/jpeg;base64,${avatar}`}
                    style={{ width, height }}
                    alt=''
                />
            ) : (
                <img src={pulse} style={{ width, height }} alt='loading...' />
            )}
        </Fragment>
    );
};

Avatar.propTypes = {
    url: PropTypes.string.isRequired,
};

export default Avatar;
