import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useParams } from 'react-router-dom';
import { FullPageLoader } from '../../../components';
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
  const { id: clusterId } = useParams();
  const healthMetricData = useSelector(ClustersSelectors.getHealthMetricsData);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchClusterMetrics')
  );

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

  return (
    <DataWrapper className="w-100">
      <FullPageLoader loading={loading} />
      <ScrollSetGrey className="mt-4 scroll-set-grey pe-1">
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
