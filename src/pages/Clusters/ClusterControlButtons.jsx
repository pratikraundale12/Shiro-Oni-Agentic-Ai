import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ClustersActions, ClustersSelectors } from '../../store';
import { Loader } from '../../components';
import { TriangleIcons, SquareBoxIcon } from '../../assets';
import styled from 'styled-components';

const DataWrapper = styled.div`
  width: 100%;
  padding-top: 0px;
  margin-top: 0px;
  padding-left: 15px;
`;

const TitleText = styled.div`
  font-family: Red Hat Display;
  font-weight: 550;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: -0.5%;
  text-transform: capitalize;
`;

const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
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
  opacity: ${props => (props.disabled ? 0.5 : 1)};
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

const ClusterControlButtons = () => {
  const dispatch = useDispatch();
  const { id: clusterId } = useParams();

  const [selectedMethod, setSelectedMethod] = useState();
  const [startInitiated, setStartInitiated] = useState(false);
  const [stopInitiated, setStopInitiated] = useState(false);

  const runningStatusData = useSelector(ClustersSelectors.getRunningStatusData);

  const handleStartClick = () => {
    setSelectedMethod('start');
    setStartInitiated(true);
    dispatch(
      ClustersActions.changeClusterActionState({
        clusterId,
        data: { action: 'start' },
      })
    );
  };

  const handleStopClick = () => {
    setSelectedMethod('stop');
    setStopInitiated(true);
    dispatch(
      ClustersActions.changeClusterActionState({
        clusterId,
        data: { action: 'stop' },
      })
    );
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterMetrics(clusterId));
    dispatch(ClustersActions.fetchRunningStatusCluster(clusterId));
  }, [dispatch, clusterId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(ClustersActions.fetchRunningStatusCluster(clusterId));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, clusterId]);

  useEffect(() => {
    if (runningStatusData?.status?.isRunning) {
      setSelectedMethod('start');
    } else {
      setSelectedMethod('stop');
    }

    if (runningStatusData?.status?.startInitiated) {
      setStartInitiated(true);
    } else {
      setStartInitiated(false);
    }

    if (runningStatusData?.status?.stopInitiated) {
      setStopInitiated(true);
    } else {
      setStopInitiated(false);
    }
  }, [runningStatusData]);

  return (
    <>
      <DataWrapper className="w-100">
        <TitleText>Cluster Control</TitleText>
        <div className="row mt-4 mb-4">
          <TextsvgDiv className="d-flex col-2">
            <ActiveButtonDiv className="div-btn-1 mr-2">
              <ActiveButtonDiv
                className="div-btn-1"
                isActive={selectedMethod === 'start'}
                activeColor="#58e715"
                hoverColor="#58e715"
                activeTextColor="#fff"
                onClick={
                  !(startInitiated || stopInitiated) ? handleStartClick : null
                }
                data-tooltip-id="start"
                disabled={startInitiated || stopInitiated}
              >
                <TriangleIcons color="#B5BDC8" />
              </ActiveButtonDiv>
            </ActiveButtonDiv>
            <div className="mr-2">
              {startInitiated ? 'Starting...' : 'Start Cluster'}
            </div>
          </TextsvgDiv>
          <TextsvgDiv className="d-flex col-2">
            <ActiveButtonDiv className="div-btn-2 mr-2">
              <ActiveButtonDiv
                className="div-btn-1"
                isActive={selectedMethod === 'stop'}
                activeColor="#c52b2b"
                hoverColor="#c52b2b"
                activeTextColor="#fff"
                onClick={
                  !(startInitiated || stopInitiated) ? handleStopClick : null
                }
                data-tooltip-id="stop"
                disabled={startInitiated || stopInitiated}
              >
                <SquareBoxIcon color="#B5BDC8" />
              </ActiveButtonDiv>
            </ActiveButtonDiv>
            <div className="mr-2">
              {stopInitiated ? 'Stopping...' : 'Stop Cluster'}
            </div>
          </TextsvgDiv>
          {(startInitiated || stopInitiated) && (
            <div className="col-3">
              <div className="row">
                <div className="col-2">
                  <Loader size="lg" />
                </div>
                <TextsvgDiv className="col-10">
                  Cluster Status is updating...
                </TextsvgDiv>
              </div>
            </div>
          )}
        </div>
      </DataWrapper>
    </>
  );
};

export default ClusterControlButtons;
