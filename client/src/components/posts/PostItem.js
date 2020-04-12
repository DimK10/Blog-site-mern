import React, { Fragment } from 'react';
import Moment from 'react-moment';
import stripHtml from 'string-strip-html';
import PropTypes from 'prop-types';
import noImg from '../../images/no-thumbnail-medium.png';
import { Link } from 'react-router-dom';

const PostItem = ({
    post: {
        _id,
        title,
        photoId = undefined,
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
                {photoId ? (
                    <img
                        className='card-img-top'
                        src={`/api/post/image/${_id}`}
                        alt=''
                    />
                ) : (
                    <img className='card-img-top' alt='' src={noImg} />
                )}
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
