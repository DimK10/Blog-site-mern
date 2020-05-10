import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from 'react-select';
import { updateUser } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

import Resizer from 'react-image-file-resizer';

const EditProfile = ({
    updateUser,
    updatedOptions,
    options,
    setAlert,
    auth: { user },
}) => {
    // Helper function to convert base64 to blob
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };

    const [formValues, setFormValues] = useState({
        avatar: user.avatarId ? b64toBlob(user.avatar, 'jpeg') : null,
        name: user.name,
        email: user.email,
        oldPassword: '',
        password: '',
        password2: '',
        about: user.about,
        interests: user.interests,
    });

    const {
        avatar,
        name,
        email,
        oldPassword,
        password,
        password2,
        about,
        interests,
    } = formValues;

    const [imagePreview, setImagePreview] = useState(
        user.avatar ? `data:image/jpeg;base64,${user.avatar}` : ''
    );

    const onSelectChange = (interests) => {
        if (interests && interests.length > 0) {
            setFormValues({
                ...formValues,
                ...{
                    interests: [...interests.map((interest) => interest.value)],
                },
            });
        } else {
            setFormValues({
                ...formValues,
                ...{ interests: [] },
            });
        }
    };

    const onAvatarChange = (e) => {
        setFormValues({ ...formValues, avatar: e.target.files[0] });
    };

    const onChange = (e) =>
        setFormValues({ ...formValues, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('newPasswords do not match', 'danger');
        } else {
            // TODO - regiterUser
            // Creat formData object and add values
            let formData = new FormData();
            // Resize image first to make file size also smaller

            Resizer.imageFileResizer(
                avatar,
                320,
                320,
                'JPEG',
                100,
                0,
                (uri) => {
                    console.log(uri);
                },
                'base64'
            );

            formData.append('avatar', avatar);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('oldPassword', oldPassword);
            formData.append('password', password);
            formData.append('about', about);
            formData.append('interests', JSON.stringify(interests));

            console.log(...formData);

            updateUser(formData, user._id);
        }
    };

    return (
        <Fragment>
            <div className='container'>
                <div className='jumbotron mt-3 mb-3'>
                    <h1 className='large-text primary'>Edit Profile</h1>
                    <p className='lead'>
                        <i className='fas fa-user'></i>
                        Edit your Profile!
                    </p>
                </div>
                <form className='form' onSubmit={(e) => onSubmit(e)}>
                    <div className='form-group'>
                        {imagePreview && (
                            <Fragment>
                                <label htmlFor='img-preview'>
                                    Image to upload
                                </label>

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
                                    if (e.target.files[0]) {
                                        setImagePreview(
                                            URL.createObjectURL(
                                                e.target.files[0]
                                            )
                                        );
                                        onAvatarChange(e);
                                    }
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
                            value={name}
                            onChange={(e) => onChange(e)}
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
                            value={email}
                            onChange={(e) => onChange(e)}
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='oldPasswordInput'>* oldPassword</label>
                        <input
                            type='password'
                            id='oldPasswordInput'
                            className='form-control'
                            placeholder='Old Password'
                            name='oldPassword'
                            onChange={(e) => onChange(e)}
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='newPasswordInput'>* newPassword</label>
                        <input
                            type='password'
                            id='newPasswordInput'
                            className='form-control'
                            placeholder='New Password'
                            name='password'
                            onChange={(e) => onChange(e)}
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='newPasswordInput2'>
                            * Re-Type newPassword
                        </label>
                        <input
                            type='password'
                            id='newPasswordInput2'
                            className='form-control'
                            placeholder='Confirm New Password'
                            name='password2'
                            onChange={(e) => onChange(e)}
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
                            value={about}
                            onChange={(e) => onChange(e)}
                        ></textarea>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='interests'>
                            interests (Choose one or more - optional)
                        </label>
                        <Select
                            defaultValue={updatedOptions}
                            isMulti={true}
                            isSearchable={true}
                            name='interests'
                            onChange={(interests) => {
                                onSelectChange(interests);
                            }}
                            options={options}
                        />
                    </div>
                    <div className='row mb-4'>
                        <div className='col'>
                            <button type='submit' className='btn btn-primary'>
                                Update Profile!
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

EditProfile.propTypes = {
    updateUser: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { updateUser, setAlert })(EditProfile);
