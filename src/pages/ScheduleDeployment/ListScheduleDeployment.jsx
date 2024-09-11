/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  HoldIcon,
  PencilIcon,
} from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  GridActions,
  LoadingSelectors,
} from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { RejectScheduleModal } from './RejectScheduleModal';
import { ScheduleDeploymentModal } from './ScheduleDeploymentModal';
import { StatusText } from './StatusText';
import { TextWithPhotoRender } from './TextWithPhotoRender';
import { TokenScheduleDeploymentModal } from './TokenScheduleDeploymentModal';

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
  // const [selectedTimeStamp, setSelectedTimeStamp] = useState(new Date());
  // const [selectedData, setSelectedData] = useState(null);
  // const [dateToken, setDateToken] = useState(new Date());
  // const [scheduleData, setScheduleData] = useState({});
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  // const loadingButton = useSelector(state =>
  //   LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  // );
  // const isRejectScheduleModal = useSelector(
  //   SchedularSelectors.getRejectScheduleModel
  // );
  // const isEditScheduleModal = useSelector(
  //   SchedularSelectors.getEditScheduleModel
  // );
  const cancelScheduleModal = useSelector(
    SchedularSelectors.getCancelScheduleModal
  );
  const approveScheduleModal = useSelector(
    SchedularSelectors.getApproveScheduleModal
  );
  // const isConfirmScheduleModal = useSelector(
  //   SchedularSelectors.getScheduleCofirmModel
  // );
  const tokenScheduleModal = useSelector(
    SchedularSelectors.getTokenScheduleModal
  );

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      dispatch(SchedularActions.checkApproverToken({ params: { token } }));
      // if (!isEmpty(selectedSchedule)) {
      //   dispatch(SchedularActions.setTokenScheduleModal(true));
      // }
    }
  }, [dispatch, token]);

  // const { control } = useForm({
  //   resolver: yupResolver(scheduleSchema),
  // });
  const handleEditClick = item => {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setScheduleModal());
  };

  const handleCancelModel = item => {
    // if (item.deployer_id === currentUser.id) {
    dispatch(SchedularActions.setSelectedSchedule(item));
    dispatch(SchedularActions.setCancelScheduleModal());
    // }
  };

  const handleEnableEdit = item => {
    if (item.deployment_status === 'PENDING') {
      return false;
    } else if (item.deployment_status === 'NOT APPROVED' && item.can_approve) {
      return false;
    } else {
      return true;
    }
  };

  const handeEnableCancel = item => {
    if (item.deployment_status === 'PENDING') {
      return false;
    } else if (item.deployment_status === 'SCHEDULED') {
      return false;
    } else {
      return true;
    }
  };

  const getActionsMenu = item => {
    return (
      <ActionTd>
        <IconButton
          onClick={() => {
            handleEditClick(item);
          }}
          disabled={handleEnableEdit(item)}
        >
          <PencilIcon width={16} height={16} />
        </IconButton>
        <IconButton
          onClick={() => handleCancelModel(item)}
          disabled={handeEnableCancel(item)}
        >
          <HoldIcon />
        </IconButton>
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
          // setSelectedData={setSelectedData}
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

  // const handleCloseModel = () => {
  //   if (isRjectConfirmScheduleModal) {
  //     dispatch(SchedularActions.setConfirmRejectScheduleModel());
  //   }
  //   if (isConfirmScheduleModal) {
  //     dispatch(SchedularActions.setScheduleConfirmModel());
  //   }
  // };

  // const handleApproveClick = () => {
  //   const payload = { is_approved: true, schedularId: selectedData };
  //   dispatch(SchedularActions.editScheduleDeployment(payload));
  //   setSelectedData(null);
  //   dispatch(GridActions.fetchGrid({ module: 'scheduler' }));
  // };
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
  // const onSubmit = async data => {
  //   const payload = { is_approved: false, schedularId: selectedData, ...data };
  //   dispatch(SchedularActions.editScheduleDeployment(payload));
  //   setSelectedData(null);
  //   dispatch(GridActions.fetchGrid({ module: 'scheduler' }));
  // };

  //// check this edit

  // const editConfirmSchedule = () => {
  //   const payload = {
  //     scheduled_time: selectedTimeStamp.toISOString(),
  //     schedularId: selectedData,
  //   };
  //   dispatch(SchedularActions.editScheduleDeployment(payload));
  //   dispatch(GridActions.fetchGrid({ module: 'scheduler' }));
  // };

  // const handleRejecModalClose = () => {
  //   dispatch(SchedularActions.setRejectScheduleModal());
  // };

  // const handleTokenConfirm = () => {
  //   const payload = {
  //     scheduled_time: dateToken.toISOString(),
  //     is_approved: true,
  //     schedularId: scheduleData.scheduler_id,
  //   };
  //   console.log(payload);
  //   // dispatch(SchedularActions.editScheduleDeployment(payload));
  // };

  // const handleTokenScheduleDecline = () => {
  //   dispatch(SchedularActions.setTokenScheduleModel());
  //   dispatch(SchedularActions.setRejectScheduleModal());
  // };

  // const handleCloseTokenModel = () => {
  //   dispatch(SchedularActions.setTokenScheduleModel());
  // };

  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'IN PROGRESS', label: 'In Progress' },
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
      />
    </>
  );
};
