/* eslint-disable no-unused-vars */
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  CrossWithCircleIcon,
  DeleteDustbinIcon,
  // HoldIcon,
  PencilIcon,
  RejectIcon,
  TickIconWithCircle,
} from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { history } from '../../helpers/history';
import { ModalWithIcon } from '../../shared';
import { AuthenticationSelectors } from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { ApproverGroupDisplay } from './ApproverGroupDisplay';
import { RejectScheduleModal } from './RejectScheduleModal';
import { ScheduleDeploymentModal } from './ScheduleDeploymentModal';
import { StatusText } from './StatusText';
import { TextWithPhotoRender } from './TextWithPhotoRender';
import { TokenScheduleDeploymentModal } from './TokenScheduleDeploymentModal';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
`;
const StyledButton = styled.button`
  border: none;
  background: transparent;
`;
export const ListScheduleDeployment = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const cancelScheduleModal = useSelector(
    SchedularSelectors.getCancelScheduleModal
  );
  const approveScheduleModal = useSelector(
    SchedularSelectors.getApproveScheduleModal
  );

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const tokenId = params.get('id');
  if (tokenId) {
    window.localStorage.setItem('scheduleTokenid', tokenId);
  }
  useEffect(() => {
    history.push('/schedule-deployment');
  }, []);

  const handleEditClick = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setScheduleModal(true));
  };

  const handleCancelModel = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setCancelScheduleModal(true));
    dispatch(SchedularActions.setRejectScheduleModal(true));
  };
  const handleApproveCheck = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setApproveScheduleModal(true));
  };
  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);

  const RejectIconRender = item => {
    return (
      <>
        <IconButton
          onClick={() => handleCancelModel(item)}
          // disabled={!item?.can_cancel}
          data-tooltip-id={`${`tooltip-group-cross-schedule`}`}
          style={{ border: 'transparent' }}
        >
          <CrossWithCircleIcon color="red" />
        </IconButton>
        {
          <ReactTooltip
            id={`tooltip-group-cross-schedule`}
            place="left"
            content={'Reject'}
            style={{
              width: '110px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        }
      </>
    );
  };

  const ApprovIconRender = item => {
    return (
      <>
        <IconButton
          onClick={() => handleApproveCheck(item)}
          // disabled={!item?.can_cancel}
          data-tooltip-id={`${`tooltip-group-tick-schedule`}`}
          style={{ border: 'transparent' }}
        >
          <TickIconWithCircle />
        </IconButton>
        {
          <ReactTooltip
            id={`tooltip-group-tick-schedule`}
            place="left"
            content={'Approve'}
            style={{
              width: '100px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        }
      </>
    );
  };
  const editIconRender = item => {
    return (
      <>
        <IconButton
          onClick={() => handleEditClick(item)}
          // disabled={!item?.can_cancel}
          data-tooltip-id={`${`tooltip-group-edit-schedule`}`}
          className="pencil-icon-schedule-list"
        >
          <PencilIcon width={16} height={16} />
        </IconButton>
        {
          <ReactTooltip
            id={`tooltip-group-edit-schedule`}
            place="left"
            content={'Edit'}
            style={{
              width: '100px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        }
      </>
    );
  };
  const stopIconRender = item => {
    return (
      <>
        <IconButton
          onClick={() => handleRejectCrossClick(item)}
          // disabled={!item?.can_cancel}
          data-tooltip-id={`${`tooltip-group-reject-schedule`}`}
          style={{ border: 'transparent' }}
        >
          <RejectIcon />
        </IconButton>
        {
          <ReactTooltip
            id={`tooltip-group-reject-schedule`}
            place="left"
            content={'Stop'}
            style={{
              width: '80px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        }
      </>
    );
  };
  const getActionsMenu = item => {
    return (
      <ActionTd>
        {currentUserData?.role === 'superadmin' && (
          <>
            {item?.state === 'PENDING' && (
              <>
                {RejectIconRender(item)}
                {ApprovIconRender(item)}
              </>
            )}
            {(item?.state === 'PENDING' || item?.state === 'TIME_LAPSED') &&
              currentUser?.id === item?.deployer_id && (
                <>{editIconRender(item)}</>
              )}
            {item?.state === 'APPROVED' && <>{stopIconRender(item)}</>}
          </>
        )}
        {currentUserData?.role !== 'superadmin' &&
          currentUser?.id === item?.deployer_id &&
          !item?.groupUsersData.some(
            ele => ele?.id === currentUserData?.id
          ) && (
            <>
              {(item?.state === 'PENDING' || item?.state === 'TIME_LAPSED') && (
                <>{editIconRender(item)}</>
              )}
            </>
          )}
        {currentUserData?.role !== 'superadmin' &&
          currentUser?.id === item?.deployer_id &&
          item?.groupUsersData.some(ele => ele?.id === currentUserData?.id) && (
            <>
              {item?.state === 'PENDING' && (
                <>
                  {editIconRender(item)}
                  {RejectIconRender(item)}
                  {ApprovIconRender(item)}
                </>
              )}
              {item?.state === 'TIME_LAPSED' && <>{editIconRender(item)}</>}
              {item?.state === 'APPROVED' && <>{stopIconRender(item)}</>}
            </>
          )}
        {currentUserData?.role !== 'superadmin' &&
          currentUser?.id !== item?.deployer_id &&
          item?.groupUsersData.some(ele => ele?.id === currentUserData?.id) && (
            <>
              {item?.state === 'PENDING' && (
                <>
                  {RejectIconRender(item)}
                  {ApprovIconRender(item)}
                </>
              )}
              {item?.state === 'APPROVED' && <>{stopIconRender(item)}</>}
            </>
          )}
      </ActionTd>
    );
  };

  const COLUMNS = [
    {
      label: 'Process Group',
      renderCell: item => <TextRender text={item?.namespace_name || 'N/A'} />,
      width: '12%',
    },
    {
      label: 'Flow Name',
      renderCell: item => <TextRender text={item?.flow_name || 'N/A'} />,
      width: '11%',
    },
    {
      label: 'Version',
      renderCell: item => <TextRender text={item?.version || 'N/A'} />,
      width: '6%',
    },
    {
      label: 'Post Deploy State',
      renderCell: item => (
        <TextRender text={item?.deployment_status || 'N/A'} />
      ),
      width: '11%',
    },
    {
      label: 'Schedular',
      renderCell: item => <TextRender text={item?.scheduled_by || 'N/A'} />,
      width: '8%',
    },
    {
      label: 'Deploy Time',
      renderCell: item => <TextRender text={item.scheduled_time || 'N/A'} />,
      width: '14%',
      sort: { sortKey: 'deploy_time' },
    },
    {
      label: 'Approver group/Approver',
      renderCell: item =>
        isEmpty(item?.approver_group) ? (
          <TextWithPhotoRender
            item={item}
            content={item?.approvers}
            currentUser={currentUser}
          />
        ) : (
          <ApproverGroupDisplay item={item} />
        ),
      width: '12%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusText
          text={item?.state === 'TIME_LAPSED' ? 'TIME LAPSED' : item?.state}
          item={item}
        />
      ),
      width: '10%',
    },
    {
      label: 'Actions',
      width: '16%',
      renderCell: item => getActionsMenu(item),
    },
  ];

  const handleCancelClick = () => {
    const payload = {
      state: 'NOT_APPROVED',
      schedularId: selectedSchedule.id,
    };
    dispatch(SchedularActions.editScheduleByRegistry(payload));
  };
  const handleApproveClick = () => {
    const payload = {
      state: 'APPROVED',
      schedularId: selectedSchedule.id,
    };
    dispatch(SchedularActions.editScheduleByRegistry(payload));
  };
  const handleRejectCrossClick = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setRejectScheduleModal(true));
  };

  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'DEPLOYED', label: 'Deployed' },
    { value: 'TIME_LAPSED', label: 'Time Lapsed' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'STOPPED', label: 'Stopped' },
  ];

  const sortFns = {
    deploy_time: data =>
      data.sort((a, b) => a?.deploy_time?.localeCompare(b?.deploy_time)),
  };

  return (
    <>
      <ModalWithIcon
        title={'Disapprove Schedule Deployment'}
        primaryButtonText={'Stop'}
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={false}
        onRequestClose={() =>
          dispatch(SchedularActions.setCancelScheduleModal(false))
        }
        primaryText={'Are you sure you want to disapprove this Deployment?'}
        onSubmit={handleCancelClick}
      />
      <ModalWithIcon
        title={'Schedule Deployment Confirmation'}
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
        icon={<ConfirmScheduleDeploymentIcon />}
        isOpen={approveScheduleModal}
        onRequestClose={() =>
          dispatch(SchedularActions.setApproveScheduleModal(false))
        }
        primaryText={'Are you sure you want to approve this Deployment?'}
        secondaryText={
          'Once approved it will automatically schedule according to process'
        }
        onSubmit={handleApproveClick}
      />
      <ScheduleDeploymentModal />
      <RejectScheduleModal />
      <TokenScheduleDeploymentModal />
      <Grid
        module="scheduler"
        title="Deployment List"
        columns={COLUMNS}
        sortFns={sortFns}
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Approver or flow name"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};
