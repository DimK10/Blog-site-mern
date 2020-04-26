import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

const EditComment = ({ text }) => {
    const [commentText, setCommentText] = useState(text);

    const onChange = (e) => {
        setCommentText(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // TODO - Update comment here
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
    text: PropTypes.string.isRequired,
};

export default EditComment;
