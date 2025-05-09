/*eslint-disable*/
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ClustersActions, LoadingSelectors } from '../../../store';
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
}) => {
  const dispatch = useDispatch();
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );

  const onRequestClose = () => {
    setIsProcessModalOpen(false);
    setSelectedCluster({});
    // dispatch(
    //   GridActions.fetchGrid({
    //     module: 'clusters',
    //     params: { page: 1, limit: 10 },
    //   })
    // );
  };

  useEffect(() => {
    if (isProcessModalOpen) {
      const payload = {
        clusterId: selectedCluster?.id,
        process_id: selectedCluster?.process_id,
        process_name: selectedCluster?.process_name,
      };
      dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
    }
  }, [isProcessModalOpen]);

  useEffect(() => {
    let intervalId;
    if (isProcessModalOpen) {
      intervalId = setInterval(() => {
        const payload = {
          clusterId: selectedCluster?.id,
          process_id: selectedCluster?.process_id,
          process_name: selectedCluster?.process_name,
        };
        dispatch(ClustersActions.fetchAnsibleCLusterProcessData(payload));
      }, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isProcessModalOpen, dispatch]);
  return (
    <>
      <FullPageLoader loading={loading} />
      <ModalWithRightBtn
        isOpen={isProcessModalOpen}
        onRequestClose={onRequestClose}
        onSubmit={() => onRequestClose()}
        title={` Cluster Details`}
        primaryButtonText="Back"
        contentStyles={{ minWidth: '60%', maxHeight: '60%' }}
        footerAlign="start"
      >
        <Container>
          <StepProgress />
        </Container>
      </ModalWithRightBtn>
    </>
  );
};
