import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import { getComments } from '../../actions/comment';
import ReactHtmlParser from 'react-html-parser';
import { v4 as uuidv4 } from 'uuid';
import { NavLink } from 'react-router-dom';
import Moment from 'react-moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Comment from './Comment';
import Image from '../layout/Image';
import TreeLoading from '../layout/TreeLoading';
import noImg from '../../images/no-thumbnail-medium.png';
import AddComment from './AddComment';

const Post = ({
    getPost,
    getComments,
    auth: { isAuthenticated },
    postObj: { post, loading },
    comment: { comments, commentsLoading },
    match,
    location,
}) => {
    useEffect(() => {
        getPost(match.params.id);
        getComments(match.params.id);
    }, [getPost]);

    return loading || post === null ? (
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
                        {post.imageId ? (
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
                        <p>
                            Posted on{' '}
                            <Moment format='MMMM Do YYYY'>
                                {post.createdAt}
                            </Moment>
                        </p>
                        <hr></hr>
                        {/* <!-- Post Content --> */}
                        {<p className='lead'>{post.title}</p>}
                        {/* TODO - Remove after */}
                        {<p>{post.description}</p>}
                        {/* <p>{ReactHtmlParser(JSON.parse(post.description))}</p> */}

                        <hr></hr>

                        <div className='blog-right-side'>
                            {/* <!-- Comments Form --> */}
                            {/* TODO - Mae comments functional */}
                            {isAuthenticated ? (
                                <AddComment
                                    postId={post._id}
                                    userId={post.author._id}
                                />
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
                                    {post.categories.length > 0 ? (
                                        <Fragment>
                                            <div className='col-lg-6'>
                                                {post.categories.map(
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
                                                {post.categories.map(
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
    auth: PropTypes.object.isRequired,
    postObj: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    postObj: state.post,
    comment: state.comment,
});

export default connect(mapStateToProps, { getPost, getComments })(Post);
