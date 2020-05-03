import React, { Fragment, useState } from 'react';
import ProfileContent from '../profile/ProfileContent';

export const SideBar = () => {
    const [isToggled, setIsToggled] = useState('');
    const [render, setRender] = useState('dashboard');

    return (
        <Fragment>
            <div className={`d-flex ${isToggled}`} id='wrapper'>
                {/* <!-- Sidebar --> */}
                <div className='bg-light border-right' id='sidebar-wrapper'>
                    <div className='sidebar-heading'>User Menu </div>
                    <div className='list-group list-group-flush'>
                        <span
                            id='operations'
                            className='list-group-item list-group-item-action bg-light'
                            onClick={() => {
                                setRender('my-posts');
                            }}
                        >
                            My Posts
                        </span>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            My Comments
                        </a>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            My History
                        </a>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            Edit Profile
                        </a>
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
