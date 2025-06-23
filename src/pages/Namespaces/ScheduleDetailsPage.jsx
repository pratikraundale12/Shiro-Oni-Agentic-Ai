import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  CrossIcon,
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { KDFM } from '../../constants';
import { DateField } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { SchedularSelectors } from '../../store/schedular';

const ScrollSetGrey = styled.div`
  height: calc(100vh - 324px);
  max-height: calc(100vh - 324px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const DataWrapper = styled.div`
  width: 100%;
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

const ActiveButtonDiv = styled.div`
  width: 100%;
  gap: 12px;
  max-height: 48px;
  min-height: 48px;
  padding: 8px 60px 8px 8px;
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
  justify-content: center;

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
const IconsvgDiv = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
`;
const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
`;
const TextDiv = styled.div`
  display: flex;
  align-items: center;
`;
const StyledSpan = styled.span`
  margin-left: 4px !important;
`;
const ConfigTitle = styled.div`
  border-bottom: 1px solid #dde4f0;
`;
const ConfigTitleHTwo = styled.div`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #ff7a00;
  position: relative;
  border-bottom: 1px solid #ff7a00;
  width: fit-content;
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
const ScheduleDeploymentTab = ({
  scheduleDeployTime,
  setScheduleDeployTime,
  activeButton,
  setActiveButton,
  scheduleErrors,
  setScheduleErrors,
}) => {
  const dispatch = useDispatch();
  const scheduleStartFlow = useSelector(
    NamespacesSelectors.getScheduleStartFlow
  );

  const timeDeployScheduleDeployment = useSelector(
    NamespacesSelectors.getScheduleTimeByRegistry
  );
  const scheduleDeploymentFlow = useSelector(
    NamespacesSelectors.getScheduleByRegistry
  );
  const scheduleUpgradeFromList = useSelector(
    SchedularSelectors.getScheduleFromList
  );
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const { control, reset } = useForm({});

  useEffect(() => {
    if (timeDeployScheduleDeployment) {
      setScheduleDeployTime(timeDeployScheduleDeployment);
    } else {
      reset({
        scheduled_time: null,
      });
    }
  }, [timeDeployScheduleDeployment, reset]);

  useEffect(() => {
    if (scheduleDeployTime) {
      reset({
        scheduled_time: scheduleDeployTime,
      });
    }
  }, [scheduleDeployTime, reset]);

  const handleUpdateStatus = status => {
    setActiveButton(status);
    dispatch(NamespacesActions.setFlowControlStateAtScheduleDeploy(status));
  };

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        <DateField
          id="process-group-schedule-deploy-time"
          label="Schedule Deploy Time"
          name="scheduled_time"
          placeholder="select schedule deploy time"
          control={control}
          errors={scheduleErrors}
          required
          scheduleDeployTime={scheduleDeployTime}
          onChange={value => {
            setScheduleErrors({});
            setScheduleDeployTime(value);
          }}
        />

        <div className=" p-3">
          <ConfigTitle className="config-title">
            <ConfigTitleHTwo className="p-3 mb-0">
              <span>{KDFM.FLOW_CONTROL}</span>
            </ConfigTitleHTwo>
          </ConfigTitle>
        </div>

        <IconsvgDiv>
          {(scheduleDeploymentFlow || scheduleUpgradeFromList) && (
            <CustomNine className="col-4 mb-3">
              <ActiveButtonContainer className="d-flex ">
                <TextDetails className="col-lg-12">
                  Processor Details
                </TextDetails>
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-1 mr-2"
                    count={selectedNameSpace?.runningCount || 0}
                    activeColor="#58e715"
                  >
                    <TriangleIcons color="#B5BDC8" />
                    <span>{selectedNameSpace?.runningCount || 0}</span>
                  </CountDiv>
                  <div>{KDFM.RUNNING_PROCESSORS}</div>
                </TextDiv>
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-2 mr-2"
                    count={selectedNameSpace?.stoppedCount || 0}
                    activeColor="#c52b2b"
                  >
                    <SquareBoxIcon color="#B5BDC8" />
                    <span>{selectedNameSpace?.stoppedCount || 0}</span>
                  </CountDiv>
                  <div>{KDFM.STOPPED_PROCESSORS}</div>
                </TextDiv>
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-3 mr-2"
                    count={selectedNameSpace?.invalidCount || 0}
                    activeColor="#CF9F5D"
                  >
                    <TriangleExclamationMarkIcon color="#B5BDC8" />
                    <span>{selectedNameSpace?.invalidCount || 0}</span>
                  </CountDiv>
                  <div>{KDFM.INVALID_PROCESSORS}</div>
                </TextDiv>
                <TextDiv className="d-flex">
                  <CountDiv
                    className="div-btn-4 mr-2"
                    count={selectedNameSpace?.disabledCount || 0}
                    activeColor="#2c7cf3"
                  >
                    <SmallNotThunderIcon
                      width={20}
                      height={20}
                      color="#B5BDC8"
                    />
                    <StyledSpan>
                      {selectedNameSpace?.disabledCount || 0}
                    </StyledSpan>
                  </CountDiv>
                  <div>{KDFM.DISABLED_PROCESSORS}</div>
                </TextDiv>
              </ActiveButtonContainer>
            </CustomNine>
          )}
          {
            <ActiveButtonContainer className="d-flex ">
              {!(
                selectedNameSpace?.runningCount === 0 &&
                selectedNameSpace?.stoppedCount === 0
              ) ? (
                <>
                  <>
                    {scheduleStartFlow === false && (
                      <>
                        <TextDetails className="col-lg-12">
                          Control Action
                        </TextDetails>
                        {/* RUNNING Button */}
                        <TextsvgDiv className="d-flex align-items-center mb-2">
                          <ActiveButtonDiv
                            className="div-btn-1 mr-2"
                            isActive={activeButton === 'RUNNING'}
                            activeColor="#58e715"
                            hoverColor="#58e715"
                            activeTextColor="#fff"
                            onClick={() => handleUpdateStatus('RUNNING')}
                          >
                            <IconCover>
                              <TriangleIcons color="#B5BDC8" />
                            </IconCover>
                            <div>{KDFM.RUNNING_FLOW}</div>
                          </ActiveButtonDiv>
                        </TextsvgDiv>

                        {/* STOPPED Button */}
                        <TextsvgDiv className="d-flex align-items-center">
                          <ActiveButtonDiv
                            className="div-btn-2 mr-2"
                            isActive={activeButton === 'STOPPED'}
                            activeColor="#c52b2b"
                            hoverColor="#c52b2b"
                            activeTextColor="#fff"
                            onClick={() => handleUpdateStatus('STOPPED')}
                          >
                            <IconCover>
                              {' '}
                              <SquareBoxIcon color="#B5BDC8" />
                            </IconCover>
                            <div>{KDFM.STOPPED_FLOW}</div>
                          </ActiveButtonDiv>
                        </TextsvgDiv>
                      </>
                    )}
                  </>

                  {activeButton && (
                    <TextsvgDiv className="d-flex">
                      <ActiveButtonDiv
                        className="div-btn-1"
                        onClick={() => {
                          setActiveButton(null);
                          dispatch(
                            NamespacesActions.setFlowControlStateAtScheduleDeploy(
                              null
                            )
                          );
                        }}
                      >
                        <IconCover>
                          <CrossIcon color="#B5BDC8" />
                        </IconCover>
                        <div>Reset Flow</div>
                      </ActiveButtonDiv>
                    </TextsvgDiv>
                  )}
                </>
              ) : (
                <div className="text_info">{KDFM.FLOW_CONTROL_WARNING}</div>
              )}
            </ActiveButtonContainer>
          }
        </IconsvgDiv>
      </ScrollSetGrey>
    </DataWrapper>
  );
};
ScheduleDeploymentTab.propTypes = {
  scheduleDeployTime: PropTypes.object,
  setScheduleDeployTime: PropTypes.func,
  activeButton: PropTypes.object,
  scheduleErrors: PropTypes.object,
  setScheduleErrors: PropTypes.func,
  setActiveButton: PropTypes.func,
};
export default ScheduleDeploymentTab;
