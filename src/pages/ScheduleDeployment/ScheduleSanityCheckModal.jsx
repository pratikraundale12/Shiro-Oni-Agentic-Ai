import { isEmpty } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  InvalidProcessorIcon,
  RightCircleIcon,
  SanityCheckIcon,
  StarInfoIcon,
} from '../../assets';
import { Modal } from '../../shared';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import SanityCheckCollapsableItem from '../Namespaces/SanityCheckCollapsableItem';
import { NamespacesSelectors } from '../../store';
import { history } from '../../helpers/history';
// import { useEffect } from 'react';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 250px;
`;
const NotificationContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: rgb(245, 247, 250);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dde4f0;
  width: fit-content;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff7ed;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ea580c;
  width: fit-content;
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 400;
`;

const WarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const MessageText = styled.span`
  color: #374151;
  font-size: 14px;
  white-space: nowrap;
  margin-right: 16px;
`;

const ScheduleSanityCheckModal = () => {
  const dispatch = useDispatch();
  const sanityCheckData = useSelector(
    SchedularSelectors.getSanityAndDeployStatus
  );
  const responseData = useSelector(
    NamespacesSelectors.getSanityReportAuditData
  );

  const formatDate = isoString => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };
  const isOpen = useSelector(
    SchedularSelectors.getIsScheduleSanityCheckModalOpen
  );

  const handleScheduleTertiaryButton = () => {
    dispatch(SchedularActions.setIsSanityCheckScheduleModalOpen(true));
    dispatch(SchedularActions.setIsScheduleSanityCheckModalOpen(false));
    dispatch(SchedularActions.setIsDiffModalOpen(false));
  };
  const namespaceId =
    sanityCheckData?.data?.namespaceId ?? responseData?.data?.namespace_id;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InvalidProcessorIcon />
          {'Sanity Verification Report'}
        </div>
      }
      isOpen={isOpen}
      onRequestClose={() => {
        dispatch(SchedularActions.setIsScheduleSanityCheckModalOpen(false));
        // dispatch(NamespacesActions.setSanityReportAuditData(null));
      }}
      size="md"
      primaryButtonText={'Quick Fixes'}
      footerAlign="start"
      onSubmit={() => {
        dispatch(SchedularActions.setIsScheduleSanityCheckModalOpen(false));
        history.push(`/process-group/${namespaceId}`);
      }}
      contentStyles={{ maxWidth: '70%', maxHeight: '60%' }}
      secondaryButtonText="Close"
      tertiaryButton={true}
      tertiaryButtonConfig={{
        tertiaryButtonTest: isEmpty(sanityCheckData?.data || responseData?.data)
          ? 'Run Sanity Check'
          : 'Re-run Sanity Check',
        tertiaryButtonSubmit: handleScheduleTertiaryButton,
        tertiaryButtonDisable: true,
        tertiaryButtonIcon: <SanityCheckIcon />,
        variant: 'tertiary',
      }}
    >
      <ModalBody className="modal-body">
        <div className="d-flex gap-2 justify-content-between">
          <div className="d-flex gap-2">
            <NotificationContainer>
              <WarningIcon>
                <StarInfoIcon />
              </WarningIcon>
              <MessageText>Last Sanity Check Report</MessageText>
            </NotificationContainer>
            <ActionContainer>
              <MessageText>
                {responseData?.data?.updated_at
                  ? formatDate(responseData?.data?.updated_at)
                  : 'N/A'}
              </MessageText>
            </ActionContainer>
          </div>
          <div>
            {responseData?.data &&
              (isEmpty(
                sanityCheckData?.data || responseData?.data?.sanity_details
              ) ? (
                // ✅ No issues detected
                <div className="ml-4 flex items-center text-green-600">
                  <RightCircleIcon width="16" height="16" />
                  <span className="ml-2">
                    Sanity check passed with no errors or inconsistencies.
                  </span>
                </div>
              ) : (
                // ⚠️ Issues found
                <div className="ml-4 flex items-center text-red-600">
                  <InvalidProcessorIcon width="16" height="16" />
                  <span className="ml-2">
                    Sanity check identified potential configuration issues
                  </span>
                </div>
              ))}
          </div>
        </div>
        {!isEmpty(sanityCheckData?.data) &&
          sanityCheckData.data.map(item => {
            console.log(item); // side‑effect is fine here
            return (
              <span key={item?.processGroupId}>
                <SanityCheckCollapsableItem item={item} />
              </span>
            );
          })}
        {isEmpty(sanityCheckData?.data) &&
          responseData?.data?.sanity_details &&
          !isEmpty(responseData?.data?.sanity_details) &&
          responseData?.data?.sanity_details.map(item => (
            <span key={item?.namespace_id}>
              <SanityCheckCollapsableItem item={item} />
            </span>
          ))}
      </ModalBody>
    </Modal>
  );
};

export default ScheduleSanityCheckModal;
