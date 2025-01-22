/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
import { KDFM } from '../../constants';

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

export const ScheduleDeploymentModal = () => {
  const dispatch = useDispatch();
  const scheduleModal = useSelector(SchedularSelectors.getScheduleModal);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  );
  const [scheduleErrors, setScheduleErrors] = useState({});
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const {
    control,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(SchemaWithoutApprover),
    defaultValues: DEFAULT_VALUES,
  });
  const onRequestClose = () => {
    dispatch(SchedularActions.setScheduleModal(false));
    reset();
    dispatch(SchedularActions.setSelectedSchedule({}));
    setScheduleErrors({});
  };
  const onSubmit = data => {
    const payload = {
      schedularId: selectedSchedule?.id,
      scheduled_time: new Date(data?.scheduled_time).toISOString(),
    };
    const currentTime = new Date();
    const scheduledTime = new Date(data?.scheduled_time);
    if (scheduledTime.getTime() > currentTime.getTime()) {
      setScheduleErrors({});
      dispatch(SchedularActions.editScheduleDeployment(payload));
      dispatch(SchedularActions.setScheduleModal(false));
      reset();
    } else {
      setScheduleErrors({
        scheduled_time: {
          message: KDFM.INCORRECT_SCHEDULE_TIME,
        },
      });
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
          ? 'Edit Deployment Schedule'
          : 'Deployment Schedule'
      }
      isOpen={scheduleModal}
      onRequestClose={onRequestClose}
      secondaryButtonText="Cancel"
      primaryButtonText={!isEmpty(selectedSchedule) ? 'Update' : 'Continue'}
      // primaryButtonDisabled={showApprover && isEmpty(approver_ids)}
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
              onChange={() => setScheduleErrors({})}
              control={control}
              errors={
                Object.keys(scheduleErrors).length ? scheduleErrors : errors
              }
              required
            />
          </div>
        </div>
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
