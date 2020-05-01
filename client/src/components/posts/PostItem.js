import React, { Fragment, useState } from 'react';
import Moment from 'react-moment';
import stripHtml from 'string-strip-html';
import PropTypes from 'prop-types';
import noImg from '../../images/no-thumbnail-medium.png';
import { Link } from 'react-router-dom';

import Image from '../layout/Image';

const PostItem = ({
    post: {
        _id,
        title,
        imageId = undefined,
        description,
        categories,
        created_at,
        author: { name },
    },
}) => {
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
                {/* TODO - Add loading for image */}
                {imageId ? (
                    <Image url={`/api/post/image/${_id}`} />
                ) : (
                    <img className='card-img-top' alt='' src={noImg} />
                )}
                <div className='card-body'>
                    <h2 className='card-title'>{title}</h2>
                    {/* TODO - Remove this line - all descriptions will be formatted as html */}
                    {/* <p className='card-text'>{description}</p> */}
                    {/* <p className='card-text'>{showShortDesc(description)}</p> */}
                    <p>
                        Tags:{' '}
                        {categories.map((category) => (
                            <Fragment key={category._id}>
                                <span className='tag'>{category.title}</span>{' '}
                            </Fragment>
                        ))}
                    </p>
                    <Link to={`/post/${_id}`} className='btn btn-primary'>
                        Read More &rarr;
                    </Link>
                </div>
                <div className='card-footer text-muted'>
                    Posted on <Moment format='YYYY/MM/DD'>{created_at}</Moment>{' '}
                    by <a href='#/'>{name}</a>
                </div>
            </div>
        </Fragment>
    );
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostItem;
