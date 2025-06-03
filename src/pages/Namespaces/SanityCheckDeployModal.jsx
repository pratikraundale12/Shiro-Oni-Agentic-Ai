// import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { NoDataIcon } from '../../assets';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { isEmpty } from 'lodash';
import SanityCheckCollapsableItem from './SanityCheckCollapsableItem';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../../helpers/history';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 250px;
`;
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const SanityCheckDeployModal = () => {
  const dispatch = useDispatch();
  const responseData = useSelector(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const isModalOpen = useSelector(
    NamespacesSelectors.getSanityCheckDeployModalOpen
  );

  const handleSecondaryClick = () => {
    dispatch(NamespacesActions.setSanityCheckDeployModalOpen(false));
    history.push(`/process-group/${responseData?.id}`);
    dispatch(NamespacesActions.setRegistryAllDetails({}));
    dispatch(NamespacesActions.setregistryDetailsFlow(true));
  };

  const handleRequestClose = () => {
    dispatch(NamespacesActions.setSanityCheckDeployModalOpen(false));
    dispatch(NamespacesActions.setSelectedNamespace({}));
    history.push('/process-group');
  };
  const sanityCheckData = responseData?.sanityResult || [
    {
      processGroupName: 'MYSQL',
      processGroupId: '2ff9fe2d-0197-1000-ffff-ffffd9f010c6',
      isParent: true,
      processors: [
        {
          processorName: 'Fetch Data from Orders table',
          processorId: '8437bf00-0e0c-385c-892e-d5c5e33b6675',
          errorMessage:
            "ip-172-31-42-111:8443 - Component is invalid: 'Database Connection Pooling Service' validated against 'a39de077-bbac-34ea-b9f3-bf97a65ec455' is invalid because Controller Service [Database Connection Pooling Service] Identifier [a39de077-bbac-34ea-b9f3-bf97a65ec455] state is Enabling",
        },
        {
          processorName: 'Fetch Data from customer',
          processorId: '44855eea-20c7-39cf-abcd-cdc6d89be675',
          errorMessage:
            "ip-172-31-42-111:8443 - Component is invalid: 'Database Connection Pooling Service' validated against 'cb657edc-12bc-38bf-a543-c37f892b49cf' is invalid because Invalid Controller Service: cb657edc-12bc-38bf-a543-c37f892b49cf is not a valid Controller Service Identifier",
        },
      ],
      controllerServices: [],
      hasError: true,
    },
    {
      processGroupName: 'FETCH DATA from Products',
      processGroupId: '9e9631c0-6613-35bf-b47d-536b5e03d054',
      isParent: false,
      processors: [
        {
          processorName: 'Fetch DATA FROM products table',
          processorId: '7621d101-dbfd-3225-a7a4-a50b054aadf3',
          errorMessage:
            "ip-172-31-42-111:8443 - Component is invalid: 'Database Connection Pooling Service' validated against 'df9f6015-cd83-307b-9dee-90cd40b27e90' is invalid because Controller Service [Database Connection Pooling Service] Identifier [df9f6015-cd83-307b-9dee-90cd40b27e90] state is Enabling",
        },
      ],
      controllerServices: [],
      hasError: true,
    },
    {
      processGroupName: 'FETCH ALL DATA',
      processGroupId: 'ff060f38-6472-3c63-ad9a-0f5745cbcfd6',
      isParent: false,
      processors: [
        {
          processorName: 'Fetch Data from Orders table',
          processorId: '34e80932-1710-3654-8bcd-d9bb6cfd9f9b',
          errorMessage:
            "ip-172-31-42-111:8443 - Component is invalid: 'Database Connection Pooling Service' validated against 'cb657edc-12bc-38bf-a543-c37f892b49cf' is invalid because Invalid Controller Service: cb657edc-12bc-38bf-a543-c37f892b49cf is not a valid Controller Service Identifier",
        },
        {
          processorName: 'Fetch DATA FROM products table',
          processorId: 'ee854985-c419-3996-95d1-ac19be576acc',
          errorMessage:
            "ip-172-31-42-111:8443 - Component is invalid: 'Database Connection Pooling Service' validated against 'df9f6015-cd83-307b-9dee-90cd40b27e90' is invalid because Controller Service [Database Connection Pooling Service] Identifier [df9f6015-cd83-307b-9dee-90cd40b27e90] state is Enabling",
        },
        {
          processorName: 'ExecuteSQL',
          processorId: '1b7da2d8-b805-371f-92be-276a3b9e7b04',
          errorMessage:
            "ip-172-31-42-111:8443 - Component is invalid: 'Database Connection Pooling Service' validated against '4198e723-83a5-3275-af6a-1f2dcd80e3ad' is invalid because Controller Service [Database Connection Pooling Service] Identifier [4198e723-83a5-3275-af6a-1f2dcd80e3ad] state is Enabling",
        },
        {
          processorName: 'Fetch Data from customer',
          processorId: 'f4596c2d-dece-35be-bb3d-99769945da2f',
          errorMessage:
            "ip-172-31-42-111:8443 - Component is invalid: 'Database Connection Pooling Service' validated against 'cb657edc-12bc-38bf-a543-c37f892b49cf' is invalid because Invalid Controller Service: cb657edc-12bc-38bf-a543-c37f892b49cf is not a valid Controller Service Identifier",
        },
      ],
      controllerServices: [],
      hasError: true,
    },
  ];

  return (
    <Modal
      title={'Sanity Check Details'}
      isOpen={isModalOpen}
      onRequestClose={() => handleRequestClose()}
      size="md"
      secondaryButtonText={'Process Group Details'}
      primaryButtonText={KDFM.CONTINUE}
      onSecondarySubmit={handleSecondaryClick}
      footerAlign="start"
      onSubmit={() => {
        dispatch(NamespacesActions.setSanityCheckDeployModalOpen(false));
        dispatch(NamespacesActions.setDeployedModal(true));
      }}
      contentStyles={{ maxWidth: '60%', maxHeight: '60%' }}
    >
      <ModalBody className="modal-body">
        {' '}
        {sanityCheckData &&
          !isEmpty(sanityCheckData) &&
          sanityCheckData?.map(item => (
            <span key={item?.processGroupId}>
              <SanityCheckCollapsableItem item={item} />
            </span>
          ))}
        {isEmpty(sanityCheckData) && (
          <div className="d-flex flex-column align-items-center mt-5">
            <NoDataIcon width={130} />
            <NoDataText>No Data Found!!</NoDataText>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

// SanityCheckDeployModal.propTypes = {

// };

export default SanityCheckDeployModal;
