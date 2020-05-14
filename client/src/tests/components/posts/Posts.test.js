import React from 'react';
import { shallow } from 'enzyme';
import Posts from '../../../components/posts/Posts';
import posts from '../../fixtures/posts';
import toJson from 'enzyme-to-json';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('My connected React-Redux Posts Component', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({
            post: posts,
        });
    });

    component = renderer.create(
        <Provider store={store}>
            <Posts />
        </Provider>
    );

    it('should render Posts Component with given state from redux store', () => {
        expect(component.toJson()).toMatchSnapShot();
    });
});
