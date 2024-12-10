import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  SmallNotThunderIcon,
  SmallThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import DisbaleIconImage from '../../assets/images/disable.png';
import EnableIconImage from '../../assets/images/enable.png';
import StartIconImage from '../../assets/images/start.png';
import StopIconImage from '../../assets/images/stop.png';
import { KDFM } from '../../constants';
import { ModalWithIcon } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const CustomNine = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-4 {
    flex: 0 0 auto;
    width: 33%;
  }
`;
const ActiveButtonContainer = styled.div`
  gap: 7px;
  justify-content: center;
  flex-direction: column;
`;
const TextDiv = styled.div`
  display: flex;
  align-items: center;
`;
const CountDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
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
const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
`;
const IconsvgDiv = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
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
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border: 1px solid
      ${props => (props.isActive ? props.activeColor : '#FF7A00')};
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
const DataWrapper = styled.div`
  width: 100%;
  height: 596px;
  top: 273px;
  left: 290px;
  gap: 0px;
  opacity: 0px;
  border: Mixed solid rgba(221, 228, 240, 1);
`;

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const FlowControl = () => {
  const dispatch = useDispatch();
  const sigleNamespaceData = useSelector(
    NamespacesSelectors.getFlowControlData
  );
  const [activeButton, setActiveButton] = useState(null);
  const [confirmDialogue, setConfirmDialogue] = useState({
    state: false,
    action: '',
    text: '',
    forPopup: false,
  });

  const singleNamespaceData = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );

  const permissions = singleNamespaceData?.permissions;
  const { canWrite } = permissions || {};
  const handleUpdateStatus = status => {
    if (!canWrite) return;
    setActiveButton(status);
    const text =
      status === 'STOPPED'
        ? 'stop'
        : status === 'RUNNING'
          ? 'start'
          : status === 'ENABLED'
            ? 'enable'
            : status === 'DISABLED'
              ? 'disable'
              : '';
    setConfirmDialogue({
      state: true,
      action: status,
      text,
      forPopup: true,
    });
  };

  const handleConfirmUpdateStatus = () => {
    dispatch(NamespacesActions.updateNamespaceStatus(confirmDialogue.action));
    setConfirmDialogue({
      state: false,
      action: '',
      text: '',
      forPopup: false,
    });
  };

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        <IconsvgDiv>
          <CustomNine className="col-4 mb-3">
            <ActiveButtonContainer className="d-flex ">
              <TextDiv className="d-flex">
                <CountDiv
                  className="div-btn-1 mr-2"
                  count={sigleNamespaceData?.runningCount}
                  activeColor="#58e715"
                >
                  <TriangleIcons color="#B5BDC8" />
                  <span>{sigleNamespaceData?.runningCount}</span>
                </CountDiv>
                <div>{KDFM.RUNNING_PROCESSORS}</div>
              </TextDiv>
              <TextDiv className="d-flex">
                <CountDiv
                  className="div-btn-2 mr-2"
                  count={sigleNamespaceData?.stoppedCount}
                  activeColor="#c52b2b"
                >
                  <SquareBoxIcon color="#B5BDC8" />
                  <span>{sigleNamespaceData?.stoppedCount}</span>
                </CountDiv>
                <div>{KDFM.STOPPED_PROCESSORS}</div>
              </TextDiv>
              <TextDiv className="d-flex">
                <CountDiv
                  className="div-btn-3 mr-2"
                  count={sigleNamespaceData?.invalidCount}
                  activeColor="#CF9F5D"
                >
                  <TriangleExclamationMarkIcon color="#B5BDC8" />
                  <span>{sigleNamespaceData?.invalidCount}</span>
                </CountDiv>
                <div>{KDFM.INVALID_PROCESSORS}</div>
              </TextDiv>
              <TextDiv className="d-flex">
                <CountDiv
                  className="div-btn-4 mr-2"
                  count={singleNamespaceData?.disabledCount}
                  activeColor="#2c7cf3"
                >
                  <SmallNotThunderIcon color="#B5BDC8" />
                  <span>{singleNamespaceData?.disabledCount}</span>
                </CountDiv>
                <div>{KDFM.DISABLED_PROCESSORS}</div>
              </TextDiv>
            </ActiveButtonContainer>
          </CustomNine>
          <ActiveButtonContainer className="d-flex ">
            <TextsvgDiv className="d-flex">
              <ActiveButtonDiv className="div-btn-1 mr-2">
                <ActiveButtonDiv
                  disabled={!canWrite}
                  className="div-btn-1 "
                  isActive={activeButton === 'RUNNING'}
                  activeColor="#58e715"
                  hoverColor="#58e715"
                  activeTextColor="#fff"
                  onClick={() => handleUpdateStatus('RUNNING')}
                >
                  <TriangleIcons color="#B5BDC8" />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
              <div className="mr-2">{KDFM.RUNNING_FLOW}</div>
            </TextsvgDiv>
            <TextsvgDiv className="d-flex">
              <ActiveButtonDiv className="div-btn-2 mr-2">
                <ActiveButtonDiv
                  disabled={!canWrite}
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
              <div>{KDFM.STOPPED_FLOW}</div>
            </TextsvgDiv>
            <TextsvgDiv className="d-flex">
              <ActiveButtonDiv className="div-btn-3 mr-2">
                <ActiveButtonDiv
                  disabled={!canWrite}
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
              <div>{KDFM.ENABLED_FLOW}</div>
            </TextsvgDiv>
            <TextsvgDiv className="d-flex">
              <ActiveButtonDiv className="div-btn-4 mr-2">
                <ActiveButtonDiv
                  className="div-btn-1"
                  disabled={!canWrite}
                  isActive={activeButton === 'DISABLED'}
                  activeColor="#2c7cf3"
                  hoverColor="#2c7cf3"
                  activeTextColor="#fff"
                  onClick={() => handleUpdateStatus('DISABLED')}
                >
                  <SmallNotThunderIcon color="#B5BDC8" />
                </ActiveButtonDiv>
              </ActiveButtonDiv>
              <div>{KDFM.DISABLED_FLOW}</div>
            </TextsvgDiv>
          </ActiveButtonContainer>
        </IconsvgDiv>
        <ModalWithIcon
          title={'Flow Confirmation'}
          primaryButtonText={'Confirm'}
          secondaryButtonText="Cancel"
          icon={
            <img
              src={
                confirmDialogue?.action === 'STOPPED'
                  ? StopIconImage
                  : confirmDialogue?.action === 'RUNNING'
                    ? StartIconImage
                    : confirmDialogue?.action === 'ENABLED'
                      ? EnableIconImage
                      : DisbaleIconImage
              }
              height="80px"
              width="80px"
              alt="img"
            />
          }
          isOpen={confirmDialogue?.state}
          onRequestClose={() => {
            setConfirmDialogue({
              state: false,
              action: '',
              text: '',
              forPopup: false,
            });
          }}
          primaryText={`Do you really want to ${confirmDialogue?.text}?`}
          onSubmit={handleConfirmUpdateStatus}
        />
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default FlowControl;
