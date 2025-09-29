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
  CreateClusterIcon,
  InfoIcon,
  ManageClusterIcon,
  SelectedTickIconOrange,
} from '../../../assets';
import { theme } from '../../../styles';
import { history } from '../../../helpers/history';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { isEmpty } from 'lodash';

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

const Divstyled = styled.div`
  border: 2px solid
    ${({ borderSelected }) =>
      borderSelected ? theme.colors.primary : '#DDE4F0'};
  background-color: ${({ borderSelected }) =>
    borderSelected ? '#f5f7fa' : '#fff'};
  border-radius: 8px;
  color: #444445;
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 14px;
  height: 40px;
  cursor: pointer;
`;

export const AddOrEditClusterModal = () => {
  const dispatch = useDispatch();
  const [selectedFlow, setSelectedFlow] = useState(null);
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
    if (!isModalOpen) {
      setSelectedFlow(null);
    }
  }, [isModalOpen]);
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
      primaryButtonDisabled={isEmpty(selectedFlow)}
      secondaryButtonText="Back"
      contentStyles={{ minWidth: '32%' }}
      footerAlign="start"
    >
      <Container>
        {currentUser?.permissions?.includes('add_cluster_setup') && (
          <BulletContainer
            onClick={() => {
              setSelectedFlow(KDFM.CREATE_CLUSTER_FLOW);
            }}
            borderSelected={selectedFlow === KDFM.CREATE_CLUSTER_FLOW}
          >
            <div>
              <LeftHolder>
                <IconContainer
                  borderSelected={selectedFlow === KDFM.CREATE_CLUSTER_FLOW}
                >
                  <CreateClusterIcon
                    height="60"
                    width="60"
                    color={theme.colors.primary}
                  />
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
                      {KDFM.CREATE_NEW_CLUSTER_DESCRIPTION}
                    </BottomText>
                  </div>
                </div>
                {selectedFlow === KDFM.CREATE_CLUSTER_FLOW && (
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
                <ManageClusterIcon
                  height="50"
                  width="50"
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
      {selectedFlow === KDFM.CREATE_CLUSTER_FLOW && (
        <div className="mt-4 row" style={{ height: '50px' }}>
          <div className="col-6">
            <Divstyled
              className=" h-100 w-100 d-flex justify-content-center align-items-center"
              borderSelected={createNewClusterMethod === 'VM'}
              onClick={() => setCreateNewCusterMethod('VM')}
            >
              {' '}
              <span data-tooltip-id={`tooltip-VM`}>
                <InfoIcon
                  color={
                    createNewClusterMethod === 'VM'
                      ? theme.colors.primary
                      : theme.colors.darkGrey2
                  }
                />
              </span>
              &nbsp; Virtual Machine / Instances
            </Divstyled>
            <ReactTooltip
              id={`tooltip-VM`}
              place="top"
              content={'THIS IS DEMO TEXT FOR VM'}
              style={{
                whiteSpace: 'normal',
                zIndex: 9999,
              }}
            />
          </div>
          <div className="col-6">
            <Divstyled
              className=" h-100 w-100 d-flex justify-content-center align-items-center"
              borderSelected={createNewClusterMethod === 'Kubernetes'}
              onClick={() => setCreateNewCusterMethod('Kubernetes')}
            >
              {' '}
              <span data-tooltip-id={`tooltip-Kubernetes`}>
                <InfoIcon
                  color={
                    createNewClusterMethod === 'Kubernetes'
                      ? theme.colors.primary
                      : theme.colors.darkGrey2
                  }
                />
              </span>{' '}
              &nbsp;Kubernetes
            </Divstyled>{' '}
            <ReactTooltip
              id={`tooltip-Kubernetes`}
              place="top"
              content={'THIS IS DEMO TEXT FOR KUBERNETES'}
              style={{
                whiteSpace: 'normal',
                zIndex: 9999,
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
