/* eslint-disable  */
import { cluster } from 'd3';
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
  OpenEyeIcon,
  // HoldIcon,
  PencilIcon,
  RejectIcon,
  SortDownIcon,
  SortUpIcon,
  TickIconWithCircle,
} from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { ModalWithIcon } from '../../shared';
import SortingComponent from '../../shared/SortingComponent';
import {
  AuthenticationSelectors,
  ClustersActions,
  GridActions,
  NamespacesSelectors,
} from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { SettingsSelectors } from '../../store/settings';
import { ApproverGroupDisplay } from './ApproverGroupDisplay';
import { DiffModalScheduleList } from './DiffModalSchedule';
import { RejectScheduleModal } from './RejectScheduleModal';
import { ScheduleDeploymentModal } from './ScheduleDeploymentModal';
import { StatusText } from './StatusText';
import { TextWithPhotoRender } from './TextWithPhotoRender';
import { TokenScheduleDeploymentModal } from './TokenScheduleDeploymentModal';
import { UserStoryModal } from './UserStoryModal';

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
const TextColor = styled.div`
  color: ${props => (props.mode ? '#444445' : '#ff7700;')};
  font-family: ${props => props.theme.fontRedHat};
  font-size: ${props => props.theme.size.lg};
  font-weight: 400;
  text-transform: ${props => (props.capitalizeText ? 'capitalize' : 'none')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  z-index: 2;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
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
  const selectedRange = useSelector(SchedularSelectors.getScheduleSelectRange);
  const selctedCluster = useSelector(
    SchedularSelectors.getSelectedClusterState
  );
  const selctedStatus = useSelector(SchedularSelectors.getSelectedStatusState);
  const search = useSelector(SchedularSelectors.getSearchText);
  const location = useLocation();
  const settingData = useSelector(SettingsSelectors.getSettings);
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
          onClick={event => {
            handleEditClick(item);
            event.currentTarget.blur();
          }}
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
          onClick={event => {
            handleRejectCrossClick(item);
            event.currentTarget.blur();
          }}
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
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setIsDiffModalOpen(true));
    dispatch(SchedularActions.fetchDiffScheduleData(item?.id));
  };
  const handleUserStoryModal = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setIsUserStoryModalOpen(true));
  };
  const getActionsMenu = item => {
    return (
      <ActionTd>
        <IconButton
          onClick={event => {
            handleUserStoryModal(item);
            event.currentTarget.blur();
          }}
          data-tooltip-id={`tooltip-group-user-story`}
        >
          <OpenEyeIcon width={14} height={14} />
        </IconButton>{' '}
        <ReactTooltip
          id={`tooltip-group-user-story`}
          place="left"
          content={'User Story'}
          style={{
            width: '125px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        />
        <IconButton
          onClick={event => {
            getDefSchedule(item);
            event.currentTarget.blur();
          }}
          data-tooltip-id={`${`tooltip-group-diff-schedule`}`}
        >
          <DiffIcon />
        </IconButton>
        <ReactTooltip
          id={`tooltip-group-diff-schedule`}
          place="left"
          content={'View Changes'}
          style={{
            width: '125px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        />
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
        {item?.namespace_name && (
          <>
            <li style={{ textAlign: 'left' }}>Name : {item?.namespace_name}</li>
            {item?.namespace_id !== 'root' && (
              <li style={{ textAlign: 'left' }}>ID : {item?.namespace_id}</li>
            )}
          </>
        )}
      </>
    );
  };
  const pgNameDisplay = item => {
    return (
      <>
        <TextColor
          data-tooltip-id={`${item?.id}name`}
          mode={
            item?.mode === 'deploy' &&
            (item?.state === 'TIME_LAPSED' ||
              item?.state === 'FAILED' ||
              item?.state === 'PENDING' ||
              item?.state === 'APPROVED' ||
              item?.state === 'STOPPED' ||
              item?.state === 'REJECTED')
          }
        >
          {item?.namespace_name}
        </TextColor>
        <ReactTooltip
          id={`${item?.id}name`}
          place="left"
          content={ListForTooltip(item)}
          style={{
            width: 'max-content',
            maxWidth: '400px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: 9999,
          }}
        />
      </>
    );
  };

  const handleProcessGroupClick = item => {
    const updatedUrl = item?.nifi_url?.endsWith('/nifi')
      ? `${item?.nifi_url}?processGroupId=${item?.namespace_id}`
      : `${item?.nifi_url}/nifi?processGroupId=${item?.namespace_id}`;
    window.open(updatedUrl, '_blank');
  };

  const COLUMNS = [
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('namespace_name')}
            style={{ background: 'none' }}
          >
            Process Group{' '}
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
        <>
          {item?.mode === 'deploy' &&
          (item?.state === 'TIME_LAPSED' ||
            item?.state === 'FAILED' ||
            item?.state === 'PENDING' ||
            item?.state === 'APPROVED' ||
            item?.state === 'STOPPED' ||
            item?.state === 'REJECTED') ? (
            <span>{pgNameDisplay(item)}</span>
          ) : (
            <button
              onClick={event => {
                handleProcessGroupClick(item);
                event.currentTarget.blur();
              }}
              className="process-group-button"
              data-tooltip-id={`${item?.id}name`}
              style={{
                background: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#ff7700',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                display: 'block',
                width: '100%',
                textAlign: 'left',
              }}
            >
              {pgNameDisplay(item)}
            </button>
          )}
        </>
      ),
      width: '14%',
      resize: true,
    },
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('cluster_name')}
            style={{ background: 'none' }}
          >
            Cluster{' '}
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
      renderCell: item => <TextRender text={item?.cluster_name} />,
      width: '9%',
      resize: true,
    },
    {
      label: 'Version',
      renderCell: item => <TextRender text={item?.version} />,
      width: '7%',
      resize: true,
    },
    {
      label: 'Post Deploy State',
      renderCell: item => <TextRender text={item?.deployment_status} />,
      width: '12%',
      resize: true,
    },
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('scheduled_by')}
            style={{ background: 'none' }}
          >
            Scheduler{' '}
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
      renderCell: item => <TextRender text={item?.scheduled_by} />,
      width: '10%',
      resize: true,
    },
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('scheduled_date_time')}
            style={{ background: 'none' }}
          >
            Deploy Time{' '}
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
        <TextRender text={convertDateTime(item?.scheduled_date_time)} />
      ),
      sort: { sortKey: 'deploy_time' },
      width: '13%',
      resize: true,
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
      resize: true,
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
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => getActionsMenu(item),
      resize: true,
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
  useEffect(() => {
    dispatch(ClustersActions.fetchClusters());
  }, [dispatch]);

  const fetchRecords = () => {
    dispatch(
      GridActions.fetchGrid({
        module: 'scheduler',
        params: {
          page: currentPage,
          ...(selectedRange && {
            start_date: selectedRange?.[0]?.toISOString(),
            end_date: selectedRange?.[1]?.toISOString(),
          }),
          ...(selctedCluster?.label !== 'All' && {
            clusterName: selctedCluster?.label,
          }),
          ...(selctedStatus &&
            selctedStatus !== 'all' && {
              deployment_status: selctedStatus,
            }),
          ...(search && { search }),
        },
      })
    );
  };
  useEffect(() => {
    if (settingData?.refresh && settingData?.refresh > 0) {
      fetchRecords();
      const intervalId = setInterval(fetchRecords, settingData?.refresh);
      return () => clearInterval(intervalId);
    }
  }, [
    selectedRange,
    selctedCluster,
    selctedStatus,
    search,
    currentPage,
    settingData?.refresh,
  ]);
  return (
    <>
      <ModalWithIcon
        title={'Disapprove Deployment Schedule'}
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
        title={'Deployment Schedule Confirmation'}
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
      <UserStoryModal />
      <Grid
        module="scheduler"
        title="Deployment Schedule List"
        columns={COLUMNS}
        sortFns={sortFns}
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Process Group"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        sortingState={sortingState}
        setSortingState={setSortingState}
        itemsPerPage={KDFM.ITEMS_PER_PAGE}
      />
      <DiffModalScheduleList />
    </>
  );
};
