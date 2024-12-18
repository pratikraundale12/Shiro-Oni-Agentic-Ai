/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon } from '../../assets';
import { LoaderContainer } from '../../components';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import CollapsibleSection from './CollapsibleSection';

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
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const RefreshModal = ({ refreshItem }) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(NamespacesSelectors.getRefreshmodalOpen);
  const collapsibleData = refreshItem?.referencingComponents || [];
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
      {collapsibleData.length > 0 ? (
        collapsibleData.map(item => (
          <>
            <CollapsibleSection title={item.name}>
              <ReferencingBody>
                <ReferencingBodyHeading>
                  Referencing Processors
                </ReferencingBodyHeading>
                <ReferencingBodyUl>
                  {item?.processors?.length > 0 ? (
                    item.processors.map((service, index) => (
                      <ReferencingBodyLi key={index}>
                        {service?.name}
                      </ReferencingBodyLi>
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
                  {item?.controllerServices?.length > 0 ? (
                    item?.controllerServices?.map((service, index) => (
                      <ReferencingBodyLi key={index}>
                        {service?.name || 'none'}
                      </ReferencingBodyLi>
                    ))
                  ) : (
                    <ReferencingBodyLi key="none">None</ReferencingBodyLi>
                  )}
                </ReferencingBodyUl>
              </ReferencingBody>
            </CollapsibleSection>
          </>
        ))
      ) : (
        <LoaderContainer>
          <NoDataIcon width={140} />
          <NoDataText>No Data Found!!</NoDataText>
        </LoaderContainer>
      )}
    </Modal>
  );
};

export default RefreshModal;
