import React, { Fragment } from 'react';
import treeLoading from './treeLoading.gif';

export default () => {
    return (
        <Fragment>
            <img
                src={treeLoading}
                style={{ width: '50px', margin: 'auto', display: 'block' }}
                alt='Loading...'
            />
        </Fragment>
    );
};
