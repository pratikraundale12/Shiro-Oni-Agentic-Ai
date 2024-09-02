/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { UserSelect } from '../../components';
import { Button, DateField, Modal } from '../../shared';
import {
  ClustersActions,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';

const Container = styled.div`
  height: 350px;
`;

const DEFAULT_VALUES = {
  scheduled_time: '',
  approver_ids: [],
};

const Schema = yup.object().shape({
  scheduled_time: yup.string().required('Deploy time is required'),
  approver_ids: yup.array().required('Approvers is required'),
});

export const ScheduleDeploymentModal = () => {
  const dispatch = useDispatch();
  const scheduleModal = useSelector(SchedularSelectors.getScheduleModal);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  );
  const {
    control,
    formState: { errors, isDirty },
    reset,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: DEFAULT_VALUES,
  });

  const onRequestClose = () => {
    dispatch(SchedularActions.setScheduleModal());
  };

  // const approvers = useWatch({
  //   control,
  //   name: 'approver_ids',
  //   defaultValue: [],
  // });

  // const openModal = () => {
  //   if (window.location.pathname.includes('schedule-deployment')) {
  //     dispatch(SchedularActions.setEditScheduleModel());
  //     return;
  //   }
  //   setScheduleInitialOpen(true);
  // };
  // const closeModal = () => {
  //   if (window.location.pathname.includes('schedule-deployment')) {
  //     dispatch(SchedularActions.setEditScheduleModel());
  //     return;
  //   }
  //   setScheduleInitialOpen(false);
  // };

  // useEffect(() => {
  //   if (!isEmpty(selectedCluster)) {
  //     dispatch(NamespacesActions.fetchNamespaces());
  //   }
  // }, [dispatch, selectedCluster]);

  // useEffect(() => {
  //   dispatch(ClustersActions.fetchClusterList());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (!isEmpty(selectedCluster)) {
  //     dispatch(SchedularActions.fetchNamespaces(selectedCluster?.value));
  //   }
  // }, [selectedCluster, dispatch]);

  // useEffect(() => {
  //   const isFormValid = approvers.length > 0;
  //   setDisableButton(!isFormValid);
  // }, [approvers]);

  const onSubmit = data => {
    if (!isEmpty(selectedSchedule)) {
      const payload = {
        schedularId: selectedSchedule.scheduler_id,
        // is_approved: true,
        scheduled_time: new Date(data.scheduled_time).toISOString(),
      };
      dispatch(SchedularActions.editScheduleDeployment(payload));
    } else {
      dispatch(SchedularActions.setFormData(data));
      dispatch(SchedularActions.setScheduleModal());
      dispatch(SchedularActions.setScheduleDeployModal());
    }
  };

  useEffect(() => {
    if (!isEmpty(selectedSchedule)) {
      reset({
        scheduled_time: new Date(selectedSchedule?.scheduled_time),
        approver_ids: selectedSchedule?.approvers?.map(
          item => item.approver_id
        ),
      });
    } else {
      reset({
        scheduled_time: new Date(),
      });
    }
  }, [dispatch, reset, selectedSchedule]);

  return (
    <Modal
      size="md"
      title={
        !isEmpty(selectedSchedule)
          ? 'Edit Schedule Deployment'
          : 'Schedule Deployment'
      }
      isOpen={scheduleModal}
      onRequestClose={onRequestClose}
      secondaryButtonText="Cancel"
      primaryButtonText={!isEmpty(selectedSchedule) ? 'Update' : 'Continue'}
      primaryButtonDisabled={!isDirty}
      onSubmit={handleSubmit(onSubmit)}
      footerAlign="start"
      contentStyles={{ minWidth: '45%', minHeight: '40%' }}
      loading={loading}
    >
      <Container>
        <div className="row">
          <div className="col-12">
            <DateField
              label="Deploy Time"
              name="scheduled_time"
              placeholder="Select deploy time"
              control={control}
              errors={errors}
              required
            />
          </div>
        </div>
        <UserSelect
          control={control}
          errors={errors}
          name="approver_ids"
          placeholder="Select atleast one approver"
          label="Approver"
          required
        />
      </Container>
    </Modal>
  );
};
ScheduleDeploymentModal.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  scheduleInitialOpen: PropTypes.bool,
  setScheduleInitialOpen: PropTypes.func,
  handleContinue: PropTypes.func,
  startDate: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  showButton: PropTypes.bool,
  loadingButton: PropTypes.bool,
};
