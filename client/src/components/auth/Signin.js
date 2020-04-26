import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';

const Signin = ({ login, isAuthenticated, location }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        login(email, password);
    };

    // Redirect if logged in
    if (isAuthenticated) {
        if (location.pathname) {
            // User was sent from a page, so redirect to that page
            return <Redirect to={location.state.prevPath} />;
        }
        return <Redirect to='/' />;
    }

    return (
        <Fragment>
            <div className='container'>
                <div className='jumbotron mt-3 mb-3'>
                    <h1 className='large-text primary'>Sign In</h1>
                    <p className='lead'>
                        <i className='fas fa-user'></i>
                        Sign Into Your Account
                    </p>
                </div>
                <form className='form' onSubmit={(e) => onSubmit(e)}>
                    <div className='form-group'>
                        <input
                            type='email'
                            className='form-control'
                            placeholder='Email Address'
                            name='email'
                            required=''
                            value={email}
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            className='form-control'
                            placeholder='Password'
                            name='password'
                            value={password}
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                    <input
                        type='submit'
                        className='btn btn-primary'
                        value='Login'
                    />
                </form>
                <p className='my-1'>
                    Don't have an account?
                    <a href='./nature-sign-up.html'>Sign Up</a>
                </p>
            </div>
        </Fragment>
    );
};

Signin.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Signin);
