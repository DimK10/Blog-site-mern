import React from 'react';
import { shallow } from 'enzyme';
import { Posts } from '../../../components/posts/Posts';
import posts from '../../fixtures/posts';

test('should render Posts Component (but not for a specific user) and call getPosts', () => {
    let props = {
        getPosts: jest.fn(),
        getUserPosts: jest.fn(),
        post: { posts },
    };

    let wrapper;

    let useEffect = jest
        .spyOn(React, 'useEffect')
        .mockImplementation((f) => f());

    wrapper = shallow(<Posts {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.getPosts).toHaveBeenCalledTimes(1);
    expect(props.getUserPosts).not.toHaveBeenCalled();
});

test('should render Posts Component for a specific user and call getUserPosts', () => {
    let useEffect = jest
        .spyOn(React, 'useEffect')
        .mockImplementation((f) => f());

    let props = {
        getPosts: jest.fn(),
        getUserPosts: jest.fn(),
        post: { posts },
        isForOnUser: true,
        userId: 'some-user-id',
    };

    let wrapper = shallow(<Posts {...props} />);

    expect(wrapper).toMatchSnapshot();
    expect(props.getUserPosts).toHaveBeenCalledTimes(1);
    expect(props.getUserPosts).toHaveBeenCalledWith(props.userId);
    expect(props.getPosts).not.toHaveBeenCalled();
});
