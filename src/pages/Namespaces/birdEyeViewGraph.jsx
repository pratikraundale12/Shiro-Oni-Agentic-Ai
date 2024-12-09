/*eslint-disable*/

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { NamespacesActions } from '../../store';
import { useDispatch } from 'react-redux';

const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
  const svgRef = useRef();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

  const xScaleRef = useRef(false);
  const yScaleRef = useRef(false);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn('No data provided for RectangleGraph');
      return;
    }

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
    const initialZoomLevel = 1;

    // Drag Behavior
    const drag = d3
      .drag()
      .on('start', function (event, d) {
        const transform = d3.zoomTransform(svg.node());
        const [cursorX, cursorY] = d3.pointer(event, svg.node());
        const dataX = xScale.invert((cursorX - transform.x) / transform.k);
        const dataY = yScale.invert((cursorY - transform.y) / transform.k);
        d.offsetX = dataX - d.x;
        d.offsetY = dataY - d.y;
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
      g.selectAll('rect').remove();
      const rects = g
        .selectAll('rect')
        .data(currentData, d => d.id)
        .join('rect')
        .attr('x', d => xScale(d.x) - (xScale(d.x + d.width) - xScale(d.x)) / 2)
        .attr(
          'y',
          d => yScale(d.y) - (yScale(d.y + d.height) - yScale(d.y)) / 2
        )
        .attr('width', d => xScale(d.x + d.width) - xScale(d.x))
        .attr('height', d => yScale(d.y + d.height) - yScale(d.y))
        .attr('fill', d => d.color)
        .style('stroke', d => d.color)
        .call(d => {
          d.each(function (d) {
            if (d.color === '#FF7A00') {
              d3.select(this).call(drag);
            }
          });
        });
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

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

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
