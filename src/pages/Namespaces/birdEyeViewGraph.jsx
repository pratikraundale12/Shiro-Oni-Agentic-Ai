//GRAPH IS FIXED WITH NO CHANGE IN THE COORDINATES OF BOXES

// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import PropTypes from 'prop-types';
// import { NamespacesActions } from '../../store';
// import { useDispatch } from 'react-redux';

// const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
//   const svgRef = useRef();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const svgWidth = 600;
//     const svgHeight = 300;

//     // Select the SVG and set its dimensions
//     const svg = d3
//       .select(svgRef.current)
//       .attr('width', svgWidth)
//       .attr('height', svgHeight)
//       .style('background', '#f9f9f9')
//       .style('border', '1px solid #E0D3D3');

//     // Append a single group element only once for zoomable content
//     let g = svg.select('g');
//     if (g.empty()) {
//       g = svg.append('g');
//     }

//     // Calculate the min/max x and y for scaling
//     const minX = Math.min(...data.map(d => d.x));
//     const maxX = Math.max(...data.map(d => d.x + d.width));
//     const minY = Math.min(...data.map(d => d.y));
//     const maxY = Math.max(...data.map(d => d.y + d.height));

//     // Calculate the range of the data to fit it into the view box
//     const dataWidth = maxX - minX;
//     const dataHeight = maxY - minY;

//     // Define scales to fit the data in the view box
//     const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
//     const yScale = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]); // Inverted y-axis for SVG

//     // Function to render rectangles
//     const renderRectangles = transform => {
//       // Clear the existing rectangles before rendering new ones to prevent duplication
//       g.selectAll('rect').remove();

//       g.selectAll('rect')
//         .data(data)
//         .join('rect')
//         .attr('x', d => xScale(d.x)) // No zoom transformation on x
//         .attr('y', d => yScale(d.y)) // No zoom transformation on y
//         .attr('width', d => d.width * transform.k) // Scale width by zoom level
//         .attr('height', d => d.height * transform.k) // Scale height by zoom level
//         .attr('fill', d => d.color);
//     };

//     // Initial zoom to fit the entire graph
//     const initialScale = Math.min(svgWidth / dataWidth, svgHeight / dataHeight);

//     // Create an initial zoom transformation
//     const initialTransform = d3.zoomIdentity
//       .translate(
//         (svgWidth - dataWidth * initialScale) / 2,
//         (svgHeight - dataHeight * initialScale) / 2
//       )
//       .scale(initialScale);

//     // Render initial rectangles with the initial transform
//     renderRectangles(initialTransform);

//     // Define zoom behavior with pan and scale limits
//     const zoom = d3
//       .zoom()
//       .scaleExtent([0.1, 10]) // Set zoom scale limits
//       .on('zoom', event => {
//         const transform = event.transform;
//         renderRectangles(transform); // Re-render rectangles on zoom and pan
//       });

//     // Apply zoom behavior and initial transformation
//     svg.call(zoom).call(zoom.transform, initialTransform);

//     // Add click event listener to capture the click coordinates
//     svg.on('click', event => {
//       const [x, y] = d3.pointer(event);
//       console.log('Click coordinates:', { x, y });

//       // Optionally, you can also convert the click coordinates to the data space
//       const dataX = xScale.invert(x);
//       const dataY = yScale.invert(y);
//       setXStateCoordiate(dataX), setYStateCoordiate(dataY);
//       dispatch(NamespacesActions.setPosition({ x: dataX }));
//       dispatch(NamespacesActions.setPosition({ y: dataY }));
//       console.log('Converted to data coordinates:', { dataX, dataY });
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

// COORDINATES OF GRAPH IS SAME WITH DRAG AND DROP ALONG WITH SELECTION OF COORDINATES
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import PropTypes from 'prop-types';
// import { NamespacesActions } from '../../store';
// import { useDispatch } from 'react-redux';

// const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
//   const svgRef = useRef();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const svgWidth = 400;
//     const svgHeight = 200;

