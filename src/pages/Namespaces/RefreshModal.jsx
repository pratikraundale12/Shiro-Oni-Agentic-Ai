import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const RefreshModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(NamespacesSelectors.getRefreshmodalOpen);
  const handleClose = () => {
    dispatch(NamespacesActions.setRefreshmodalOpen(false));
  };
  return (
    <div>
      <Modal
        title=" Referencing Components"
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        size="md"
        // primaryButtonText={'Add'}
        // secondaryButtonText="Back"
        // contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
      ></Modal>
    </div>
  );
};

export default RefreshModal;
