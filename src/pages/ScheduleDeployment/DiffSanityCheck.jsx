import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  InvalidProcessorIcon,
  SanityCheckIcon,
  StarInfoIcon,
} from '../../assets';
import { Button } from '../../shared';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import SanityCheckCollapsableItem from '../Namespaces/SanityCheckCollapsableItem';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const DataWrapper = styled.div`
  width: 100%;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  height: calc(100vh - 410px);
  max-height: calc(100vh - 410px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const BottomButtonWrapper = styled.div`
  padding: 1rem;
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

const DiffSanityCheck = () => {
  const dispatch = useDispatch();
  const sanityCheckData = useSelector(
    SchedularSelectors.getSanityAndDeployStatus
  );
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
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

  // Reset modal state when component mounts
  useEffect(() => {
    dispatch(SchedularActions.setIsSanityCheckScheduleModalOpen(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      NamespacesActions.fetchSanityReportAuditLog(
        sanityCheckData?.id || selectedSchedule?.last_sanity_check_id
      )
    );
  }, [dispatch]);
  const handleSanityCheck = () => {
    dispatch(SchedularActions.setIsSanityCheckScheduleModalOpen(true));
    dispatch(SchedularActions.setIsDiffModalOpen(false));
  };

  return (
    <>
      <DataWrapper>
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <div className="d-flex gap-2">
            <NotificationContainer>
              <WarningIcon>
                <StarInfoIcon />
              </WarningIcon>
              <MessageText>Last Sanity Check Report</MessageText>
            </NotificationContainer>
            <ActionContainer>
              <MessageText>
                {formatDate(responseData?.data?.updated_at)}{' '}
                <span>
                  {responseData?.data?.hasError === true
                    ? 'Last sanity check detected some issues'
                    : responseData?.data?.hasError === false
                      ? 'Last sanity check had no issue'
                      : ''}
                </span>
              </MessageText>
            </ActionContainer>
          </div>
          <BottomButtonWrapper className="d-flex">
            <div className="col-2 ">
              {' '}
              <Button
                size="md"
                variant="quaternary"
                type="button"
                onClick={handleSanityCheck}
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <SanityCheckIcon height="24" width="24" />
                  Sanity Check
                </div>
              </Button>
            </div>
            {!isEmpty(sanityCheckData?.data) && (
              <div className="ml-4">
                <InvalidProcessorIcon />
                <span>Sanity check detected some issues</span>
              </div>
            )}
          </BottomButtonWrapper>
          {sanityCheckData?.data &&
            !isEmpty(sanityCheckData?.data) &&
            sanityCheckData?.data?.map(item => (
              <span key={item?.processGroupId}>
                <SanityCheckCollapsableItem item={item} />
              </span>
            ))}
        </ScrollSetGrey>
      </DataWrapper>
    </>
  );
};

export default DiffSanityCheck;
