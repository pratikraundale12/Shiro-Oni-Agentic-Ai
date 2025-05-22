/* eslint-disable */
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
import Chart from 'react-apexcharts';

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

const ChartColumnWrapper = styled.div`
  flex: 0 0 auto;
  width: 50%;
  
  @media screen and (min-width: 1200px) {
    width: 25%;
  }
  
  padding-right: 1rem;
  padding-left: 1rem;
  margin-bottom: 1.5rem;
`;

const ChartCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background-color: #fff;
  height: 250px;
`;

const ChartTitle = styled.h6`
  color: #666;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
`;

const ChartContainer = styled.div`
  height: 150px;
  position: relative;
`;

const ChartLabelsContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  margin-top: 33px;
`;

const ChartLabelsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ChartUnit = styled.span`
  font-size: 16px;
  color: #666;
`;

const ChartSubtitle = styled.span`
  font-size: 16px;
  color: #666;
`;

const NodeCard = styled.div`
  border: 1px solid #dde4f0;
  border-radius: 16px;
  background-color: #fff;
  margin-bottom: 20px;
`;

const NodeCardContent = styled.div`
  padding: 1rem;
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

  // Helper function to extract percentage value from strings like "24.77%"
  const getPercentageValue = value => {
    if (!value) return 0;
    const numericValue = parseFloat(value.toString().replace('%', ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const RadialChart = ({ title, value, unit, subtitle, percentage, showPercentageSign }) => {
    const percentageValue = getPercentageValue(percentage);

    const chartOptions = {
      chart: {
        type: 'radialBar',
        height: 200,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          hollow: {
            size: '55%',
          },
          track: {
            background: '#f0f0f0',
            strokeWidth: '100%',
            margin: 5,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              offsetY: -5,
              formatter: function () {
                let val =
                  typeof value === 'string'
                    ? value.replace(/[a-zA-Z]+/, '')
                    : value;

                const num = parseFloat(val);
                if (isNaN(num)) return '00.00';

                const parts = num.toFixed(2).split('.');
                const paddedInteger = parts[0].padStart(2, '0');
                return `${paddedInteger}.${parts[1]}${showPercentageSign ? '%' : ''}`;
              },
            },
          },
        },
      },
      colors: ['#F07A0D'],
      stroke: {
        lineCap: 'round',
      },
      labels: [title],
    };

    const series = [percentageValue || 0];

    return (
      <ChartColumnWrapper className="col-xl-3 col-6 mb-4">
        <ChartCard>
          <ChartTitle>
            {title}
          </ChartTitle>
          <ChartContainer>
            <Chart
              options={chartOptions}
              series={series}
              type="radialBar"
              height={200}
            />
            <ChartLabelsContainer>
              <ChartLabelsWrapper>
                <ChartUnit>{unit}</ChartUnit>
                {subtitle && (
                  <ChartSubtitle>
                    ({subtitle})
                  </ChartSubtitle>
                )}
              </ChartLabelsWrapper>
            </ChartLabelsContainer>
          </ChartContainer>
        </ChartCard>
      </ChartColumnWrapper>
    );
  };

  return (
    <DataWrapper className="w-100">
      <FullPageLoader loading={loading} />
      <ScrollSetGrey className="mt-4 scroll-set-grey pe-1">
        {healthMetricData &&
          !isEmpty(healthMetricData) &&
          healthMetricData?.data?.map(ele => (
            <NodeCard
              key={ele?.name}
              className="mb-2"
            >
              <TitleText className="mt-4 ms-3 mb-3">
                <span style={{ color: `${theme.colors.primary}` }}>Node</span>:{' '}
                {ele?.name}
              </TitleText>

              <NodeCardContent>
                <RowConfig className="row">
                  <RadialChart
                    title="Total Disk"
                    value={ele?.data?.disk?.total || '0'}
                    unit="GB"
                    percentage={0}
                  />

                  <RadialChart
                    title="Total Disk Utilisation"
                    value={ele?.data?.disk?.used || '0'}
                    unit="GB"
                    subtitle={ele?.data?.disk?.utilization}
                    percentage={ele?.data?.disk?.utilization}
                  />

                  <RadialChart
                    title="CPU Utilisation"
                    value={
                      getPercentageValue(ele?.data?.cpu?.utilization).toFixed(
                        2
                      ) + '%' || '0.00%'
                    }
                    unit=""
                    percentage={ele?.data?.cpu?.utilization}
                    showPercentageSign={true}
                  />

                  <RadialChart
                    title="Total Memory"
                    value={ele?.data?.memory?.total || '0'}
                    unit="GB"
                    percentage={0}
                  />

                  <RadialChart
                    title="Total Memory Utilisation"
                    value={ele?.data?.memory?.used || '0'}
                    unit="GB"
                    subtitle={ele?.data?.memory?.utilization}
                    percentage={ele?.data?.memory?.utilization}
                  />

                  {ele?.data?.nifi?.heap_used && (
                    <RadialChart
                      title="NiFi Heap Used"
                      value={ele?.data?.nifi?.heap_used || '0'}
                      unit="MB"
                      percentage={0}
                    />
                  )}

                  {ele?.data?.nifi?.heap_assigned && (
                    <RadialChart
                      title="NiFi Heap Assigned"
                      value={ele?.data?.nifi?.heap_assigned || '0'}
                      unit="MB"
                      percentage={0}
                    />
                  )}
                </RowConfig>
              </NodeCardContent>
            </NodeCard>
          ))}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default ClusterStatusTab;