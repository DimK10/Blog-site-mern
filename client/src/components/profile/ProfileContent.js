import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Posts from '../posts/Posts';
import { connect } from 'react-redux';
import EditProfile from './EditProfile';
import ProfileDashboard from './ProfileDashboard';
import ProfileHistory from './ProfileHistory';
import { getAllCategories } from '../../actions/category';

const ProfileContent = ({
    render,
    getAllCategories,
    category: { options },
    auth: { user },
}) => {
    // In EditProfile component, the defaultValue prop is not set when i try to update the
    // updatedOptions state value using useEffect, the prop stays with the initial value
    // So i am retievind the data from the higher component in order to pass them as props in EditProfile

    useEffect(() => {
        getAllCategories();
    }, []);

    const [updatedOptions, setUpdatedOptions] = useState([]);

    useEffect(() => {
        setUpdatedOptions(
            options.filter(
                (option) =>
                    user.interests
                        .map((interest) => interest._id)
                        .indexOf(option.value) !== -1
            )
        );
    }, [options, user.interests]);

    const renderSelectedOption = () => {
        switch (render) {
            case 'dashboard':
                return <ProfileDashboard />;
            case 'my-posts':
                return <Posts isForOnUser={true} userId={user._id} />;
            case 'edit-profile':
                return (
                    <EditProfile
                        updatedOptions={updatedOptions}
                        options={options}
                    />
                );
            case 'my-history':
                return <ProfileHistory />;

            default:
                return <ProfileDashboard />;
        }
    };

    return <Fragment>{renderSelectedOption()}</Fragment>;
};

ProfileContent.propTypes = {
    getAllCategories: PropTypes.func.isRequired,
    render: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    category: state.category,
});

export default connect(mapStateToProps, { getAllCategories })(ProfileContent);
