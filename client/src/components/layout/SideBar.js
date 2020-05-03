import React, { Fragment, useState, useEffect } from 'react';
import ProfileContent from '../profile/ProfileContent';

export const SideBar = () => {
    const [isToggled, setIsToggled] = useState('');
    const [render, setRender] = useState('dashboard');

    const [isMyProfileActive, setIsMyProfileActive] = useState('active');
    const [isMyPostsActive, setIsMyPostsActive] = useState('');
    const [isEditProfileActive, setIsEditProfileActive] = useState('');
    const [isMyCommentsActive, setIsMyCommentsActive] = useState('');
    const [isMyHistoryActive, setIsMyHistoryActive] = useState('');

    useEffect(() => {
        if (isMyProfileActive === 'active') {
        } else if (isMyPostsActive === 'active') {
            setIsMyProfileActive('');
            setIsEditProfileActive('');
            setIsMyCommentsActive('');
            setIsMyHistoryActive('');
        } else if (isEditProfileActive === 'active') {
            setIsMyPostsActive('');
            setIsMyProfileActive('');
            setIsMyCommentsActive('');
            setIsMyHistoryActive('');
        } else if (isMyCommentsActive === 'active') {
            setIsMyPostsActive('');
            setIsMyProfileActive('');
            setIsEditProfileActive('');
            setIsMyHistoryActive('');
        } else {
            setIsMyPostsActive('');
            setIsMyProfileActive('');
            setIsEditProfileActive('');
            setIsMyCommentsActive('');
        }
    }, [
        render,
        isMyProfileActive,
        isMyPostsActive,
        isEditProfileActive,
        isMyCommentsActive,
        isMyHistoryActive,
    ]);

    return (
        <Fragment>
            <div className={`d-flex ${isToggled}`} id='wrapper'>
                {/* <!-- Sidebar --> */}
                <div className='bg-light border-right' id='sidebar-wrapper'>
                    <div className='sidebar-heading'>User Menu </div>
                    <div className='list-group list-group-flush'>
                        <span
                            id='operations'
                            className={`list-group-item list-group-item-action bg-light ${isMyProfileActive}`}
                            onClick={() => {
                                setRender('dashboard');
                                setIsMyProfileActive('active');
                                setIsMyPostsActive('');
                                setIsEditProfileActive('');
                                setIsMyCommentsActive('');
                                setIsMyHistoryActive('');
                            }}
                        >
                            My Profile
                        </span>
                        <span
                            id='operations'
                            className={`list-group-item list-group-item-action bg-light ${isMyPostsActive}`}
                            onClick={() => {
                                setRender('my-posts');
                                setIsMyProfileActive('');
                                setIsMyPostsActive('active');
                                setIsEditProfileActive('');
                                setIsMyCommentsActive('');
                                setIsMyHistoryActive('');
                            }}
                        >
                            My Posts
                        </span>
                        <span
                            id='operations'
                            className={`list-group-item list-group-item-action bg-light ${isEditProfileActive}`}
                            onClick={() => {
                                setRender('edit-profile');
                                setIsMyProfileActive('');
                                setIsMyPostsActive('');
                                setIsEditProfileActive('active');
                                setIsMyCommentsActive('');
                                setIsMyHistoryActive('');
                            }}
                        >
                            Edit Profile
                        </span>
                        <span
                            id='operations'
                            className={`list-group-item list-group-item-action bg-light ${isMyHistoryActive}`}
                            onClick={() => {
                                setRender('my-history');
                                setIsMyProfileActive('');
                                setIsMyPostsActive('');
                                setIsEditProfileActive('');
                                setIsMyCommentsActive('');
                                setIsMyHistoryActive('active');
                            }}
                        >
                            My History
                        </span>
                    </div>
                </div>
                {/* <!-- /#sidebar-wrapper --> */}

                {/* <!-- Page Content --> */}
                <div id='page-content-wrapper'>
                    <nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom'>
                        <button
                            className='btn btn-primary'
                            id='menu-toggle'
                            onClick={() => {
                                setIsToggled(isToggled === '' ? 'toggled' : '');
                            }}
                        >
                            Toggle Menu
                        </button>
                    </nav>

                    <div className='container-fluid'>
                        <ProfileContent render={render} />
                    </div>
                </div>
                {/* <!-- /#page-content-wrapper --> */}
            </div>
        </Fragment>
    );
};

export default SideBar;
