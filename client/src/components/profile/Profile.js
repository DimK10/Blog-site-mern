import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SideBar from '../layout/SideBar';

const Profile = (props) => {
    return (
        <Fragment>
            <SideBar />
            Profile Page
        </Fragment>
    );
};

Profile.propTypes = {};

export default Profile;
