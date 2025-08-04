/*eslint-disable*/
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  ExclamationIcon,
  GreaterArrowIcon,
  GreenRightCircleIcon,
  OpenLinkIcon,
  SanityCheckIcon,
  ScheduleStartIcon,
  ScheduleStopIcon,
  SmallNotThunderIcon,
  // SmallThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import DisbaleIconImage from '../../assets/images/disable.png';
import EnableIconImage from '../../assets/images/enable.png';
import StartIconImage from '../../assets/images/start.png';
import StopIconImage from '../../assets/images/stop.png';
import { FullPageLoader } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, ModalWithIcon } from '../../shared';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SchedularActions } from '../../store/schedular';

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
  row-gap: 8px;
  .text_info {
    border-left: 5px solid #ff7a00;
    padding: 1rem;
    background: #fff7ed;
  }
`;
const TextDiv = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
`;
const CountDiv = styled.div`
  margin-left: 6px;
  min-width: 60px;
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
const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
`;
const IconsvgDiv = styled.div``;
const ActiveButtonDiv = styled.div`
  width: 100%;
  gap: 12px;
  max-height: 48px;
  min-height: 48px;
  padding: 8px;
  border: 1px solid
    ${({ className, isActive }) => {
      if (isActive) {
        if (className?.includes('div-btn-1')) return '#58e715'; // Start (RUNNING) button
        if (className?.includes('div-btn-2')) return '#c52b2b'; // Stop (STOPPED) button
      }
      return '#dde4f0';
    }};
  border-radius: 8px;
  background-color: ${({ isActive, className }) => {
    if (isActive) {
      if (className?.includes('div-btn-1')) return '#58e715'; // green
      if (className?.includes('div-btn-2')) return '#c52b2b'; // red
    }
    return '#f5f7fa'; // default inactive
  }};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  color: ${({ isActive, className }) => {
    if (isActive) {
      if (className?.includes('div-btn-1')) return '#fff'; // green
      if (className?.includes('div-btn-2')) return '#fff'; // red
    }
    return 'black'; // default inactive
  }};
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 16px;
    font-weight: 600;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }
  &:hover {
    background-color: ${({ disabled, className, isActive, hoverColor }) => {
      if (disabled) return undefined; // no hover effect
      if (hoverColor) return hoverColor;
      return '#F6F7F9';
    }};

    border: 1px solid
      ${({ className, isActive }) => {
        if (isActive) {
          if (className?.includes('div-btn-1')) return '#58e715';
          if (className?.includes('div-btn-2')) return '#c52b2b';
        }
        return '#dde4f0';
      }};

    color: ${({ disabled, isActive }) => {
      if (disabled) return undefined; // don't override the original color
      return isActive ? '#000' : '#fff'; // active = black, inactive = white
    }};

    border-radius: 8px; // always applied, even on hover
  }
`;

const ActiveButtonDivSchedule = styled.div`
  width: 100%;
  gap: 12px;
  max-height: 48px;
  min-height: 48px;
  padding: 8px;
  border: 1px solid
    ${({ className, isActive }) => {
      if (isActive) {
        if (className?.includes('div-btn-1')) return '#58e715'; // Start (RUNNING) button
        if (className?.includes('div-btn-2')) return '#c52b2b'; // Stop (STOPPED) button
      }
      return '#dde4f0';
    }};
  border-radius: 8px;
  background-color: ${({ isActive, className }) => {
    if (isActive) {
      if (className?.includes('div-btn-1')) return '#58e715'; // green
      if (className?.includes('div-btn-2')) return '#c52b2b'; // red
    }
    return '#f5f7fa'; // default inactive
  }};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  color: ${({ isActive, className }) => {
    if (isActive) {
      if (className?.includes('div-btn-1')) return '#fff'; // green
      if (className?.includes('div-btn-2')) return '#fff'; // red
    }
    return 'black'; // default inactive
  }};
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 16px;
    font-weight: 600;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
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
  min-height: calc(100vh - 324px);
  max-height: calc(100vh - 324px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const BottomButtonWrapper = styled.div`
  padding: 1rem;
  border-top: 1px solid #dde4f0;
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

const TextDetails = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  text-transform: capitalize;
  color: #444445;
  margin-bottom: 25px;
`;
const ShowMessageFlow = styled.div`
  border-left: 5px solid #ff7a00;
  padding: 1rem;
  background: #fff7ed;