//     // Select the SVG and set its dimensions
//     const svg = d3
//       .select(svgRef.current)
//       .attr('width', svgWidth)
//       .attr('height', svgHeight)
//       .style('background', '#f9f9f9')
//       .style('border', '1px solid #E0D3D3');

//     // Append a single group element only once for zoomable content
//     let g = svg.select('g');
//     if (g.empty()) {
//       g = svg.append('g');
//     }

//     // Calculate the min/max x and y for scaling
//     const minX = Math.min(...data.map(d => d.x));
//     const maxX = Math.max(...data.map(d => d.x + d.width));
//     const minY = Math.min(...data.map(d => d.y));
//     const maxY = Math.max(...data.map(d => d.y + d.height));

//     // Calculate the range of the data to fit it into the view box
//     const dataWidth = maxX - minX;
//     const dataHeight = maxY - minY;

//     // Define scales to fit the data in the view box
//     const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);
//     const yScale = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]); // Inverted y-axis for SVG

//     // Function to render rectangles
//     const renderRectangles = () => {
//       // Clear the existing rectangles before rendering new ones to prevent duplication
//       g.selectAll('rect').remove();

//       g.selectAll('rect')
//         .data(data)
//         .join('rect')
//         .attr('x', d => xScale(d.x)) // Keep original coordinates
//         .attr('y', d => yScale(d.y)) // Keep original coordinates
//         .attr('width', d => d.width)
//         .attr('height', d => d.height)
//         .attr('fill', d => d.color);
//     };

//     // Initial zoom to fit the entire graph
//     const initialScale = Math.min(svgWidth / dataWidth, svgHeight / dataHeight);

//     // Create an initial zoom transformation
//     const initialTransform = d3.zoomIdentity
//       .translate(
//         (svgWidth - dataWidth * initialScale) / 2,
//         (svgHeight - dataHeight * initialScale) / 2
//       )
//       .scale(initialScale);

//     // Render initial rectangles without transform (applied to the group later)
//     renderRectangles();

//     // Define zoom behavior with pan and scale limits
//     const zoom = d3
//       .zoom()
//       .scaleExtent([0.1, 10]) // Set zoom scale limits
//       .on('zoom', event => {
//         const transform = event.transform;
//         g.attr('transform', transform); // Apply the transform to the group (g)
//       });

//     // Apply zoom behavior and initial transformation
//     svg.call(zoom).call(zoom.transform, initialTransform);

//     // Add click event listener to capture the click coordinates
//     svg.on('click', event => {
//       const transform = d3.zoomTransform(svg.node()); // Get current transform

//       const [x, y] = d3.pointer(event); // Get click position in SVG space
//       console.log('Click coordinates:', { x, y });

//       // Apply the inverse transformation for correct coordinates
//       const dataX = xScale.invert((x - transform.x) / transform.k);
//       const dataY = yScale.invert((y - transform.y) / transform.k);

//       setXStateCoordiate(dataX);
//       setYStateCoordiate(dataY);
//       dispatch(NamespacesActions.setPosition({ x: dataX }));
//       dispatch(NamespacesActions.setPosition({ y: dataY }));
//       console.log('Converted to data coordinates:', { dataX, dataY });
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

// GRAPH IS GOOD IT JUST REORIENT TO ORIGNAL POSITION

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { NamespacesActions } from '../../store';
import { useDispatch } from 'react-redux';

const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
  const svgRef = useRef();
  const dispatch = useDispatch();

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

    svg.call(zoom).call(zoom.transform, initialTransform);

    svg.on('click', event => {
      const transform = d3.zoomTransform(svg.node());

      const [x, y] = d3.pointer(event);
      console.log('Click coordinates:', { x, y });

      const dataX = xScale.invert((x - transform.x) / transform.k);
      const dataY = yScale.invert((y - transform.y) / transform.k);

      setXStateCoordiate(dataX);
      setYStateCoordiate(dataY);
      dispatch(NamespacesActions.setPosition({ x: dataX }));
      dispatch(NamespacesActions.setPosition({ y: dataY }));
      console.log('Converted to data coordinates:', { dataX, dataY });
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
