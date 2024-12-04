/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  HoldIcon,
  PencilIcon,
} from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { ModalWithIcon } from '../../shared';
import { AuthenticationSelectors } from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { RejectScheduleModal } from './RejectScheduleModal';
import { ScheduleDeploymentModal } from './ScheduleDeploymentModal';
import { StatusText } from './StatusText';
import { TextWithPhotoRender } from './TextWithPhotoRender';
import { TokenScheduleDeploymentModal } from './TokenScheduleDeploymentModal';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { isEmpty } from 'lodash';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
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
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      dispatch(SchedularActions.checkApproverToken({ params: { token } }));
    }
  }, [dispatch, token]);

  const handleEditClick = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setScheduleModal());
  };

  const handleCancelModel = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setCancelScheduleModal());
  };

  const getActionsMenu = item => {
    return (
      <ActionTd>
        <IconButton
          onClick={() => {
            handleEditClick(item);
          }}
          disabled={!item?.can_edit}
          data-tooltip-id={`${item?.can_edit && `tooltip-group-edit-schedule`}`}
        >
          <PencilIcon width={16} height={16} />
        </IconButton>
        {
          <ReactTooltip
            id={`tooltip-group-edit-schedule`}
            place="left"
            content={'Edit'}
            style={{
              width: '60px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        }
        <IconButton
          onClick={() => handleCancelModel(item)}
          disabled={!item?.can_cancel}
          data-tooltip-id={`${item?.can_cancel && `tooltip-group-cancel-schedule`}`}
        >
          <HoldIcon />
        </IconButton>
        {
          <ReactTooltip
            id={`tooltip-group-cancel-schedule`}
            place="left"
            content={'Cancel'}
            style={{
              width: '80px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        }
      </ActionTd>
    );
  };

  const COLUMNS = [
    {
      label: 'Process Group',
      renderCell: item => <TextRender text={item.namespace_name || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Source Cluster',
      renderCell: item => (
        <TextRender text={item.source_cluster_name || 'N/A'} />
      ),
      width: '15%',
    },
    {
      label: 'Dest. Cluster',
      renderCell: item => (
        <TextRender text={item.destination_cluster_name || 'N/A'} />
      ),
      width: '14%',
    },
    {
      label: 'Deploy Time',
      renderCell: item => <TextRender text={item.scheduled_time || 'N/A'} />,
      width: '14%',
    },
    {
      label: 'Approver',
      renderCell: item =>
        !isEmpty(item?.approvers) ? (
          <TextWithPhotoRender
            item={item}
            content={item?.approvers}
            currentUser={currentUser}
          />
        ) : (
          <TextRender text={'N/A'} />
        ),
      width: '13%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusText text={item?.deployment_status} item={item} />
      ),
      width: '12%',
    },
    {
      label: 'Actions',
      width: '17%',
      renderCell: item => getActionsMenu(item),
    },
  ];

  const handleCancelClick = () => {
    const payload = {
      is_cancelled: true,
      schedularId: selectedSchedule.scheduler_id,
    };
    dispatch(SchedularActions.editScheduleDeployment(payload));
  };
  const handleApproveClick = () => {
    const payload = {
      is_approved: true,
      schedularId: selectedSchedule.scheduler_id,
    };
    dispatch(SchedularActions.editScheduleDeployment(payload));
  };

  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'IN PROGRESS', label: 'In Progress' },
    { value: 'NOT APPROVED', label: 'Not Approved' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];
  return (
    <>
      <ModalWithIcon
        title={'Cancel Schedule Deployment'}
        primaryButtonText={'Stop'}
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={cancelScheduleModal}
        onRequestClose={() =>
          dispatch(SchedularActions.setCancelScheduleModal())
        }
        primaryText={'Are you sure you want to cancel this Deployment?'}
        secondaryText={
          'This Deployment will be Cancel from Schedule Deployment Page'
        }
        onSubmit={handleCancelClick}
      />
      <ModalWithIcon
        title={'Schedule Deployment Confirmation'}
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
        icon={<ConfirmScheduleDeploymentIcon />}
        isOpen={approveScheduleModal}
        onRequestClose={() =>
          dispatch(SchedularActions.setApproveScheduleModal())
        }
        primaryText={'Are you sure you want Approve this Deployment?'}
        secondaryText={
          'Once Approved it will automatically Schedule according to process'
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
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Process Group, Cluster or Approver"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};
