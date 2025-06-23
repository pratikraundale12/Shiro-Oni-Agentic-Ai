import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {
  InvalidProcessorIcon,
  NoDataIcon,
  RightCircleIcon,
  StarInfoIcon,
} from '../../assets';
// import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { isEmpty } from 'lodash';
import SanityCheckCollapsableItem from './SanityCheckCollapsableItem';
import { NamespacesSelectors } from '../../store';
import { useSelector } from 'react-redux';

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

const SanityCheckAuditLogReportModal = ({
  isSanityCheckModalOpen,
  setIsSanitCheckModalOpen,
}) => {
  const responseData = useSelector(
    NamespacesSelectors.getSanityReportAuditData
  );

  const handleSecondaryClick = () => {
    setIsSanitCheckModalOpen(false);
  };

  const handleRequestClose = () => {
    setIsSanitCheckModalOpen(false);
  };
  const sanityCheckData = responseData?.data?.sanity_details || [];
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

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {'Sanity Verification Report'}
        </div>
      }
      isOpen={isSanityCheckModalOpen}
      onRequestClose={() => handleRequestClose()}
      size="md"
      primaryButtonText={'Close'}
      onSecondarySubmit={handleSecondaryClick}
      footerAlign="start"
      onSubmit={() => {
        setIsSanitCheckModalOpen(false);
      }}
      contentStyles={{ maxWidth: '70%', maxHeight: '60%' }}
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
                sanityCheckData || responseData?.data?.sanity_details
              ) ? (
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
                    Sanity check identified potential configuration issues
                  </MessageTextSuccess>
                </ActionContainerInvalid>
              ))}
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
            <NoDataIcon width={130} />
            <NoDataText>No Data Found!!</NoDataText>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

SanityCheckAuditLogReportModal.propTypes = {
  isSanityCheckModalOpen: PropTypes.bool,
  setIsSanitCheckModalOpen: PropTypes.func,
};

export default SanityCheckAuditLogReportModal;
