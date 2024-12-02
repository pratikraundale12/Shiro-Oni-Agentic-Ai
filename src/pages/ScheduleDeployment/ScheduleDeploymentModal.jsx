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
  AuthenticationSelectors,
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

const SchemaWithApprover = yup.object().shape({
  scheduled_time: yup.string().required('Deploy time is required'),
  approver_ids: yup.array().required('Approvers is required'),
});
const SchemaWithoutApprover = yup.object().shape({
  scheduled_time: yup.string().required('Deploy time is required'),
});

export const ScheduleDeploymentModal = ({ showApprover }) => {
  const dispatch = useDispatch();
  const scheduleModal = useSelector(SchedularSelectors.getScheduleModal);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  );
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const {
    control,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm({
    resolver: showApprover
      ? yupResolver(SchemaWithApprover)
      : yupResolver(SchemaWithoutApprover),
    defaultValues: DEFAULT_VALUES,
  });
  const onRequestClose = () => {
    dispatch(SchedularActions.setScheduleModal());
    reset();
    dispatch(SchedularActions.setSelectedSchedule({}));
  };

  const onSubmit = data => {
    const formattedDate = new Date(data.scheduled_time).toUTCString();
    const { approver_ids } = data;

    if (!isEmpty(selectedSchedule)) {
      const payload = {
        schedularId: selectedSchedule.scheduler_id,
        scheduled_time: formattedDate,
        approver_ids: approver_ids,
      };
      dispatch(SchedularActions.editScheduleDeployment(payload));
      reset();
      dispatch(SchedularActions.setSelectedSchedule({}));
    } else {
      dispatch(
        SchedularActions.setFormData({
          approver_ids: approver_ids || [],
          scheduled_time: formattedDate,
        })
      );
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

  const needToDisable = selectedSchedule?.approvers?.some(
    item => item.approver_id === currentUser?.id
  );
  const approver_ids = watch('approver_ids');
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
      primaryButtonDisabled={showApprover && isEmpty(approver_ids)}
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
        {showApprover && (
          <UserSelect
            control={control}
            errors={errors}
            name="approver_ids"
            placeholder="Select atleast one approver"
            label="Approver"
            disabled={
              currentUser?.role === 'superadmin' || !needToDisable
                ? false
                : true
            }
            required
          />
        )}
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
  showApprover: PropTypes.bool,
};
