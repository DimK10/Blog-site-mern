import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllUsers } from '../../actions/users';
import { v4 as uuidv4 } from 'uuid';
import Avatar from '../layout/Avatar';
import TreeLoading from '../layout/TreeLoading';

const Community = ({ getAllUsers, users: { users, loading } }) => {
    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);
    return (
        <Fragment>
            <div className='container'>
                <div className='jumbotron mt-3 mb-3'>
                    <h1 className='large-text primary'>
                        People On This Blog Site
                    </h1>
                </div>

                {!loading ? (
                    users.map((user) => (
                        <Fragment key={uuidv4()}>
                            <div className='profile bg-light'>
                                {/* <img
                        src='./images/team_01.jpg'
                        className='round-img'
                        alt=''
                    ></img> */}
                                {user.avatarId ? (
                                    <Avatar
                                        url={`/api/user/image/${user.avatarId}`}
                                        width={'13em'}
                                        height={'13em'}
                                        withFlex={false}
                                    />
                                ) : (
                                    <div className='d-flex mr-3 rounded-circle'>
                                        <i
                                            className='fas fa-user fa-5x'
                                            style={{ margin: '0 auto' }}
                                        ></i>
                                    </div>
                                )}
                                <div>
                                    <h2>{user.name}</h2>
                                    <p>{user.email}</p>
                                    <p>{user.about}</p>
                                </div>
                                <div>
                                    <h3>Interests</h3>
                                    <ul>
                                        {user.interests.map((interest) => (
                                            <li key={uuidv4()}>
                                                <i className='fas fa-check'></i>
                                                {interest.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Fragment>
                    ))
                ) : (
                    <TreeLoading />
                )}
            </div>
        </Fragment>
    );
};

Community.propTypes = {
    users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    users: state.users,
});

export default connect(mapStateToProps, { getAllUsers })(Community);
