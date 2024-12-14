import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root')
Modal.defaultStyles.overlay.backgroundColor = 'rgba(95, 95, 95, 0.68)';
Modal.defaultStyles.overlay.zIndex = '9999';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '550px',
        maxHeight: '510px',
        borderRadius: '10px'
    }
};

const AppModal = ({ children, style = {}, ...props }) => {


    return (
        <Modal
            style={{
                content: { ...customStyles.content, ...style }
            }}
            {...props}>
            {children}
        </Modal>
    )
}

export default AppModal;