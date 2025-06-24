import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ExclamationIcon,
  InvalidProcessorIcon,
  RightCircleIcon,
  SanityCheckIcon,
  StarInfoIcon,
} from '../../assets';
import { FullPageLoader } from '../../components';
import { Button, ModalWithIcon } from '../../shared';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import SanityCheckCollapsableItem from './SanityCheckCollapsableItem';

const DataWrapper = styled.div`
  width: 100%;
`;

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
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
const SanityVerifictionReport = () => {
  const dispatch = useDispatch();
  const [isSanityCheckModalOpen, setIsSanityCheckModalOpen] = useState(false);
  const sanityCheckData = useSelector(
    NamespacesSelectors.getSanityCheckDetailSectionData
  );
  const lastSanityReport = useSelector(
    NamespacesSelectors.getLastSanityReportData
  );

  const selectedNamespaceForDetail = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const namespace_Id = window.location.pathname.split('/').pop();

  const handledeployByRegistry = () => {
    dispatch(
      NamespacesActions.fetchSanityCheckSummaryData({
        id: selectedNamespaceForDetail?.id || namespace_Id,
      })
    );
    setIsSanityCheckModalOpen(false);
  };

  useEffect(() => {
    if (selectedNamespaceForDetail?.id || namespace_Id) {
      dispatch(
        NamespacesActions.fetchLastSanityReport({
          namespaceId: selectedNamespaceForDetail?.id || namespace_Id,
        })
      );
    }
  }, [dispatch, selectedNamespaceForDetail?.id, namespace_Id]);

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
  const loadingSanity = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchSanityCheckSummaryData')
  );

  return (
    <div>
      <FullPageLoader loading={loadingSanity} />
      <DataWrapper>
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <div className="d-flex gap-2 justify-content-between align-items-center">
            <div className="d-flex gap-2 align-items-center">
              <div className="w-auto ">
                {' '}
                <Button
                  size="md"
                  onClick={() => setIsSanityCheckModalOpen(true)}
                  variant="quaternary"
                >
                  <div
                    className="d-flex "
                    style={{ fontSize: '14px', fontWeight: '750' }}
                  >
                    <SanityCheckIcon height="24" width="24" />
                    {isEmpty(lastSanityReport?.data)
                      ? 'Run Sanity Check'
                      : 'Re-run Sanity Check'}
                  </div>
                </Button>
              </div>
              <div className="d-flex gap-2">
                <NotificationContainer>
                  <WarningIcon>
                    <StarInfoIcon />
                  </WarningIcon>
                  <MessageText>Last Sanity Check Report</MessageText>
                </NotificationContainer>
                <ActionContainer>
                  <MessageText>
                    {lastSanityReport?.data?.updated_at
                      ? formatDate(lastSanityReport?.data?.updated_at)
                      : 'No Sanity Performed Yet'}
                  </MessageText>
                </ActionContainer>
              </div>
            </div>
            <div>
              {!isEmpty(lastSanityReport?.data) &&
                (lastSanityReport?.data?.hasError ? (
                  /* ⚠️ Issues found */
                  <ActionContainerInvalid className="mx-4 flex items-center text-red-600">
                    <InvalidProcessorIcon width="16" height="16" />
                    <MessageTextSuccess className="ml-2 text-md">
                      Sanity check identified potential configuration errors
                    </MessageTextSuccess>
                  </ActionContainerInvalid>
                ) : (
                  /* ✅ No issues detected */
                  <ActionContainerSuccess className="mx-4 flex items-center text-green-600">
                    <RightCircleIcon width="16" height="16" />
                    <MessageTextSuccess className="ml-2 text-md">
                      Sanity check passed with no errors or inconsistencies.
                    </MessageTextSuccess>
                  </ActionContainerSuccess>
                ))}
            </div>
          </div>
          <div>
            {sanityCheckData &&
              !isEmpty(sanityCheckData) &&
              sanityCheckData?.map(item => (
                <span key={item?.processGroupId}>
                  <SanityCheckCollapsableItem item={item} />
                </span>
              ))}
            {isEmpty(sanityCheckData) &&
              lastSanityReport?.data?.sanity_details &&
              !isEmpty(lastSanityReport?.data?.sanity_details) &&
              lastSanityReport?.data?.sanity_details.map(item => (
                <span key={item?.processGroupId}>
                  <SanityCheckCollapsableItem item={item} />
                </span>
              ))}
          </div>
        </ScrollSetGrey>
      </DataWrapper>
      <ModalWithIcon
        title={'Sanity Check Confirmation'}
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
        icon={<ExclamationIcon height={120} width={150} />}
        isOpen={isSanityCheckModalOpen}
        onRequestClose={() => setIsSanityCheckModalOpen(false)}
        primaryText={'Do you want Sanity Check during Deployment?'}
        secondaryText={
          'Process group will be deployed in a stopped state and cannot be undone'
        }
        onSubmit={handledeployByRegistry}
      />
    </div>
  );
};

export default SanityVerifictionReport;
