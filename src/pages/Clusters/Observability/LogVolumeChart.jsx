import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { aggregateLogsForChart } from './helper';

const LogVolumeChart = ({ logs = [], onTimeRangeChange, height = 200 }) => {
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

    // --- 1. FIXED 1-HOUR X-AXIS ---
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const xScale = d3
      .scaleTime()
      .domain([oneHourAgo, now])
      .range([0, innerWidth]);

    const maxVal = d3.max(chartData, d => d.total) || 10;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal])
      .nice()
      .range([innerHeight, 0]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // --- 2. GRID & AXES (ZOOMED OUT) ---
    // Horizontal Gridlines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(''));

    // X-Axis: Ticks every 10 minutes, no seconds
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMinute.every(10))
          .tickFormat(d3.timeFormat('%H:%M'))
      )
      .style('color', '#666');

    // Y-Axis
    g.append('g').call(d3.axisLeft(yScale).ticks(5)).style('color', '#666');

    // --- 3. BARS (FIXED WIDTH) ---
    // Calculate bar width based on 60 minutes in the view, not the number of logs
    // This ensures bars stay thin (approx 1/60th of width) even if only 1 log exists
    const barWidth = (innerWidth / 60) * 0.7;

    const stack = d3.stack().keys(['INFO', 'ERROR']);
    const layers = stack(chartData);
    const colorMap = { INFO: '#73bf69', ERROR: '#e02f44' };

    g.selectAll('.layer')
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

    // --- 4. BRUSH (ZOOM) ---
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on('end', event => {
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xScale.invert);
        d3.select('.brush').call(brush.move, null);
        if (onTimeRangeChange)
          onTimeRangeChange(x0.toISOString(), x1.toISOString());
      });

    g.append('g')
      .attr('class', 'brush')
      .call(brush)
      .select('.selection')
      .attr('fill', '#007bff')
      .attr('fill-opacity', 0.1);

    // Styling grid
    svg.selectAll('.grid line').attr('stroke', '#e9ecef');
    svg.selectAll('.domain').attr('stroke', '#ccc');
  }, [chartData, dimensions, onTimeRangeChange]);

  const totals = useMemo(
    () => ({
      error: chartData.reduce((acc, d) => acc + d.ERROR, 0),
      info: chartData.reduce((acc, d) => acc + d.INFO, 0),
    }),
    [chartData]
  );

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', background: '#fff', padding: '15px' }}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '10px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              width: 12,
              height: 12,
              background: '#e02f44',
              borderRadius: '2px',
            }}
          />
          <span style={{ fontSize: '13px', color: '#444' }}>
            Error: <strong>{totals.error}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              width: 12,
              height: 12,
              background: '#73bf69',
              borderRadius: '2px',
            }}
          />
          <span style={{ fontSize: '13px', color: '#444' }}>
            Info: <strong>{totals.info}</strong>
          </span>
        </div>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ overflow: 'visible' }}
      />
    </div>
  );
};

LogVolumeChart.propTypes = {
  logs: PropTypes.array.isRequired,
  onTimeRangeChange: PropTypes.func.isRequired,
  height: PropTypes.number,
};

export default React.memo(LogVolumeChart);

// /////////////////V4
// import React, { useRef, useEffect, useMemo, useState } from 'react';
// import * as d3 from 'd3';
// import PropTypes from 'prop-types';
// import { aggregateLogsForChart } from './helper';

