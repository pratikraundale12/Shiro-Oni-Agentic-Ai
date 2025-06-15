/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useParams } from 'react-router-dom';
import { FullPageLoader, LoaderContainer } from '../../../components';
import { isEmpty } from 'lodash';
import { theme } from '../../../styles';
import Chart from 'react-apexcharts';
import { NoDataIcon, RefreshIcon } from '../../../assets';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { SelectField } from '../../../shared';

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
  height: calc(100vh - 285px);
  max-height: calc(100vh - 285px);
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
  margin: 0 !important;
  position: relative;
  z-index: 4;
  top: -7px;
  left: 25px;
  background-color: #fff;
  width: fit-content;
  padding: 0 6px;
`;

const DescriptionText = styled.div`
  font-family: Red Hat Display;
  font-weight: 550;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.5%;
  // text-transform: capitalize;
`;
const ChartColumnWrapper = styled.div`
  flex: 0 0 auto;
  width: 50%;

  @media screen and (min-width: 1200px) {
    // width: 25%;
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
  cursor: pointer;
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
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically (optional) */
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
const LoadingText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const RefreshIoconHolder = styled.div`
  cursor: pointer;
  background-color: #f5f7fa;
  border: 1px solid #dde4f0;
  width: 37px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  min-width: 37px;
  margin-right: 5px;
`;
const DropdownContainer = styled.div`
  min-width: 175px;
  max-width: 175px;
  cursor: pointer;
  & div > div {
    & > div {
      min-width: 175px;
      max-width: 175px;
      cursor: pointer;
    }
  }
  & div > div {
    & > div > * {
      min-width: unset;
      max-width: unset;
      cursor: pointer;
    }
  }
`;
const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;
  min-width: 8.5rem;

  &.entity-dropdown {
    min-width: 10rem;
  }

  > div {
    margin-top: 0;
  }
  /* Apply fixed width to dropdown options */
  .react-select__menu {
    width: 175px;
  }

  .react-select__menu-list {
    max-width: 175px;
    white-space: wrap;
    text-overflow: ellipsis;
  }

  .react-select__option {
    max-width: 175px;
    word-break: break-all;
    overflow: hidden;
  }
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
  }, [dispatch]);

  const handleRefreshMetrics = () => {
    dispatch(ClustersActions.fetchClusterMetrics(clusterId));
  };

  // Helper function to extract percentage value from strings like "24.77%"
  const getPercentageValue = value => {
    if (!value) return 0;
    const numericValue = parseFloat(value.toString().replace('%', ''));
    return isNaN(numericValue) ? 0 : parseFloat(numericValue.toFixed(2));
  };
  const convertDateTime = dateString => {
    if (!dateString) return 'No date provided';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const availableNodes = healthMetricData?.data?.map(data => {
    return {
      label: data?.name,
      value: data?.name
    };
  });
  
  const [selectedNode, setSelectedNode] = useState({});
  const selectedNodeData = healthMetricData?.data?.find(
  ele => ele?.name === selectedNode?.value
)
  useEffect(() => {
    if(!isEmpty(healthMetricData?.data)){
      setSelectedNode({
        label: healthMetricData?.data[0]?.name,
        value: healthMetricData?.data[0]?.name
      });
    }
  },[healthMetricData]);
  
  const handleNodeChange = (node) => {
    setSelectedNode(node)
  }
  const RadialChart = ({
    title,
    value,
    unit,
    subtitle,
    percentage,
    showPercentageSign,
    contentTotal = '',
    contentUsed = '',
    contentUsedPercentage = '',
  }) => {
    const percentageValue = getPercentageValue(percentage);
    const [displayContent, setDisplayContent] = useState(false);
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
        <ChartCard
          onMouseOver={() => setDisplayContent(true)}
          onMouseOut={() => setDisplayContent(false)}
        >
          <ChartTitle className="mb-2">
            {title} {displayContent ? ' : Description' : ' : Utilization'}
          </ChartTitle>
          {displayContent ? (
            <ChartContainer className="">
              <div className="">
                <DescriptionText className="row  ">
                  <div className="w-100">
                    <span
                      style={{ color: `${theme.colors.primary}` }}
                      className="ms-2"
                    >
                      Total &nbsp;
                    </span>
                    : {contentTotal || 'N/A'}
                  </div>
                </DescriptionText>

                <DescriptionText className="row " style={{ marginTop: '8px' }}>
                  <div>
                    <span
                      style={{ color: `${theme.colors.primary}` }}
                      className="ms-2"
                    >
                      Used &nbsp;
                    </span>
                    : {contentUsed || 'N/A'}
                  </div>
                </DescriptionText>
                <DescriptionText className="row " style={{ marginTop: '8px' }}>
                  <div>
                    <span
                      style={{ color: `${theme.colors.primary}` }}
                      className="ms-2"
                    >
                      Used Percentage &nbsp;
                    </span>
                    : {contentUsedPercentage || 'N/A'}
                  </div>
                </DescriptionText>
              </div>
            </ChartContainer>
          ) : (
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
                  {subtitle && <ChartSubtitle>({subtitle})</ChartSubtitle>}
                </ChartLabelsWrapper>
              </ChartLabelsContainer>
            </ChartContainer>
          )}
        </ChartCard>
      </ChartColumnWrapper>
    );
  };

  return (
    <DataWrapper className="w-100">
      <FullPageLoader loading={loading} />
      <div className="d-flex justify-content-end p-2 align-items-center gap-2">
        {' '}
        <DropdownContainer>
          <StyledSelectField
            size="sm"
            name="nodes"
            title="Select Node"
            placeholder="Select Node"
            value={selectedNode}
            options={availableNodes}
            onChange={handleNodeChange}
          />
        </DropdownContainer>
        {healthMetricData?.time && (
          <DescriptionText>
            Last Update At :{' '}
            <span style={{ color: `${theme.colors.primary}` }}>
              {convertDateTime(healthMetricData?.time)}
            </span>
          </DescriptionText>
        )}
        <RefreshIoconHolder
          onClick={handleRefreshMetrics}
          data-tooltip-id={`tooltip-group-hm-refresh`}
        >
          <RefreshIcon style={{ cursor: 'pointer' }} />
        </RefreshIoconHolder>
        <ReactTooltip
          id={`tooltip-group-hm-refresh`}
          place="left"
          content={'Refresh Metrics'}
          style={{
            width: 'auto',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        />
      </div>
      <ScrollSetGrey className="pt-4 scroll-set-grey pe-1">
        {healthMetricData &&
          !isEmpty(healthMetricData) &&
          selectedNodeData && (
            <NodeCard key={selectedNodeData?.name} className="mb-4">
              <TitleText className="mt-4 ms-3 mb-3">
                <span style={{ color: `${theme.colors.primary}` }}>Node</span>:{' '}
                {selectedNodeData?.name}
              </TitleText>

              <NodeCardContent>
                <RowConfig className="row">
                  <RadialChart
                    title="Total Disk"
                    value={
                      getPercentageValue(selectedNodeData?.data?.disk?.utilization).toFixed(
                        2
                      ) + '%' || '0.00%'
                    }
                    unit={selectedNodeData?.data?.disk?.used}
                    percentage={selectedNodeData?.data?.disk?.utilization}
                    showPercentageSign={true}
                    contentTotal={selectedNodeData?.data?.disk?.total}
                    contentUsed={selectedNodeData?.data?.disk?.used}
                    contentUsedPercentage={selectedNodeData?.data?.disk?.utilization}
                  />
                  <RadialChart
                    title="Total Memory"
                    value={
                      getPercentageValue(
                        selectedNodeData?.data?.memory?.utilization
                      ).toFixed(2) + '%' || '0.00%'
                    }
                    unit={selectedNodeData?.data?.memory?.used}
                    percentage={selectedNodeData?.data?.memory?.utilization}
                    showPercentageSign={true}
                    contentTotal={selectedNodeData?.data?.memory?.total}
                    contentUsed={selectedNodeData?.data?.memory?.used}
                    contentUsedPercentage={selectedNodeData?.data?.memory?.utilization}
                  />
                  <RadialChart
                    title="NiFi Heap "
                    value={
                      (getPercentageValue(selectedNodeData?.data?.nifi?.heap_used) /
                        getPercentageValue(
                          selectedNodeData?.data?.nifi?.total_heap_memory
                        )) *
                        100 || '0%'
                    }
                    unit={selectedNodeData?.data?.nifi?.heap_used}
                    percentage={
                      (getPercentageValue(selectedNodeData?.data?.nifi?.heap_used) /
                        getPercentageValue(
                          selectedNodeData?.data?.nifi?.total_heap_memory
                        )) *
                      100
                    }
                    showPercentageSign={true}
                    contentTotal={selectedNodeData?.data?.nifi?.total_heap_memory}
                    contentUsed={selectedNodeData?.data?.nifi?.heap_used}
                    contentUsedPercentage={
                      (
                        (getPercentageValue(selectedNodeData?.data?.nifi?.heap_used) /
                          getPercentageValue(
                            selectedNodeData?.data?.nifi?.total_heap_memory
                          )) *
                        100
                      ).toFixed(2) + '%' || '0%'
                    }
                  />
                  <RadialChart
                    title="CPU Utilisation"
                    value={
                      getPercentageValue(selectedNodeData?.data?.cpu?.utilization).toFixed(
                        2
                      ) + '%' || '0.00%'
                    }
                    unit={selectedNodeData?.data?.cpu?.used}
                    percentage={selectedNodeData?.data?.cpu?.utilization}
                    showPercentageSign={true}
                    contentTotal={selectedNodeData?.data?.cpu?.total}
                    contentUsed={selectedNodeData?.data?.cpu?.used}
                    contentUsedPercentage={
                      getPercentageValue(selectedNodeData?.data?.cpu?.utilization).toFixed(
                        2
                      ) + '%' || '0.00%'
                    }
                  />
                </RowConfig>
              </NodeCardContent>
            </NodeCard>
          )}
        {(isEmpty(healthMetricData) || !healthMetricData) && (
          <LoaderContainer>
            <NoDataIcon width={140} />
            <LoadingText>No Health Metrics Data Found!</LoadingText>
          </LoaderContainer>
        )}
      </ScrollSetGrey>
    </DataWrapper>
  );
};

export default ClusterStatusTab;
