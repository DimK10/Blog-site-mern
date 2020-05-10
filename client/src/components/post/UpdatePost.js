import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';
import { updatePost } from '../../actions/post';
import { getAllCategories } from '../../actions/category';
import TreeLoading from '../layout/TreeLoading';

const UpdatePost = ({
    getAllCategories,
    updatePost,
    category: { options, loading: categoriesLoading },
    post: { post },
    auth: { user },
    match,
}) => {
    useEffect(() => {
        getAllCategories();
    }, [getAllCategories]);

    useEffect(() => {
        setUpdatedOptions(
            options.filter(
                (option) =>
                    post.categories
                        .map((category) => category._id)
                        .indexOf(option.value) !== -1
            )
        );
    }, [options, post.categories]);

    const [updatedOptions, setUpdatedOptions] = useState([]);

    const [formValues, setFormValues] = useState({
        image: post.image ? post.image : null,
        title: post.title,
        description: post.description,
        postCategories: post.categories
            ? post.categories.map((category) => category._id)
            : [],
    });

    const { image, title, description, postCategories } = formValues;

    const [imagePreview, setImagePreview] = useState(
        post.image ? `data:image/jpeg;base64,${image}` : ''
    );

    if (!post._id) {
        // Redirect to original post
        return <Redirect to={`/post/${match.params.id}`} />;
    }

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

                postCategories: [
                    ...categories.map((category) => category.value),
                ],
            });
        } else {
            setFormValues({
                ...formValues,
                ...{ categories: [] },
            });
        }
    };

    const onImageChange = (e) => {
        setFormValues({ ...formValues, image: e.target.files[0] });
    };

    const onChange = (e) =>
        setFormValues({ ...formValues, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        // TODO - regiterUser
        // Creat formData object and add values
        let formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('categories', JSON.stringify(postCategories));

        // console.log(...formData);
        updatePost(post._id, user._id, formData);
    };

    return !categoriesLoading && updatedOptions.length > 0 ? (
        <Fragment>
            <div className='container'>
                {/* <!-- jumbotron --> */}
                <div className='jumbotron mt-3 mb-3'>
                    <h1 className='large-text primary'>Update Your Post!</h1>
                    <p className='lead'>
                        Fix that small mistake and make your post THE BEST!
                    </p>
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
                                                image: null,
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
                                        onImageChange(e);
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
                            defaultValue={post.title}
                        />
                    </div>
                    <div className='form-group'>
                        {/* <!-- There is a tinyMCE fore react  link: https://www.tiny.cloud/docs/integrations/react/ --> */}
                        <label htmlFor='editor'>* Description</label>
                        <Editor
                            initialValue={post.description}
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
                                    // eslint-disable-next-line
                                    'undo redo | formatselect | bold italic | \
                                    alignleft aligncenter alignright | \
                                    bullist numlist outdent indent | link image media | help',
                            }}
                            onChange={handleEditorChange}
                        />{' '}
                    </div>
                    <div className='form-group'>
                        <label htmlFor='categories'>
                            * Categories - Tags (Choose one or more)
                        </label>
                        <Select
                            defaultValue={updatedOptions}
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
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    ) : (
        <TreeLoading />
    );
};

UpdatePost.propTypes = {
    getAllCategories: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    category: state.category,
    post: state.post,
    auth: state.auth,
});

export default connect(mapStateToProps, { getAllCategories, updatePost })(
    UpdatePost
);
