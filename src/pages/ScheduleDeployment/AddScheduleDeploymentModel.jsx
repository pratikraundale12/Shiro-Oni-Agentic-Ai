import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { UserSelect } from '../../components';
import { Button, DateTimeInput, Modal } from '../../shared';
import {
  ClustersActions,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import styled from 'styled-components';

const Container = styled.div`
  height: 350px;
`;
export const AddScheduleDeploymentModal = ({
  control,
  errors,
  scheduleInitialOpen,
  setScheduleInitialOpen,
  handleContinue = () => {},
  startDate,
  setStartDate,
  showButton = false,
}) => {
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const openModal = () => {
    setScheduleInitialOpen(true);
  };
  const closeModal = () => {
    setScheduleInitialOpen(false);
  };

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(NamespacesActions.fetchNamespaces());
    }
  }, [dispatch, selectedCluster]);

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(SchedularActions.fetchNamespaces(selectedCluster?.value));
    }
  }, [selectedCluster, dispatch]);

  return (
    <div>
      {showButton && (
        <Button onClick={openModal} size="md" variant="secondary">
          Schedule
        </Button>
      )}
      <Modal
        size="md"
        title={'Add Schedule Deployment'}
        isOpen={scheduleInitialOpen}
        onRequestClose={closeModal}
        secondaryButtonText="Cancel"
        primaryButtonText="Continue"
        onSubmit={handleContinue}
        footerAlign="start"
        contentStyles={{ minWidth: '45%' }}
      >
        <Container>
          <div className="row">
            <div className="col-12">
              <DateTimeInput
                startDate={startDate}
                setStartDate={setStartDate}
                label="Deploy Time"
                control={control}
                errors={errors}
                required
              />
            </div>
          </div>
          {showButton && (
            <UserSelect
              control={control}
              errors={errors}
              name="approver_ids"
              placeholder="Select atleast one approver"
              label="Approver"
            />
          )}
        </Container>
      </Modal>
    </div>
  );
};
AddScheduleDeploymentModal.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  scheduleInitialOpen: PropTypes.bool,
  setScheduleInitialOpen: PropTypes.func,
  handleContinue: PropTypes.func,
  startDate: PropTypes.string.isRequired,
  setStartDate: PropTypes.object.isRequired,
  showButton: PropTypes.bool,
};
