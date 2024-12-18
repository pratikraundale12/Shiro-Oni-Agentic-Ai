import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { DateField } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import PropTypes from 'prop-types';
import {
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { KDFM } from '../../constants';
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
const ScheduleDeploymentTab = ({
  scheduleDeployTime,
  setScheduleDeployTime,
  activeButton,
  setActiveButton,
}) => {
  const dispatch = useDispatch();
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
  const {
    control,
    formState: { errors },
    reset,
  } = useForm({});

  useEffect(() => {
    if (timeDeployScheduleDeployment) {
      setScheduleDeployTime(timeDeployScheduleDeployment);
    }
  }, [timeDeployScheduleDeployment]);

  useEffect(() => {
    if (scheduleDeployTime) {
      reset({
        scheduled_time: scheduleDeployTime,
      });
    }
  }, [scheduleDeployTime]);

  const handleUpdateStatus = status => {
    setActiveButton(status);
    dispatch(NamespacesActions.setFlowControlStateAtScheduleDeploy(status));
  };

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        <DateField
          label="Deploy Time"
          name="scheduled_time"
          placeholder="Select deploy time"
          control={control}
          errors={errors}
          required
          onChange={value => {
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
                  <TextsvgDiv className="d-flex">
                    <ActiveButtonDiv className="div-btn-1 mr-2">
                      <ActiveButtonDiv
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
  setActiveButton: PropTypes.func,
};
export default ScheduleDeploymentTab;
