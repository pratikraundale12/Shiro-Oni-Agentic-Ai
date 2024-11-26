/////^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^GOOD CODE
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import PropTypes from 'prop-types';
// import { NamespacesActions } from '../../store';
// import { useDispatch } from 'react-redux';

// const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
//   const svgRef = useRef();
//   const dispatch = useDispatch();
//   const isFirstRender = useRef(true);

//   // Refs to store scales
//   const xScaleRef = useRef();
//   const yScaleRef = useRef();

//   useEffect(() => {
//     const svgWidth = 600;
//     const svgHeight = 250;

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

//     // Set up the initial scales (only once)
//     if (!xScaleRef.current || !yScaleRef.current) {
//       const minX = Math.min(...data.map(d => d.x));
//       const maxX = Math.max(...data.map(d => d.x + d.width));
//       const minY = Math.min(...data.map(d => d.y));
//       const maxY = Math.max(...data.map(d => d.y + d.height));

//       xScaleRef.current = d3
//         .scaleLinear()
//         .domain([minX, maxX])
//         .range([0, svgWidth]);
//       yScaleRef.current = d3
//         .scaleLinear()
//         .domain([minY, maxY])
//         .range([0, svgHeight]);
//     }

//     const xScale = xScaleRef.current;
//     const yScale = yScaleRef.current;

//     const renderRectangles = () => {
//       g.selectAll('rect').remove();

//       g.selectAll('rect')
//         .data(data)
//         .join('rect')
//         .attr('x', d => xScale(d.x))
//         .attr('y', d => yScale(d.y))
//         .attr('width', d => d.width)
//         .attr('height', d => d.height)
//         .attr('fill', d => d.color)
//         .style('stroke', '#fff');
//     };

//     const initialScale = Math.min(
//       svgWidth / (xScale.domain()[1] - xScale.domain()[0]),
//       svgHeight / (yScale.domain()[1] - yScale.domain()[0])
//     );

//     const zoomOutFactor = data?.length === 1 ? 0.2 : 1;
//     const adjustedScale = initialScale * zoomOutFactor;

//     const initialTransform = d3.zoomIdentity
//       .translate(
//         (svgWidth - (xScale.domain()[1] - xScale.domain()[0]) * adjustedScale) /
//           2,
//         (svgHeight -
//           (yScale.domain()[1] - yScale.domain()[0]) * adjustedScale) /
//           2
//       )
//       .scale(adjustedScale);

//     renderRectangles();

//     const zoom = d3
//       .zoom()
//       .scaleExtent([0.1, 10])
//       .on('zoom', event => {
//         const transform = event.transform;
//         g.attr('transform', transform);
//       });

//     svg.call(zoom);

//     if (isFirstRender.current) {
//       svg.call(zoom.transform, initialTransform);
//       isFirstRender.current = false;
//     }

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
//////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//777777777777777777777777777777777
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { NamespacesActions } from '../../store';
import { useDispatch } from 'react-redux';

const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
  const svgRef = useRef();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  const xScaleRef = useRef();
  const yScaleRef = useRef();

  useEffect(() => {
    const svgWidth = 600;
    const svgHeight = 250;

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

    if (!xScaleRef.current || !yScaleRef.current) {
      const minX = Math.min(...data.map(d => d.x));
      const maxX = Math.max(...data.map(d => d.x + d.width));
      const minY = Math.min(...data.map(d => d.y));
      const maxY = Math.max(...data.map(d => d.y + d.height));

      const padding = 20;

      xScaleRef.current = d3
        .scaleLinear()
        .domain([minX - padding, maxX + padding])
        .range([0, svgWidth]);
      yScaleRef.current = d3
        .scaleLinear()
        .domain([minY - padding, maxY + padding])
        .range([0, svgHeight]);
    }

    const xScale = xScaleRef.current;
    const yScale = yScaleRef.current;

    const renderRectangles = () => {
      g.selectAll('rect').remove();

      g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y))
        .attr('width', d => xScale(d.x + d.width) - xScale(d.x))
        .attr('height', d => yScale(d.y + d.height) - yScale(d.y))
        .attr('fill', d => d.color)
        .style('stroke', '#fff');
    };

    const initialScale = Math.min(
      svgWidth / (xScale.domain()[1] - xScale.domain()[0]),
      svgHeight / (yScale.domain()[1] - yScale.domain()[0])
    );

    const zoomOutFactor = data?.length === 1 ? 0.2 : 1;
    const adjustedScale = initialScale * zoomOutFactor;

    const initialTransform = d3.zoomIdentity
      .translate(
        (svgWidth - (xScale.domain()[1] - xScale.domain()[0]) * adjustedScale) /
          2,
        (svgHeight -
          (yScale.domain()[1] - yScale.domain()[0]) * adjustedScale) /
          2
      )
      .scale(adjustedScale);

    renderRectangles();

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', event => {
        const transform = event.transform;
        g.attr('transform', transform);
      });

    svg.call(zoom);

    if (isFirstRender.current) {
      svg.call(zoom.transform, initialTransform);
      isFirstRender.current = false;
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
  setXStateCoordiate: PropTypes.func.isRequired,
  setYStateCoordiate: PropTypes.func.isRequired,
};

export default RectangleGraph;
//777777777777777777777777
