import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { aggregateLogsForChart } from './helper';

export const LogVolumeChart = ({
  logs = [],
  timeRange,
  onTimeRangeChange,
  onReset,
  height = 200,
}) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: height });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [height]);

  const chartData = useMemo(() => aggregateLogsForChart(logs), [logs]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width <= 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // --- 1. DYNAMIC X-AXIS BASED ON PROPS ---
    const xScale = d3
      .scaleTime()
      .domain(timeRange) // Use the range passed from parent
      .range([0, innerWidth]);

    const maxVal = d3.max(chartData, d => d.total) || 10;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal])
      .nice()
      .range([innerHeight, 0]);

    // --- 2. CLIP PATH (Prevents bars from overflowing on zoom) ---
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'chart-clip')
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // --- 3. AXES & GRID ---
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(''))
      .attr('stroke-opacity', 0.1);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.max(2, Math.floor(innerWidth / 80))) // Dynamic tick count
      .tickFormat(d3.timeFormat('%H:%M:%S'));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g').call(d3.axisLeft(yScale).ticks(5));

    // --- 4. BARS WITH CLIPPING ---
    const stack = d3.stack().keys(['INFO', 'ERROR']);
    const layers = stack(chartData);
    const colorMap = { INFO: '#73bf69', ERROR: '#e02f44' };

    // Calculate bar width based on current zoom domain
    // If the domain is 1hr (3600s), bars are narrow. If 1min (60s), bars are wide.
    const domainDiffSeconds = (timeRange[1] - timeRange[0]) / 1000;
    const barWidth = Math.max(2, (innerWidth / (domainDiffSeconds / 60)) * 0.8);

    const barGroup = g.append('g').attr('clip-path', 'url(#chart-clip)');

    barGroup
      .selectAll('.layer')
      .data(layers)
      .enter()
      .append('g')
      .attr('fill', d => colorMap[d.key])
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.data.date) - barWidth / 2)
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', barWidth)
      .attr('rx', 1);

    // --- 5. INTERACTION: BRUSH & DOUBLE CLICK ---
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on('end', event => {
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xScale.invert);
        // Clear brush overlay immediately
        g.select('.brush').call(brush.move, null);
        onTimeRangeChange(x0, x1);
      });

    // eslint-disable-next-line no-unused-vars
    const brushG = g.append('g').attr('class', 'brush').call(brush);

    // Double-click to reset
    svg.on('dblclick', () => {
      if (onReset) onReset();
    });

    // Clean UI styles
    svg.selectAll('.domain').attr('stroke', '#ccc');
    svg.selectAll('.tick line').attr('stroke', '#eee');
  }, [chartData, dimensions, timeRange, onTimeRangeChange, onReset]);

  // ... (Keep the Legend/Totals section same as before)
  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        background: '#fff',
        padding: '15px',
        userSelect: 'none',
      }}
    >
      {/* Legend... */}
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ overflow: 'visible', cursor: 'crosshair' }}
      />
    </div>
  );
};

LogVolumeChart.propTypes = {
  logs: PropTypes.array.isRequired,
  timeRange: PropTypes.array.isRequired,
  onTimeRangeChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  height: PropTypes.number,
};

export default React.memo(LogVolumeChart);
