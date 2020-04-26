import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Avatar from '../layout/Avatar';

const Comment = ({
    comment: {
        text,
        userId: { _id, avatarId, name },
        replies = [],
    },
    auth: { isAuthenticated, loading, user },
}) => {
    return (
        <Fragment>
            <div className='media mb-4'>
                {avatarId ? (
                    <Avatar url={`/api/user/image${avatarId}`} />
                ) : (
                    <div className='d-flex mr-3 rounded-circle'>
                        <i className='fas fa-user fa-2x'></i>
                    </div>
                )}
                <div className='media-body'>
                    <h5 className='mt-0'>
                        {name}{' '}
                        <div className='d-flex justify-content-end'>
                            {!loading && isAuthenticated && user._id === _id && (
                                <Fragment>
                                    <span onClick={(e) => console.log(e)}>
                                        <i
                                            className='fas fa-edit pr-1'
                                            title='edit'
                                        ></i>
                                    </span>{' '}
                                    <span>
                                        <i
                                            className='far fa-trash-alt'
                                            title='delete'
                                        ></i>
                                    </span>
                                </Fragment>
                            )}
                        </div>
                    </h5>
                    {text}
                    {replies &&
                        replies.map((reply) => (
                            <div key={uuidv4()}>
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
                                        <h5 className='mt-0'>
                                            {reply.userId.name}
                                        </h5>
                                        {reply.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </Fragment>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Comment);
