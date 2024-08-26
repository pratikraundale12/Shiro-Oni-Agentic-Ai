import React, { useState } from 'react';
import { Grid, IconButton, TextRender } from '../../components';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  HoldIcon,
  PencilIcon,
} from '../../assets';
import { STATUS_OPTIONS } from '../../constants';
import { AuthenticationSelectors } from '../../store';
import { StatusText } from './StatusText';
import { TextWithPhotoRender } from './TextWithPhotoRender';
import { ModalWithIcon } from '../../shared';
import { AddScheduleDeploymentModal } from './AddScheduleDeploymentModel';
import { RejectConfirmScheduleModel } from './RejectConfirmModel';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

export const ListScheduleDeployment = () => {
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [deleteOpenModel, setDeleteOpenModel] = useState(false);
  const [scheduleInitialOpen, setScheduleInitialOpen] = useState(false);
  const [selectedTimeStamp, setSelectedTimeStamp] = useState(new Date());
  const [confirmScheduleModelOpen, setConfirmScheduleModelOpen] =
    useState(false);
  const [confirmRejectModelOpen, setConfirmRejectModelOpen] = useState(false);

  const handleEditClick = item => {
    setScheduleInitialOpen(true);
    setSelectedTimeStamp(item?.scheduled_time);
  };

  const getActionsMenu = item => (
    <div>
      <ActionTd>
        <IconButton
          onClick={() => {
            handleEditClick(item);
          }}
        >
          <PencilIcon width={16} height={16} />
        </IconButton>
        <IconButton onClick={() => setDeleteOpenModel(true)}>
          <HoldIcon />
        </IconButton>
      </ActionTd>
    </div>
  );

  const COLUMNS = [
    {
      label: 'Namespace',
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
      width: '15%',
    },
    {
      label: 'Deploy Time',
      renderCell: item => <TextRender text={item.scheduled_time || 'N/A'} />,
      width: '15%',
    },
    {
      label: 'Approver',
      renderCell: item => (
        <TextWithPhotoRender
          item={item}
          content={item?.approvers}
          currentUser={currentUser}
          setConfirmScheduleModelOpen={setConfirmScheduleModelOpen}
          setConfirmRejectModelOpen={setConfirmRejectModelOpen}
        />
      ),
      width: '15%',
    },
    {
      label: 'Status',
      renderCell: item => <StatusText text={item?.deployment_status} />,
      width: '15%',
    },
    {
      label: 'Actions',
      width: '10%',
      renderCell: item => getActionsMenu(item),
    },
  ];

  const handleCloseModel = () => {
    setDeleteOpenModel(false);
    setConfirmScheduleModelOpen(false);
  };

  return (
    <>
      <ModalWithIcon
        title={
          confirmScheduleModelOpen
            ? 'Schedule Deployment Confirmation'
            : 'Cancel Schedule Deployment'
        }
        primaryButtonText={confirmScheduleModelOpen ? 'Confirm' : 'Stop'}
        secondaryButtonText="Cancel"
        icon={
          confirmScheduleModelOpen ? (
            <ConfirmScheduleDeploymentIcon />
          ) : (
            <DeleteDustbinIcon />
          )
        }
        isOpen={deleteOpenModel || confirmScheduleModelOpen}
        // onSubmit={deleteUserConfirmed}
        onRequestClose={() => handleCloseModel()}
        primaryText={
          confirmScheduleModelOpen
            ? 'Are you sure you want to Approve this Deployment'
            : 'Are you sure you want to cancel this Deployment?'
        }
        secondaryText={
          confirmScheduleModelOpen
            ? 'Once Approved it will automatically Schedule according to process'
            : 'This Deployment will be Cancel from Schedule Deployment Page'
        }
      />
      <AddScheduleDeploymentModal
        scheduleInitialOpen={scheduleInitialOpen}
        setScheduleInitialOpen={setScheduleInitialOpen}
        startDate={selectedTimeStamp}
      />
      <RejectConfirmScheduleModel
        icon={<ConfirmScheduleDeploymentIcon />}
        title={'Schedule Deployment Confirmation'}
        primaryText={'Are you sure you want to Reject this Deployment'}
        isOpen={confirmRejectModelOpen}
        onRequestClose={() => setConfirmRejectModelOpen(false)}
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
      />
      <Grid
        module="scheduler"
        title="Deployment List"
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        placeholder="Search Namespace, Cluster or Approver"
      />
    </>
  );
};
