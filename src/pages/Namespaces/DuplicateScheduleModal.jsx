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

const Container = styled.div`
  height: 250px;
`;
const Icon = styled.div`
  align-items: center !important;
  justify-content: center !important;
  display: flex !important;
`;
export const DuplicateScheduleModal = ({ handleScheduleDeployDuplicate }) => {
  const dispatch = useDispatch();
  const duplicateModalOpen = useSelector(
    NamespacesSelectors.getDuplicateScheduleModalOpen
  );
  const duplicateResponseData = useSelector(
    NamespacesSelectors.getDuplicateScheduleModalData
  );
  console.log(duplicateResponseData, 'duplicateResponseData');
  //   const loading = useSelector(state =>
  //     LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  //   );
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

  return (
    <Modal
      size="md"
      title={'Already scheduled process group'}
      isOpen={duplicateModalOpen}
      onRequestClose={onRequestClose}
      secondaryButtonText="Cancel"
      primaryButtonText={'Confirm'}
      // primaryButtonDisabled={showApprover && isEmpty(approver_ids)}
      onSubmit={handleSubmit(onSubmit)}
      // footerAlign="start"
      contentStyles={{ minWidth: '35%', minHeight: '30%' }}
      //   loading={loading}
    >
      <Container>
        <div className="d-flex justify-content-center">
          <div className="col-12">
            <Icon>
              <DuplicateIcon />
            </Icon>
            <div className="d-flex justify-content-center mt-3">
              {duplicateResponseData?.message} <br />
              {formatDate(duplicateResponseData?.scheduled_time)}
            </div>
          </div>
        </div>
      </Container>
    </Modal>
  );
};
DuplicateScheduleModal.propTypes = {
  handleScheduleDeployDuplicate: PropTypes.func,
};
