import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const ProfileDashboard = ({ auth: { loading, user } }) => {
    return (
        !loading && (
            <Fragment>
                <div className='card' style={{ height: '100vh' }}>
                    <div className='container'>
                        <div className='row ml-2'>
                            <h1>My Profile:</h1>
                        </div>
                        <div className='row ml-2 mr-2'>
                            <div className='rounded mx-auto d-block'>
                                {user.avatar ? (
                                    <img
                                        src={`data:image/jpeg;base64,${user.avatar}`}
                                        className='round-img'
                                        alt='user avatar'
                                        style={{
                                            width: '20rem',
                                            height: '20rem',
                                        }}
                                    />
                                ) : (
                                    <i className='fas fa-user-circle fa-10x'></i>
                                )}
                            </div>
                        </div>

                        <hr
                            style={{
                                width: '70%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        />
                        <div className='row ml-2 mr-2'>
                            <div className='col'>
                                <h3>Name: {user.name}</h3>
                            </div>
                        </div>
                        <hr
                            style={{
                                width: '70%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        />
                        <div className='row ml-2 mr-2'>
                            <div className='col'>
                                <h3>Email: {user.email}</h3>
                            </div>
                        </div>
                        <hr
                            style={{
                                width: '70%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        />
                        <div className='row ml-2 mr-2'>
                            <div className='col'>
                                <h3>About me:</h3>
                                <h5>{user.about}</h5>
                            </div>
                        </div>
                        <hr
                            style={{
                                width: '70%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        />
                        <div className='row ml-2 mr-2'>
                            <div className='col'>
                                <h3>Interests:</h3>
                                <ul>
                                    {user.interests.map((interest) => (
                                        <li key={uuidv4()}>{interest.title}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    );
};

ProfileDashboard.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(ProfileDashboard);
