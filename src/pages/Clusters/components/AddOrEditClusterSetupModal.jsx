/*eslint-disable*/
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { Modal } from '../../../shared';
import { KDFM } from '../../../constants';
import {
  CreateClusterIcon,
  ManageClusterIcon,
  SelectedTickIconOrange,
} from '../../../assets';
import { theme } from '../../../styles';
import { history } from '../../../helpers/history';

const Container = styled.div``;
const BulletContainer = styled.div`
  height: 120px;
  margin-bottom: 10px;
  border: 2px solid
    ${({ borderSelected }) =>
      borderSelected ? theme.colors.primary : '#DDE4F0'};
  border-radius: 14px;
  background-color: #f5f7fa;
  cursor: pointer;
`;

const IconContainer = styled.div`
  border: 1px solid
    ${({ borderSelected }) =>
      borderSelected ? theme.colors.primary : '#DDE4F0'};
  border-radius: 14px;
  background-color: #ffff;
`;
const LeftHolder = styled.div`
  padding: 16px 26px;
`;
const RightHolder = styled.div`
  padding: 26px 5px;
`;
const HighLightText = styled.span`
  font-family: Noto Sans;
  font-weight: 600;
  font-size: 20px;
  line-height: 27.24px;
  letter-spacing: 0%;
  color: #444445;
`;
const BottomText = styled.span`
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  line-height: 21.17px;
  letter-spacing: 0%;
  color: #444445;
`;

export const AddOrEditClusterModal = () => {
  const dispatch = useDispatch();
  const [selectedFlow, setSelectedFlow] = useState(null);

  const isModalOpen = useSelector(
    ClustersSelectors.getIsAddorEditClusterModalOpen
  );
  const onRequestClose = () => {
    dispatch(ClustersActions.setIsAddorEditClusterModalOpen(false));
  };
  const { handleSubmit } = useForm();
  const handleContinueSubmit = () => {
    if (selectedFlow === 'ManageCluster') {
      history.push(`/clusters/add`);
      onRequestClose();
    } else if (selectedFlow === 'CreateCluster') {
      history.push(`/clusters/setup-cluster`);
      onRequestClose();
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedFlow(null);
    }
  }, [isModalOpen]);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      onSubmit={handleSubmit(handleContinueSubmit)}
      title={KDFM.NEW_CLUSTER}
      primaryButtonText="Continue"
      secondaryButtonText="Back"
      contentStyles={{ minWidth: '32%' }}
      footerAlign="start"
    >
      <Container>
        <BulletContainer
          onClick={() => {
            setSelectedFlow('CreateCluster');
          }}
          borderSelected={selectedFlow === 'CreateCluster'}
        >
          <div className="d-flex row align-items-center  h-100 mx-auto">
            <LeftHolder className="col-3 align-items-center justify-content-center h-100 ">
              <IconContainer
                className=" d-flex align-items-center justify-content-center h-100"
                borderSelected={selectedFlow === 'CreateCluster'}
              >
                <CreateClusterIcon
                  height="60"
                  width="60"
                  color={
                    selectedFlow === 'CreateCluster'
                      ? theme.colors.primary
                      : 'black'
                  }
                />
              </IconContainer>
            </LeftHolder>
            <RightHolder className="col-9 h-100 row">
              <div className="col-10 h-100">
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <HighLightText>Create New Cluster</HighLightText>
                </div>
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <BottomText>Set up a new DFM cluster from scratch</BottomText>
                </div>
              </div>
              {selectedFlow === 'CreateCluster' && (
                <div className="col-2  d-flex align-items-center justify-content-center ">
                  <SelectedTickIconOrange height="25" width="25" />
                </div>
              )}
            </RightHolder>
          </div>
        </BulletContainer>
        <BulletContainer
          onClick={() => {
            setSelectedFlow('ManageCluster');
          }}
          borderSelected={selectedFlow === 'ManageCluster'}
        >
          <div className="d-flex row align-items-center  h-100 mx-auto">
            <LeftHolder className="col-3 align-items-center justify-content-center h-100 ">
              <IconContainer
                className=" d-flex align-items-center justify-content-center h-100"
                borderSelected={selectedFlow === 'ManageCluster'}
              >
                <ManageClusterIcon
                  height="50"
                  width="50"
                  color={
                    selectedFlow === 'ManageCluster'
                      ? theme.colors.primary
                      : 'black'
                  }
                />
              </IconContainer>
            </LeftHolder>
            <RightHolder className="col-9 h-100 row">
              <div className="col-10 h-100">
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <HighLightText>Manage Existing Cluster</HighLightText>
                </div>
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <BottomText>Manage an existing DFM cluster</BottomText>
                </div>
              </div>
              {selectedFlow === 'ManageCluster' && (
                <div className="col-2  d-flex align-items-center justify-content-center ">
                  <SelectedTickIconOrange height="25" width="25" />
                </div>
              )}
            </RightHolder>
          </div>
        </BulletContainer>
      </Container>
    </Modal>
  );
};

// AddOrEditClusterModal.propTypes = {
//   icon: PropTypes.elementType.isRequired,
//   primaryText: PropTypes.string,
//   secondaryText: PropTypes.string,
//   setValue: PropTypes.func.isRequired,
//   control: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
//   register: PropTypes.object.isRequired,
//   loadingButton: PropTypes.bool,
// };
