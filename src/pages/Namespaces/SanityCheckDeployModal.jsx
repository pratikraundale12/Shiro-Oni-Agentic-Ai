// import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
// import { NoDataIcon } from '../../assets';
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
  const sanityCheckData = responseData?.sanityResult || [];

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
            <NoDataText>
              Sanity check has been performed successfully, with no issues
              detected. You can now start the flow.
            </NoDataText>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

// SanityCheckDeployModal.propTypes = {

// };

export default SanityCheckDeployModal;
