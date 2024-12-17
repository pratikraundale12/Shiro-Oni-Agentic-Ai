/*eslint-disable*/

import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NamespacesActions } from '../../store';
import { FitIcon, ZoomInIcon, ZoomOutIcon } from '../../assets';
import styled from 'styled-components';

const ZoomControls = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 0 8px 8px 0px;
  border: 1px solid rgb(229, 230, 232);
  gap: 0.8rem;
`;

const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
  const svgRef = useRef();
  const zoomRef = useRef();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  const xScaleRef = useRef(false);
  const yScaleRef = useRef(false);
  const initialZoomLevel = 0.6;

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
        const transform = d3.zoomTransform(svg.node());
        const [cursorX, cursorY] = d3.pointer(event, svg.node());
        const dataX = xScale.invert((cursorX - transform.x) / transform.k);
        const dataY = yScale.invert((cursorY - transform.y) / transform.k);
        d.offsetX = d.x - dataX;
        d.offsetY = d.y - dataY;
      })
      .on('drag', function (event, d) {
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

    const renderRectangles = (currentData = data) => {
      g.selectAll('g').remove(); // Clear previous groups

      const rectGroups = g
        .selectAll('g')
        .data(currentData, d => d.id)
        .join('g') // Group each rectangle and its sub-elements
        .attr('transform', d => {
          return `translate(${xScale(d.x)}, ${yScale(d.y)})`;
        });

      rectGroups.each(function (d) {
        const group = d3.select(this);

        // Outer rectangle (base)
        group
          .append('rect')
          .attr('x', -d.width / 2) // Center rectangle
          .attr('y', -d.height / 2)
          .attr('width', xScale(d.x + d.width) - xScale(d.x))
          .attr('height', yScale(d.y + d.height) - yScale(d.y))
          .attr('rx', 2) // Rounded corners
          .attr('fill', 'white')
          .attr('stroke', d.color)
          .attr('stroke-width', 0.5);

        // Top section (orange header path)
        const headerHeight = 10; // Height of the header section (orange part)
        group
          .append('rect')
          .attr('x', -d.width / 2) // Match the outer rectangle's position
          .attr('y', -d.height / 2) // Start at the top
          .attr('width', xScale(d.x + d.width) - xScale(d.x)) // Same width as the outer rectangle
          .attr('height', headerHeight) // Height of the header
          .attr('fill', d.color)
          .attr('rx', 2)
          .attr('fill', d.color);

        if (d.color === '#FF7A00') {
          group.call(drag); // Apply drag behavior to the entire group
        }
      });

      // g.selectAll('rect').remove();
      // const rects = g
      //   .selectAll('rect')
      //   .data(currentData, d => d.id)
      //   .join('rect')
      //   .attr('x', d => xScale(d.x) - (xScale(d.x + d.width) - xScale(d.x)) / 2)
      //   .attr(
      //     'y',
      //     d => yScale(d.y) - (yScale(d.y + d.height) - yScale(d.y)) / 2
      //   )
      //   .attr('width', d => xScale(d.x + d.width) - xScale(d.x))
      //   .attr('height', d => yScale(d.y + d.height) - yScale(d.y))
      //   .attr('fill', d => d.color)
      //   .style('stroke', d => d.color)
      //   .style('cursor', d => (d.color === '#FF7A00' ? 'pointer' : 'default'))
      //   .call(d => {
      //     d.each(function (d) {
      //       if (d.color === '#FF7A00') {
      //         d3.select(this).call(drag);
      //       }
      //     });
      //   });
    };

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

  // Handlers for Zoom In, Zoom Out, and Expand
  const handleZoomIn = () => {
    d3.select(svgRef.current).call(
      zoomRef.current.scaleBy,
      1.2 // Zoom In factor
    );
  };

  const handleZoomOut = () => {
    d3.select(svgRef.current).call(
      zoomRef.current.scaleBy,
      0.8 // Zoom Out factor
    );
  };

  const handleExpand = () => {
    d3.select(svgRef.current).call(
      zoomRef.current.transform,
      d3.zoomIdentity.scale(initialZoomLevel).translate(0, 0) // Reset zoom to default
    );
  };

  return (
    <div
      className="d-flex"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* SVG Container */}
      <svg ref={svgRef}></svg>

      {/* Zoom Controls */}

      <ZoomControls>
        <ZoomInIcon dataTitle="Zoom In" onClick={handleZoomIn} />
        <ZoomOutIcon dataTitle="Zoom Out" onClick={handleZoomOut} />
        <FitIcon dataTitle="Expand" onClick={handleExpand} />
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
