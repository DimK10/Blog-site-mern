import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addReply } from '../../actions/reply';

const AddReply = ({ addReply, commentId, postId, userId, cancelReply }) => {
    const [replyText, setReplyText] = useState('');

    const onChange = (e) => {
        setReplyText(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        addReply(replyText, commentId, postId, userId);
    };
    return (
        <Fragment>
            <div className='blog-right-side'>
                <div className='card my-4'>
                    <h5 className='card-header'>Leave a Reply:</h5>
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
                            <button
                                type='button'
                                className='btn btn-secondary'
                                onClick={cancelReply}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

AddReply.propTypes = {
    commentId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    cancelReply: PropTypes.func.isRequired,
};

export default connect(null, { addReply })(AddReply);
