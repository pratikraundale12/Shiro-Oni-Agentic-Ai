import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SquareBoxIcon, TriangleIcons } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useParams } from 'react-router-dom';
import { FullPageLoader, Loader } from '../../../components';
import { isEmpty } from 'lodash';
import { theme } from '../../../styles';

const RowConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: -1rem;
  margin-left: -1rem;
`;

const UseColXl = styled.div`
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
  @media screen and (min-width: 1200px) {
    &.col-xl-4 {
      flex: 0 0 auto;
      width: 33.33333333%;
    }
  }

  padding-right: 1rem;
  padding-left: 1rem;
`;

const SummaryDetailsHFourTag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #2d343f;
`;
const SummaryDetailsPtag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #7a7a7a;

  & > div {
    display: flex;
    gap: 0.5rem;

    & .summary-clipboard {
      margin-top: -0.5rem;
    }
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
  height: calc(100vh - 324px);
  max-height: calc(100vh - 324px);
  overflow-x: hidden;
  overflow-y: auto;
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
const TitleText = styled.div`
  font-family: Red Hat Display;
  font-weight: 550;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: -0.5%;
  text-transform: capitalize;
`;
const ClusterStatusTab = () => {
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState();
  const [startInitiated, setStartInitiated] = useState(false);
  const [stopInitiaded, setStopInitiated] = useState(false);
  const { id: clusterId } = useParams();
  const healthMetricData = useSelector(ClustersSelectors.getHealthMetricsData);
  const runningStatusData = useSelector(ClustersSelectors.getRunningStatusData);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchClusterMetrics')
  );

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
  }, [dispatch]);

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
    <DataWrapper className="w-100">
      <FullPageLoader loading={loading} />
      <TitleText className="mt-4">Cluster Control</TitleText>
      <div className="row mt-4 mb-4">
        <TextsvgDiv className="d-flex col-2">
          <ActiveButtonDiv className="div-btn-1 mr-2">
            <ActiveButtonDiv
              className="div-btn-1 "
              isActive={selectedMethod === 'start'}
              activeColor="#58e715"
              hoverColor="#58e715"
              activeTextColor="#fff"
              onClick={
                !(startInitiated || stopInitiaded) ? handleStartClick : null
              }
              data-tooltip-id="start"
              disabled={startInitiated || stopInitiaded}
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
                !(startInitiated || stopInitiaded) ? handleStopClick : null
              }
              data-tooltip-id="stop"
              disabled={startInitiated || stopInitiaded}
            >
              <SquareBoxIcon color="#B5BDC8" />
            </ActiveButtonDiv>
          </ActiveButtonDiv>
          <div>{stopInitiaded ? 'Stopping Cluster...' : 'Stop Cluster'}</div>
        </TextsvgDiv>
        {(startInitiated || stopInitiaded) && (
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

      <ScrollSetGrey className="scroll-set-grey pe-1">
        {healthMetricData &&
          !isEmpty(healthMetricData) &&
          healthMetricData?.data?.map(ele => (
            <div
              key={ele?.name}
              style={{ border: '1px solid #dde4f0' }}
              className="mb-2"
            >
              <TitleText className="mt-4 ms-3">
                {' '}
                <span style={{ color: `${theme.colors.primary}` }}>
                  Node{' '}
                </span>: {ele?.name}
              </TitleText>
              <RowConfig className=" p-3">
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Total Disk
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {ele?.data?.disk?.total}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Total Disk Utilisation
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {ele?.data?.disk?.used} &nbsp;
                      {`(${ele?.data?.disk?.utilization})`}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      CPU Utilisation
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {ele?.data?.cpu?.utilization}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Total Memory
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {ele?.data?.memory?.total}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Total Memory Utilisation
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {ele?.data?.memory?.used}
                      &nbsp;
                      {`(${ele?.data?.memory?.utilization})`}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                {ele?.data?.nifi?.heap_used && (
                  <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                    <div>
                      <SummaryDetailsHFourTag className="mb-2">
                        NiFi Heap Used
                      </SummaryDetailsHFourTag>
                      <SummaryDetailsPtag className="mb-0">
                        {ele?.data?.nifi?.heap_used}
                      </SummaryDetailsPtag>
                    </div>
                  </UseColXl>
                )}
                {ele?.data?.nifi?.heap_assigned && (
                  <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                    <div>
                      <SummaryDetailsHFourTag className="mb-2">
                        NiFi Heap Assigned
                      </SummaryDetailsHFourTag>
                      <SummaryDetailsPtag className="mb-0">
                        {ele?.data?.nifi?.heap_assigned}
                      </SummaryDetailsPtag>
                    </div>
                  </UseColXl>
                )}
              </RowConfig>
            </div>
          ))}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default ClusterStatusTab;
