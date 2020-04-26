import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Avatar = ({ url }) => {
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        let fetchAvatar = async () => {
            const config = {
                responseType: 'arrayBuffer',
            };
            let res = await axios.get(url, config);

            let base64Url = new Buffer(res.data, 'binary').toString('base64');

            setAvatar(base64Url);
        };

        fetchAvatar();
    }, []);
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
