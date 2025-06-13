/*eslint-disable*/
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  GridActions,
  LoadingSelectors,
} from '../../../store';
import { ModalWithRightBtn } from '../../../shared';
import { FullPageLoader } from '../../../components';
import StepProgress from './ProgressSteps';

const Container = styled.div`
  height: 100%;
`;

export const ClusterProcessDisplayModal = ({
  isProcessModalOpen,
  setIsProcessModalOpen,
  setSelectedCluster,
  selectedCluster,
  sortingState,
}) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    ClustersSelectors.getProgressTrackingModalOpen
  );
  const progressStageRef = useRef(null);
  const ansibleClusterCreationData = useSelector(
    ClustersSelectors.getansibleClusterCreationResponseData
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );

  const onRequestClose = () => {
    setIsProcessModalOpen(false);
    dispatch(ClustersActions.setProgressTrackingModalOpen(false));
    setSelectedCluster({});
    dispatch(
      GridActions.fetchGrid({
        module: 'clusters',
        params: { page: 1, limit: 10 },
        ...(sortingState && {
          sort: sortingState,
        }),
      })
    );
  };

  useEffect(() => {
    if (isProcessModalOpen || isModalOpen) {
      const payload = {
        clusterId:
          selectedCluster?.id || ansibleClusterCreationData?.cluster_id,
        process_id:
          selectedCluster?.process_id || ansibleClusterCreationData?.process_id,
        process_name:
          selectedCluster?.process_name ||
          ansibleClusterCreationData?.process_name,
      };
      dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
    }
  }, [isProcessModalOpen, isModalOpen]);

  useEffect(() => {
    let intervalId;
    if (isProcessModalOpen || isModalOpen) {
      intervalId = setInterval(() => {
        const payload = {
          clusterId:
            selectedCluster?.id || ansibleClusterCreationData?.cluster_id,
          process_id:
            selectedCluster?.process_id ||
            ansibleClusterCreationData?.process_id,
          process_name:
            selectedCluster?.process_name ||
            ansibleClusterCreationData?.process_name,
        };
        dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isProcessModalOpen, isModalOpen, dispatch]);
  return (
    <>
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isProcessModalOpen || isModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={() => onRequestClose()}
        title={` Cluster Details`}
        primaryButtonText="Close"
        contentStyles={{ minWidth: '60%', maxHeight: '60%' }}
        footerAlign="start"
      >
        <Container>
          <div className="progress">
            <div
              className="progress-bar "
              role="progressbar"
              style={{ width: '25%', backgroundColor: '#55D955' }}
              aria-valuenow={25}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <StepProgress progressStageRef={progressStageRef} />
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
