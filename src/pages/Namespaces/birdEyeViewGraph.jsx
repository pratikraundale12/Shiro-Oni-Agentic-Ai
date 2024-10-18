import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { NamespacesActions } from '../../store';
import { useDispatch } from 'react-redux';

const RectangleGraph = ({ data, setXStateCoordiate, setYStateCoordiate }) => {
  const svgRef = useRef();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);

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
    const yScale = d3.scaleLinear().domain([minY, maxY]).range([0, svgHeight]);

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

    const zoomOutFactor = 0.2;
    const adjustedScale = initialScale * zoomOutFactor;

    const initialTransform = d3.zoomIdentity
      .translate(
        (svgWidth - dataWidth * adjustedScale) / 2,
        (svgHeight - dataHeight * adjustedScale) / 2
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
  setYStateCoordiate: PropTypes.func,
  setXStateCoordiate: PropTypes.func,
};

export default RectangleGraph;
