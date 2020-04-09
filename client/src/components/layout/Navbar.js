import React, { Fragment } from 'react';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../../images/logo-made/logo.jpg';
import Signin from '../auth/Signin';

const Navbar = (props) => {
    const guestLinks = (
        <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
                <a className='nav-link' href='./nature-blog-home.html'>
                    Home
                </a>
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
                <a className='nav-link' href='./nature-sign-up.html'>
                    Sign Up
                </a>
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
                    {<Fragment>{guestLinks}</Fragment>}
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {};

export default Navbar;
