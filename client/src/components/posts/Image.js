import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { getPostImage } from '../../actions/image';
import pulseLoading from '../../images/loading/Pulse-1s-200px.gif';
import { connect } from 'react-redux';

const Image = ({ getPostImage, image: { image, loading }, postId }) => {
    const [img, setImg] = useState('');
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPostImage(postId);
    }, [getPostImage]);

    return (
        <Fragment>
            {!loading ? (
                <img
                    className='card-img-top'
                    src={`data:image/jpeg;base64,${image}`}
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
    getPostImage: PropTypes.func.isRequired,
    image: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    image: state.image,
});

export default connect(mapStateToProps, { getPostImage })(Image);
