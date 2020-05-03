import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Posts from '../posts/Posts';
import { connect } from 'react-redux';
import EditProfile from './EditProfile';
import ProfileDashboard from './ProfileDashboard';
import ProfileHistory from './ProfileHistory';

const ProfileContent = ({ render, auth: { user } }) => {
    const renderSelectedOption = () => {
        switch (render) {
            case 'dashboard':
                return <ProfileDashboard />;
            case 'my-posts':
                return <Posts isForOnUser={true} userId={user.id} />;
            case 'edit-profile':
                return <EditProfile />;
            case 'my-history':
                return <ProfileHistory />;

            default:
                return <ProfileDashboard />;
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
