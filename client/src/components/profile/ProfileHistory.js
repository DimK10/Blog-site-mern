import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const ProfileHistory = ({
    auth: {
        user: { history },
    },
}) => {
    return (
        // TODO - update auth data in redux
        <Fragment>
            <h1>Your History:</h1>
            <ul>
                {history.map((h) => {
                    let msg = '';

                    if (h.parent) {
                        msg = `You have ${h.action}d a ${h.type} in `;
                        return (
                            <li key={uuidv4()}>
                                <p>{msg}</p>
                                <Link to={`/post/${h.postId}`}>
                                    {' this post'}
                                </Link>
                            </li>
                        );
                    }

                    if (h.type === 'post') {
                        msg = `You have ${h.action}d a `;

                        return (
                            <li key={uuidv4()}>
                                <p>{msg}</p>
                                <Link to={`/post/${h.id}`}>new post</Link>
                            </li>
                        );
                    }

                    msg = `You have ${h.action}d a ${h.type}`;
                    return (
                        <li key={uuidv4()}>
                            <p>{msg}</p>
                        </li>
                    );
                })}
            </ul>
        </Fragment>
    );
};

ProfileHistory.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ProfileHistory);
