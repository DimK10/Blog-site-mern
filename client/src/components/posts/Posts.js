import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPosts, getUserPosts } from '../../actions/post';
import PostItem from './PostItem';

const Posts = ({
    getPosts,
    getUserPosts,
    location,
    auth: { user },
    post: { posts, loading },
    isForOnUser = false,
    userId = '',
}) => {
    useEffect(() => {
        if (isForOnUser && userId !== '') {
            getUserPosts(userId);
        } else {
            getPosts();
        }
    }, [getUserPosts, getPosts]);

    return (
        <Fragment>
            {/* TODO - Make this a static component so that alerts are shown under it */}
            {/* <!-- full Title --> */}
            {!isForOnUser && userId === '' ? (
                <div className='full-title'>
                    <div className='container'>
                        {/* <!-- Page Heading/Breadcrumbs --> */}
                        <h1 className='mt-4 mb-3'>Welcome To Nature's Blog!</h1>
                        <h3 className='mt-4 mb-3'>
                            A blog that is all about nature!
                        </h3>
                    </div>
                </div>
            ) : (
                <h2>My Posts</h2>
            )}
            {/* <!-- Page Content --> */}
            <div className='container'>
                <div className='row'>
                    {/* <!-- Blog Entries Column --> */}
                    <div className='col-md-8 mt-5 blog-entries'>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <PostItem key={post._id} post={post} />
                            ))
                        ) : (
                            <h2>No Posts</h2>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    getUserPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
    auth: state.auth,
});

export default withRouter(
    connect(mapStateToProps, { getPosts, getUserPosts })(Posts)
);
