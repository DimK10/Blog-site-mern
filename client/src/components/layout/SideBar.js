import React, { Fragment, useState } from 'react';

export const SideBar = () => {
    const [isToggled, setIsToggled] = useState('');

    return (
        <Fragment>
            <div className={`d-flex ${isToggled}`} id='wrapper'>
                {/* <!-- Sidebar --> */}
                <div className='bg-light border-right' id='sidebar-wrapper'>
                    <div className='sidebar-heading'>Start Bootstrap </div>
                    <div className='list-group list-group-flush'>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            Dashboard
                        </a>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            Shortcuts
                        </a>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            Overview
                        </a>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            Events
                        </a>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            Profile
                        </a>
                        <a
                            href='#'
                            className='list-group-item list-group-item-action bg-light'
                        >
                            Status
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
                        <h1 className='mt-4'>Simple Sidebar</h1>
                        <p>
                            The starting state of the menu will appear collapsed
                            on smaller screens, and will appear non-collapsed on
                            larger screens. When toggled using the button below,
                            the menu will change.
                        </p>
                        <p>
                            Make sure to keep all page content within the{' '}
                            <code>#page-content-wrapper</code>. The top navbar
                            is optional, and just for demonstration. Just create
                            an element with the <code>#menu-toggle</code> ID
                            which will toggle the menu when clicked.
                        </p>
                    </div>
                </div>
                {/* <!-- /#page-content-wrapper --> */}
            </div>
        </Fragment>
    );
};

export default SideBar;
