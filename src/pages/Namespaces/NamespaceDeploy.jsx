import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ExclamationIcon,
  GreenRightCircleIcon,
  SmallNotThunderIcon,
  SmallThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { KDFM } from '../../constants';
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
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  /* border: 1px solid #dde4f0;
  border-radius: 8px;
  background-color: #f5f7fa; */
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

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
`;

const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #dde4f0;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: 1px solid
      ${props => (props.isActive ? props.activeColor : '#c52b2b')};
  }

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
const WarningContainer = styled.div`
  height: 85px;
  border-radius: 20px;
  border: 1px solid #dde4f0;
  margin: 5px;
  display: flex;
`;

const WarningHeading = styled.div`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  text-align: left;
  color: #444445;
`;

const WarningText = styled.div`
  font-family: Red Hat Display;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.02em;
  text-align: left;
  color: #444445;
`;

const NamespaceDeploy = ({
  isOpen,
  closePopup,
  getParamerterContext,
  handleTertiaryButton,
}) => {
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState(null);
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const formData = useSelector(NamespacesSelectors.getFormData);
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const selectedDestCluster = useSelector(
    NamespacesSelectors.getSelectedDestCluster
  );
  const handleUpdateStatus = status => {
    setActiveButton(status);
    dispatch(NamespacesActions.updateNamespaceStatus(status));
  };

  const handleClick = () => {
    window.open(deployOrUpgradeDetails.nifiUrl, '_blank');
  };

  return (
    <>
      <Modal
        title={`Namespace ${
          checkDestCluster.mode === 'upgrade'
            ? checkDestCluster.version <= formData.version
              ? KDFM.UPGRADE
              : KDFM.DOWNGRADE
            : KDFM.DEPLOY
        }`}
        isOpen={isOpen}
        onRequestClose={closePopup}
        size="sm"
        onSecondarySubmit={getParamerterContext}
        secondaryButtonText="Parameter Context"
        primaryButtonText="Go to Nifi Instance"
        contentStyles={{ maxWidth: '45%', maxHeight: '65%' }}
        onSubmit={handleClick}
        footerAlign="start"
        secondaryButtonProps={{
          disabled: !deployOrUpgradeDetails?.parameterContextId,
        }}
        tertiaryButton={true}
        tertiaryButtonConfig={{
          tertiaryButtonTest: 'Variables',
          tertiaryButtonSubmit: handleTertiaryButton,
          tertiaryButtonDisable: false,
        }}
      >
        <ModalBody className="modal-body">
          <div className="d-flex justify-content-center align-items-center">
            <ModalIcon className="d-flex me-3 ">
              <GreenRightCircleIcon />
            </ModalIcon>
            <ModalHFive>
              Namespace successfully {''}
              {checkDestCluster.mode === 'upgrade' ? 'upgraded' : 'deployed'} to
              {''} {selectedDestCluster?.label}
            </ModalHFive>
          </div>
          <RowModal>
            <ColumnThree className="col-4 mb-3">
              <RowModalDiv className="d-flex  h-100  ">
                <ActionTitleSet className="mb-0 ">Namespace</ActionTitleSet>
                <SubTitleSet className="mb-0 ">
                  {checkDestCluster?.name}
                </SubTitleSet>
              </RowModalDiv>
            </ColumnThree>
            <ColumnThree className="col-4 mb-3">
              <RowModalDiv className="d-flex  h-100  ">
                <ActionTitleSet className="mb-0 ">
                  Current Version
                </ActionTitleSet>
                <SubTitleSet className="mb-0 ">{formData?.version}</SubTitleSet>
              </RowModalDiv>
            </ColumnThree>
            <CustomNine className="col-8 mb-3">
              <ActiveButtonContainer className="d-flex ">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-1"
                      count={deployOrUpgradeDetails?.runningCount}
                      activeColor="#58e715"
                    >
                      <TriangleIcons color="#B5BDC8" />
                      <span>{deployOrUpgradeDetails?.runningCount}</span>
                    </CountDiv>
                    <div>Running Processors</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-2"
                      count={deployOrUpgradeDetails?.stoppedCount}
                      activeColor="#c52b2b"
                    >
                      <SquareBoxIcon color="#B5BDC8" />
                      <span>{deployOrUpgradeDetails?.stoppedCount}</span>
                    </CountDiv>
                    <div>Stopped Processors</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-3"
                      count={deployOrUpgradeDetails?.invalidCount}
                      activeColor="#CF9F5D"
                    >
                      <TriangleExclamationMarkIcon color="#B5BDC8" />
                      <span>{deployOrUpgradeDetails?.invalidCount}</span>
                    </CountDiv>
                    <div>Invalid Processors</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <CountDiv
                      className="div-btn-4"
                      count={deployOrUpgradeDetails?.disabledCount}
                      activeColor="#2c7cf3"
                    >
                      <SmallNotThunderIcon color="#B5BDC8" />
                      <span>{deployOrUpgradeDetails?.disabledCount}</span>
                    </CountDiv>
                    <div>Disabled Processors</div>
                  </div>
                </div>
              </ActiveButtonContainer>
            </CustomNine>

            <CustomNine className="col-8 mb-3">
              <ActiveButtonContainer className="d-flex ">
                <ActiveButtonDiv className="div-btn-1">
                  <ActiveButtonDiv
                    className="div-btn-1"
                    isActive={activeButton === 'RUNNING'}
                    activeColor="#58e715"
                    hoverColor="#58e715"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('RUNNING')}
                  >
                    <TriangleIcons color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
                <ActiveButtonDiv className="div-btn-2">
                  <ActiveButtonDiv
                    className="div-btn-1"
                    isActive={activeButton === 'STOPPED'}
                    activeColor="#c52b2b"
                    hoverColor="#c52b2b"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('STOPPED')}
                  >
                    <SquareBoxIcon color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
                <ActiveButtonDiv className="div-btn-3">
                  <ActiveButtonDiv
                    className="div-btn-1"
                    isActive={activeButton === 'ENABLED'}
                    activeColor="#cf9f5d"
                    hoverColor="#cf9f5d"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('ENABLED')}
                  >
                    <SmallThunderIcon color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
                <ActiveButtonDiv className="div-btn-4">
                  <ActiveButtonDiv
                    className="div-btn-1"
                    isActive={activeButton === 'DISABLED'}
                    activeColor="#2c7cf3"
                    hoverColor="#2c7cf3"
                    activeTextColor="#fff"
                    onClick={() => handleUpdateStatus('DISABLED')}
                  >
                    <SmallNotThunderIcon color="#B5BDC8" />
                  </ActiveButtonDiv>
                </ActiveButtonDiv>
              </ActiveButtonContainer>
            </CustomNine>
          </RowModal>
          <WarningContainer>
            <div className="col-2 d-flex justify-content-center align-items-center">
              <ExclamationIcon />
            </div>
            <div className="col-8 d-flex align-items-center">
              <div>
                <WarningHeading>Warning !!!</WarningHeading>
                <WarningText>
                  Add Parameter Context and Variables before Scheduling this
                  Deployment
                </WarningText>
              </div>
            </div>
          </WarningContainer>
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
  handleTertiaryButton: PropTypes.func,
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
};

export default NamespaceDeploy;
