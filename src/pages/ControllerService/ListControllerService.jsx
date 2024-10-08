import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import styled from 'styled-components';
// import {
//   ConfirmScheduleDeploymentIcon,
//   DeleteDustbinIcon,
// } from '../../assets';
import { Grid } from '../../components';
// import { ModalWithIcon } from '../../shared';

// import {
//   SchedularActions,
//   SchedularSelectors,
// } from '../../store/schedular/redux';
// import { RejectScheduleModal } from './RejectScheduleModal';
// import { ScheduleDeploymentModal } from './ScheduleDeploymentModal';
// import { StatusText } from './StatusText';
// import { TextWithPhotoRender } from './TextWithPhotoRender';
// import { TokenScheduleDeploymentModal } from './TokenScheduleDeploymentModal';

// const ActionTd = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: start;
//   gap: 15px;
// `;

export const ListControllerService = () => {
  //   const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  //   const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  //   const cancelScheduleModal = useSelector(
  //     SchedularSelectors.getCancelScheduleModal
  //   );
  //   const approveScheduleModal = useSelector(
  //     SchedularSelectors.getApproveScheduleModal
  //   );

  //   const location = useLocation();

  //   const params = new URLSearchParams(location.search);
  //   const token = params.get('token');

  //   const handleEnableEdit = item => {
  //     if (item.deployment_status === 'PENDING') {
  //       return false;
  //     } else if (item.deployment_status === 'NOT APPROVED' && item.can_approve) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   };

  //   const handeEnableCancel = item => {
  //     if (item.deployment_status === 'PENDING') {
  //       return false;
  //     } else if (item.deployment_status === 'SCHEDULED') {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   };

  //   const getActionsMenu = item => {
  //     return (
  //       <ActionTd>
  //         <IconButton
  //           onClick={() => {
  //             handleEditClick(item);
  //           }}
  //           disabled={handleEnableEdit(item)}
  //         >
  //           <PencilIcon width={16} height={16} />
  //         </IconButton>
  //         <IconButton
  //           onClick={() => handleCancelModel(item)}
  //           disabled={handeEnableCancel(item)}
  //         >
  //           <HoldIcon />
  //         </IconButton>
  //       </ActionTd>
  //     );
  //   };

  //   const COLUMNS = [
  //     {
  //       label: 'Process Group',
  //       renderCell: item => <TextRender text={item.namespace_name || 'N/A'} />,
  //       width: '15%',
  //     },
  //     {
  //       label: 'Source Cluster',
  //       renderCell: item => (
  //         <TextRender text={item.source_cluster_name || 'N/A'} />
  //       ),
  //       width: '15%',
  //     },
  //     {
  //       label: 'Dest. Cluster',
  //       renderCell: item => (
  //         <TextRender text={item.destination_cluster_name || 'N/A'} />
  //       ),
  //       width: '15%',
  //     },
  //     {
  //       label: 'Deploy Time',
  //       renderCell: item => <TextRender text={item.scheduled_time || 'N/A'} />,
  //       width: '15%',
  //     },
  //     {
  //       label: 'Approver',
  //       renderCell: item => (
  //         <TextWithPhotoRender
  //           item={item}
  //           content={item?.approvers}
  //           currentUser={currentUser}
  //           // setSelectedData={setSelectedData}
  //         />
  //       ),
  //       width: '15%',
  //     },
  //     {
  //       label: 'Status',
  //       renderCell: item => <StatusText text={item?.deployment_status} />,
  //       width: '15%',
  //     },
  //     {
  //       label: 'Actions',
  //       width: '10%',
  //       renderCell: item => getActionsMenu(item),
  //     },
  //   ];

  //   const handleCancelClick = () => {
  //     const payload = {
  //       is_cancelled: true,
  //       schedularId: selectedSchedule.scheduler_id,
  //     };
  //     dispatch(SchedularActions.editScheduleDeployment(payload));
  //   };
  //   const handleApproveClick = () => {
  //     const payload = {
  //       is_approved: true,
  //       schedularId: selectedSchedule.scheduler_id,
  //     };
  //     dispatch(SchedularActions.editScheduleDeployment(payload));
  //   };

  //   const STATUS_OPTIONS = [
  //     { value: 'all', label: 'All' },
  //     { value: 'PENDING', label: 'Pending' },
  //     { value: 'SUCCESS', label: 'Success' },
  //     { value: 'SCHEDULED', label: 'Scheduled' },
  //     { value: 'IN PROGRESS', label: 'In Progress' },
  //     { value: 'NOT APPROVED', label: 'Not Approved' },
  //     { value: 'CANCELLED', label: 'Cancelled' },
  //   ];
  return (
    <>
      <Grid
        module="controllerService"
        title="Deployment List"
        columns={[]}
        // statusOptions={STATUS_OPTIONS}
        placeholder="Search Process Group, Cluster or Approver"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};
