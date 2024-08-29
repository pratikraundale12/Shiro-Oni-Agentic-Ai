import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RightCircleIcon } from '../../../assets';
import { KDFM } from '../../../constants';
import { Modal } from '../../../shared';
import { ClustersActions, ClustersSelectors } from '../../../store';

const Icon = styled.div`
  align-items: center !important;
  justify-content: center !important;
  display: flex !important;
`;

const Title = styled.h5`
  font-family: noto sans;
  font-size: 20px;
  font-weight: 700;
  text-transform: capitalize;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: center !important;
  padding-top: 1.5rem !important;
  margin-bottom: 0 !important;
  margin-top: 0.5rem !important;
`;

const Para = styled.p`
  text-align: center;
  margin-bottom: 0 !important;
  margin-top: 0;
  margin-bottom: 1rem;
  box-sizing: border-box;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-end: 0px;
`;

const ClusterSuccessModal = () => {
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(ClustersActions.updateClusterSuccessModal(false));
  };
  const clusterSuccessModal = useSelector(
    ClustersSelectors.getClusterSuccessModal
  );

  return (
    <Modal
      title={KDFM.CLUSTER_ADDED}
      size="sm"
      onRequestClose={handleSubmit}
      isOpen={clusterSuccessModal}
      primaryButtonText={KDFM.CONTINUE}
      onSubmit={handleSubmit}
    >
      <Icon>
        <RightCircleIcon color="#0CBF59" />
      </Icon>
      <Title className="text-capitalize">
        {KDFM.CLUSTER_ADDED_SUCCESSFULLY}
      </Title>
      <Para>{KDFM.CLUSTER_SUCCESS_DESCRIPTION}</Para>
    </Modal>
  );
};

export default ClusterSuccessModal;
