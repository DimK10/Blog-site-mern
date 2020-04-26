import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../layout/Avatar';

const Comment = ({
    comment: {
        text,
        userId: { avatarId, name },
        replies = [],
    },
}) => {
    return (
        <Fragment>
            {avatarId ? (
                <Avatar url={`/api/user/image${avatarId}`} />
            ) : (
                <div className='d-flex mr-3 rounded-circle'>
                    <i className='fas fa-user fa-2x'></i>
                </div>
            )}
            <div className='media-body'>
                <h5 className='mt-0'>{name}</h5>
                {text}
                {replies &&
                    replies.map((reply) => (
                        <div className='media mt-4'>
                            {reply.userId.avatarId ? (
                                <Avatar
                                    url={`/api/user/image${reply.userId.avatarId}`}
                                />
                            ) : (
                                <div className='d-flex mr-3 rounded-circle'>
                                    <i className='fas fa-user fa-2x'></i>
                                </div>
                            )}
                            <div className='media-body'>
                                <h5 class='mt-0'>{reply.userId.name}</h5>
                                {reply.text}
                            </div>
                        </div>
                    ))}
            </div>
        </Fragment>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
};

export default Comment;