`;

const FlowControl = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  function extractIdFromPath(path) {
    if (typeof path !== 'string' || path.trim() === '') {
      return null;
    }
    const parts = path.split('/');
    return parts[parts.length - 1];
  }

  // Example usage:
  const path = location?.pathname;
  const idOfLocation = extractIdFromPath(path);

  const sigleNamespaceData = useSelector(
    NamespacesSelectors.getFlowControlData
  );
  const selectedNamespaceForDetail = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  const [activeButton, setActiveButton] = useState(null);
  const [confirmDialogue, setConfirmDialogue] = useState({
    state: false,
    action: '',
    text: '',
    forPopup: false,
  });

  const singleNamespaceData1 = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );

  const permissions = singleNamespaceData1?.permissions;
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

  const { id } = useParams();
  useEffect(() => {
    dispatch(NamespacesActions.setSourceNamespaceId(id));
    dispatch(NamespacesActions.singleNamespaceData(id));
  }, [dispatch, id]);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateNamespaceStatus')
  );

  const handleInvalidProcessorsClick = () => {
    history.push(`/process-group/${id}/invalid-processors`);
    dispatch(
      NamespacesActions.fetchInvalidProcessorDetails({ namespaceId: id })
    );
  };

  const handleScheduleFlow = type => {
    dispatch(NamespacesActions.setScheduleStartFlow(true));
    dispatch(NamespacesActions.setScheduleFlowType(type));
    dispatch(SchedularActions.setScheduleFromList(true));
    dispatch(
      NamespacesActions.setVersionSelect({
        version: singleNamespaceData1?.version,
      })
    );
    dispatch(NamespacesActions.setdeployRegistryFlow(false));
    dispatch(NamespacesActions.setDeployByRegistryFlow(false));
    dispatch(
      NamespacesActions.fetchVersionData({
        bucketId: singleNamespaceData1?.bucketId,
        flowId: singleNamespaceData1?.flowId,
      })
    );
    dispatch(
      NamespacesActions.fetchRegistryFlowDetails({
        bucketId: singleNamespaceData1?.bucketId,
        flowId: singleNamespaceData1?.flowId,
        version: singleNamespaceData1?.version,
      })
    );

    history.push('/process-group/config-details', {
      state: {
        id: singleNamespaceData1?.id,
      },
    });
  };

  return (
    <DataWrapper>
      <FullPageLoader loading={loading} />
      <ScrollSetGrey className="scroll-set-grey pe-1">
        <IconsvgDiv className="row">
          <CustomNine className="col-md-6 mb-3">
            <TextDetails className="col-lg-12">Processor Details</TextDetails>
            <ActiveButtonContainer className="row">
              <TextDiv className="col-lg-6">
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
              <TextDiv className="col-lg-6">
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
              <TextDiv className="col-lg-6">
                <CountDiv
                  className="div-btn-3 mr-2"
                  count={sigleNamespaceData?.invalidCount}
                  activeColor="#CF9F5D"
                >
                  <TriangleExclamationMarkIcon color="#B5BDC8" />
                  <span>{sigleNamespaceData?.invalidCount}</span>
                </CountDiv>
                {sigleNamespaceData?.invalidCount > 0 ? (
                  <div
                    onClick={() => handleInvalidProcessorsClick()}
                    style={{
                      cursor: 'pointer',
                      color: '#FF7A00',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {KDFM.INVALID_PROCESSORS}
                    <OpenLinkIcon />
                  </div>
                ) : (
                  <div>{KDFM.INVALID_PROCESSORS}</div>
                )}
              </TextDiv>
              <TextDiv className="col-lg-6">
                <CountDiv
                  className="div-btn-4 mr-2"
                  count={singleNamespaceData1?.disabledCount}
                  activeColor="#2c7cf3"
                >
                  <SmallNotThunderIcon width={16} color="#B5BDC8" />
                  <span>{singleNamespaceData1?.disabledCount}</span>
                </CountDiv>
                <div>{KDFM.DISABLED_PROCESSORS}</div>
              </TextDiv>
            </ActiveButtonContainer>
          </CustomNine>
          <div className="col-md-6">
            <TextDetails className="col-lg-12">Control Action</TextDetails>
            <ActiveButtonContainer className="row ">
              {!(
                sigleNamespaceData?.runningCount === 0 &&
                sigleNamespaceData?.stoppedCount === 0
              ) ? (
                <>
                  {selectedNamespaceForDetail?.is_active_schedule === false ||
                  singleNamespaceData1?.is_active_schedule === false ? (
                    <TextsvgDiv className="col-lg-6">
                      <ActiveButtonDiv
                        disabled={
                          !canWrite ||
                          (sigleNamespaceData?.runningCount > 0 &&
                            sigleNamespaceData?.stoppedCount === 0)
                        }
                        className="div-btn-1"
                        isActive={activeButton === 'RUNNING'}
                        activeColor="#58e715"
                        hoverColor="#58e715"
                        activeTextColor="#fff"
                        data-tooltip-id="runningProcessor"
                        onClick={() => {
                          if (
                            !canWrite ||
                            (sigleNamespaceData?.runningCount > 0 &&
                              sigleNamespaceData?.stoppedCount === 0)
                          ) {
                            return;
                          }
                          handleUpdateStatus('RUNNING');
                        }}
                      >
                        <IconCover>
                          <TriangleIcons color="#58e715" />
                        </IconCover>
                        <div className="mr-2">{KDFM.RUNNING_FLOW}</div>
                      </ActiveButtonDiv>
                    </TextsvgDiv>
                  ) : (
                    <ShowMessageFlow>
                      {KDFM.SCHEDULE_AUTOMATIC_START_FLOW}
                    </ShowMessageFlow>
                  )}
                  <TextsvgDiv className="col-lg-6">
                    <ActiveButtonDiv
                      disabled={
                        !canWrite ||
                        (sigleNamespaceData?.runningCount === 0 &&
                          sigleNamespaceData?.stoppedCount > 0)
                      }
                      className="div-btn-2"
                      isActive={activeButton === 'STOPPED'}
                      activeColor="#c52b2b"
                      hoverColor="#c52b2b"
                      activeTextColor="#fff"
                      data-tooltip-id="stoppedProcessor"
                      onClick={() => {
                        if (
                          !canWrite ||
                          (sigleNamespaceData?.runningCount === 0 &&
                            sigleNamespaceData?.stoppedCount > 0)
                        ) {
                          return;
                        }
                        handleUpdateStatus('STOPPED');
                      }}
                    >
                      <IconCover>
                        <SquareBoxIcon color="#c52b2b" />
                      </IconCover>
                      <div>{KDFM.STOPPED_FLOW}</div>
                    </ActiveButtonDiv>
                  </TextsvgDiv>
                </>
              ) : (
                <div className="text_info">{KDFM.FLOW_CONTROL_WARNING}</div>
              )}

              {!(
                sigleNamespaceData?.runningCount === 0 &&
                sigleNamespaceData?.stoppedCount === 0
              ) ? (
                <>
                  {singleNamespaceData1?.flowName && (
                    <>
                      {(selectedNamespaceForDetail?.is_active_schedule ===
                        false ||
                        singleNamespaceData1?.is_active_schedule === false) && (
                        <>
                          {/* Schedule Start Flow Button */}
                          <TextsvgDiv className="col-lg-6">
                            <ActiveButtonDivSchedule
                              className="div-btn-1"
                              data-tooltip-id="scheduleStartFlow"
                              onClick={
                                !(
                                  !canWrite ||
                                  (sigleNamespaceData?.runningCount > 0 &&
                                    sigleNamespaceData?.stoppedCount === 0)
                                )
                                  ? () => handleScheduleFlow('RUNNING')
                                  : undefined
                              }
                              disabled={
                                !canWrite ||
                                (sigleNamespaceData?.runningCount > 0 &&
                                  sigleNamespaceData?.stoppedCount === 0)
                              }
                            >
                              <IconCover>
                                <ScheduleStartIcon />
                              </IconCover>
                              <div className="mr-2">Schedule Start Flow</div>
                            </ActiveButtonDivSchedule>
                          </TextsvgDiv>

                          {/* Schedule Stop Flow Button */}
                          <TextsvgDiv className="col-lg-6">
                            <ActiveButtonDivSchedule
                              className="div-btn-2"
                              data-tooltip-id="scheduleStopFlow"
                              onClick={
                                !(
                                  !canWrite ||
                                  (sigleNamespaceData?.runningCount === 0 &&
                                    sigleNamespaceData?.stoppedCount > 0)
                                )
                                  ? () => handleScheduleFlow('STOPPED')
                                  : undefined
                              }
                              disabled={
                                !canWrite ||
                                (sigleNamespaceData?.runningCount === 0 &&
                                  sigleNamespaceData?.stoppedCount > 0)
                              }
                            >
                              <IconCover>
                                <ScheduleStopIcon />
                              </IconCover>
                              <div>Schedule Stop Flow</div>
                            </ActiveButtonDivSchedule>
                          </TextsvgDiv>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="text_info">
                  {KDFM.SCHEDULE_FLOW_CONTROL_WARNING}
                </div>
              )}
            </ActiveButtonContainer>
          </div>
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
            setActiveButton(null);
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
