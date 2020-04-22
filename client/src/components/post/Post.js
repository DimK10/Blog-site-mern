import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import ReactHtmlParser from 'react-html-parser';
import Moment from 'react-moment';
import Image from '../layout/Image';
import TreeLoading from '../layout/TreeLoading';
import noImg from '../../images/no-thumbnail-medium.png';

const Post = ({
    getPost,
    auth: { isAuthenticated },
    postObj: { post, loading },
    match,
}) => {
    useEffect(() => {
        getPost(match.params.id);
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
                            <div className='card my-4'>
                                <h5 className='card-header'>
                                    Leave a Comment:
                                </h5>
                                <div className='card-body'>
                                    <form>
                                        <div className='form-group'>
                                            <textarea
                                                className='form-control'
                                                rows='3'
                                            ></textarea>
                                        </div>
                                        <button
                                            type='submit'
                                            className='btn btn-primary'
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Single Comment --> */}
                        <div className='media mb-4'>
                            <img
                                className='d-flex mr-3 rounded-circle'
                                src='images/testi_01.png'
                                alt=''
                            ></img>
                            <div className='media-body'>
                                <h5 className='mt-0'>Commenter Name</h5>
                                Cras sit amet nibh libero, in gravida nulla.
                                Nulla vel metus scelerisque ante sollicitudin.
                                Cras purus odio, vestibulum in vulputate at,
                                tempus viverra turpis. Fusce condimentum nunc ac
                                nisi vulputate fringilla. Donec lacinia congue
                                felis in faucibus.
                            </div>
                        </div>

                        {/* <!-- Comment with nested comments --> */}
                        <div className='media mb-4'>
                            <img
                                className='d-flex mr-3 rounded-circle'
                                src='images/testi_02.png'
                                alt=''
                            ></img>
                            <div className='media-body'>
                                <h5 className='mt-0'>Commenter Name</h5>
                                Cras sit amet nibh libero, in gravida nulla.
                                Nulla vel metus scelerisque ante sollicitudin.
                                Cras purus odio, vestibulum in vulputate at,
                                tempus viverra turpis. Fusce condimentum nunc ac
                                nisi vulputate fringilla. Donec lacinia congue
                                felis in faucibus.
                                <div className='media mt-4'>
                                    <img
                                        className='d-flex mr-3 rounded-circle'
                                        src='images/testi_01.png'
                                        alt=''
                                    ></img>
                                    <div className='media-body'>
                                        <h5 className='mt-0'>Commenter Name</h5>
                                        Cras sit amet nibh libero, in gravida
                                        nulla. Nulla vel metus scelerisque ante
                                        sollicitudin. Cras purus odio,
                                        vestibulum in vulputate at, tempus
                                        viverra turpis. Fusce condimentum nunc
                                        ac nisi vulputate fringilla. Donec
                                        lacinia congue felis in faucibus.
                                    </div>
                                </div>
                                <div className='media mt-4'>
                                    <img
                                        className='d-flex mr-3 rounded-circle'
                                        src='images/testi_03.png'
                                        alt=''
                                    ></img>
                                    <div className='media-body'>
                                        <h5 className='mt-0'>Commenter Name</h5>
                                        Cras sit amet nibh libero, in gravida
                                        nulla. Nulla vel metus scelerisque ante
                                        sollicitudin. Cras purus odio,
                                        vestibulum in vulputate at, tempus
                                        viverra turpis. Fusce condimentum nunc
                                        ac nisi vulputate fringilla. Donec
                                        lacinia congue felis in faucibus.
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                                            <ul className='list-unstyled mb-0'>
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
                                                            <ul className='list-unstyled mb-0'>
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
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    postObj: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
