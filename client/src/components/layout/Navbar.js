import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../../images/logo-made/logo.jpg';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
    const guestLinks = (
        <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
                <Link className='nav-link' to='/'>
                    Home
                </Link>
            </li>
            <li className='nav-item'>
                <a className='nav-link' href='./nature-blog-about.html'>
                    About
                </a>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signin'>
                    Sign In
                </Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signup'>
                    Sign Up
                </Link>
            </li>
        </ul>
    );

    const userLinks = (
        <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
                <Link className='nav-link' to='/'>
                    Home
                </Link>
            </li>
            <li className='nav-item'>
                <a className='nav-link' href='./nature-blog-view-profiles.html'>
                    Community
                </a>
            </li>
            <li className='nav-item'>
                <a className='nav-link' href='./nature-blog-about.html'>
                    About
                </a>
            </li>
            <li className='nav-item'>
                <a className='nav-link' href='./nature-blog-create-post.html'>
                    Create a Post
                </a>
            </li>
            <li className='nav-item'>
                <a
                    className='nav-link'
                    href='./nature-blog-create-category.html'
                >
                    Create a Category
                </a>
            </li>
            <li className='nav-item'>
                <div
                    style={{ cursor: 'pointer' }}
                    className='nav-link'
                    onClick={logout}
                >
                    Log Out
                </div>
            </li>
        </ul>
    );

    return (
        <nav className='navbar fixed-top navbar-expand-lg navbar-dark bg-light top-nav fixed-top'>
            <div className='row ml-2'>
                Logo created by
                <a
                    href='https://www.designevo.com/logo-maker/'
                    title='Free Online Logo Maker'
                >
                    DesignEvo logo maker
                </a>
            </div>
            <div className='container'>
                <a className='navbar-brand' href='index.html'>
                    <img
                        src={logo}
                        alt='logo'
                        style={{ width: '120px', height: '70px' }}
                    />
                </a>
                <button
                    className='navbar-toggler navbar-toggler-right'
                    type='button'
                    data-toggle='collapse'
                    data-target='#navbarResponsive'
                    aria-controls='navbarResponsive'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='fas fa-bars'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarResponsive'>
                    {/* //TODO - Add the links for user and admin */}
                    {/* {<Fragment>{guestLinks}</Fragment>} */}
                    {!loading && (
                        <Fragment>
                            {isAuthenticated ? userLinks : guestLinks}
                        </Fragment>
                    )}
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
