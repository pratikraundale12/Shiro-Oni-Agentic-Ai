import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { InputField, Modal } from '../../shared';
import { ConfirmScheduleDeploymentIcon, QRIcons } from '../../assets';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { LoadingSelectors } from '../../store';

const IconWrapper = styled.div`
  text-align: center;
`;

const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;

const StyledInputField = styled(InputField)`
  margin-bottom: 0.4rem;
`;

const DEFAULT_VALUES = {
  note: '',
};

const Schema = yup.object().shape({
  note: yup.string().required('Reason is required'),
});

export const RejectScheduleModal = () => {
  const dispatch = useDispatch();
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const rejectScheduleModal = useSelector(
    SchedularSelectors.getRejectScheduleModal
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  );
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: DEFAULT_VALUES,
  });

  const onRequestClose = () => {
    dispatch(SchedularActions.setRejectScheduleModal());
  };

  const onSubmit = data => {
    data.is_approved = false;
    data.schedularId = selectedSchedule.scheduler_id;
    dispatch(SchedularActions.editScheduleDeployment(data));
  };

  return (
    <Modal
      isOpen={rejectScheduleModal}
      onRequestClose={onRequestClose}
      onSecondarySubmit={onRequestClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Schedule Deployment Confirmation"
      primaryButtonText="Confirm"
      secondaryButtonText="Cancel"
      loading={loading}
      contentStyles={{ minWidth: '40%', minHeight: '40%' }}
      footerAlign="center"
    >
      <IconWrapper>
        <ConfirmScheduleDeploymentIcon />
      </IconWrapper>
      <PrimaryText>Are you sure you want to Reject this Deployment</PrimaryText>
      <StyledInputField
        name="note"
        label="Reason"
        placeholder="Enter the Reason for Rejection"
        register={register}
        errors={errors}
        icon={<QRIcons />}
        required
      />
    </Modal>
  );
};

RejectScheduleModal.propTypes = {
  icon: PropTypes.elementType.isRequired,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.object.isRequired,
  loadingButton: PropTypes.bool,
};
