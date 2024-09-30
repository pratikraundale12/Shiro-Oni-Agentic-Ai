// NOW THE GRAPH IS NOT RESETTING

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { NamespacesActions } from '../../store';
import { useDispatch } from 'react-redux';

const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
  const svgRef = useRef();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true); // Track initial render

  useEffect(() => {
    const svgWidth = 400;
    const svgHeight = 200;

    const svg = d3
      .select(svgRef.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('background', '#f9f9f9')
      .style('border', '1px solid #E0D3D3');

    let g = svg.select('g');
    if (g.empty()) {
      g = svg.append('g');
    }

    const minX = Math.min(...data.map(d => d.x));
    const maxX = Math.max(...data.map(d => d.x + d.width));
    const minY = Math.min(...data.map(d => d.y));
    const maxY = Math.max(...data.map(d => d.y + d.height));

    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
    const yScale = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]);

    const renderRectangles = () => {
      g.selectAll('rect').remove();

      g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y))
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr('fill', d => d.color);
    };

    const initialScale = Math.min(svgWidth / dataWidth, svgHeight / dataHeight);

    const initialTransform = d3.zoomIdentity
      .translate(
        (svgWidth - dataWidth * initialScale) / 2,
        (svgHeight - dataHeight * initialScale) / 2
      )
      .scale(initialScale);

    renderRectangles();

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', event => {
        const transform = event.transform;
        g.attr('transform', transform);
      });

    svg.call(zoom);

    // Only apply initial transformation on the first render
    if (isFirstRender.current) {
      svg.call(zoom.transform, initialTransform);
      isFirstRender.current = false; // Mark that the first render is done
    }

    svg.on('click', event => {
      const transform = d3.zoomTransform(svg.node());

      const [x, y] = d3.pointer(event);

      const dataX = xScale.invert((x - transform.x) / transform.k);
      const dataY = yScale.invert((y - transform.y) / transform.k);

      setXStateCoordiate(dataX);
      setYStateCoordiate(dataY);
      dispatch(NamespacesActions.setPosition({ x: dataX }));
      dispatch(NamespacesActions.setPosition({ y: dataY }));
    });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};
RectangleGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  setYStateCoordiate: PropTypes.func,
  setXStateCoordiate: PropTypes.func,
};

export default RectangleGraph;

// RECTABGLE FRAME WITH DRAG FUNCTIONALITY BUT DUPLICATION OF FRAME ISSUE
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import PropTypes from 'prop-types';
// import { NamespacesActions } from '../../store';
// import { useDispatch } from 'react-redux';

// const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
//   const svgRef = useRef();
//   const dispatch = useDispatch();
//   const isFirstRender = useRef(true);

//   useEffect(() => {
//     const svgWidth = 400;
//     const svgHeight = 200;

//     const svg = d3
//       .select(svgRef.current)
//       .attr('width', svgWidth)
//       .attr('height', svgHeight)
//       .style('background', '#f9f9f9')
//       .style('border', '1px solid #E0D3D3');

//     let g = svg.select('g');
//     if (g.empty()) {
//       g = svg.append('g');
//     }

//     const minX = Math.min(...data.map(d => d.x));
//     const maxX = Math.max(...data.map(d => d.x + d.width));
//     const minY = Math.min(...data.map(d => d.y));
//     const maxY = Math.max(...data.map(d => d.y + d.height));

//     const dataWidth = maxX - minX;
//     const dataHeight = maxY - minY;

//     const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
//     const yScale = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]);

//     const renderRectangles = () => {
//       g.selectAll('rect').remove();

//       g.selectAll('rect')
//         .data(data)
//         .join('rect')
//         .attr('x', d => xScale(d.x))
//         .attr('y', d => yScale(d.y))
//         .attr('width', d => d.width)
//         .attr('height', d => d.height)
//         .attr('fill', d => d.color);
//     };

//     const initialScale = Math.min(svgWidth / dataWidth, svgHeight / dataHeight);

//     const initialTransform = d3.zoomIdentity
//       .translate(
//         (svgWidth - dataWidth * initialScale) / 2,
//         (svgHeight - dataHeight * initialScale) / 2
//       )
//       .scale(initialScale);

//     renderRectangles();

//     const zoom = d3
//       .zoom()
//       .scaleExtent([0.1, 10])
//       .on('zoom', event => {
//         const transform = event.transform;
//         g.attr('transform', transform);
//       });

//     svg.call(zoom);

//     // Only apply initial transformation on the first render
//     if (isFirstRender.current) {
//       svg.call(zoom.transform, initialTransform);
//       isFirstRender.current = false;
//     }

//     // Add rectangular frame for dragging
//     const frame = svg
//       .append('rect')
//       .attr('x', 50)
//       .attr('y', 50)
//       .attr('width', 100)
//       .attr('height', 50)
//       .attr('stroke', 'red')
//       .attr('fill', 'none')
//       .attr('stroke-width', 2)
//       .call(
//         d3.drag().on('drag', event => {
//           const { x, y } = event;
//           const newX = Math.max(0, Math.min(svgWidth - 100, x)); // Constrain within svg
//           const newY = Math.max(0, Math.min(svgHeight - 50, y));

//           frame.attr('x', newX).attr('y', newY);
//           const dx = ((newX - 50) * (maxX - minX)) / svgWidth;
//           const dy = ((newY - 50) * (maxY - minY)) / svgHeight;

