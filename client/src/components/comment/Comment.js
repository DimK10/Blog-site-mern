import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Avatar from '../layout/Avatar';
import EditComment from './EditComment';
import { deleteComment } from '../../actions/comment';
import AddReply from '../reply/AddReply';
import SecondaryLoading from '../layout/SecondaryLoading';
import Reply from '../reply/Reply';

//TODO - Move to comments folder
const Comment = ({
    deleteComment,
    comment: {
        _id: commentId,
        text,
        postId,
        userId: { _id, avatarId, name },
        replies = [],
    },
    commentState: {
        loadingReply,
        loadingOnUpdateReply,
        loadingOnDeleteReply,
        loadingOnDelete,
    },
    auth,
}) => {
    const { isAuthenticated, loading, user } = auth;

    const [isOnEdit, setIsOnEdit] = useState(false);

    const [onReply, setOnReply] = useState(false);

    const onClick = () => {
        deleteComment(commentId, postId, _id);
    };

    const onEditClick = () => {
        setIsOnEdit(!isOnEdit);
    };

    const onReplyClick = () => {
        setOnReply(!onReply);
    };

    const cancelReply = () => {
        setOnReply(false);
    };

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
                            {!loading && isAuthenticated && user.id === _id && (
                                <Fragment>
                                    {loadingOnDelete && (
                                        <SecondaryLoading width={'30px'} />
                                    )}
                                    <span
                                        id='operations'
                                        onClick={(e) => onEditClick()}
                                    >
                                        <i
                                            className='fas fa-edit pr-1'
                                            title='edit'
                                        ></i>
                                    </span>{' '}
                                    <span
                                        id='operations'
                                        onClick={(e) => onClick()}
                                    >
                                        <i
                                            className='far fa-trash-alt'
                                            title='delete'
                                        ></i>
                                    </span>
                                </Fragment>
                            )}
                        </div>
                    </h5>
                    {!isOnEdit ? (
                        <Fragment>
                            {!onReply ? (
                                <Fragment>
                                    {!loading &&
                                    isAuthenticated &&
                                    user.id === _id ? (
                                        <Fragment>
                                            {text}
                                            {'   '}
                                            <button
                                                className='btn btn-primary d-flex justify-content-end'
                                                onClick={() => onReplyClick()}
                                            >
                                                {' '}
                                                reply
                                            </button>
                                        </Fragment>
                                    ) : (
                                        <Fragment>{text}</Fragment>
                                    )}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    {text}
                                    <AddReply
                                        commentId={commentId}
                                        postId={postId}
                                        userId={user.id}
                                        cancelReply={cancelReply}
                                    />
                                </Fragment>
                            )}
                        </Fragment>
                    ) : (
                        <EditComment
                            commentId={commentId}
                            postId={postId}
                            userId={_id}
                            text={text}
                        />
                    )}
                    {replies &&
                        replies.map((reply) => (
                            <Reply
                                key={uuidv4()}
                                reply={reply}
                                postId={postId}
                                loadindReply={loadingReply}
                                loadingOnUpdateReply={loadingOnUpdateReply}
                                loadingOnDeleteReply={loadingOnDeleteReply}
                                auth={auth}
                            />
                        ))}
                </div>
            </div>
        </Fragment>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    commentState: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    commentState: state.comment,
});

export default connect(mapStateToProps, { deleteComment })(Comment);
