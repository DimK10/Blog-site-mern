import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getAllCategories } from '../../actions/category';
import { registerUser } from '../../actions/auth';

const Signup = ({
    getAllCategories,
    setAlert,
    category: { categories, options, loading },
}) => {
    const [formValues, setFormValues] = useState({
        avatar: {},
        name: '',
        email: '',
        password: '',
        password2: '',
        about: '',
        interests: [],
    });

    const {
        avatar,
        name,
        email,
        password,
        password2,
        about,
        interests,
    } = formValues;

    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        getAllCategories();
    }, [getAllCategories]);

    // const onSelectChange = (categories) => console.log(categories);

    // const onFileChange = (e) => console.log(e.target.files[0]);

    const onChange = (e) =>
        setFormValues({ ...formValues, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Password do not match', 'danger');
        } else {
            // TODO - regiterUser
            // Creat formData object and add values
            let formData = new FormData();
            formData.append('avatar', avatar);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('about', about);
            formData.append('interests', interests);

            registerUser(formData);
        }
    };

    return (
        <Fragment>
            <div className='container'>
                <div className='jumbotron mt-3 mb-3'>
                    <h1 className='large-text primary'>Sign Up</h1>
                    <p className='lead'>
                        <i className='fas fa-user'></i>
                        Create A New Account
                    </p>
                </div>
                <form className='form'>
                    <div className='form-group'>
                        {imagePreview && (
                            <Fragment>
                                <label htmlFor='img-preview'>
                                    Image to upload
                                </label>
                                <div className=''>
                                    <div className='text-center col-xxs-12 col-xs-10'>
                                        <img
                                            src={imagePreview}
                                            id='img-preview'
                                            className='rounded '
                                            style={{
                                                width: '200px',
                                                height: '200px',
                                            }}
                                            alt='img_preview'
                                        ></img>

                                        <i
                                            className='fas fa-times-circle fa-2x'
                                            style={{
                                                position: 'absolute',
                                                color: 'Tomato',
                                            }}
                                            onClick={() => {
                                                setImagePreview('');
                                                setFormValues({
                                                    ...formValues,
                                                    avatar: null,
                                                });
                                            }}
                                        ></i>

                                        {/* <div className='col-auto pl-0'>
                                            {' '}
                                            <i className='fas fa-times-circle'></i>
                                        </div> */}
                                    </div>
                                </div>
                            </Fragment>
                        )}
                    </div>
                    <div className='form-group'>
                        <label>Profile Picture (optional)</label>
                        <div className='custom-file'>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='avatar'
                                aria-describedby='inputGroupFileAddon01'
                                onChange={(e) => {
                                    setImagePreview(
                                        URL.createObjectURL(e.target.files[0])
                                    );
                                    onChange(e);
                                }}
                            ></input>
                            <label
                                className='custom-file-label'
                                htmlFor='avatar'
                            >
                                Choose a profile image
                            </label>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='nameInput'>* Name</label>
                        <input
                            id='nameInput'
                            className='form-control'
                            placeholder='Profile Name'
                            name='name'
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='emailInput'>* Email</label>
                        <input
                            type='email'
                            id='emailInput'
                            className='form-control'
                            placeholder='Email Address'
                            name='email'
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='passwordInput'>* Password</label>
                        <input
                            type='password'
                            id='passwordInput'
                            className='form-control'
                            placeholder='Password'
                            name='password'
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='passwordInput2'>
                            * Re-Type Password
                        </label>
                        <input
                            type='password'
                            id='passwordInput2'
                            className='form-control'
                            placeholder='Confirm Password'
                            name='password2'
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='aboutTextarea'>
                            Tells Us More About Yourself
                        </label>
                        <textarea
                            className='form-control'
                            id='aboutTextarea'
                            name='about'
                            rows='3'
                        ></textarea>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='interests'>
                            interests (Choose one or more - optional)
                        </label>
                        {!loading && (
                            <Select
                                isMulti={true}
                                isSearchable={true}
                                name='interests'
                                onChange={(categories) => {
                                    categories.map((category) =>
                                        onChange(category.value)
                                    );
                                }}
                                options={options}
                            />
                        )}
                        {/* <select
                            id='interests'
                            className='js-example-basic-multiple'
                            name='categories[]'
                            multiple='multiple'
                            style='width: 100%'
                        >
                            <option value='general'>General</option>
                            ...
                            <option value='animals'>Animals</option>
                            <option value='nature'>Nature</option>
                        </select> */}
                    </div>
                    <div className='row mb-4'>
                        <div className='col'>
                            <button type='submit' className='btn btn-primary'>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

Signup.propTypes = {
    getAllCategories: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    category: state.category,
});

export default connect(mapStateToProps, { getAllCategories, setAlert })(Signup);
