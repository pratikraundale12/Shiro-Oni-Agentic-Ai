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
  DiffIcon,
  // HoldIcon,
  PencilIcon,
  RejectIcon,
  SortDownIcon,
  SortUpIcon,
  TickIconWithCircle,
} from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { history } from '../../helpers/history';
import { ModalWithIcon } from '../../shared';
import SortingComponent from '../../shared/SortingComponent';
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
import { DiffModalScheduleList } from './DiffModalSchedule';

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
  const [sortingState, setSortingState] = useState('');
  const toggleSorting = column => {
    setSortingState(prevState => {
      if (prevState === column) {
        return `-${column}`;
      }
      return column;
    });
  };
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

  const convertDateTime = dateString => {
    if (!dateString) return 'No date provided';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };
  //
  const getDefSchedule = async item => {
    dispatch(SchedularActions.setIsDiffModalOpen(true));
    dispatch(SchedularActions.fetchDiffScheduleData(item?.id));
  };
  const getActionsMenu = item => {
    return (
      <ActionTd>
        {' '}
        <IconButton
          onClick={() => getDefSchedule(item)}
          data-tooltip-id={`${`tooltip-group-reject-schedule`}`}
        >
          <DiffIcon />
        </IconButton>
        {currentUserData?.role === 'superadmin' && (
          <>
            {item?.action_by !== 'NO_APPROVER_REQUIRED' && (
              <>
                {item?.state === 'PENDING' && (
                  <>
                    {RejectIconRender(item)}
                    {ApprovIconRender(item)}
                  </>
                )}
                {(item?.state === 'PENDING' ||
                  item?.state === 'TIME_LAPSED' ||
                  item?.state === 'FAILED') &&
                  currentUser?.id === item?.deployer_id && (
                    <>{editIconRender(item)}</>
                  )}
                {item?.state === 'APPROVED' && <>{stopIconRender(item)}</>}
              </>
            )}
            {item?.action_by === 'NO_APPROVER_REQUIRED' &&
              item?.state === 'PENDING' && <>{stopIconRender(item)}</>}
          </>
        )}
        {/* NON SUPERADMIN + SCHEDULAR + NOT IN APPROVER GROUP */}
        {currentUserData?.role !== 'superadmin' &&
          currentUser?.id === item?.deployer_id &&
          !item?.groupUsersData?.some(
            ele => ele?.id === currentUserData?.id
          ) && (
            <>
              {item?.action_by !== 'NO_APPROVER_REQUIRED' && (
                <>
                  {(item?.state === 'PENDING' ||
                    item?.state === 'TIME_LAPSED') && (
                    <>{editIconRender(item)}</>
                  )}
                </>
              )}
              {item?.action_by === 'NO_APPROVER_REQUIRED' &&
                item?.state === 'PENDING' && <>{editIconRender(item)}</>}
              {item?.state === 'FAILED' && <>{editIconRender(item)}</>}
            </>
          )}
        {/* NON SUPERADMIN + SCHEDULAR + IN APPROVER GROUP */}
        {currentUserData?.role !== 'superadmin' &&
          currentUser?.id === item?.deployer_id &&
          item?.groupUsersData?.some(
            ele => ele?.id === currentUserData?.id
          ) && (
            <>
              {item?.action_by !== 'NO_APPROVER_REQUIRED' && (
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
              {item?.action_by === 'NO_APPROVER_REQUIRED' &&
                item?.state === 'PENDING' && <>{editIconRender(item)}</>}
              {item?.state === 'FAILED' && <>{editIconRender(item)}</>}
            </>
          )}
        {/* NON SUPERADMIN + NON SCHEDULAR + IN APPROVER GROUP */}
        {currentUserData?.role !== 'superadmin' &&
          currentUser?.id !== item?.deployer_id &&
          item?.action_by !== 'NO_APPROVER_REQUIRED' &&
          item?.groupUsersData?.some(
            ele => ele?.id === currentUserData?.id
          ) && (
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
  const ListForTooltip = item => {
    return (
      <>
        <li>Name : {item?.namespace_name}</li>
        {item?.namespace_id !== 'root' && <li>ID : {item?.namespace_id}</li>}
      </>
    );
  };

  const COLUMNS = [
    {
      label: (
        <>
          Process Group{' '}
          <button onClick={() => toggleSorting('namespace_name')}>
            {sortingState === 'namespace_name' ? (
              <SortUpIcon />
            ) : sortingState === '-namespace_name' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => (
        <TextRender
          text={item?.namespace_name || 'N/A'}
          ListForTooltip={ListForTooltip(item)}
        />
      ),
      width: '12%',
    },
    {
      label: (
        <>
          Cluster{' '}
          <button onClick={() => toggleSorting('cluster_name')}>
            {sortingState === 'cluster_name' ? (
              <SortUpIcon />
            ) : sortingState === '-cluster_name' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => <TextRender text={item?.cluster_name || 'N/A'} />,
      width: '11%',
    },
    {
      label: 'Version',
      renderCell: item => <TextRender text={item?.version || 'N/A'} />,
      width: '5%',
    },
    {
      label: 'Post Deploy State',
      renderCell: item => (
        <TextRender text={item?.deployment_status || 'STOPPED'} />
      ),
      width: '10%',
    },
    {
      label: (
        <>
          Scheduler{' '}
          <button onClick={() => toggleSorting('scheduled_by')}>
            {sortingState === 'scheduled_by' ? (
              <SortUpIcon />
            ) : sortingState === '-scheduled_by' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => <TextRender text={item?.scheduled_by || 'N/A'} />,
      width: '8%',
    },
    {
      label: (
        <>
          Deploy Time{' '}
          <button onClick={() => toggleSorting('scheduled_date_time')}>
            {sortingState === 'scheduled_date_time' ? (
              <SortUpIcon />
            ) : sortingState === '-scheduled_date_time' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => (
        <TextRender
          text={convertDateTime(item?.scheduled_date_time) || 'N/A'}
        />
      ),
      width: '14%',
      sort: { sortKey: 'deploy_time' },
    },
    {
      label: 'Approver group/Approver',
      renderCell: item =>
        item?.action_by === 'NO_APPROVER_REQUIRED' ? (
          <StatusText text={'No Approver Required'} item={item} />
        ) : (
          <ApproverGroupDisplay item={item} />
        ),
      width: '14%',
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
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'STOPPED', label: 'Stopped' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'TIME_LAPSED', label: 'Time Lapsed' },
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
        placeholder="Search Process Group or Flow Name"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        sortingState={sortingState}
      />
      <DiffModalScheduleList />
    </>
  );
};
