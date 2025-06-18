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
  gap: 7px;
  justify-content: center;
  flex-direction: column;
  .text_info {
    border-left: 5px solid #ff7a00;
    padding: 1rem;
    background: #fff7ed;
  }
`;
const TextDiv = styled.div`
  display: flex;
  align-items: center;
`;
const CountDiv = styled.div`
  height: 48px;
  margin-left: 6px;
  max-height: 48px;
  min-height: 48px;
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
  min-height: calc(100vh - 324px);
  max-height: calc(100vh - 324px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const BottomButtonWrapper = styled.div`
  padding: 1rem;
  border-top: 1px solid #dde4f0;
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
    dispatch(SchedularActions.setScheduleFromList(true));
    dispatch(NamespacesActions.setScheduleStartFlow(true));
    dispatch(NamespacesActions.setScheduleFlowType(type));
    dispatch(NamespacesActions.setFlowPath(singleNamespaceData1?.flowId));
    dispatch(
      NamespacesActions.setSelectedNamespace({
        label: singleNamespaceData1?.name,
        value: singleNamespaceData1?.id,
        ...singleNamespaceData1,
      })
    );
    dispatch(NamespacesActions.setSelectedNameSpaceForDetail({}));
    dispatch(
      NamespacesActions.setVersionSelect({
        version: singleNamespaceData1?.version,
      })
    );
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
              <TextDiv className="d-flex">
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
          <ActiveButtonContainer className="d-flex ">
            {!(
              sigleNamespaceData?.runningCount === 0 &&
              sigleNamespaceData?.stoppedCount === 0
            ) ? (
              <>
                {(!selectedNamespaceForDetail?.is_active_schedule || selectedNamespaceForDetail?.is_active_schedule == 'false') ? (
                  <TextsvgDiv className="d-flex">
                    <ActiveButtonDiv
                      disabled={
                        !canWrite ||
                        (sigleNamespaceData?.runningCount > 0 &&
                          sigleNamespaceData?.stoppedCount === 0)
                      }
                      className="div-btn-1 mr-2"
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
                      <TriangleIcons color="#B5BDC8" />
                    </ActiveButtonDiv>
                    <div className="mr-2">{KDFM.RUNNING_FLOW}</div>
                    {sigleNamespaceData?.runningCount > 0 &&
                      sigleNamespaceData?.stoppedCount === 0 && (
                        <ReactTooltip
                          id="runningProcessor"
                          content="Running Components"
                          place="right"
                          positionStrategy="fixed"
                        />
                      )}
                  </TextsvgDiv>
                ) : (
                  <div className="text-message mb-3">
                    The process group has been successfully deployed and is
                    scheduled to start automatically at the specified date and
                    time.
                  </div>
                )}
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-2 mr-2">
                    <ActiveButtonDiv
                      disabled={
                        !canWrite ||
                        (sigleNamespaceData?.runningCount === 0 &&
                          sigleNamespaceData?.stoppedCount > 0)
                      }
                      className="div-btn-1"
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
                      <SquareBoxIcon color="#B5BDC8" />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div>{KDFM.STOPPED_FLOW}</div>
                  {sigleNamespaceData?.runningCount === 0 &&
                    sigleNamespaceData?.stoppedCount > 0 && (
                      <ReactTooltip
                        id="stoppedProcessor"
                        content="Stopped Components"
                        place="right"
                        positionStrategy="fixed"
                      />
                    )}
                </TextsvgDiv>{' '}
                {singleNamespaceData1?.flowName && (
                  <>
                    {(!selectedNamespaceForDetail?.is_active_schedule || selectedNamespaceForDetail?.is_active_schedule == 'false')
                      && (
                      <>
                        {/* Schedule Start Flow Button */}
                        <TextsvgDiv className="d-flex">
                          <ActiveButtonDiv className="div-btn-1 mr-2">
                            <ActiveButtonDiv
                              data-tooltip-id="scheduleStartFlow"
                              onClick={() => handleScheduleFlow('RUNNING')}
                            >
                              <ScheduleStartIcon />
                            </ActiveButtonDiv>
                          </ActiveButtonDiv>
                          <div className="mr-2">Schedule Start Flow</div>
                          <ReactTooltip
                            id="scheduleStartFlow"
                            content="Schedule start flow"
                            place="right"
                            positionStrategy="fixed"
                          />
                        </TextsvgDiv>

                        {/* Schedule Stop Flow Button */}
                        <TextsvgDiv className="d-flex">
                          <ActiveButtonDiv className="div-btn-2 mr-2">
                            <ActiveButtonDiv
                              data-tooltip-id="scheduleStopFlow"
                              onClick={() => handleScheduleFlow('STOPPED')}
                            >
                              <ScheduleStopIcon />
                            </ActiveButtonDiv>
                          </ActiveButtonDiv>
                          <div>Schedule Stop Flow</div>
                          <ReactTooltip
                            id="scheduleStopFlow"
                            content="Schedule stop flow"
                            place="right"
                            positionStrategy="fixed"
                          />
                        </TextsvgDiv>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="text_info">{KDFM.FLOW_CONTROL_WARNING}</div>
            )}
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
        {/* <ModalWithIcon
          title={'Sanity Check Confirmation'}
          primaryButtonText={'Confirm'}
          secondaryButtonText="Cancel"
          icon={<ExclamationIcon height={120} width={150} />}
          isOpen={isSanityCheckModalOpen}
          onRequestClose={() => setIsSanityCheckModalOpen(false)}
          primaryText={'Do you want Sanity Check during Deployment?'}
          secondaryText={
            'Process group will be deployed in a stopped state and cannot be undone'
          }
          onSubmit={handledeployByRegistry}
        /> */}
        {/* {isEmpty(sanityCheckData) && sanityCheckCleanModalDisplay && (
          <ModalWithIcon
            title={'Sanity Check'}
            secondaryButtonText='Close'
            icon={<GreenRightCircleIcon />}
            isOpen={sanityCheckCleanModalDisplay}
            secondaryText={
              'Sanity check passed with no issues. Start the flow from the Flow Control tab in the Process Group Details page.'
            }
            onSubmit={() =>
              dispatch(NamespacesActions.setDisplaySanityCheckCleanModal(false))
            }
          />
        )} */}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default FlowControl;
