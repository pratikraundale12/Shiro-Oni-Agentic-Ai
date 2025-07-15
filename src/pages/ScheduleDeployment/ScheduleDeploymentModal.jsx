/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import {
  CrossIcon,
  LinkIcon,
  SquareBoxIcon,
  TriangleIcons,
} from '../../assets';
import { FullPageLoader, UserSelect } from '../../components';
import { KDFM } from '../../constants';
import { Button, DateField, Modal, SelectField } from '../../shared';
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
const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid
    ${({ className }) => {
      if (className?.includes('div-btn-1')) return '#58e715'; // Start (RUNNING) button
      if (className?.includes('div-btn-2')) return '#c52b2b'; // Stop (STOPPED) button
      return '#dde4f0';
    }};
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }
  svg path {
    fill: ${props => (props.isActive ? props.activeColor : '#b5bdc8')};
  }
`;
const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
`;

const FlowControlDiv = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
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
  scheduled_time: yup.string().required('Schedule deploy time is required'),
});

export const ScheduleDeploymentModal = ({ onConfirm }) => {
  const dispatch = useDispatch();
  const scheduleModal = useSelector(SchedularSelectors.getScheduleModal);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const hideVersionSchedulestartstop =
    selectedSchedule?.mode === 'start' || selectedSchedule?.mode === 'stop';

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'editScheduleDeployment')
  );
  const [scheduleErrors, setScheduleErrors] = useState({});
  const [activeButton, setActiveButton] = useState(
    selectedSchedule?.deployment_status &&
      selectedSchedule.deployment_status !== ''
      ? selectedSchedule.deployment_status.toUpperCase()
      : null
  );

  const versionListData = useSelector(NamespacesSelectors.getVersionListData);

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
  useEffect(() => {
    if (
      selectedSchedule?.deployment_status &&
      selectedSchedule.deployment_status !== ''
    ) {
      setActiveButton(selectedSchedule.deployment_status.toUpperCase());
    } else {
      setActiveButton(null);
    }
  }, [selectedSchedule]);
  const handleUpdateStatus = status => {
    setActiveButton(status);
  };

  const onSubmit = data => {
    const payload = {
      schedularId: selectedSchedule?.id,
      scheduled_time: new Date(data?.scheduled_time).toISOString(),
      version: data?.select_version,
      deployment_status: activeButton,
    };
    const currentTime = new Date();
    const scheduledTime = new Date(data?.scheduled_time);
    if (!hideVersionSchedulestartstop) {
      if (data?.select_version === selectedSchedule?.prev_version) {
        toast.info('The selected version is already deployed.');
        return;
      }
    }

    if (scheduledTime.getTime() > currentTime.getTime()) {
      setScheduleErrors({});
      dispatch(SchedularActions.editScheduleDeployment(payload));
      dispatch(SchedularActions.setScheduleModal(false));
      reset();
      if (onConfirm) onConfirm();
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
        approver_ids: selectedSchedule?.approvers?.map(
          item => item.approver_id
        ),
        select_version: selectedSchedule?.version,
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

  const versionOptions = Array.isArray(versionListData?.versionList)
    ? versionListData.versionList
        .slice()
        .sort((a, b) =>
          String(a.version).localeCompare(String(b.version), undefined, {
            numeric: true,
          })
        )
        .map(version => ({
          label: String(version.version),
          value: version.version,
        }))
    : [];
  return (
    <>
      <FullPageLoader loading={loading} />
      <Modal
        size="md"
        title={
          !isEmpty(selectedSchedule)
            ? 'Re-Schedule Deployment Schedule'
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
                label="Schedule Deploy Time"
                name="scheduled_time"
                placeholder="select schedule deploy time"
                onChange={() => setScheduleErrors({})}
                control={control}
                errors={
                  Object.keys(scheduleErrors).length ? scheduleErrors : errors
                }
                required
              />
            </div>
            {!hideVersionSchedulestartstop && (
              <>
                <div className="col-12">
                  <SelectField
                    name="select_version"
                    label="Version"
                    icon={<LinkIcon />}
                    placeholder="Select Version"
                    options={versionOptions}
                    control={control}
                    sortAlphabetically={false}
                  />
                </div>
                <FlowControlDiv className="mt-4">Flow Control</FlowControlDiv>
                <div className="d-flex mt-3">
                  <TextsvgDiv className="d-flex mr-4">
                    <ActiveButtonDiv className="div-btn-1 mr-2">
                      <ActiveButtonDiv
                        className="div-btn-1 "
                        isActive={activeButton === 'RUNNING'}
                        activeColor="#58e715"
                        hoverColor="#58e715"
                        activeTextColor="#fff"
                        onClick={() => handleUpdateStatus('RUNNING')}
                      >
                        <TriangleIcons color="#B5BDC8" />
                      </ActiveButtonDiv>
                    </ActiveButtonDiv>
                    <div className="mr-2">{KDFM.RUNNING_FLOW}</div>
                  </TextsvgDiv>
                  <TextsvgDiv className="d-flex">
                    <ActiveButtonDiv className="div-btn-2 mr-2">
                      <ActiveButtonDiv
                        className="div-btn-2"
                        isActive={activeButton === 'STOPPED'}
                        activeColor="#c52b2b"
                        hoverColor="#c52b2b"
                        activeTextColor="#fff"
                        onClick={() => handleUpdateStatus('STOPPED')}
                      >
                        <SquareBoxIcon color="#B5BDC8" />
                      </ActiveButtonDiv>
                    </ActiveButtonDiv>
                    <div>{KDFM.STOPPED_FLOW}</div>
                  </TextsvgDiv>

                  {activeButton && (
                    <TextsvgDiv className="d-flex ml-4">
                      <ActiveButtonDiv className="div-btn-2 mr-2">
                        <ActiveButtonDiv
                          className="div-btn-2"
                          onClick={() => {
                            setActiveButton(null);
                          }}
                        >
                          <CrossIcon color="#B5BDC8" />
                        </ActiveButtonDiv>
                      </ActiveButtonDiv>
                      <div>Reset Flow</div>
                    </TextsvgDiv>
                  )}
                </div>
              </>
            )}
          </div>
        </Container>
      </Modal>
    </>
  );
};
ScheduleDeploymentModal.propTypes = {
  onConfirm: PropTypes.func,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  scheduleInitialOpen: PropTypes.bool,
  setScheduleInitialOpen: PropTypes.func,
  handleContinue: PropTypes.func,
  startDate: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  showButton: PropTypes.bool,
  loadingButton: PropTypes.bool,
  setActiveButton: PropTypes.func,
  activeButton: PropTypes.string,
};
