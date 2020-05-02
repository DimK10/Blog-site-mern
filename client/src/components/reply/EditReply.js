import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { updateReply } from '../../actions/reply';
import { connect } from 'react-redux';

const EditReply = ({ updateReply, replyId, postId, userId, text }) => {
    const [replyText, setReplyText] = useState(text);

    const onChange = (e) => {
        setReplyText(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        updateReply(replyId, postId, userId, replyText);
    };

    return (
        <Fragment>
            <div className='blog-right-side'>
                <div className='card my-4'>
                    <h5 className='card-header'>Update Your Reply:</h5>
                    <div className='card-body'>
                        <form className='form' onSubmit={(e) => onSubmit(e)}>
                            <div className='form-group'>
                                <textarea
                                    value={replyText}
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

EditReply.propTypes = {
    updateReply: PropTypes.func.isRequired,
    replyId: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default connect(null, { updateReply })(EditReply);
