import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Posts from '../posts/Posts';
import { connect } from 'react-redux';

const ProfileContent = ({ render, auth: { user } }) => {
    const renderSelectedOption = () => {
        switch (render) {
            case 'dashboard':
                return <p>Dashboard</p>;
            case 'my-posts':
                return <Posts isForOnUser={true} userId={user.id} />;

            default:
                break;
        }
    };

    return <Fragment>{renderSelectedOption()}</Fragment>;
};

ProfileContent.propTypes = {
    render: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ProfileContent);
