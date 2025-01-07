/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const ReferencingBody = styled.div`
  margin-bottom: 1rem;
`;

const ReferencingBodyHeading = styled.div`
  font-size: 16px;
`;

const ReferencingBodyUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ReferencingBodyLi = styled.li`
  color: var(--bs-gray-500);
`;

const ControllerServerRefreshModal = ({ refreshItem }) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(NamespacesSelectors.getRefreshmodalOpen);
  const collapsibleData =
    refreshItem?.referencingComponents ||
    refreshItem?.configuredData?.referencingComponents ||
    [];
  const handleClose = () => {
    dispatch(NamespacesActions.setRefreshmodalOpen(false));
  };

  return (
    <Modal
      title={`${refreshItem?.name || ''} Referencing Components`}
      isOpen={isModalOpen}
      onRequestClose={handleClose}
      size="md"
      contentStyles={{ maxWidth: '40%', maxHeight: '60%' }}
    >
      <ReferencingBody>
        <ReferencingBodyHeading>Referencing Processors</ReferencingBodyHeading>
        <ReferencingBodyUl>
          {collapsibleData?.processors?.length > 0 ? (
            collapsibleData?.processors?.map((service, index) => (
              <ReferencingBodyLi key={index}>{service?.name}</ReferencingBodyLi>
            ))
          ) : (
            <ReferencingBodyLi key="none">None</ReferencingBodyLi>
          )}
        </ReferencingBodyUl>
      </ReferencingBody>

      <ReferencingBody>
        <ReferencingBodyHeading>
          Referencing Controller Services
        </ReferencingBodyHeading>
        <ReferencingBodyUl>
          {collapsibleData?.controllerService?.length > 0 ? (
            collapsibleData?.controllerService?.map((service, index) => (
              <ReferencingBodyLi key={index}>
                {service?.name || 'none'}
              </ReferencingBodyLi>
            ))
          ) : (
            <ReferencingBodyLi key="none">None</ReferencingBodyLi>
          )}
        </ReferencingBodyUl>
      </ReferencingBody>
    </Modal>
  );
};

export default ControllerServerRefreshModal;
