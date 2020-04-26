import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { addComment } from '../../actions/comment';
import { connect } from 'react-redux';

//TODO - Move to comments folder
const SubmitComment = ({ postId, userId, addComment }) => {
    const [commentText, setCommentText] = useState('');

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
                        <button type='submit' className='btn btn-primary'>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

SubmitComment.propTypes = {
    postId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(SubmitComment);
