/*eslint-disable*/
import styled from 'styled-components';
import { QRIcons } from '../../../assets';
import { SelectField } from '../../../shared';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { FullPageLoader } from '../../../components';
import { theme } from '../../../styles';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;

const RowConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: -1rem;
  margin-left: -1rem;
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

const KubeClusterHealthMetrics = ({ podsList, clusterId }) => {
  const dispatch = useDispatch();
  const { watch, control, setValue, register } = useForm();
  const podValue = watch('pod');
  const options = useMemo(() => {
    return (
      podsList?.map(ele => ({
        label: ele?.name,
        value: ele?.name,
      })) || []
    );
  }, [podsList]);
  const podHealth = useSelector(ClustersSelectors.getKubePodHealth);

  const getPercentageValue = value => {
    if (!value) return 0;
    const numericValue = parseFloat(value.toString().replace('%', ''));
    return isNaN(numericValue) ? 0 : parseFloat(numericValue.toFixed(2));
  };

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

  useEffect(() => {
    if (!isEmpty(options)) {
      setValue('pod', options?.[0]?.value);
    }
  }, [options, setValue]);

  useEffect(() => {
    if (!isEmpty(podValue)) {
      dispatch(
        ClustersActions.fetchKubeHealth({ id: clusterId, pod: podValue })
      );
    }
  }, [podValue]);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchKubeHealth')
  );

  return (
    <>
      <FullPageLoader loading={loading} />{' '}
      <div className="row d-flex justify-content-end mb-2">
        {' '}
        <div className="col-6">
          <LabelSelect className="mb-3">Select Pod</LabelSelect>
          <SelectField
            name="pod"
            icon={<QRIcons />}
            register={register}
            control={control}
            options={options || []}
            placeholder={'Select Pod'}
          />
        </div>
      </div>
      <div
        style={{
          overflow: 'auto',
          //   maxHeight: 'calc(100vh - 487px)',
          maxHeight: 'calc(100vh - 587px)',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <>
          <NodeCard className="mb-4 mt-2">
            <TitleText className="mt-2 ms-3 mb-3">
              <span style={{ color: `${theme.colors.primary}` }}>Pod</span>:{' '}
              {podValue || ''}
            </TitleText>

            <NodeCardContent>
              <RowConfig className="row">
                <RadialChart
                  title="Total CPU"
                  value={
                    getPercentageValue(
                      podHealth?.data?.data?.[0]?.data?.cpu?.utilization
                    ).toFixed(2) + '%' || '0.00%'
                  }
                  unit={'cores'}
                  percentage={podHealth?.data?.pods?.total?.cpu_percentage}
                  showPercentageSign={true}
                  contentTotal={podHealth?.data?.data?.[0]?.data?.cpu?.total}
                  contentUsed={podHealth?.data?.data?.[0]?.data?.cpu?.used}
                  contentUsedPercentage={
                    podHealth?.data?.data?.[0]?.data?.cpu?.utilization
                  }
                />
                <RadialChart
                  title="Total Memory"
                  value={
                    getPercentageValue(
                      podHealth?.data?.data?.[0]?.data?.memory?.utilization
                    ).toFixed(2) + '%' || '0.00%'
                  }
                  unit={'MB/GB'}
                  percentage={100}
                  showPercentageSign={true}
                  contentTotal={podHealth?.data?.data?.[0]?.data?.memory?.total}
                  contentUsed={podHealth?.data?.data?.[0]?.data?.memory?.used}
                  contentUsedPercentage={
                    podHealth?.data?.data?.[0]?.data?.memory?.utilization
                  }
                />
                <RadialChart
                  title="Total Disk"
                  value={
                    getPercentageValue(
                      podHealth?.data?.data?.[0]?.data?.disk?.utilization
                    ).toFixed(2) + '%' || '0.00%'
                  }
                  unit={'MB/GB'}
                  percentage={100}
                  showPercentageSign={true}
                  contentTotal={podHealth?.data?.data?.[0]?.data?.disk?.total}
                  contentUsed={podHealth?.data?.data?.[0]?.data?.disk?.used}
                  contentUsedPercentage={
                    podHealth?.data?.data?.[0]?.data?.disk?.utilization
                  }
                />
              </RowConfig>
            </NodeCardContent>
          </NodeCard>
        </>{' '}
      </div>
    </>
  );
};
KubeClusterHealthMetrics.propTypes = {
  podsList: PropTypes.array,
  clusterId: PropTypes.string,
};

export default KubeClusterHealthMetrics;
