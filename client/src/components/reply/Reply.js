import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../layout/Avatar';
import SecondaryLoading from '../layout/SecondaryLoading';
import { deleteReply } from '../../actions/reply';
import { connect } from 'react-redux';
import EditReply from './EditReply';

const Reply = ({
    deleteReply,
    reply: { _id, userId, text },
    postId,
    loadingReply,
    loadingOnUpdateReply,
    loadingOnDeleteReply,
    auth: { isAuthenticated, loading, user },
}) => {
    const [isOnEdit, setIsOnEdit] = useState(false);

    const onClick = () => {
        // TODO - Add postId to reply object in response
        deleteReply(_id, postId, userId._id);
    };

    const onEditClick = (e) => {
        setIsOnEdit(!isOnEdit);
    };

    return (
        <Fragment>
            <div className='media mt-4'>
                {userId.avatarId ? (
                    <Avatar url={`/api/user/image${userId.avatarId}`} />
                ) : (
                    <div className='d-flex mr-3 rounded-circle'>
                        <i className='fas fa-user fa-2x'></i>
                    </div>
                )}
                <div className='media-body'>
                    <div>
                        <h5 className='mt-0'>
                            {userId.name}
                            {/* TODO - STOP FETCHING DATA WITH FULL USER OBJECT!!! */}
                            {!loading &&
                                isAuthenticated &&
                                user.id === userId._id && (
                                    <Fragment>
                                        {loadingOnDeleteReply && (
                                            <SecondaryLoading width={'30px'} />
                                        )}
                                        <span
                                            id='operations'
                                            onClick={(e) => onEditClick(e)}
                                        >
                                            <i
                                                className='fas fa-edit pr-1'
                                                title='edit'
                                            ></i>
                                        </span>{' '}
                                        <span
                                            id='operations'
                                            onClick={() => onClick()}
                                        >
                                            <i
                                                className='far fa-trash-alt'
                                                title='delete'
                                            ></i>
                                        </span>
                                    </Fragment>
                                )}
                        </h5>
                        {isOnEdit && (
                            <EditReply
                                replyId={_id}
                                postId={postId}
                                userId={userId._id}
                                text={text}
                            />
                        )}
                    </div>
                    {text}
                    {loadingOnUpdateReply && <SecondaryLoading />}
                </div>
            </div>
        </Fragment>
    );
};

Reply.propTypes = {
    reply: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteReply: PropTypes.func.isRequired,
};

export default connect(null, { deleteReply })(Reply);
