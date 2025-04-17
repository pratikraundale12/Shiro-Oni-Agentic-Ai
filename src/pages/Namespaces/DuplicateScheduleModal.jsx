/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Modal } from '../../shared';
import { history } from '../../helpers/history';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { DuplicateIcon } from '../../assets';
import { theme } from '../../styles';

const Container = styled.div``;
const Icon = styled.div`
  align-items: center !important;
  justify-content: center !important;
  display: flex !important;
`;
const LinkClick = styled.span`
  color: ${theme.colors.primary};
`;
export const DuplicateScheduleModal = ({
  handleScheduleDeployDuplicate,
  type,
}) => {
  const dispatch = useDispatch();
  const duplicateModalOpen = useSelector(
    NamespacesSelectors.getDuplicateScheduleModalOpen
  );
  const duplicateResponseData = useSelector(
    NamespacesSelectors.getDuplicateScheduleModalData
  );
  const scheduleDeploymentFlow = useSelector(
    NamespacesSelectors.getScheduleByRegistry
  );

  const { handleSubmit } = useForm();

  const onRequestClose = () => {
    dispatch(NamespacesActions.setDuplicateScheduleModalOpen(false));
    history.push('/process-group');
  };
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${day} ${month} ${year} ${time}`;
  }

  const onSubmit = () => {
    dispatch(NamespacesActions.setDuplicateScheduleModalOpen(false));
    handleScheduleDeployDuplicate();
  };
  const handleRediectSchedule = () => {
    window.localStorage.setItem(
      'scheduleTokenid',
      duplicateResponseData?.scheduleId
    );
    history.push('/schedule-deployment');
  };
  //
  return (
    <Modal
      size="md"
      title={'Already scheduled process group'}
      isOpen={duplicateModalOpen}
      onRequestClose={onRequestClose}
      secondaryButtonText="Cancel"
      primaryButtonText={'Confirm'}
      onSubmit={handleSubmit(onSubmit)}
      contentStyles={{ minWidth: '25%', minHeight: '30%' }}
      primaryButtonProps={{ id: 'duplicate-schedule-deployment' }}
    >
      <Container>
        <div className="d-flex justify-content-center">
          <div className="col-12">
            <Icon>
              <DuplicateIcon />
            </Icon>
            <div className="d-flex justify-content-center mt-4 flex-column px-3">
              <div className="text-center h5">
                {duplicateResponseData?.message} to be{' '}
                {duplicateResponseData?.exisitingMode} on{' '}
                {formatDate(duplicateResponseData?.scheduled_time)} for version
                &nbsp;
                {duplicateResponseData?.version}
              </div>
              <span className=" d-flex gap-2 justify-content-center mb-2">
                <LinkClick
                  onClick={handleRediectSchedule}
                  style={{ cursor: 'pointer' }}
                >
                  Click here
                </LinkClick>
                to see the existing schedule
              </span>
              <div className="text-center h5">
                Do you still want to continue with duplicate{' '}
                {scheduleDeploymentFlow
                  ? 'deployment'
                  : type === 'upgrade'
                    ? 'upgrade'
                    : 'downgrade'}
                ?
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Modal>
  );
};
DuplicateScheduleModal.propTypes = {
  handleScheduleDeployDuplicate: PropTypes.func,
  type: PropTypes.string,
};
