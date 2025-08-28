import React from 'react';
import { Modal } from '../../../shared';
import { DeleteDustbinIcon } from '../../../assets';
import { KDFM } from '../../../constants';
import styled from 'styled-components';
const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;
const EKSClusterDeleteModal = () => {
  return (
    <>
      <Modal
        isOpen={false}
        title={'Delete Cluster'}
        secondaryButtonText="Back"
        primaryButtonText="Delete"
        primaryButtonDisabled={false}
        onSubmit={() => {}}
        onSecondarySubmit={() => {}}
        onRequestClose={() => {}}
        footerAlign="center"
      >
        <div className=" row d-flex justify-content-center">
          <div style={{ textAlign: 'center' }}>
            <DeleteDustbinIcon />
          </div>
          <PrimaryText>{KDFM.HARD_DELETE_CLUSTER_WARNING}</PrimaryText>
          <div className="d-flex justify-content-center"></div>
        </div>
      </Modal>
    </>
  );
};
export default EKSClusterDeleteModal;
