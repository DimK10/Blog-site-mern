import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateComment } from '../../actions/comment';

const EditComment = ({ updateComment, commentId, postId, userId, text }) => {
    const [commentText, setCommentText] = useState(text);

    const onChange = (e) => {
        setCommentText(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        updateComment(commentId, postId, userId, commentText);
    };

    return (
        <Fragment>
            <div className='blog-right-side'>
                <div className='card my-4'>
                    <h5 className='card-header'>Update Your Comment:</h5>
                    <div className='card-body'>
                        <form className='form' onSubmit={(e) => onSubmit(e)}>
                            <div className='form-group'>
                                <textarea
                                    value={commentText}
                                    onChange={(e) => onChange(e)}
                                    rows='3'
                                    style={{ width: '100%' }}
                                ></textarea>
                            </div>
                            <button type='submit' className='btn btn-primary'>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

EditComment.propTypes = {
    updateComment: PropTypes.func.isRequired,
    commentId: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default connect(null, { updateComment })(EditComment);