// const LogVolumeChart = ({ logs = [], onTimeRangeChange, height = 200 }) => {
//   const containerRef = useRef(null);
//   const svgRef = useRef(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: height });

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const resizeObserver = new ResizeObserver(entries => {
//       for (let entry of entries) {
//         setDimensions({ width: entry.contentRect.width, height: height });
//       }
//     });
//     resizeObserver.observe(containerRef.current);
//     return () => resizeObserver.disconnect();
//   }, [height]);

//   const chartData = useMemo(() => aggregateLogsForChart(logs), [logs]);

//   useEffect(() => {
//     if (!svgRef.current || dimensions.width <= 0) return;

//     const margin = { top: 20, right: 30, bottom: 40, left: 50 };
//     const innerWidth = dimensions.width - margin.left - margin.right;
//     const innerHeight = dimensions.height - margin.top - margin.bottom;

//     const svg = d3.select(svgRef.current);
//     svg.selectAll('*').remove();

//     // --- 1. DYNAMIC DOMAIN LOGIC ---
//     // If logs exist, use their time extent. Otherwise, default to last 1 hour.
//     const now = new Date();
//     const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

//     let xDomain = [oneHourAgo, now];
//     if (chartData.length > 0) {
//       const dataExtent = d3.extent(chartData, d => d.date);
//       // Ensure we have a valid range; if it's a single point, pad it
//       if (dataExtent[0].getTime() === dataExtent[1].getTime()) {
//         xDomain = [
//           new Date(dataExtent[0].getTime() - 30000),
//           new Date(dataExtent[1].getTime() + 30000),
//         ];
//       } else {
//         xDomain = dataExtent;
//       }
//     }

//     const xScale = d3.scaleTime().domain(xDomain).range([0, innerWidth]);
//     const maxVal = d3.max(chartData, d => d.total) || 10;
//     const yScale = d3
//       .scaleLinear()
//       .domain([0, maxVal])
//       .nice()
//       .range([innerHeight, 0]);

//     const g = svg
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     // --- 2. SQUARE GRIDS ---
//     // Horizontal Grid
//     g.append('g')
//       .attr('class', 'grid horizontal')
//       .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(''));

//     // Vertical Grid
//     g.append('g')
//       .attr('class', 'grid vertical')
//       .attr('transform', `translate(0,${innerHeight})`)
//       .call(
//         d3.axisBottom(xScale).ticks(10).tickSize(-innerHeight).tickFormat('')
//       );

//     // Axes
//     g.append('g')
//       .attr('transform', `translate(0,${innerHeight})`)
//       .call(
//         d3
//           .axisBottom(xScale)
//           .ticks(innerWidth / 100)
//           .tickFormat(d3.timeFormat('%H:%M'))
//       )
//       .style('color', '#666');

//     g.append('g').call(d3.axisLeft(yScale).ticks(5)).style('color', '#666');

//     // --- 3. BARS (FIXED WIDTH) ---
//     const barWidth = Math.max(2, (innerWidth / (chartData.length || 60)) * 0.6);
//     const stack = d3.stack().keys(['INFO', 'ERROR']);
//     const layers = stack(chartData);
//     const colorMap = { INFO: '#73bf69', ERROR: '#e02f44' };

//     g.selectAll('.layer')
//       .data(layers)
//       .enter()
//       .append('g')
//       .attr('fill', d => colorMap[d.key])
//       .selectAll('rect')
//       .data(d => d)
//       .enter()
//       .append('rect')
//       .attr('x', d => xScale(d.data.date) - barWidth / 2)
//       .attr('y', d => yScale(d[1]))
//       .attr('height', d => Math.max(0, yScale(d[0]) - yScale(d[1])))
//       .attr('width', barWidth)
//       .attr('rx', 1);

//     // --- 4. HOVER INDICATOR LINE ---
//     const hoverLine = g
//       .append('line')
//       .attr('y1', 0)
//       .attr('y2', innerHeight)
//       .attr('stroke', '#ff7a00')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '4,4')
//       .style('opacity', 0);

//     // --- 5. BRUSH & MOUSE LISTENER ---
//     const brush = d3
//       .brushX()
//       .extent([
//         [0, 0],
//         [innerWidth, innerHeight],
//       ])
//       .on('brush', event => {
//         // Hide hover line while dragging
//         hoverLine.style('opacity', 0);
//       })
//       .on('end', event => {
//         if (!event.selection) return;
//         const [x0, x1] = event.selection.map(xScale.invert);
//         d3.select('.brush').call(brush.move, null);
//         if (onTimeRangeChange)
//           onTimeRangeChange(x0.toISOString(), x1.toISOString());
//       });

//     const brushG = g.append('g').attr('class', 'brush').call(brush);

//     // Stylize selection
//     brushG
//       .select('.selection')
//       .attr('fill', '#007bff')
//       .attr('fill-opacity', 0.1)
//       .attr('stroke', '#007bff');

//     // Attach hover logic to the brush overlay (the rect that catches events)
//     brushG
//       .select('.overlay')
//       .style('cursor', 'crosshair')
//       .on('mousemove', function (event) {
//         const [mouseX] = d3.pointer(event);
//         hoverLine.attr('x1', mouseX).attr('x2', mouseX).style('opacity', 1);
//       })
//       .on('mouseleave', () => {
//         hoverLine.style('opacity', 0);
//       });

//     // Final Styling for Grids
//     svg.selectAll('.grid line').attr('stroke', '#e9ecef');
//     svg.selectAll('.domain').attr('stroke', '#ccc');
//   }, [chartData, dimensions, onTimeRangeChange]);

//   const totals = useMemo(
//     () => ({
//       error: chartData.reduce((acc, d) => acc + d.ERROR, 0),
//       info: chartData.reduce((acc, d) => acc + d.INFO, 0),
//     }),
//     [chartData]
//   );

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         width: '100%',
//         background: '#fff',
//         padding: '15px',
//         border: '1px solid #eee',
//         borderRadius: '8px',
//       }}
//     >
//       <div
//         style={{
//           display: 'flex',
//           gap: '20px',
//           marginBottom: '10px',
//           fontFamily: 'sans-serif',
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//           <span
//             style={{
//               width: 12,
//               height: 12,
//               background: '#e02f44',
//               borderRadius: '2px',
//             }}
//           />
//           <span style={{ fontSize: '13px', color: '#444' }}>
//             Error: <strong>{totals.error}</strong>
//           </span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//           <span
//             style={{
//               width: 12,
//               height: 12,
//               background: '#73bf69',
//               borderRadius: '2px',
//             }}
//           />
//           <span style={{ fontSize: '13px', color: '#444' }}>
//             Info: <strong>{totals.info}</strong>
//           </span>
//         </div>
//       </div>
//       <svg
//         ref={svgRef}
//         width="100%"
//         height={height}
//         style={{ overflow: 'visible' }}
//       />
//     </div>
//   );
// };

// LogVolumeChart.propTypes = {
//   logs: PropTypes.array.isRequired,
//   onTimeRangeChange: PropTypes.func.isRequired,
//   height: PropTypes.number,
// };

// export default React.memo(LogVolumeChart);
