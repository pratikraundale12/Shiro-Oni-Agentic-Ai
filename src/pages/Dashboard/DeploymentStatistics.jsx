import React, { useEffect, useRef } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import * as d3 from 'd3';
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
import {
  DashboardActions,
  DashboardSelectors,
  NamespacesSelectors,
} from '../../store';
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

// Styled container for pie chart
const PieChartContainer = styled.div`
  width: 50%;
  height: 300px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
                    '#E4842B',
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

// Custom Tooltip Component for Change Request Bar Chart
const CustomCRTooltip = ({ active, payload, label }) => {
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

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
          {`Cluster Name: ${selectedCluster?.label || 'N/A'}`}
        </p>
        <p className="label" style={{ fontWeight: 'bold' }}>
          {`CR #: ${label}`}
        </p>
        <p style={{ color: '#E4842B' }}>
          {`Process Groups#: ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

CustomCRTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

// D3 Pie Chart Component
const D3PieChart = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    // Clear previous content
    svg.selectAll('*').remove();

    const width = 400;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 20;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(['Success Rate', 'Error Rate', 'Failure Rate'])
      .range(['#50C878', '#E4842B', '#C41E3A']);

    // Pie generator
    const pie = d3
      .pie()
      .value(d => d.value)
      .sort(null);

    // Arc generator
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Create pie data with proper number conversion
    const pieData = [
      { name: 'Success Rate', value: Number(data.successRate) || 0 },
      { name: 'Error Rate', value: Number(data.errorRate) || 0 },
      { name: 'Failure Rate', value: Number(data.failureRate) || 0 },
    ].filter(d => d.value > 0);

    const arcs = g
      .selectAll('.arc')
      .data(pie(pieData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Draw pie slices
    arcs
      .append('path')
      .attr('d', arc)
      .style('fill', d => color(d.data.name))
      .style('stroke', '#fff')
      .style('stroke-width', '2px')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', function () {
            const centroid = arc.centroid(d);
            return `translate(${centroid[0] * 0.1}, ${centroid[1] * 0.1})`;
          });

        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${d.data.name}: ${Number(d.data.value).toFixed(1)}%`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'translate(0,0)');

        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Add percentage labels
    arcs
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#fff')
      .text(d => {
        const value = Number(d.data.value);
        return value > 0 ? `${value.toFixed(1)}%` : '';
      });

    // Add legend
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(20, 20)`);

    const legendItems = legend
      .selectAll('.legend-item')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', d => color(d.name));

    legendItems
      .append('text')
      .attr('x', 18)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text(d => d.name);
  }, [data]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          padding: '8px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          borderRadius: '4px',
          pointerEvents: 'none',
          opacity: 0,
          fontSize: '12px',
          zIndex: 1000,
        }}
      />
    </div>
  );
};

D3PieChart.propTypes = {
  data: PropTypes.object.isRequired,
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

  const successFailureData = {
    successRate: dataMetrics?.successRate || 0,
    failureRate: dataMetrics?.failureRate || 0,
    errorRate: dataMetrics?.errorRate || 0,
  };

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
              <Bar dataKey="error" name="Error Deployments" fill="#E4842B" />
              <Bar dataKey="failed" name="Failed Deployments" fill="#C41E3A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success and Failure Rate Pie Chart */}
        <PieChartContainer>
          <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>
            Deployment Process Groups Rates
          </h4>
          <D3PieChart data={successFailureData} />
        </PieChartContainer>
      </div>

      {!isEmpty(deploymentMetrics?.changeRequestData) && (
        // Updated Bar Chart for Change Request Count vs CR Number
        <div style={{ width: '100%', height: 300, marginTop: 40 }}>
          <ResponsiveContainer>
            <BarChart
              data={flowCrData}
              barCategoryGap="60%"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crNumber" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomCRTooltip />} />
              <Legend />
              <Bar
                dataKey="crCount"
                name="Change Request Count"
                fill="#E4842B"
              />
            </BarChart>
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
