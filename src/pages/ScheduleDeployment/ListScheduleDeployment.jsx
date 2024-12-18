/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  CrossWithCircleIcon,
  DeleteDustbinIcon,
  // HoldIcon,
  PencilIcon,
  RejectIcon,
  TickIconWithCircle,
  // PencilIcon,
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
import { ApproverGroupDisplay } from './ApproverGroupDisplay';

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
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      dispatch(SchedularActions.checkApproverToken({ params: { token } }));
    }
  }, [dispatch, token]);

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

  const getActionsMenu = item => {
    return (
      <ActionTd>
        {currentUserData?.role === 'superadmin' ? (
          <>
            {/* SUPER ADMIN */}
            <IconButton
              onClick={() => handleEditClick(item)}
              // disabled={!item?.can_cancel}
              data-tooltip-id={`${item?.can_cancel && `tooltip-group-edit-schedule`}`}
            >
              <PencilIcon />
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
        ) : (
          <>
            {currentUser?.id === item?.deployer_id ? (
              <>
                {/* SCHEDULAR */}
                {item?.state !== 'APPROVED' && (
                  <IconButton
                    onClick={() => handleEditClick(item)}
                    // disabled={!item?.can_cancel}
                    data-tooltip-id={`${item?.can_cancel && `tooltip-group-cancel-schedule`}`}
                  >
                    <PencilIcon />
                  </IconButton>
                )}
              </>
            ) : (
              <>
                {/* APPROVER */}
                {item?.state === 'PENDING' && (
                  <>
                    <IconButton
                      onClick={() => handleCancelModel(item)}
                      // disabled={!item?.can_cancel}
                      data-tooltip-id={`${`tooltip-group-cross-schedule`}`}
                    >
                      <CrossWithCircleIcon color="red" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleApproveCheck(item)}
                      // disabled={!item?.can_cancel}
                      data-tooltip-id={`${`tooltip-group-tick-schedule`}`}
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
                    {
                      <ReactTooltip
                        id={`tooltip-group-cross-schedule`}
                        place="left"
                        content={'Disapprove'}
                        style={{
                          width: '110px',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      />
                    }
                  </>
                )}
                {item?.state === 'APPROVED' && (
                  <>
                    <IconButton
                      onClick={() => handleRejectCrossClick(item)}
                      // disabled={!item?.can_cancel}
                      data-tooltip-id={`${`tooltip-group-reject-schedule`}`}
                    >
                      <RejectIcon />
                    </IconButton>
                    {
                      <ReactTooltip
                        id={`tooltip-group-reject-schedule`}
                        place="left"
                        content={'Reject'}
                        style={{
                          width: '80px',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      />
                    }
                  </>
                )}
                {/* {item?.state === 'NOT_APPROVED' && <>Rejected</>} */}
              </>
            )}
          </>
        )}
      </ActionTd>
    );
  };

  const COLUMNS = [
    {
      label: 'Process Group',
      renderCell: item => <TextRender text={item?.namespace_name || 'N/A'} />,
      width: '14%',
    },
    {
      label: 'Flow Name',
      renderCell: item => <TextRender text={item?.flow_name || 'N/A'} />,
      width: '14%',
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
      width: '14%',
    },
    {
      label: 'Deploy Time',
      renderCell: item => <TextRender text={item.scheduled_time || 'N/A'} />,
      width: '14%',
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
      width: '13%',
    },
    {
      label: 'Status',
      renderCell: item => <StatusText text={item?.state} item={item} />,
      width: '10%',
    },
    {
      label: 'Actions',
      width: '15%',
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
    { value: 'IN PROGRESS', label: 'In Progress' },
    { value: 'NOT APPROVED', label: 'Not Approved' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

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
        placeholder="Search Approver or flow name"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};
