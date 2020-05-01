import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { addComment } from '../../actions/comment';
import { connect } from 'react-redux';
import SecondaryLoading from '../layout/SecondaryLoading';

//TODO - Move to comments folder
const AddComment = ({ postId, userId, addComment, comment }) => {
    const [commentText, setCommentText] = useState('');

    //TODO - Change to a loading animation

    const onChange = (e) => {
        setCommentText(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        addComment(postId, userId, commentText);
    };

    return (
        <Fragment>
            <div className='card my-4'>
                <h5 className='card-header'>Leave a Comment:</h5>
                <div className='card-body'>
                    <form className='form' onSubmit={(e) => onSubmit(e)}>
                        <div className='form-group'>
                            <textarea
                                className='form-control'
                                rows='3'
                                onChange={(e) => onChange(e)}
                            ></textarea>
                        </div>
                        <div className='d-flex justify-content-start'>
                            <button type='submit' className='btn btn-primary'>
                                Submit
                            </button>
                            {comment.loading && <SecondaryLoading />}
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

AddComment.propTypes = {
    postId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    addComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    comment: state.comment,
});

export default connect(mapStateToProps, { addComment })(AddComment);
