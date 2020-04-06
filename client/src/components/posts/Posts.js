import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import { connect } from 'react-redux';
import PostItem from './PostItem';

const Posts = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    return (
        <Fragment>
            {/* <!-- full Title --> */}
            <div className='full-title'>
                <div className='container'>
                    {/* <!-- Page Heading/Breadcrumbs --> */}
                    <h1 className='mt-4 mb-3'>Welcome To Nature's Blog!</h1>
                    <h3 className='mt-4 mb-3'>
                        A blog that is all about nature!
                    </h3>
                </div>
            </div>
            {/* <!-- Page Content --> */}
            <div className='container'>
                <div className='row'>
                    {/* <!-- Blog Entries Column --> */}
                    <div className='col-md-8 mt-5 blog-entries'>
                        {posts.map((post) => (
                            <PostItem key={post._id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mpaStateToProps = (state) => ({
    post: state.post,
});

export default connect(mpaStateToProps, { getPosts })(Posts);
