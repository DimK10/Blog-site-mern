import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getAllCategories } from '../../actions/category';

const Signup = ({
    getAllCategories,
    category: { categories, options, loading },
}) => {
    // const [options, setOptions] = useState([]);
    const [categoriesSelected, setSelected] = useState([]);

    useEffect(() => {
        getAllCategories();
    }, [getAllCategories]);

    const onSelectChange = (categories) => console.log(categories);

    const onFileChange = (e) => console.log(e.target.files[0]);

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
                        <label>Profile Picture (optional)</label>
                        <div className='custom-file'>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='inputGroupFile01'
                                aria-describedby='inputGroupFileAddon01'
                                onChange={(e) => onFileChange(e)}
                            ></input>
                            <label
                                className='custom-file-label'
                                htmlFor='inputGroupFile01'
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
                            name='nameInput'
                            required=''
                            value=''
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
                            required=''
                            value=''
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
                            minlength='6'
                            value=''
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
                            minlength='6'
                            value=''
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='aboutTextarea'>
                            Tells Us More About Yourself
                        </label>
                        <textarea
                            className='form-control'
                            id='aboutTextarea'
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
                                onChange={(categories) =>
                                    onSelectChange(categories)
                                }
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
    category: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    category: state.category,
});

export default connect(mapStateToProps, { getAllCategories })(Signup);
