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

    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
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

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', '#fee1c6')
      .attr('fill-opacity', 0.3);

    // 2. Grid Group (Forms the rectangles in the background)
    const gridGroup = g.append('g').attr('class', 'chart-grid');

    // Horizontal Grid Lines
    gridGroup
      .append('g')
      .attr('class', 'grid-horizontal')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(''))
      .selectAll('line')
      .attr('stroke', '#3e3d3d') // Explicitly set stroke color
      .attr('stroke-opacity', 0.2) // Increased from 0.05 to ensure visibility
      .attr('shape-rendering', 'crispEdges');

    // Vertical Grid Lines
    gridGroup
      .append('g')
      .attr('class', 'grid-vertical')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(Math.max(2, Math.floor(innerWidth / 80)))
          .tickSize(-innerHeight)
          .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#3e3d3d') // Explicitly set stroke color
      .attr('stroke-opacity', 0.2) // Increased visibility
      .attr('shape-rendering', 'crispEdges');

    // Remove the default domain lines (borders) of the grid groups for a cleaner look
    gridGroup.selectAll('.domain').remove();

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

    const focusLine = g
      .append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#e02f44') // Matching your Error color or red
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .style('pointer-events', 'none'); // Important: line shouldn't block the brush
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
    brushG
      .select('.selection')
      .attr('fill', '#7c7e80') // Blue tint for the zoomed area
      .attr('fill-opacity', 0.15)
      // .attr('stroke', '#007bff') // Subtle border for the drag area
      .attr('stroke-width', 1);

    brushG
      .select('.overlay')
      .on('mousemove', event => {
        const [mouseX] = d3.pointer(event);

        // Ensure the line stays within chart bounds
        if (mouseX >= 0 && mouseX <= innerWidth) {
          focusLine.attr('x1', mouseX).attr('x2', mouseX).attr('opacity', 0.6); // Visible on hover
        }
      })
      .on('mouseleave', () => {
        focusLine.attr('opacity', 0); // Hide when mouse leaves chart area
      });

    // Double-click to reset
    svg.on('dblclick', () => {
      if (onReset) onReset();
    });

    // Clean UI styles
    svg.selectAll('.domain').attr('stroke', '#ccc');
    svg.selectAll('.tick line').attr('stroke', '#eee');
  }, [chartData, dimensions, timeRange, onTimeRangeChange, onReset]);

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, d) => {
        acc.info += d.INFO || 0;
        acc.error += d.ERROR || 0;
        return acc;
      },
      { info: 0, error: 0 }
    );
  }, [chartData]);

  // ... (Keep the Legend/Totals section same as before)
  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        background: '#fff',
        padding: '0',
        paddingTop: '10px',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Legend... */}
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ overflow: 'visible', cursor: 'crosshair', display: 'block' }}
      />

      <div
        style={{
          position: 'absolute',
          right: '25px', // Matches SVG margin.right
          bottom: '-15px', // Sits just above the X-axis labels
          display: 'flex',
          gap: '15px',
          pointerEvents: 'none', // Ensures it doesn't block zoom clicks
          fontFamily: 'sans-serif',
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: 8,
              height: 8,
              background: '#73bf69',
              borderRadius: '2px',
            }}
          />
          <span style={{ color: '#666' }}>
            INFO: <span style={{ color: '#222' }}>{totals.info}</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: 8,
              height: 8,
              background: '#e02f44',
              borderRadius: '2px',
            }}
          />
          <span style={{ color: '#666' }}>
            ERROR: <span style={{ color: '#222' }}>{totals.error}</span>
          </span>
        </div>
      </div>
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
