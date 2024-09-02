/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { DateField, InputField, Modal } from '../../shared';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { LoadingSelectors } from '../../store';
import { QRIcons } from '../../assets';

const Container = styled.div`
  height: 350px;
`;

const DEFAULT_VALUES = {
  namespace_name: '',
  source_cluster_name: '',
  destination_cluster_name: '',
  scheduled_time: '',
};

const Schema = yup.object().shape({
  namespace_name: yup.string(),
  source_cluster_name: yup.string(),
  destination_cluster_name: yup.string(),
  scheduled_time: yup.string().required('Deploy time is required'),
});

export const TokenScheduleDeploymentModal = () => {
  const dispatch = useDispatch();
  const tokenScheduleModal = useSelector(
    SchedularSelectors.getTokenScheduleModal
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  );
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const {
    control,
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: DEFAULT_VALUES,
  });

  const onRequestClose = () => {
    dispatch(SchedularActions.setTokenScheduleModal());
  };

  const onSecondarySubmit = () => {
    dispatch(SchedularActions.setTokenScheduleModal());
    dispatch(SchedularActions.setRejectScheduleModal());
  };

  const onSubmit = data => {
    const formattedDate = new Date(data.scheduled_time).toUTCString();
    const payload = {
      schedularId: selectedSchedule.scheduler_id,
      is_approved: true,
      scheduled_time: formattedDate,
    };
    dispatch(SchedularActions.editScheduleDeployment(payload));
  };

  useEffect(() => {
    if (!isEmpty(selectedSchedule)) {
      reset({
        namespace_name: selectedSchedule?.namespace_name,
        source_cluster_name: selectedSchedule?.source_cluster_name,
        destination_cluster_name: selectedSchedule?.destination_cluster_name,
        scheduled_time: new Date(selectedSchedule?.scheduled_time),
      });
    }
  }, [dispatch, reset, selectedSchedule]);

  return (
    <Modal
      title="Schedule Deployment"
      isOpen={tokenScheduleModal}
      onRequestClose={onRequestClose}
      secondaryButtonText="Decline"
      primaryButtonText="Approve"
      onSubmit={handleSubmit(onSubmit)}
      onSecondarySubmit={onSecondarySubmit}
      loading={loading}
      contentStyles={{ minWidth: '45%', minHeight: '40%' }}
      footerAlign="start"
    >
      <Container className="row">
        <div className="col-12">
          <InputField
            label="Namespace"
            name="namespace_name"
            register={register}
            errors={errors}
            icon={<QRIcons />}
            disabled
            required
          />
        </div>
        <div className="row">
          <div className="col-6">
            <InputField
              label="Source Cluster"
              name="source_cluster_name"
              register={register}
              errors={errors}
              icon={<QRIcons />}
              disabled
              required
            />
          </div>
          <div className="col-6">
            <InputField
              label="Destination Cluster"
              name="destination_cluster_name"
              register={register}
              errors={errors}
              icon={<QRIcons />}
              disabled
              required
            />
          </div>
        </div>
        <div className="col-12">
          <DateField
            name="scheduled_time"
            control={control}
            errors={errors}
            label="Deploy Time"
            placeholder="Select deploy time"
            required
          />
        </div>
      </Container>
    </Modal>
  );
};
TokenScheduleDeploymentModal.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  scheduleInitialOpen: PropTypes.bool,
  setScheduleInitialOpen: PropTypes.func,
  handleContinue: PropTypes.func,
  dateToken: PropTypes.string.isRequired,
  setDateToken: PropTypes.func.isRequired,
  showButton: PropTypes.bool,
  loadingButton: PropTypes.bool,
  handleDecline: PropTypes.func,
  handleCloseModel: PropTypes.func,
};
