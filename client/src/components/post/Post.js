import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost, getPostImage, deletePost } from '../../actions/post';
import { getComments } from '../../actions/comment';
import ReactHtmlParser from 'react-html-parser';
import { v4 as uuidv4 } from 'uuid';
import { NavLink, withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import Comment from '../comment/Comment';
import Image from '../layout/Image';
import TreeLoading from '../layout/TreeLoading';
import noImg from '../../images/no-thumbnail-medium.png';
import AddComment from '../comment/AddComment';

const Post = ({
    getPost,
    getPostImage,
    getComments,
    deletePost,
    auth: { isAuthenticated, loading: authLoading, user },
    postObj: {
        post: {
            _id: id,
            imageId,
            title,
            description,
            categories,
            loading,
            createdAt,
            author,
        },
    },
    comment: { comments, commentsLoading },
    match,
    location,
    history,
}) => {
    useEffect(() => {
        getPost(match.params.id);
        getPostImage(match.params.id);
        getComments(match.params.id);
    }, [getPost, getPostImage, getComments, match.params.id]);

    const onDeletePostBtnClick = async () => {
        // Delete post here and redirect to /
        await deletePost(id, author._id);
        history.push('/');
    };

    return loading || id === null ? (
        <div className='mt-5'>
            <TreeLoading />
        </div>
    ) : (
        <Fragment>
            {/* <!-- Page Content --> */}
            <div className='container'>
                <div className='breadcrumb-main'></div>

                <div className='row'>
                    {/* <!-- Post Content Column --> */}
                    <div className='col-lg-8 mt-5'>
                        {/* <!-- Preview Image --> */}
                        {imageId ? (
                            //TODO - Use Redux here - Remake the component below
                            <Image url={`/api/post/image/${match.params.id}`} />
                        ) : (
                            <img
                                className='img-fluid rounded'
                                src={noImg}
                                alt=''
                            ></img>
                        )}
                        <hr></hr>
                        {/* <!-- Date/Time --> */}
                        <Fragment>
                            <p>
                                Posted on{' '}
                                <Moment format='MMMM Do YYYY'>
                                    {createdAt}
                                </Moment>
                            </p>
                            {!authLoading &&
                                isAuthenticated &&
                                user._id === author._id && (
                                    <Fragment>
                                        <NavLink
                                            className='btn btn-primary mr-3'
                                            to={`/post/update/${id}`}
                                        >
                                            Update Post
                                        </NavLink>

                                        <button
                                            className='btn btn-alert'
                                            onClick={async () =>
                                                await onDeletePostBtnClick()
                                            }
                                        >
                                            Delete Post
                                        </button>
                                    </Fragment>
                                )}
                        </Fragment>
                        <hr></hr>
                        {/* <!-- Post Content --> */}
                        {<p className='lead'>{title}</p>}
                        {/* TODO - Remove after */}
                        {/* {<p>{post.description}</p>} */}
                        {ReactHtmlParser(description)}

                        <hr></hr>

                        <div className='blog-right-side'>
                            {/* <!-- Comments Form --> */}
                            {/* TODO - Mae comments functional */}
                            {isAuthenticated ? (
                                <AddComment postId={id} userId={user._id} />
                            ) : (
                                <div className='card my-4'>
                                    <h4>
                                        <NavLink
                                            exact
                                            to={{
                                                pathname: '/signin',
                                                state: {
                                                    prevPath: location.pathname,
                                                },
                                            }}
                                        >
                                            Sign In
                                        </NavLink>{' '}
                                        <span>to comment!</span>
                                    </h4>
                                    <br />
                                    <h5>
                                        <span>
                                            Not a User?{' '}
                                            <NavLink
                                                exact
                                                to={{
                                                    pathname: '/signup',
                                                    state: {
                                                        prevPath:
                                                            location.pathname,
                                                    },
                                                }}
                                            >
                                                Join Us!
                                            </NavLink>
                                        </span>
                                    </h5>
                                </div>
                            )}
                        </div>
                        {/* <!-- Comment with nested comments --> */}
                        {!commentsLoading ? (
                            <Fragment>
                                {/* TODO - Remove comments from post object returned from api */}
                                {comments &&
                                    comments.map((comment) => (
                                        <Comment
                                            comment={comment}
                                            key={uuidv4()}
                                            type='child'
                                        />
                                    ))}
                            </Fragment>
                        ) : (
                            <TreeLoading />
                        )}
                    </div>

                    {/* <!-- Sidebar Widgets Column --> */}
                    <div className='col-md-4 mt-4 blog-right-side'>
                        {/* <!-- Categories Widget --> */}
                        <div className='card my-4 sticky-top sticky-offset-15'>
                            {' '}
                            <h5 className='card-header'>Categories</h5>
                            <div className='card-body'>
                                <div className='row'>
                                    {categories.length > 0 ? (
                                        <Fragment>
                                            <div className='col-lg-6'>
                                                {categories.map(
                                                    (category, index) =>
                                                        index % 2 === 0 ? (
                                                            <ul
                                                                className='list-unstyled mb-0'
                                                                key={uuidv4()}
                                                            >
                                                                <li>
                                                                    <a href='#/'>
                                                                        {
                                                                            category.title
                                                                        }
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        ) : undefined
                                                )}
                                            </div>
                                            <div className='col-lg-6'>
                                                {categories.map(
                                                    (category, index) =>
                                                        index % 2 === 1 ? (
                                                            <ul
                                                                className='list-unstyled mb-0'
                                                                key={uuidv4()}
                                                            >
                                                                <li>
                                                                    <a href='#/'>
                                                                        {
                                                                            category.title
                                                                        }
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        ) : undefined
                                                )}
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <p>No Tags Added </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- /.row --> */}
            </div>
            {/* <!-- /.container --> */}
        </Fragment>
    );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    getPostImage: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    postObj: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    postObj: state.post,
    comment: state.comment,
});

export default withRouter(
    connect(mapStateToProps, {
        getPost,
        getPostImage,
        getComments,
        deletePost,
    })(Post)
);
