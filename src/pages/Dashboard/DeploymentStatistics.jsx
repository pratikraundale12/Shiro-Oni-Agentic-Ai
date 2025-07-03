import React from 'react';
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
  ActiveThreadIcon,
  DisabledProcessorIcon,
  InvalidProcessorIcon,
  RunningProcessorIcon,
  StoppedProcessorIcon,
  TotalProcessorIcon,
  TotalQuedIcon,
} from '../../assets';
import { DeploymentInsightContainer } from './components/DeploymentInsightContainer';

// Styled container for insight cards
const InsightDataContainer = styled.div`
  margin: 25px 0;
  display: flex;
  flex-wrap: wrap;
  row-gap: 25px;
`;

// Custom Tooltip Component for deployment statistics
const CustomDeploymentTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 1) {
    const data = payload[0].payload;

    let successLabel = '';
    let errorLabel = '';

    switch (label) {
      case 'Deployed':
        successLabel = 'Deployed';
        errorLabel = 'Deployed with Errors';
        break;
      case 'Downgraded':
        successLabel = 'Downgraded';
        errorLabel = 'Downgraded with Errors';
        break;
      case 'Upgraded':
        successLabel = 'Upgraded';
        errorLabel = 'Upgraded with Errors';
        break;
      case 'Failed':
        successLabel = 'Failed';
        errorLabel = 'Failed';
        break;
      default:
        successLabel = 'Count';
        errorLabel = 'Errors';
    }

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
        {data.success > 0 && (
          <p
            style={{ color: payload[0].color }}
          >{`${successLabel}: ${data.success}`}</p>
        )}
        {data.error > 0 && (
          <p
            style={{ color: payload[1].color }}
          >{`${errorLabel}: ${data.error}`}</p>
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

// Main Component
const DeploymentStatistics = () => {
  const deploymentStats = [
    { name: 'Deployed', success: 200, error: 50 },
    { name: 'Downgraded', success: 4, error: 74 },
    { name: 'Upgraded', success: 85, error: 36 },
    { name: 'Failed', error: 37 },
  ];

  const successFailureData = [
    {
      name: 'Rates',
      successRate: 25,
      failureRate: 8,
    },
  ];

  // Flow count vs CR number data for line chart
  const flowCrData = [
    { crCount: 10, crNumber: 101 },
    { crCount: 20, crNumber: 104 },
    { crCount: 30, crNumber: 109 },
    { crCount: 40, crNumber: 115 },
    { crCount: 50, crNumber: 122 },
  ];

  return (
    <div>
      <InsightDataContainer>
        <DeploymentInsightContainer
          backgroundCss="#F1F5FF"
          icon={TotalProcessorIcon}
          count="200"
          text="Deployed"
        />
        <DeploymentInsightContainer
          backgroundCss="#FEFBEC"
          icon={RunningProcessorIcon}
          count="3"
          text="Deployed with Errors"
        />
        <DeploymentInsightContainer
          backgroundCss="#EEF9FB"
          icon={StoppedProcessorIcon}
          count="4"
          text="Downgraded"
        />
        <DeploymentInsightContainer
          backgroundCss="#FDF3FC"
          icon={DisabledProcessorIcon}
          count="4"
          text="Downgraded with Errors"
        />
        <DeploymentInsightContainer
          backgroundCss="#FFF7ED"
          icon={InvalidProcessorIcon}
          count="5"
          text="Upgraded"
        />
        <DeploymentInsightContainer
          backgroundCss="#F0F0F2"
          icon={ActiveThreadIcon}
          count="6"
          text="Upgraded with Errors"
        />
        <DeploymentInsightContainer
          backgroundCss="#EEF8FF"
          icon={TotalQuedIcon}
          count="7"
          text="Failed"
        />
      </InsightDataContainer>

      <div className="d-flex">
        {/* Deployment success vs error bar chart */}
        <div style={{ width: '50%', height: 300, marginTop: 40 }}>
          <ResponsiveContainer>
            <BarChart data={deploymentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomDeploymentTooltip />} />
              <Legend />
              <Bar dataKey="success" name="Successful Count" fill="#4CAF50" />
              <Bar dataKey="error" name="Error Count" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success and Failure Rate Chart */}
        <div style={{ width: '50%', height: 300, marginTop: 40 }}>
          <ResponsiveContainer>
            <BarChart data={successFailureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="successRate"
                name="Success Rate"
                fill="#4CAF50"
                barSize={40}
                isAnimationActive={false}
                label={{ position: 'top', formatter: value => `${value}%` }}
              />
              <Bar
                dataKey="failureRate"
                name="Failure Rate"
                fill="#F44336"
                barSize={40}
                isAnimationActive={false}
                label={{ position: 'top', formatter: value => `${value}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Line Chart for Flow Count vs CR Number */}
      <div style={{ width: '100%', height: 300, marginTop: 40 }}>
        <ResponsiveContainer>
          <LineChart data={flowCrData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="crCount"
              label={{
                value: 'Flow Count',
                position: 'insideBottom',
                offset: -5,
              }}
            />
            <YAxis
              dataKey="crNumber"
              label={{ value: 'CR Number', angle: -90, position: 'insideLeft' }}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="crNumber"
              name="CR Number"
              stroke="#2196F3"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeploymentStatistics;
