import React, { useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  DeployedIcon,
  DeployedWithErrorIcon,
  DownGradeIcon,
  DowngradeWithErrorIcon,
  FailureIcon,
  UpgradeIcon,
  UpgradeWithErrorIcon,
} from '../../assets';
import { DeploymentInsightContainer } from './components/DeploymentInsightContainer';
import { DashboardActions, DashboardSelectors } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { FullPageLoader } from '../../components';
import { isEmpty } from 'lodash';

// Styled container for insight cards
const InsightDataContainer = styled.div`
  margin: 25px 0;
  display: flex;
  flex-wrap: wrap;
  row-gap: 25px;
`;

// Custom Tooltip Component for deployment statistics
const CustomDeploymentTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        <p className="label" style={{ fontWeight: 'bold' }}>
          {label} Process Group
        </p>

        {/* Handle Failed deployments separately */}
        {label === 'Failed' && data.failed > 0 && (
          <p style={{ color: 'red' }}>{`Failed: ${data.failed}`}</p>
        )}

        {/* Handle other deployment types */}
        {label !== 'Failed' && (
          <>
            {data.success > 0 && (
              <p
                style={{
                  color:
                    payload.find(p => p.dataKey === 'success')?.color ||
                    'green',
                }}
              >
                {`${label}: ${data.success}`}
              </p>
            )}
            {data.error > 0 && (
              <p
                style={{
                  color:
                    payload.find(p => p.dataKey === 'error')?.color ||
                    '#C3F53C',
                }}
              >
                {`${label} with Errors: ${data.error}`}
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
};

CustomDeploymentTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

// Custom Tooltip Component for Success/Failure Rate Chart
const CustomRateTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        <p className="label" style={{ fontWeight: 'bold' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomRateTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

// Main Component
const DeploymentStatistics = ({ selectedRange }) => {
  const dispatch = useDispatch();

  const deploymentMetrics = useSelector(
    DashboardSelectors.getDeploymentMetrics
  );
  const dataMetrics = deploymentMetrics?.result;

  useEffect(() => {
    dispatch(
      DashboardActions.fetchDeploymentMetrics({
        ...(selectedRange &&
          selectedRange[0] &&
          selectedRange[1] && {
            start_date: selectedRange[0].toISOString(),
            end_date: selectedRange[1].toISOString(),
          }),
      })
    );
  }, [dispatch, selectedRange]);

  const deploymentStats = [
    {
      name: 'Deployed',
      success: dataMetrics?.deployed || 0,
      error: dataMetrics?.deployed_with_errors || 0,
      failed: 0,
    },
    {
      name: 'Downgraded',
      success: dataMetrics?.downgraded || 0,
      error: dataMetrics?.downgraded_with_errors || 0,
      failed: 0,
    },
    {
      name: 'Upgraded',
      success: dataMetrics?.upgraded || 0,
      error: dataMetrics?.upgraded_with_errors || 0,
      failed: 0,
    },
    {
      name: 'Failed',
      success: 0,
      error: 0,
      failed: dataMetrics?.failed || 0,
    },
  ];

  const successFailureData = [
    {
      name: 'Deployment Process Groups Rates',
      successRate: dataMetrics?.successRate,
      failureRate: dataMetrics?.failureRate,
      errorRate: dataMetrics?.errorRate,
    },
  ];

  const flowCrData = deploymentMetrics?.changeRequestData?.map(item => ({
    crCount: item?.totalCount || 0,
    crNumber: String(item.changeRequest),
  }));

  return (
    <div>
      <FullPageLoader />
      <InsightDataContainer>
        <DeploymentInsightContainer
          backgroundCss="#F1F5FF"
          icon={DeployedIcon}
          count={dataMetrics?.deployed || 0}
          text="Deployed"
        />
        <DeploymentInsightContainer
          backgroundCss="#FEFBEC"
          icon={DeployedWithErrorIcon}
          count={dataMetrics?.deployed_with_errors || 0}
          text="Deployed with Errors"
        />
        <DeploymentInsightContainer
          backgroundCss="#EEF9FB"
          icon={DownGradeIcon}
          count={dataMetrics?.downgraded || 0}
          text="Downgraded"
        />
        <DeploymentInsightContainer
          backgroundCss="#FDF3FC"
          icon={DowngradeWithErrorIcon}
          count={dataMetrics?.downgraded_with_errors || 0}
          text="Downgraded with Errors"
        />
        <DeploymentInsightContainer
          backgroundCss="#FFF7ED"
          icon={UpgradeIcon}
          count={dataMetrics?.upgraded || 0}
          text="Upgraded"
        />
        <DeploymentInsightContainer
          backgroundCss="#F0F0F2"
          icon={UpgradeWithErrorIcon}
          count={dataMetrics?.upgraded_with_errors || 0}
          text="Upgraded with Errors"
        />
        <DeploymentInsightContainer
          backgroundCss="#EEF8FF"
          icon={FailureIcon}
          count={dataMetrics?.failed || 0}
          text="Failed"
        />
      </InsightDataContainer>

      <div className="d-flex">
        {/* Deployment success vs error bar chart */}
        <div style={{ width: '50%', height: 300, marginTop: 40 }}>
          <ResponsiveContainer>
            <BarChart data={deploymentStats} barGap={15} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomDeploymentTooltip />} />
              <Legend />
              <Bar
                dataKey="success"
                name="Success Deployments"
                fill="#50C878"
              />
              <Bar dataKey="error" name="Error Deployments" fill="#FDDA0D" />
              <Bar dataKey="failed" name="Failed Deployments" fill="#C41E3A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success and Failure Rate Chart */}
        <div style={{ width: '50%', height: 300, marginTop: 40 }}>
          <ResponsiveContainer>
            <BarChart
              data={successFailureData}
              barGap={25}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomRateTooltip />} />
              <Legend />
              <Bar
                dataKey="successRate"
                name="Success Rate"
                fill="#50C878"
                barSize={40}
                isAnimationActive={false}
                label={{ position: 'top', formatter: value => `${value}%` }}
              />
              <Bar
                dataKey="errorRate"
                name="Error Rate"
                fill="#FDDA0D"
                barSize={40}
                isAnimationActive={false}
                label={{ position: 'top', formatter: value => `${value}%` }}
              />
              <Bar
                dataKey="failureRate"
                name="Failure Rate"
                fill="#C41E3A"
                barSize={40}
                isAnimationActive={false}
                label={{ position: 'top', formatter: value => `${value}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!isEmpty(deploymentMetrics?.changeRequestData) && (
        // New Line Chart for Change Request Count vs CR Number
        <div style={{ width: '100%', height: 300, marginTop: 40 }}>
          <ResponsiveContainer>
            <LineChart data={flowCrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crNumber" />
              <YAxis dataKey="crCount" allowDecimals={false} />
              <Tooltip
                formatter={value => [`${value}`, 'Deplyed Process Group Count']}
                labelFormatter={label => `Change Request Number: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="crCount"
                name="Change Request Graph"
                stroke="#E4842B"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

DeploymentStatistics.propTypes = {
  selectedRange: PropTypes.any, // Change 'any' to the appropriate type if known
};

export default DeploymentStatistics;
