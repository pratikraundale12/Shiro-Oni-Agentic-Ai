/*eslint-disable*/
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  GreenRightCircleIcon,
  InvalidProcessorIcon,
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;
const ModalIcon = styled.div`
  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
`;
const ModalHFive = styled.h5`
  text-align: center !important;
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  color: #2d343f;
  line-height: 24px;
  letter-spacing: -0.02em;
`;
const RowModal = styled.div`
  margin-top: 1.5rem !important;
  display: flex;
  flex-wrap: wrap;
`;
const ColumnThree = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-4 {
    flex: 0 0 auto;
    width: 35%;
  }
`;
const RowModalDiv = styled.div`
  align-items: flex-start !important;
  justify-content: space-around !important;
  flex-direction: column !important;
`;
const ActionTitleSet = styled.h6`
  font-size: 14px;
  font-weight: 700;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  color: #2d343f;
`;
const SubTitleSet = styled.p`
  color: #7a7a7a !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 18.52px !important;
  letter-spacing: -0.005em !important;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const CustomNine = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-8 {
    flex: 0 0 auto;
    width: 65%;
  }
`;

const CountDiv = styled.div`
  height: 48px;
  margin-left: 6px;
  max-height: 48px;
  min-height: 48px;
  min-width: 60px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;

  & span {
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 16px;
    font-weight: 500;
    line-height: 23px;
    margin-left: 8px;
    color: #b5bdc8;
  }

  svg path {
    fill: ${props => (props.count > 0 ? props.activeColor : '#b5bdc8')};
  }
`;
const ActiveButtonContainer = styled.div`
  align-items: center;
  justify-content: flex-start !important;
  gap: 7px;
  .text_info {
    border-left: 5px solid #ff7a00;
    padding: 1rem;
    background: #fff7ed;
  }
`;

const ActiveButtonDiv = styled.div`
  width: 30%;
  gap: 12px;
  max-height: 48px;
  min-height: 48px;
  padding: 8px;
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
  justify-content: start;

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

  .div-btn-1.disabled {
    cursor: not-allowed;
  }
   &.disabled {
    cursor: not-allowed;
  }
`;

const IconCover = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dde4f0;
`;