//           // Update graph position based on frame movement
//           svg.call(
//             zoom.transform,
//             d3.zoomIdentity.translate(-dx, -dy).scale(initialScale)
//           );
//         })
//       );

//     svg.on('click', event => {
//       const transform = d3.zoomTransform(svg.node());
//       const [x, y] = d3.pointer(event);

//       const dataX = xScale.invert((x - transform.x) / transform.k);
//       const dataY = yScale.invert((y - transform.y) / transform.k);

//       setXStateCoordiate(dataX);
//       setYStateCoordiate(dataY);
//       dispatch(NamespacesActions.setPosition({ x: dataX }));
//       dispatch(NamespacesActions.setPosition({ y: dataY }));
//     });
//   }, [data]);

//   return <svg ref={svgRef}></svg>;
// };

// RectangleGraph.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       x: PropTypes.number.isRequired,
//       y: PropTypes.number.isRequired,
//       width: PropTypes.number.isRequired,
//       height: PropTypes.number.isRequired,
//       color: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   setYStateCoordiate: PropTypes.func,
//   setXStateCoordiate: PropTypes.func,
// };

// export default RectangleGraph;

// GRAPH IS GOOD WITH FRAME BUT ISSUE IS ONLY LEFT CORNER WORKING
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import PropTypes from 'prop-types';
// import { NamespacesActions } from '../../store';
// import { useDispatch } from 'react-redux';

// const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
//   const svgRef = useRef();
//   const dispatch = useDispatch();
//   const isFirstRender = useRef(true);

//   useEffect(() => {
//     const svgWidth = 400;
//     const svgHeight = 200;

//     const svg = d3
//       .select(svgRef.current)
//       .attr('width', svgWidth)
//       .attr('height', svgHeight)
//       .style('background', '#f9f9f9')
//       .style('border', '1px solid #E0D3D3');

//     let g = svg.select('g');
//     if (g.empty()) {
//       g = svg.append('g');
//     }

//     const minX = Math.min(...data.map(d => d.x));
//     const maxX = Math.max(...data.map(d => d.x + d.width));
//     const minY = Math.min(...data.map(d => d.y));
//     const maxY = Math.max(...data.map(d => d.y + d.height));

//     const dataWidth = maxX - minX;
//     const dataHeight = maxY - minY;

//     const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
//     const yScale = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]);

//     const renderRectangles = () => {
//       g.selectAll('rect').remove();

//       g.selectAll('rect')
//         .data(data)
//         .join('rect')
//         .attr('x', d => xScale(d.x))
//         .attr('y', d => yScale(d.y))
//         .attr('width', d => d.width)
//         .attr('height', d => d.height)
//         .attr('fill', d => d.color);
//     };

//     const initialScale = Math.min(svgWidth / dataWidth, svgHeight / dataHeight);

//     const initialTransform = d3.zoomIdentity
//       .translate(
//         (svgWidth - dataWidth * initialScale) / 2,
//         (svgHeight - dataHeight * initialScale) / 2
//       )
//       .scale(initialScale);

//     renderRectangles();

//     const zoom = d3
//       .zoom()
//       .scaleExtent([0.1, 10])
//       .on('zoom', event => {
//         const transform = event.transform;
//         g.attr('transform', transform);
//       });

//     svg.call(zoom);

//     // Only apply initial transformation on the first render
//     if (isFirstRender.current) {
//       svg.call(zoom.transform, initialTransform);
//       isFirstRender.current = false;
//     }

//     // Add rectangular frame for dragging
//     // First remove any existing frame to prevent overlap
//     svg.selectAll('.drag-frame').remove();

//     const frame = svg
//       .append('rect')
//       .attr('class', 'drag-frame') // Add a class to identify the frame
//       .attr('x', 50)
//       .attr('y', 50)
//       .attr('width', 100)
//       .attr('height', 50)
//       .attr('stroke', 'red')
//       .attr('fill', 'none')
//       .attr('stroke-width', 2)
//       .call(
//         d3.drag().on('drag', event => {
//           const { x, y } = event;
//           const newX = Math.max(0, Math.min(svgWidth - 100, x)); // Constrain within svg
//           const newY = Math.max(0, Math.min(svgHeight - 50, y));

//           frame.attr('x', newX).attr('y', newY);

//           const dx = ((newX - 50) * (maxX - minX)) / svgWidth;
//           const dy = ((newY - 50) * (maxY - minY)) / svgHeight;

//           // Update graph position based on frame movement
//           svg.call(
//             zoom.transform,
//             d3.zoomIdentity.translate(-dx, -dy).scale(initialScale)
//           );
//         })
//       );

//     svg.on('click', event => {
//       const transform = d3.zoomTransform(svg.node());
//       const [x, y] = d3.pointer(event);

//       const dataX = xScale.invert((x - transform.x) / transform.k);
//       const dataY = yScale.invert((y - transform.y) / transform.k);

//       setXStateCoordiate(dataX);
//       setYStateCoordiate(dataY);
//       dispatch(NamespacesActions.setPosition({ x: dataX }));
//       dispatch(NamespacesActions.setPosition({ y: dataY }));
//     });
//   }, [data]);

//   return <svg ref={svgRef}></svg>;
// };

// RectangleGraph.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       x: PropTypes.number.isRequired,
//       y: PropTypes.number.isRequired,
//       width: PropTypes.number.isRequired,
//       height: PropTypes.number.isRequired,
//       color: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   setYStateCoordiate: PropTypes.func,
//   setXStateCoordiate: PropTypes.func,
// };

// export default RectangleGraph;
