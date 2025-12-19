import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NamespacesActions } from '../../store';
import { FitIcon, ZoomInIcon, ZoomOutIcon } from '../../assets';
import styled from 'styled-components';
import { KDFM } from '../../constants';
import { theme } from '../../styles';

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

const RectangleGraph = ({
  data,
  setXStateCoordiate,
  setYStateCoordiate,
  xCurrent,
  yCurrent,
  referenceDataArray = [],
}) => {
  const svgRef = useRef();
  const zoomRef = useRef();
  const dispatch = useDispatch();
  const isFirstRender = useRef(true);
  const xScaleRef = useRef(false);
  const yScaleRef = useRef(false);
  const initialZoomLevel = 0.4;
  const tooltipRef = useRef();

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

        const getTargetProcessGroup = data => {
          const sortArr = referenceDataArray?.filter(
            ele => ele?.position?.x == data.x
          );
          const finalArray = sortArr?.filter(ele => ele?.position?.y == data.y);
          return finalArray?.[0];
        };

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
          .attr('stroke-width', 0.5)
          .on('mouseover', function (event, datum) {
            let dataForBox = getTargetProcessGroup(datum);

            const tooltip =
              dataForBox?.name && datum?.color === 'teal'
                ? d3.select(tooltipRef.current)
                : null;

            tooltip.style('display', 'block').html(`
         
              <div style="height:120px; width:360px; border : 1px solid ${theme.colors.darkGrey};border-radius:10px;">
               <div style="background-color:${theme.colors.darkGrey3}; padding:6px; border-radius:10px 10px 0px 0px;  font-size: 13px; display:flex; justify-content:space-between; font-weight: 500;"> <div style="color:${theme.colors.primary};">${dataForBox?.name}</div>     
               ${dataForBox?.version !== undefined ? ` <div style="margin-right:5px">V ${dataForBox?.version}</div>` : `<div></div>`}</div>
          

           <div style="padding:10px;">
              ${dataForBox?.bucketName ? `<div><strong>Bucket Name:</strong> ${dataForBox.bucketName}</div>` : ''}
              ${dataForBox?.id ? `<div><strong>Process Group Id:</strong> ${dataForBox.id}</div>` : ''}
              ${dataForBox?.registryId ? `<div><strong>Registry Id:</strong> ${dataForBox.registryId}</div>` : ''}
              <div>${
                dataForBox?.runningCount !== undefined
                  ? `<span> <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 10 10' fill='none'><path d='M1.64453 4.93146V3.46846C1.64453 1.65204 2.93082 0.908212 4.50477 1.81642L5.77462 2.54792L7.04447 3.27942C8.61843 4.18763 8.61843 5.67528 7.04447 6.58349L5.77462 7.31499L4.50477 8.04649C2.93082 8.9547 1.64453 8.21087 1.64453 6.39445V4.93146Z' fill='%237DC7A0' stroke='%237DC7A0' stroke-width='0.616432' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round'/></svg>" />

 ${dataForBox.runningCount}</span>`
                  : ''
              } ${
                dataForBox?.stoppedCount !== undefined
                  ? `<span>  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'><rect x='4' y='4' width='14' height='14' rx='4' fill='%23D18686' stroke='%23D18686'/></svg>" />
 ${dataForBox.stoppedCount}</span>`
                  : ''
              }
              ${
                dataForBox?.invalidCount !== undefined
                  ? `<span>  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 11 10' fill='none'><path d='M9.395 6.54251L6.76489 1.80831C6.41147 1.17133 5.92243 0.822021 5.38408 0.822021C4.84573 0.822021 4.3567 1.17133 4.00327 1.80831L1.37317 6.54251C1.04029 7.14661 1.00331 7.72606 1.27043 8.18222C1.53755 8.63838 2.06357 8.88906 2.75397 8.88906H8.01419C8.70459 8.88906 9.23062 8.63838 9.49774 8.18222C9.76486 7.72606 9.72787 7.1425 9.395 6.54251ZM5.07587 3.6987C5.07587 3.53021 5.21559 3.39049 5.38408 3.39049C5.55257 3.39049 5.6923 3.53021 5.6923 3.6987V5.75348C5.6923 5.92197 5.55257 6.06169 5.38408 6.06169C5.21559 6.06169 5.07587 5.92197 5.07587 5.75348V3.6987ZM5.67586 7.27812C5.65531 7.29456 5.63476 7.31099 5.61422 7.32743C5.58956 7.34387 5.5649 7.3562 5.54024 7.36442C5.51559 7.37675 5.49093 7.38497 5.46216 7.38908C5.43751 7.39318 5.40874 7.39729 5.38408 7.39729C5.35942 7.39729 5.33066 7.39318 5.30189 7.38908C5.27723 7.38497 5.25258 7.37675 5.22792 7.36442C5.20326 7.3562 5.1786 7.34387 5.15395 7.32743C5.1334 7.31099 5.11285 7.29456 5.0923 7.27812C5.01833 7.20004 4.97313 7.09319 4.97313 6.98634C4.97313 6.87949 5.01833 6.77264 5.0923 6.69456C5.11285 6.67812 5.1334 6.66169 5.15395 6.64525C5.1786 6.62881 5.20326 6.61648 5.22792 6.60826C5.25258 6.59593 5.27723 6.58771 5.30189 6.5836C5.35532 6.57128 5.41285 6.57128 5.46216 6.5836C5.49093 6.58771 5.51559 6.59593 5.54024 6.60826C5.5649 6.61648 5.58956 6.62881 5.61422 6.64525C5.63476 6.66169 5.65531 6.67812 5.67586 6.69456C5.74983 6.77264 5.79504 6.87949 5.79504 6.98634C5.79504 7.09319 5.74983 7.20004 5.67586 7.27812Z' fill='%23CF9F5D'/></svg>" />

 ${dataForBox.invalidCount}</span>`
                  : ''
              }
              ${
                dataForBox?.disabledCount !== undefined
                  ? `<span>  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 11 10' fill='none'><path d='M9.50924 0.916439C9.38595 0.793153 9.18458 0.793153 9.0613 0.916439L1.47918 8.50266C1.3559 8.62595 1.3559 8.82731 1.47918 8.9506C1.54083 9.00813 1.61891 9.04101 1.7011 9.04101C1.78329 9.04101 1.86137 9.00813 1.92301 8.94649L9.50924 1.36027C9.63663 1.23698 9.63663 1.03973 9.50924 0.916439Z' fill='%23B5BDC8'/><path d='M6.65286 1.44654V3.77255L4.33507 6.09033V5.45746H3.06523C2.48989 5.45746 2.32962 5.10404 2.7118 4.67254L5.49397 1.50819L5.82273 1.13422C6.27889 0.616415 6.65286 0.75614 6.65286 1.44654Z' fill='%23B5BDC8'/><path d='M8.27699 5.19044L5.49483 8.35479L5.16607 8.72876C4.70991 9.24656 4.33594 9.10684 4.33594 8.41643V7.32329L7.25372 4.40552H7.92357C8.49891 4.40552 8.65918 4.75894 8.27699 5.19044Z' fill='%23B5BDC8'/></svg>" />


 ${dataForBox.disabledCount}</span>`
                  : ''
              }
              </div>
            
             
              </div>
             
            `);
            d3.select(this).attr('stroke-width', 2).attr('fill', '#f0f0f0');
          })
          .on('mousemove', function (event) {
            d3.select(tooltipRef.current)
              .style('left', `${event.pageX - 320}px`)
              .style('top', `${event.pageY - 330}px`);
          })
          .on('mouseout', function () {
            d3.select(this).attr('stroke-width', 0.5).attr('fill', 'white');
            d3.select(tooltipRef.current).style('display', 'none');
          });

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

          group
            .append('line')
            .attr('x1', 0)
            .attr('y1', topLeftY * 1)
            .attr('x2', svgWidth * 1)
            .attr('y2', topLeftY)
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 0.3);

          group
            .append('line')
            .attr('x1', topLeftX * 1)
            .attr('y1', 0)
            .attr('x2', topLeftX * 1)
            .attr('y2', svgHeight * 1.5)
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 0.3);

          group
            .append('line')
            .attr('x1', -svgWidth * 1.5)
            .attr('y1', topLeftY)
            .attr('x2', 0)
            .attr('y2', topLeftY)
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 0.3);

          group
            .append('line')
            .attr('x1', topLeftX)
            .attr('y1', -svgHeight * 2)
            .attr('x2', topLeftX)
            .attr('y2', 0)
            .attr('stroke', 'red')
            .attr('stroke-dasharray', '4 4')
            .attr('stroke-width', 0.3);
        }
      });
    };

    renderRectangles(data);

    const initialScale = Math.min(
      svgWidth / (xScale.domain()[1] - xScale.domain()[0]),
      svgHeight / (yScale.domain()[1] - yScale.domain()[0])
    );

    const zoomOutFactor = data?.length === 1 ? 0.2 : 0.2;
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
    initialTransform;
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
    const center = findMaxRectangleCluster(data);
    if (!center) return;

    const svgWidth = 600;
    const svgHeight = 250;
    const xScale = xScaleRef.current;
    const yScale = yScaleRef.current;

    // Ensure all coordinates are numbers
    const x1 = isNaN(center.x) ? 0 : center.x;
    const y1 = isNaN(center.y) ? 0 : center.y;
    const x2 = isNaN(xCurrent) ? 0 : xCurrent;
    const y2 = isNaN(yCurrent) ? 0 : yCurrent;

    const xavg = (x1 + x2) / 2;
    const yavg = (y1 + y2) / 2;

    // Avoid NaN before calling translate
    const centerX = isNaN(xScale(xavg)) ? 0 : xScale(xavg);
    const centerY = isNaN(yScale(yavg)) ? 0 : yScale(yavg);

    const offsetX = 30;
    const initialTransform = d3.zoomIdentity
      .translate(
        svgWidth / 2 - centerX * initialZoomLevel + offsetX,
        svgHeight / 2 - centerY * initialZoomLevel
      )
      .scale(initialZoomLevel);

    d3.select(svgRef.current).call(zoomRef.current.transform, initialTransform);

    d3.select(svgRef.current).call(zoomRef.current.scaleBy, 10000);
    setTimeout(() => {
      d3.select(svgRef.current).call(zoomRef.current.scaleBy, 0.02);
    }, 50);
  };

  const findMaxRectangleCluster = rectangles => {
    if (!rectangles || rectangles.length === 0) return null;
    const clusters = {};
    const gridSize = 100;
    rectangles.forEach(rect => {
      const gridX = Math.floor(rect.x / gridSize);
      const gridY = Math.floor(rect.y / gridSize);
      const key = `${gridX},${gridY}`;

      if (!clusters[key]) {
        clusters[key] = { count: 0, x: 0, y: 0 };
      }
      clusters[key].count++;
      clusters[key].x += rect.x;
      clusters[key].y += rect.y;
    });

    const maxCluster = Object.values(clusters).reduce((max, cluster) =>
      cluster.count > max.count ? cluster : max
    );

    return {
      x: maxCluster.x / maxCluster.count,
      y: maxCluster.y / maxCluster.count,
    };
  };

  return (
    <div
      className="d-inline-flex bg-white p-3"
      style={{ position: 'relative', borderRadius: '10px', maxWidth: '100%' }}
    >
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          padding: '6px 10px',
          background: '#fff',
          color: '#444445',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'none',
          whiteSpace: 'nowrap',
          zIndex: 10,
          width: '380px',
          borderColor: theme.colors.darkGrey3,
        }}
      ></div>
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
  xCurrent: PropTypes.number.isRequired,
  yCurrent: PropTypes.number.isRequired,
  referenceDataArray: PropTypes.array,
};
export default RectangleGraph;
