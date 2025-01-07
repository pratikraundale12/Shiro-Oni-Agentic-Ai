/*eslint-disable*/

import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NamespacesActions } from '../../store';
import {
  FitIcon,
  ProcessorGroupIcon,
  ProcessorIcon,
  SelectedProcessGrpIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '../../assets';
import styled from 'styled-components';
import { KDFM } from '../../constants';

const ZoomControls = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px 8px 0px;
  border-radius: 0 8px 8px 0px;
  border: 1px solid rgb(229, 230, 232);
  gap: 0.5rem;
`;

const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
  const svgRef = useRef();
  const zoomRef = useRef();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  const xScaleRef = useRef(false);
  const yScaleRef = useRef(false);
  const initialZoomLevel = 0.2;

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    const svgWidth = 600;
    const svgHeight = 250;

    const svg = d3
      .select(svgRef.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('background', 'rgb(249, 249, 249)')
      .style('border', '1px solid rgb(229 230 232)')
      .style('background-color', '#f9fafb')
      .style('background-size', '14px 14px')
      .style('border-radius', '10px 0px 0px 10px')
      .style(
        'background-image',
        'linear-gradient(to right, rgba(229, 235, 237, 1) 1px, transparent 1px), linear-gradient(to bottom, rgba(229, 235, 237, 1) 1px, transparent 1px)'
      );

    let g = svg.select('g');
    if (g.empty()) {
      g = svg.append('g');
    }

    if (!xScaleRef.current || !yScaleRef.current) {
      const minX = -2000;
      const maxX = -150;
      const minY = -1500;
      const maxY = -500;

      if (isNaN(minX) || isNaN(maxX) || isNaN(minY) || isNaN(maxY)) {
        return;
      }

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

    const orangeRect = data.find(rect => rect.color === '#FF7A00');

    // Drag Behavior
    const drag = d3
      .drag()
      .on('start', function (event, d) {
        d3.select(this).raise();
        const transform = d3.zoomTransform(svg.node());
        const [cursorX, cursorY] = d3.pointer(event, svg.node());
        const dataX = xScale.invert((cursorX - transform.x) / transform.k);
        const dataY = yScale.invert((cursorY - transform.y) / transform.k);
        d.offsetX = d.x - dataX;
        d.offsetY = d.y - dataY;
      })
      .on('drag', function (event, d) {
        d3.select(this).raise();
        const transform = d3.zoomTransform(svg.node());
        const [cursorX, cursorY] = d3.pointer(event, svg.node());
        const dataX =
          xScale.invert((cursorX - transform.x) / transform.k) + d.offsetX;
        const dataY =
          yScale.invert((cursorY - transform.y) / transform.k) + d.offsetY;

        d.x = dataX;
        d.y = dataY;

        d3.select(this).attr(
          'transform',
          `translate(${xScale(d.x)}, ${yScale(d.y)})`
        );

        setXStateCoordiate(dataX);
        setYStateCoordiate(dataY);

        dispatch(NamespacesActions.setRegistryFlowXCord(Number(dataX)));
        dispatch(NamespacesActions.setRegistryFlowYCord(Number(dataY)));

        const updatedData = data.map(rect =>
          rect.color === '#FF7A00'
            ? { ...rect, x: d.x, y: d.y, overflow: 'visible' }
            : rect
        );
        renderRectangles(updatedData);
      })
      .on('end', function (event, d) {
        const transform = d3.zoomTransform(svg.node());
        const [cursorX, cursorY] = d3.pointer(event, svg.node());
        const dataX =
          xScale.invert((cursorX - transform.x) / transform.k) + d.offsetX;
        const dataY =
          yScale.invert((cursorY - transform.y) / transform.k) + d.offsetY;

        d.x = dataX;
        d.y = dataY;

        d3.select(this).attr(
          'transform',
          `translate(${xScale(d.x)}, ${yScale(d.y)})`
        );

        setXStateCoordiate(dataX);
        setYStateCoordiate(dataY);

        dispatch(NamespacesActions.setRegistryFlowXCord(Number(dataX)));
        dispatch(NamespacesActions.setRegistryFlowYCord(Number(dataY)));
      });

    // const renderRectangles = (currentData = data) => {
    //   g.selectAll('g').remove();
    //   const rectGroups = g
    //     .selectAll('g')
    //     .data(currentData, d => d.id)
    //     .join('g')
    //     .attr('transform', d => {
    //       return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
    //     });

    //   rectGroups.each(function (d) {
    //     const group = d3.select(this);

    //     const adjustedWidth = d.width * 1;
    //     const adjustedHeight = d.height * 1;
    //     const lineExtension = 50; // Length of the extended guide lines

    //     // Add horizontal guide line
    //     group
    //       .append('line')
    //       .attr('x1', -adjustedWidth / 2 - lineExtension)
    //       .attr('y1', 0)
    //       .attr('x2', adjustedWidth / 2 + lineExtension)
    //       .attr('y2', 0)
    //       .attr('stroke', '#999')
    //       .attr('stroke-dasharray', '4, 4') // Dotted line
    //       .attr('stroke-width', 0.5);

    //     // Add vertical guide line
    //     group
    //       .append('line')
    //       .attr('x1', 0)
    //       .attr('y1', -adjustedHeight / 2 - lineExtension)
    //       .attr('x2', 0)
    //       .attr('y2', adjustedHeight / 2 + lineExtension)
    //       .attr('stroke', '#999')
    //       .attr('stroke-dasharray', '4, 4') // Dotted line
    //       .attr('stroke-width', 0.5);

    //     // Add the main rectangle
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', yScale(d.y + adjustedHeight) - yScale(d.y))
    //       .attr('rx', 1)
    //       .attr('fill', 'white')
    //       .attr('stroke', d.color)
    //       .attr('stroke-width', 0.5);

    //     // Add rectangle header
    //     const headerHeight = 10;
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', headerHeight)
    //       .attr('fill', d.color)
    //       .attr('rx', 1);

    //     // Make only the orange rectangle draggable
    //     if (d.color === '#FF7A00') {
    //       group.call(drag);
    //     }
    //   });
    // };

    // SINGLE GUIDE LINES BELOW
    // const renderRectangles = (currentData = data) => {
    //   g.selectAll('g').remove();

    //   const rectGroups = g
    //     .selectAll('g')
    //     .data(currentData, d => d.id)
    //     .join('g')
    //     .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

    //   rectGroups.each(function (d) {
    //     const group = d3.select(this);

    //     const adjustedWidth = d.width * 1;
    //     const adjustedHeight = d.height * 1;

    //     // Draw the rectangle
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', yScale(d.y + adjustedHeight) - yScale(d.y))
    //       .attr('rx', 1)
    //       .attr('fill', 'white')
    //       .attr('stroke', d.color)
    //       .attr('stroke-width', 0.5);

    //     // Draw the rectangle header
    //     const headerHeight = 10;
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', headerHeight)
    //       .attr('fill', d.color)
    //       .attr('rx', 1)
    //       .attr('fill', d.color);

    //     // Apply drag behavior only to the orange rectangle
    //     if (d.color === '#FF7A00') {
    //       group.call(drag);

    //       // Draw guide lines
    //       group
    //         .append('line')
    //         .attr('x1', -svgWidth) // Extend to the left edge
    //         .attr('y1', 0)
    //         .attr('x2', svgWidth) // Extend to the right edge
    //         .attr('y2', 0)
    //         .attr('stroke', 'red')
    //         .attr('stroke-dasharray', '4 4')
    //         .attr('stroke-width', 1);

    //       group
    //         .append('line')
    //         .attr('x1', 0)
    //         .attr('y1', -svgHeight) // Extend to the top edge
    //         .attr('x2', 0)
    //         .attr('y2', svgHeight) // Extend to the bottom edge
    //         .attr('stroke', 'red')
    //         .attr('stroke-dasharray', '4 4')
    //         .attr('stroke-width', 1);
    //     }
    //   });
    // };

    // SINGLE ATTACHED TO LEFT TOP BUT L SHAPE
    // const renderRectangles = (currentData = data) => {
    //   g.selectAll('g').remove();

    //   const rectGroups = g
    //     .selectAll('g')
    //     .data(currentData, d => d.id)
    //     .join('g')
    //     .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

    //   rectGroups.each(function (d) {
    //     const group = d3.select(this);

    //     const adjustedWidth = d.width * 1;
    //     const adjustedHeight = d.height * 1;

    //     // Draw the rectangle
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', yScale(d.y + adjustedHeight) - yScale(d.y))
    //       .attr('rx', 1)
    //       .attr('fill', 'white')
    //       .attr('stroke', d.color)
    //       .attr('stroke-width', 0.5);

    //     // Draw the rectangle header
    //     const headerHeight = 10;
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', headerHeight)
    //       .attr('fill', d.color)
    //       .attr('rx', 1)
    //       .attr('fill', d.color);

    //     // Apply drag behavior only to the orange rectangle
    //     if (d.color === '#FF7A00') {
    //       group.call(drag);

    //       // Get top-left corner relative to the group
    //       const topLeftX = -adjustedWidth / 2;
    //       const topLeftY = -adjustedHeight / 2;

    //       // Draw horizontal guide line from top-left corner
    //       group
    //         .append('line')
    //         .attr('x1', topLeftX) // Start at the top-left x position
    //         .attr('y1', topLeftY) // Start at the top-left y position
    //         .attr('x2', svgWidth) // Extend to the right edge
    //         .attr('y2', topLeftY) // Keep the y position constant
    //         .attr('stroke', 'red')
    //         .attr('stroke-dasharray', '4 4')
    //         .attr('stroke-width', 1);

    //       // Draw vertical guide line from top-left corner
    //       group
    //         .append('line')
    //         .attr('x1', topLeftX) // Start at the top-left x position
    //         .attr('y1', topLeftY) // Start at the top-left y position
    //         .attr('x2', topLeftX) // Keep the x position constant
    //         .attr('y2', svgHeight) // Extend to the bottom edge
    //         .attr('stroke', 'red')
    //         .attr('stroke-dasharray', '4 4')
    //         .attr('stroke-width', 1);
    //     }
    //   });
    // };

    // LEFT TOP ATTACHED PLUS GOOD, LENGTH DIFFERNCE
    const renderRectangles = (currentData = data) => {
      g.selectAll('g').remove();

      const rectGroups = g
        .selectAll('g')
        .data(currentData, d => d.id)
        .join('g')
        .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

      rectGroups.each(function (d) {
        const group = d3.select(this);

        const adjustedWidth = d.width * 1;
        const adjustedHeight = d.height * 1;

        // Draw the rectangle
        group
          .append('rect')
          .attr('x', -adjustedWidth / 2)
          .attr('y', -adjustedHeight / 2)
          .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
          .attr('height', yScale(d.y + adjustedHeight) - yScale(d.y))
          .attr('rx', 1)
          .attr('fill', 'white')
          .attr('stroke', d.color)
          .attr('stroke-width', 0.5);

        // Draw the rectangle header
        const headerHeight = 10;
        group
          .append('rect')
          .attr('x', -adjustedWidth / 2)
          .attr('y', -adjustedHeight / 2)
          .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
          .attr('height', headerHeight)
          .attr('fill', d.color)
          .attr('rx', 1)
          .attr('fill', d.color);

        // Apply drag behavior only to the orange rectangle
        if (d.color === '#FF7A00') {
          group.call(drag);

          // Get top-left corner relative to the group
          const topLeftX = -adjustedWidth / 2;
          const topLeftY = -adjustedHeight / 2;

          // Draw horizontal guide line from top-left corner (extend both left and right)
          group
            .append('line')
            .attr('x1', 0) // Start at the left edge of the SVG
            .attr('y1', topLeftY) // Start at the top-left y position
            .attr('x2', svgWidth) // Extend to the right edge
            .attr('y2', topLeftY) // Keep the y position constant
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 1);

          // Draw vertical guide line from top-left corner (extend both top and bottom)
          group
            .append('line')
            .attr('x1', topLeftX) // Start at the top-left x position
            .attr('y1', 0) // Extend to the top edge
            .attr('x2', topLeftX) // Keep the x position constant
            .attr('y2', svgHeight) // Extend to the bottom edge
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 1);

          // Draw extended horizontal line to the left edge
          group
            .append('line')
            .attr('x1', -svgWidth) // Extend to the left edge
            .attr('y1', topLeftY) // Keep the y position constant
            .attr('x2', 0) // Start at the right edge of the SVG
            .attr('y2', topLeftY) // Keep the y position constant
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 1);

          // Draw extended vertical line to the top edge
          group
            .append('line')
            .attr('x1', topLeftX) // Keep the x position constant
            .attr('y1', -svgHeight) // Extend to the top edge
            .attr('x2', topLeftX) // Keep the x position constant
            .attr('y2', 0) // Start at the bottom edge of the SVG
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 1);
        }
      });
    };

    // GOOD LINES BUT AWAY FROM RECT SOMETIMES
    // const renderRectangles = (currentData = data) => {
    //   // Remove all old lines
    //   g.selectAll('line').remove();

    //   // Remove old rectangle groups
    //   g.selectAll('g').remove();

    //   const rectGroups = g
    //     .selectAll('g')
    //     .data(currentData, d => d.id)
    //     .join('g')
    //     .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

    //   rectGroups.each(function (d) {
    //     const group = d3.select(this);

    //     const adjustedWidth = d.width * 1;
    //     const adjustedHeight = d.height * 1;

    //     // Draw the rectangle
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', yScale(d.y + adjustedHeight) - yScale(d.y))
    //       .attr('rx', 1)
    //       .attr('fill', 'white')
    //       .attr('stroke', d.color)
    //       .attr('stroke-width', 0.5);

    //     // Draw the rectangle header
    //     const headerHeight = 10;
    //     group
    //       .append('rect')
    //       .attr('x', -adjustedWidth / 2)
    //       .attr('y', -adjustedHeight / 2)
    //       .attr('width', xScale(d.x + adjustedWidth) - xScale(d.x))
    //       .attr('height', headerHeight)
    //       .attr('fill', d.color)
    //       .attr('rx', 1)
    //       .attr('fill', d.color);

    //     // Apply drag behavior only to the orange rectangle
    //     if (d.color === '#FF7A00') {
    //       group.call(drag);

    //       // Get top-left corner coordinates
    //       const topLeftX = xScale(d.x) - adjustedWidth / 2;
    //       const topLeftY = yScale(d.y) - adjustedHeight / 2;

    //       // Draw horizontal guide line through top-left corner
    //       g.append('line')
    //         .attr('x1', 0) // Extend to the left edge of the SVG
    //         .attr('y1', topLeftY)
    //         .attr('x2', svgWidth) // Extend to the right edge of the SVG
    //         .attr('y2', topLeftY)
    //         .attr('stroke', 'red')
    //         .attr('stroke-dasharray', '4 4')
    //         .attr('stroke-width', 0.9);

    //       // Draw vertical guide line through top-left corner
    //       g.append('line')
    //         .attr('x1', topLeftX)
    //         .attr('y1', 0) // Extend to the top edge of the SVG
    //         .attr('x2', topLeftX)
    //         .attr('y2', svgHeight) // Extend to the bottom edge of the SVG
    //         .attr('stroke', 'red')
    //         .attr('stroke-dasharray', '4 4')
    //         .attr('stroke-width', 0.9);
    //     }
    //   });
    // };

    renderRectangles(data);

    const initialScale = Math.min(
      svgWidth / (xScale.domain()[1] - xScale.domain()[0]),
      svgHeight / (yScale.domain()[1] - yScale.domain()[0])
    );

    const zoomOutFactor = data?.length === 1 ? 0.2 : 1.7;
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

    // Zoom Behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    zoomRef.current = zoom;

    if (isFirstRender.current && orangeRect) {
      const orangeCenterX = xScale(orangeRect.x);
      const orangeCenterY = yScale(orangeRect.y);

      if (!isNaN(orangeCenterX) && !isNaN(orangeCenterY)) {
        const initialTransform = d3.zoomIdentity
          .translate(
            svgWidth / 2 - orangeCenterX * initialZoomLevel,
            svgHeight / 2 - orangeCenterY * initialZoomLevel
          )
          .scale(initialZoomLevel);

        svg.call(zoom.transform, initialTransform);
      } else {
        return;
      }

      isFirstRender.current = false;
    }
  }, [data]);

  const handleZoomIn = () => {
    d3.select(svgRef.current).call(zoomRef.current.scaleBy, 1.2);
  };

  const handleZoomOut = () => {
    d3.select(svgRef.current).call(zoomRef.current.scaleBy, 0.8);
  };

  const handleExpand = () => {
    d3.select(svgRef.current).call(
      zoomRef.current.transform,
      d3.zoomIdentity.scale(initialZoomLevel).translate(0, 0)
    );
  };

  return (
    <div
      className="d-inline-flex bg-white p-3"
      style={{ position: 'relative', borderRadius: '10px', maxWidth: '100%' }}
    >
      <svg ref={svgRef}></svg>

      <ZoomControls>
        <ZoomInIcon dataTitle={KDFM.ZOOM_IN} onClick={handleZoomIn} />
        <ZoomOutIcon dataTitle={KDFM.ZOOM_OUT} onClick={handleZoomOut} />
        <FitIcon dataTitle={KDFM.FIT} onClick={handleExpand} />
      </ZoomControls>
    </div>
  );
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
