import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

const AddReply = ({ text }) => {
    const [replyText, setReplyText] = useState('');

    const onChange = (e) => {
        setReplyText(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // addComment(postId, userId, commentText);
    };
    return (
        <Fragment>
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
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

AddReply.propTypes = {};

export default AddReply;