const NamespaceDeploy = ({
  isOpen,
  closePopup,
  handleFlowConfirmPopup = () => {},
  activeButtonPopup,
  type,
}) => {
  const dispatch = useDispatch();
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const dataAfterUpgradeProcessor = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const checkFlowControlAfterUpgrade = useSelector(
    NamespacesSelectors.getFlowControlAfterUpgrade
  );
  const deployByRegistryFlow = useSelector(
    NamespacesSelectors.getdeployRegistryFlow
  );
  const selectedNamespace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  const registryFlowVerion = useSelector(NamespacesSelectors.getVersionSelect);
  const formDataRegistry = useSelector(NamespacesSelectors.getDeployFormData);

  const currentSelectedCluster = useSelector(
    NamespacesSelectors.getSelectedCluster
  );
  const handleClick = () => {
    const updatedUrl = deployOrUpgradeDetails?.nifiUrl?.endsWith('/nifi')
      ? `${deployOrUpgradeDetails.nifiUrl}?processGroupId=${deployOrUpgradeDetails?.id}`
      : `${deployOrUpgradeDetails.nifiUrl}/nifi?processGroupId=${deployOrUpgradeDetails?.id}`;

    window.open(updatedUrl, '_blank');
  };

  const handleSecondary = () => {
    history.push(`/process-group/${deployOrUpgradeDetails?.id}`);
    dispatch(NamespacesActions.setRegistryAllDetails({}));
    dispatch(NamespacesActions.setregistryDetailsFlow(true));
  };
  const provideTitle = () => {
    return `Process Group 
        ${checkFlowControlAfterUpgrade ? type : KDFM.DEPLOY}
        `;
  };
  const provideIconForModal = () => {
    return deployOrUpgradeDetails?.invalidCount > 0 ? (
      <InvalidProcessorIcon width={80} height={80} />
    ) : (
      <GreenRightCircleIcon />
    );
  };

  const getFlowName = () => {
    return deployByRegistryFlow
      ? formDataRegistry?.selectedFlowName
      : selectedNamespace?.flowName;
  };
  const getFlowCount = countType => {
    return checkFlowControlAfterUpgrade
      ? dataAfterUpgradeProcessor?.[countType]
      : deployOrUpgradeDetails?.[countType];
  };
  const checkFlowControlsDisplay = () => {
    return (
      deployOrUpgradeDetails?.stoppedCount === 0 &&
      deployOrUpgradeDetails?.runningCount === 0
    );
  };
  const checkStartFlowCondition = () => {
    return (
      (dataAfterUpgradeProcessor?.runningCount ||
        deployOrUpgradeDetails?.runningCount) > 0 &&
      (dataAfterUpgradeProcessor?.stoppedCount ||
        deployOrUpgradeDetails?.stoppedCount) === 0
    );
  };
  const checkStopFlowCondition = () => {
    return (
      (dataAfterUpgradeProcessor?.runningCount ||
        deployOrUpgradeDetails?.runningCount) === 0 &&
      (dataAfterUpgradeProcessor?.stoppedCount ||
        deployOrUpgradeDetails?.stoppedCount) > 0
    );
  };
  return (
    <>
      <Modal
        title={provideTitle()}
        isOpen={isOpen}
        onRequestClose={closePopup}
        size="sm"
        onSecondarySubmit={handleSecondary}
        secondaryButtonText="Process Group Details"
        primaryButtonText="Go to Nifi Instance"
        contentStyles={{ maxWidth: '45%', maxHeight: '65%' }}
        onSubmit={handleClick}
        footerAlign="start"
      >
        <ModalBody className="modal-body">
          <div className="d-flex justify-content-center align-items-center">
            <ModalIcon className="d-flex me-3 ms-2 ">
              {provideIconForModal()}
            </ModalIcon>
            <ModalHFive id="process-group-deploy-modal-header">
              {deployOrUpgradeDetails?.invalidCount > 0 ? (
                <>
                  Process group&nbsp;
                  {deployByRegistryFlow
                    ? 'deploye'
                    : `${type.charAt(0).toLowerCase() + type.slice(1)}`}
                  d, but there are some Invalid components
                </>
              ) : (
                <>
                  Process Group Successfully&nbsp;
                  {deployByRegistryFlow
                    ? `Deployed To ${currentSelectedCluster.label}`
                    : `${type.charAt(0).toUpperCase() + type.slice(1)}d
                To ${currentSelectedCluster.label}`}
                </>
              )}
            </ModalHFive>
          </div>
          <RowModal>
            <ColumnThree className="col-5 mb-3">
              <RowModalDiv className="d-flex  h-100  ">
                <ActionTitleSet className="mb-0 ">Flow Name</ActionTitleSet>
                <SubTitleSet
                  id="process-group-deploy-modal-flow-name"
                  className="mb-0 "
                >
                  {getFlowName()}
                </SubTitleSet>
              </RowModalDiv>
            </ColumnThree>
            <ColumnThree className="col-5 mb-3">
              <RowModalDiv className="d-flex  h-100  ">
                <ActionTitleSet className="mb-0 ">
                  Current Version
                </ActionTitleSet>
                <SubTitleSet
                  id="process-group-deploy-modal-current-version"
                  className="mb-0 "
                >
                  {registryFlowVerion?.version}
                </SubTitleSet>
              </RowModalDiv>
            </ColumnThree>
            <CustomNine className="col-10 mb-3">
              <ActiveButtonContainer className="d-flex ">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-1"
                      count={getFlowCount('runningCount')}
                      activeColor="#58e715"
                    >
                      <TriangleIcons color="#B5BDC8" />
                      <span>{getFlowCount('runningCount')}</span>
                    </CountDiv>
                    <div>Running Processors</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-2"
                      count={getFlowCount('stoppedCount')}
                      activeColor="#c52b2b"
                    >
                      <SquareBoxIcon color="#B5BDC8" />
                      <span>{getFlowCount('stoppedCount')}</span>
                    </CountDiv>
                    <div>Stopped Processors</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-3"
                      count={getFlowCount('invalidCount')}
                      activeColor="#CF9F5D"
                    >
                      <TriangleExclamationMarkIcon color="#B5BDC8" />
                      <span>{getFlowCount('invalidCount')}</span>
                    </CountDiv>
                    <div>Invalid Processors</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-4"
                      count={getFlowCount('disabledCount')}
                      activeColor="#2c7cf3"
                    >
                      <SmallNotThunderIcon width={16} color="#B5BDC8" />
                      <span>{getFlowCount('disabledCount')}</span>
                    </CountDiv>
                    <div>Disabled Processors</div>
                  </div>
                </div>
              </ActiveButtonContainer>
            </CustomNine>

            <CustomNine className="col-8 mb-3">
              <ActiveButtonContainer className="d-flex">
                {!checkFlowControlsDisplay() ? (
                  <>
                    <ActiveButtonDiv
                      className={`div-btn-1 ${
                        checkStartFlowCondition() ? 'disabled' : ''
                      }`}
                      isActive={activeButtonPopup === 'RUNNING'}
                      activeColor="#58e715"
                      hoverColor="#58e715"
                      activeTextColor="#fff"
                      onClick={() =>
                        checkStartFlowCondition() ||
                        handleFlowConfirmPopup('RUNNING')
                      }
                      data-tooltip-id="running-tooltip"
                    >
                      <IconCover>
                        <TriangleIcons color="#B5BDC8" />
                      </IconCover>
                      <div>{KDFM.RUNNING_FLOW}</div>
                    </ActiveButtonDiv>

                    <ActiveButtonDiv
                      className={`div-btn-2 ${
                        checkStopFlowCondition() ? 'disabled' : ''
                      }`}
                      isActive={activeButtonPopup === 'STOPPED'}
                      activeColor="#c52b2b"
                      hoverColor="#c52b2b"
                      activeTextColor="#fff"
                      onClick={() =>
                        checkStopFlowCondition() ||
                        handleFlowConfirmPopup('STOPPED')
                      }
                      data-tooltip-id="stopped-tooltip"
                    >
                      <IconCover>
                        <SquareBoxIcon color="#B5BDC8" />
                      </IconCover>
                      <div>{KDFM.STOPPED_FLOW}</div>
                    </ActiveButtonDiv>
                  </>
                ) : (
                  <div className="text_info">{KDFM.FLOW_CONTROL_WARNING}</div>
                )}
              </ActiveButtonContainer>
            </CustomNine>
          </RowModal>
        </ModalBody>
      </Modal>
    </>
  );
};

NamespaceDeploy.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  getParamerterContext: PropTypes.func,
  countDetails: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        runningCount: PropTypes.number,
        stoppedCount: PropTypes.number,
        invalidCount: PropTypes.number,
        disabledCount: PropTypes.number,
      })
    ),
  }),
  upgradeData: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  deployData: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  selectedVersion: PropTypes.string,
  selectedClusterName: PropTypes.string,
  selectedClusterId: PropTypes.string,
  deployCountDetails: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        runningCount: PropTypes.number,
        stoppedCount: PropTypes.number,
        invalidCount: PropTypes.number,
        disabledCount: PropTypes.number,
      })
    ),
  }),
  handleFlowConfirmPopup: PropTypes.func,
  activeButtonPopup: PropTypes.string,
};

export default NamespaceDeploy;
