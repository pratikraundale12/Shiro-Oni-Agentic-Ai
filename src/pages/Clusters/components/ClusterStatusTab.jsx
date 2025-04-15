import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SquareBoxIcon, TriangleIcons } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { useParams } from 'react-router-dom';
import { Loader } from '../../../components';
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
  const { id: clusterId } = useParams();
  const healthMetricData = useSelector(ClustersSelectors.getHealthMetricsData);
  console.log(healthMetricData, 'healthMetricData');

  const handleStartClick = () => {
    setSelectedMethod('start');
    dispatch(
      ClustersActions.changeClusterActionState({
        clusterId,
        data: { action: 'start' },
      })
    );
  };
  const handleStopClick = () => {
    setSelectedMethod('stop');
    dispatch(
      ClustersActions.changeClusterActionState({
        clusterId,
        data: { action: 'stop' },
      })
    );
  };
  useEffect(() => {
    dispatch(ClustersActions.fetchRunningStatusCluster(clusterId));
    dispatch(ClustersActions.fetchClusterMetrics(clusterId));
  }, [dispatch]);

  return (
    <DataWrapper className="w-100">
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
              onClick={handleStartClick}
              data-tooltip-id="start"
            >
              <TriangleIcons color="#B5BDC8" />
            </ActiveButtonDiv>
          </ActiveButtonDiv>
          <div className="mr-2">Start Cluster</div>
        </TextsvgDiv>
        <TextsvgDiv className="d-flex col-2">
          <ActiveButtonDiv className="div-btn-2 mr-2">
            <ActiveButtonDiv
              className="div-btn-1"
              isActive={selectedMethod === 'stop'}
              activeColor="#c52b2b"
              hoverColor="#c52b2b"
              activeTextColor="#fff"
              onClick={handleStopClick}
              data-tooltip-id="stop"
            >
              <SquareBoxIcon color="#B5BDC8" />
            </ActiveButtonDiv>
          </ActiveButtonDiv>
          <div>Stop Cluster</div>
        </TextsvgDiv>
        {false && (
          <TextsvgDiv className=" col-2">
            <Loader size="lg" />
          </TextsvgDiv>
        )}
      </div>

      <ScrollSetGrey className="scroll-set-grey pe-1">
        {healthMetricData &&
          !isEmpty(healthMetricData) &&
          healthMetricData?.data?.map(ele => (
            <div key={ele?.name}>
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
                      {ele?.data?.disk?.used} - {ele?.data?.disk?.utilization}
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
                      {ele?.data?.memory?.used} -{' '}
                      {ele?.data?.memory?.utilization}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
              </RowConfig>
            </div>
          ))}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default ClusterStatusTab;
