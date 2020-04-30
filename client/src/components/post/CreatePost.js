import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getAllCategories } from '../../actions/category';

const CreatePost = ({
    getAllCategories,
    category: { categories, options, loading },
    auth: { isAuthenticated },
}) => {
    useEffect(() => {
        getAllCategories();
    }, [getAllCategories]);

    const [imagePreview, setImagePreview] = useState('');

    const [formValues, setFormValues] = useState({
        avatar: {},
        title: '',
        description: '',
        postCategories: [],
    });

    const { avatar, title, description, postCategories } = formValues;

    const handleEditorChange = (e) => {
        // console.log('Content was updated:', e.target.getContent());
        setFormValues({
            ...formValues,
            description: e.target.getContent(),
        });
    };

    const onSelectChange = (categories) => {
        if (categories && categories.length > 0) {
            setFormValues({
                ...formValues,
                ...{
                    postCategories: [
                        ...categories.map((category) => category.value),
                    ],
                },
            });
        } else {
            setFormValues({
                ...formValues,
                ...{ categories: [] },
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

        // TODO - regiterUser
        // Creat formData object and add values
        let formData = new FormData();
        formData.append('avatar', avatar);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('categories', JSON.stringify(postCategories));

        console.log(...formData);

        // registerUser(formData);
    };

    return (
        <Fragment>
            <div className='container'>
                {/* <!-- jumbotron --> */}
                <div className='jumbotron mt-3 mb-3'>
                    <h1 className='large-text primary'>Create a new Post!</h1>
                    <p className='lead'>Feel free to share your thoughts!</p>
                    <p>* required field</p>
                </div>
                {/* <!-- image upload --> */}
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
                                </div>
                            </Fragment>
                        )}
                    </div>
                    <div className='form-group'>
                        <div className='custom-file'>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='inputGroupFile01'
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
                            />
                            <label
                                className='custom-file-label'
                                htmlFor='inputGroupFile01'
                            >
                                Choose an image (optional)
                            </label>
                        </div>
                    </div>
                    {/* <!--image upload --> */}
                    <div className='form-group'>
                        <label htmlFor='titleInput'>* Title</label>
                        <input
                            type='text'
                            className='form-control'
                            id='titleInput'
                            placeholder="Post's Title"
                            name='title'
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                    <div className='form-group'>
                        {/* <!-- There is a tinyMCE fore react  link: https://www.tiny.cloud/docs/integrations/react/ --> */}
                        <label for='editor'>* Description</label>
                        <Editor
                            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                            init={{
                                height: 500,
                                menubar: true,
                                plugins: [
                                    'advlist autolink lists link image',
                                    'charmap print preview anchor help',
                                    'searchreplace visualblocks code',
                                    'insertdatetime media table paste wordcount',
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | link image media | help',
                            }}
                            onChange={handleEditorChange}
                        />{' '}
                    </div>
                    <div className='form-group'>
                        <label for='categories'>
                            * Categories - Tags (Choose one or more)
                        </label>
                        <Select
                            isMulti={true}
                            isSearchable={true}
                            name='categories'
                            onChange={(categories) => {
                                onSelectChange(categories);
                            }}
                            options={options}
                        />
                    </div>
                    <div className='row mb-4'>
                        <div className='col'>
                            <button type='submit' className='btn btn-primary'>
                                Submit
                            </button>
                            <button className='btn btn-alert'>
                                Preview Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

CreatePost.propTypes = {
    getAllCategories: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    category: state.category,
    auth: state.auth,
});

export default connect(mapStateToProps, { getAllCategories })(CreatePost);
