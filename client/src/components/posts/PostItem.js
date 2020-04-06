import React, { Fragment, useEffect, useState } from 'react';
import Moment from 'react-moment';
import stripHtml from 'string-strip-html';
import PropTypes from 'prop-types';
import { getImage } from '../../actions/image';
import { connect } from 'react-redux';
import noImg from '../../images/no-thumbnail-medium.png';

const PostItem = ({
    image: { images, loading },
    post: {
        _id,
        title,
        description,
        categories,
        created_at,
        author: { name },
    },
}) => {
    // FIXME - Move ethis to Posts.js as useEffect with depenency posts and see waht happens
    useEffect(() => {
        getImage(_id.toString());
    }, [getImage]);

    const showShortDesc = (description) => {
        const indexOfDot = description.indexOf('.');
        let shortDesc = description.substring(0, indexOfDot);
        shortDesc = stripHtml(shortDesc).replace('"', '');
        return shortDesc;
    };

    return (
        <Fragment>
            {/* <!-- Blog Post --> */}
            <div className='card mb-4'>
                <img
                    className='card-img-top'
                    src={images}
                    alt='Card image Blog'
                />
                <div className='card-body'>
                    <h2 className='card-title'>{title}</h2>
                    <p className='card-text'>{showShortDesc(description)}</p>
                    <p>
                        Tags:{' '}
                        {categories.map((category) => (
                            <Fragment key={category._id}>
                                <span className='tag'>{category.title}</span>{' '}
                            </Fragment>
                        ))}
                    </p>
                    {/* TODO - Convert to Link */}
                    <a href='#' className='btn btn-primary'>
                        Read More &rarr;
                    </a>
                </div>
                <div className='card-footer text-muted'>
                    Posted on <Moment format='YYYY/MM/DD' /> by{' '}
                    <a href='#'>{name}</a>
                </div>
            </div>
        </Fragment>
    );
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    image: state.image,
});

export default connect(mapStateToProps, { getImage })(PostItem);
