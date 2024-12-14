import React from 'react';
import AppModal from './appModal';
import { Chip } from '@material-ui/core';

const Loader = ({ msg, ...rest }) => {

    return (
        <AppModal isOpen={true} style={{
            background: 'none',
            border: 'none',
            fontSize: '15px'
        }}>
            <Chip className='loading'
                icon={<><i className="fa fa-info-circle" aria-hidden="true" /></>}
                label={msg || `Loading...`}
            />
        </AppModal>
    )
}

export default Loader;