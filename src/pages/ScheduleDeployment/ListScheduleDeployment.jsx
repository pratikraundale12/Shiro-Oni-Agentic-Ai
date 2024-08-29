import React, { useState } from 'react';
import { Grid, IconButton, TextRender } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  HoldIcon,
  PencilIcon,
} from '../../assets';
import { STATUS_OPTIONS } from '../../constants';
import {
  AuthenticationSelectors,
  GridActions,
  LoadingSelectors,
} from '../../store';
import { StatusText } from './StatusText';
import { TextWithPhotoRender } from './TextWithPhotoRender';
import { ModalWithIcon } from '../../shared';
import { AddScheduleDeploymentModal } from './AddScheduleDeploymentModel';
import { RejectConfirmScheduleModel } from './RejectConfirmModel';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;
const scheduleSchema = yup.object().shape({
  note: yup.string().required('Note is required'),
});
export const ListScheduleDeployment = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [selectedTimeStamp, setSelectedTimeStamp] = useState(new Date());
  const [selectedData, setSelectedData] = useState(null);
  const loadingButton = useSelector(state =>
    LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  );
  const isRejectScheduleModal = useSelector(
    SchedularSelectors.getRejectScheduleModel
  );
  const isEditScheduleModal = useSelector(
    SchedularSelectors.getEditScheduleModel
  );
  const isRjectConfirmScheduleModal = useSelector(
    SchedularSelectors.getRejectConfirmScheduleModel
  );
  const isConfirmScheduleModal = useSelector(
    SchedularSelectors.getScheduleCofirmModel
  );
  // dispatch(SchedularActions.setScheduleConfirmModel());
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scheduleSchema),
  });
  const handleEditClick = item => {
    dispatch(SchedularActions.setEditScheduleModel());
    setSelectedData(item.scheduler_id);
    setSelectedTimeStamp(new Date(item?.timestamp));
  };

  const handleCancelModel = item => {
    dispatch(SchedularActions.setConfirmRejectScheduleModel());
    setSelectedData(item.scheduler_id);
  };

  const getActionsMenu = item => (
    <div>
      <ActionTd>
        <IconButton
          onClick={() => {
            handleEditClick(item);
          }}
          disabled={item.deployment_status != 'PENDING'}
        >
          <PencilIcon width={16} height={16} />
        </IconButton>
        <IconButton
          onClick={() => handleCancelModel(item)}
          disabled={item.deployment_status != 'SCHEDULED'}
        >
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
          setSelectedData={setSelectedData}
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
    if (isRjectConfirmScheduleModal) {
      dispatch(SchedularActions.setConfirmRejectScheduleModel());
    }
    if (isConfirmScheduleModal) {
      dispatch(SchedularActions.setScheduleConfirmModel());
    }
  };

  const handleApproveClick = () => {
    const payload = { is_approved: true, schedularId: selectedData };
    dispatch(SchedularActions.editScheduleDeployment(payload));
    setSelectedData(null);
    dispatch(GridActions.fetchGrid({ module: 'scheduler' }));
  };
  const handleCancelClick = () => {
    const payload = { is_approved: false, schedularId: selectedData };
    dispatch(SchedularActions.editScheduleDeployment(payload));
    setSelectedData(null);
    dispatch(GridActions.fetchGrid({ module: 'scheduler' }));
  };
  const onSubmit = async data => {
    const payload = { is_approved: false, schedularId: selectedData, ...data };
    dispatch(SchedularActions.editScheduleDeployment(payload));
    setSelectedData(null);
    dispatch(GridActions.fetchGrid({ module: 'scheduler' }));
  };

  const editConfirmSchedule = () => {
    const payload = {
      scheduled_time: selectedTimeStamp.toISOString(),
      schedularId: selectedData,
    };
    dispatch(SchedularActions.editScheduleDeployment(payload));
    dispatch(GridActions.fetchGrid({ module: 'scheduler' }));
  };

  const handleRejecModalClose = () => {
    dispatch(SchedularActions.setRejectScheduleModal());
  };
  return (
    <>
      <ModalWithIcon
        title={
          isConfirmScheduleModal
            ? 'Schedule Deployment Confirmation'
            : 'Cancel Schedule Deployment'
        }
        primaryButtonText={isConfirmScheduleModal ? 'Confirm' : 'Stop'}
        secondaryButtonText="Cancel"
        icon={
          isConfirmScheduleModal ? (
            <ConfirmScheduleDeploymentIcon />
          ) : (
            <DeleteDustbinIcon />
          )
        }
        isOpen={isRjectConfirmScheduleModal || isConfirmScheduleModal}
        // onSubmit={deleteUserConfirmed}
        onRequestClose={() => handleCloseModel()}
        primaryText={
          isConfirmScheduleModal
            ? 'Are you sure you want to Approve this Deployment'
            : 'Are you sure you want to cancel this Deployment?'
        }
        secondaryText={
          isConfirmScheduleModal
            ? 'Once Approved it will automatically Schedule according to process'
            : 'This Deployment will be Cancel from Schedule Deployment Page'
        }
        onSubmit={
          isConfirmScheduleModal ? handleApproveClick : handleCancelClick
        }
        loading={loadingButton}
      />
      <AddScheduleDeploymentModal
        scheduleInitialOpen={isEditScheduleModal}
        startDate={selectedTimeStamp}
        setStartDate={setSelectedTimeStamp}
        handleContinue={editConfirmSchedule}
        loadingButton={loadingButton}
      />
      <RejectConfirmScheduleModel
        icon={<ConfirmScheduleDeploymentIcon />}
        title={'Schedule Deployment Confirmation'}
        primaryText={'Are you sure you want to Reject this Deployment'}
        isOpen={isRejectScheduleModal}
        onRequestClose={() => handleRejecModalClose()}
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
        onSubmit={handleSubmit(onSubmit)}
        setValue={setValue}
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        register={register}
        loadingButton={loadingButton}
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
