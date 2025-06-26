import React from 'react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import SanityCheckCollapsableItem from './SanityCheckCollapsableItem';
import { InvalidProcessorIcon, RightCircleIcon } from '../../assets';

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

const ActionContainerSuccess = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid green;
  width: fit-content;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
`;
const ActionContainerInvalid = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid red;
  width: fit-content;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
`;

const MessageTextSuccess = styled.span`
  font-weight: 600;
  font-size: 16px;
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
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {'Sanity Verification Report'}
        </div>
      }
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
        <div className="d-flex gap-2 justify-content-end">
          <div>
            {isEmpty(sanityCheckData) ? (
              // ✅ No issues detected
              <ActionContainerSuccess className="mx-4 flex items-center text-green-600">
                <RightCircleIcon width="16" height="16" />
                <MessageTextSuccess className="ml-2 text-md">
                  Sanity check passed with no errors or inconsistencies.
                </MessageTextSuccess>
              </ActionContainerSuccess>
            ) : (
              // ⚠️ Issues found
              <ActionContainerInvalid className="mx-4 flex items-center text-red-600">
                <InvalidProcessorIcon width="16" height="16" />

                <MessageTextSuccess className="ml-2 text-md">
                  Sanity check identified potential configuration errors
                </MessageTextSuccess>
              </ActionContainerInvalid>
            )}
          </div>
        </div>{' '}
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
              Sanity check passed with no errors. Start the flow from the Flow
              Control tab in the Process Group Details page.
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
