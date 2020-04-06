import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import { connect } from 'react-redux';

const Posts = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);
    return <div>Posts page</div>;
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mpaStateToProps = (state) => ({
    post: state.post,
});

export default connect(mpaStateToProps, { getPosts })(Posts);
