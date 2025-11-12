/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
} from '../../../store';
import { Modal } from '../../../shared';
import { KDFM } from '../../../constants';
import {
  KubernetesIcon,
  OnprimiseIcon,
  RegisterClusterIcon,
  SelectedTickIconOrange,
} from '../../../assets';
import { theme } from '../../../styles';
import { history } from '../../../helpers/history';
const Container = styled.div`
  display: flex;
  gap: 25px;
`;

const BulletContainer = styled.div`
  width: 100%;
  max-width: 280px;
  height: 280px;
  border: 2px solid
    ${({ borderSelected }) =>
      borderSelected ? theme.colors.primary : '#DDE4F0'};
  border-radius: 14px;
  background-color: ${({ borderSelected }) =>
    borderSelected ? '#f5f7fa' : '#fff'};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px;
  position: relative; /* Needed for the checkmark icon */
`;

const IconContainer = styled.div`
  border: 1px solid
    ${({ borderSelected }) =>
      borderSelected ? '#DDE4F0' : theme.colors.primary};
  border-radius: 14px;
  background-color: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
  margin: 10px auto;
`;
const LeftHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 16px;
  text-align: center;
`;
const RightHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 16px;
  text-align: center;
`;
const HighLightText = styled.span`
  white-space: nowrap;
  font-family: Noto Sans;
  font-weight: 500;
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
  margin-top: 10px;
  display: flex;
  justify-content: center;
  padding: 0px 45px;
`;

const TickIconStyle = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const AddOrEditClusterModal = () => {
  const dispatch = useDispatch();
  const [selectedFlow, setSelectedFlow] = useState('CreateCluster');
  const [createNewClusterMethod, setCreateNewCusterMethod] = useState('VM');
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);

  const isModalOpen = useSelector(
    ClustersSelectors.getIsAddorEditClusterModalOpen
  );
  const onRequestClose = () => {
    dispatch(ClustersActions.setIsAddorEditClusterModalOpen(false));
  };
  const { handleSubmit } = useForm();
  const handleContinueSubmit = () => {
    if (selectedFlow === KDFM.MANAGE_CLUSTER_FLOW) {
      history.push(`/clusters/add`);
      onRequestClose();
    } else if (selectedFlow === KDFM.CREATE_CLUSTER_FLOW) {
      history.push(`/clusters/setup-cluster`);
      onRequestClose();
    }
  };
  useEffect(() => {
    dispatch(ClustersActions.setCreateClusterMethod(createNewClusterMethod));
  }, [createNewClusterMethod]);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      onSubmit={handleSubmit(handleContinueSubmit)}
      title={KDFM.NEW_CLUSTER}
      primaryButtonText="Continue"
      secondaryButtonText="Back"
      contentStyles={{ minWidth: '50%' }}
      footerAlign="start"
    >
      <Container>
        {currentUser?.permissions?.includes('add_cluster_setup') && (
          <BulletContainer
            onClick={() => {
              setSelectedFlow(KDFM.CREATE_CLUSTER_FLOW);
              setCreateNewCusterMethod('VM');
            }}
            borderSelected={
              createNewClusterMethod === 'VM' &&
              selectedFlow !== KDFM.MANAGE_CLUSTER_FLOW
            }
          >
            <div>
              <LeftHolder>
                <IconContainer
                  borderSelected={
                    createNewClusterMethod === 'VM' &&
                    selectedFlow !== KDFM.MANAGE_CLUSTER_FLOW
                  }
                >
                  <OnprimiseIcon width={80} height={80} />
                </IconContainer>
              </LeftHolder>
              <RightHolder>
                <div>
                  <div>
                    <HighLightText>
                      {KDFM.CREATE_NEW_CLUSTER_TITLE}
                    </HighLightText>
                  </div>
                  <div>
                    <BottomText>
                      via <br />
                    </BottomText>
                    <HighLightText>Virtual Machine / Instances</HighLightText>
                  </div>
                </div>
                {createNewClusterMethod === 'VM' &&
                  selectedFlow !== KDFM.MANAGE_CLUSTER_FLOW && (
                    <TickIconStyle>
                      <SelectedTickIconOrange height="25" width="25" />
                    </TickIconStyle>
                  )}
              </RightHolder>
            </div>
          </BulletContainer>
        )}
        {currentUser?.permissions?.includes('add_cluster_setup') && (
          <BulletContainer
            onClick={() => {
              setSelectedFlow(KDFM.CREATE_CLUSTER_FLOW);
              setCreateNewCusterMethod('Kubernetes');
            }}
            borderSelected={
              createNewClusterMethod === 'Kubernetes' &&
              selectedFlow !== KDFM.MANAGE_CLUSTER_FLOW
            }
          >
            <div>
              <LeftHolder>
                <IconContainer
                  borderSelected={
                    createNewClusterMethod === 'Kubernetes' &&
                    selectedFlow !== KDFM.MANAGE_CLUSTER_FLOW
                  }
                >
                  <KubernetesIcon width={80} height={80} />
                </IconContainer>
              </LeftHolder>
              <RightHolder>
                <div>
                  <div>
                    <HighLightText>
                      {KDFM.CREATE_NEW_CLUSTER_TITLE}
                    </HighLightText>
                  </div>
                  <div>
                    <BottomText>
                      via <br />
                    </BottomText>
                    <HighLightText>Kubernetes</HighLightText>
                  </div>
                </div>
                {selectedFlow === KDFM.CREATE_CLUSTER_FLOW &&
                  createNewClusterMethod === 'Kubernetes' && (
                    <TickIconStyle>
                      <SelectedTickIconOrange height="25" width="25" />
                    </TickIconStyle>
                  )}
              </RightHolder>
            </div>
          </BulletContainer>
        )}
        <BulletContainer
          onClick={() => {
            setSelectedFlow(KDFM.MANAGE_CLUSTER_FLOW);
          }}
          borderSelected={selectedFlow === KDFM.MANAGE_CLUSTER_FLOW}
        >
          <div>
            <LeftHolder>
              <IconContainer
                borderSelected={selectedFlow === KDFM.MANAGE_CLUSTER_FLOW}
              >
                <RegisterClusterIcon
                  height="80"
                  width="80"
                  color={theme.colors.primary}
                />
              </IconContainer>
            </LeftHolder>
            <RightHolder>
              <div>
                <div>
                  <HighLightText>
                    {KDFM.MANAGE_EXISTING_CLUSTER_TITLE}
                  </HighLightText>
                </div>
                <div>
                  <BottomText>
                    {KDFM.MANAGE_EXISTING_CLUSTER_DESCRIPTION}
                  </BottomText>
                </div>
              </div>
              {selectedFlow === KDFM.MANAGE_CLUSTER_FLOW && (
                <TickIconStyle>
                  <SelectedTickIconOrange height="25" width="25" />
                </TickIconStyle>
              )}
            </RightHolder>
          </div>
        </BulletContainer>
      </Container>
    </Modal>
  );
};
