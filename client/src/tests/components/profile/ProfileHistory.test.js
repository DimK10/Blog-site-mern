import React from 'react';
import { shallow } from 'enzyme';
import ProfileHistory from '../../../components/profile/ProfileHistory';

let wrapped = shallow(<ProfileHistory />);

describe('ProfileHistory', () => {
    it('should render the ProfileHistory Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });

    it('should show the text Profile History', () => {
        expect(wrapped.find('Fragment').text()).toEqual('Profile history');
    });
});
