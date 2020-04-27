import React, { Fragment } from 'react';
import loadingSecondary from '../../images/loading/loading-secondary.gif';

export const SecondaryLoading = ({ width = '50px' }) => {
    return (
        <Fragment>
            <img
                src={loadingSecondary}
                style={{ width, display: 'block' }}
                alt='Loading...'
            />
        </Fragment>
    );
};

export default SecondaryLoading;
