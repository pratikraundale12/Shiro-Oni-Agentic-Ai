/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';

const TreeTooltip = styled.div`
  position: absolute;
  padding: 6px;
  // background: rgba(0, 0, 0, 0.8);
  background: #fff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  // max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconRunning = () =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 10 10' fill='none'><path d='M1.64453 4.93146V3.46846C1.64453 1.65204 2.93082 0.908212 4.50477 1.81642L5.77462 2.54792L7.04447 3.27942C8.61843 4.18763 8.61843 5.67528 7.04447 6.58349L5.77462 7.31499L4.50477 8.04649C2.93082 8.9547 1.64453 8.21087 1.64453 6.39445V4.93146Z' fill='%237DC7A0' stroke='%237DC7A0' stroke-width='0.6' /></svg>`;

const IconStopped = () =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'><rect x='4' y='4' width='14' height='14' rx='4' fill='%23D18686' stroke='%23D18686'/></svg>`;

const IconInvalid = () =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 11 10' fill='none'><path d='M9.395 6.54251L6.76489 1.80831C6.41147 1.17133 5.92243 0.822021 5.38408 0.822021C4.84573 0.822021 4.3567 1.17133 4.00327 1.80831L1.37317 6.54251C1.04029 7.14661 1.00331 7.72606 1.27043 8.18222C1.53755 8.63838 2.06357 8.88906 2.75397 8.88906H8.01419C8.70459 8.88906 9.23062 8.63838 9.49774 8.18222C9.76486 7.72606 9.72787 7.1425 9.395 6.54251ZM5.07587 3.6987C5.07587 3.53021 5.21559 3.39049 5.38408 3.39049C5.55257 3.39049 5.6923 3.53021 5.6923 3.6987V5.75348C5.6923 5.92197 5.55257 6.06169 5.38408 6.06169C5.21559 6.06169 5.07587 5.92197 5.07587 5.75348V3.6987ZM5.67586 7.27812C5.65531 7.29456 5.63476 7.31099 5.61422 7.32743C5.58956 7.34387 5.5649 7.3562 5.54024 7.36442C5.51559 7.37675 5.49093 7.38497 5.46216 7.38908C5.43751 7.39318 5.40874 7.39729 5.38408 7.39729C5.35942 7.39729 5.33066 7.39318 5.30189 7.38908C5.27723 7.38497 5.25258 7.37675 5.22792 7.36442C5.20326 7.3562 5.1786 7.34387 5.15395 7.32743C5.1334 7.31099 5.11285 7.29456 5.0923 7.27812C5.01833 7.20004 4.97313 7.09319 4.97313 6.98634C4.97313 6.87949 5.01833 6.77264 5.0923 6.69456C5.11285 6.67812 5.1334 6.66169 5.15395 6.64525C5.1786 6.62881 5.20326 6.61648 5.22792 6.60826C5.25258 6.59593 5.27723 6.58771 5.30189 6.5836C5.35532 6.57128 5.41285 6.57128 5.46216 6.5836C5.49093 6.58771 5.51559 6.59593 5.54024 6.60826C5.5649 6.61648 5.58956 6.62881 5.61422 6.64525C5.63476 6.66169 5.65531 6.67812 5.67586 6.69456C5.74983 6.77264 5.79504 6.87949 5.79504 6.98634C5.79504 7.09319 5.74983 7.20004 5.67586 7.27812Z' fill='%23CF9F5D'/></svg>`;

const IconDisabled = () =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 11 10' fill='none'><path d='M9.50924 0.916439C9.38595 0.793153 9.18458 0.793153 9.0613 0.916439L1.47918 8.50266C1.3559 8.62595 1.3559 8.82731 1.47918 8.9506C1.54083 9.00813 1.61891 9.04101 1.7011 9.04101C1.78329 9.04101 1.86137 9.00813 1.92301 8.94649L9.50924 1.36027C9.63663 1.23698 9.63663 1.03973 9.50924 0.916439Z' fill='%23B5BDC8'/><path d='M6.65286 1.44654V3.77255L4.33507 6.09033V5.45746H3.06523C2.48989 5.45746 2.32962 5.10404 2.7118 4.67254L5.49397 1.50819L5.82273 1.13422C6.27889 0.616415 6.65286 0.75614 6.65286 1.44654Z' fill='%23B5BDC8'/><path d='M8.27699 5.19044L5.49483 8.35479L5.16607 8.72876C4.70991 9.24656 4.33594 9.10684 4.33594 8.41643V7.32329L7.25372 4.40552H7.92357C8.49891 4.40552 8.65918 4.75894 8.27699 5.19044Z' fill='%23B5BDC8'/></svg>`;

const theme = {
  colors: {
    darkGrey: '#e2e8f0',
    darkGrey3: '#f1f5f9',
    primary: '#f97316',
  },
};

// shimmer animation and Skeleton components (minimal, same card size)
const shimmer = keyframes`
  0% { background-position: -300px 0; }
  100% { background-position: 300px 0; }
`;

const TooltipSkeleton = styled.div`
  height: 120px;
  width: 360px;
  border: 1px solid ${theme.colors.darkGrey};
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// header-ish shimmering bar
const SkeletonHeader = styled.div`
  height: 36px;
  border-radius: 10px 10px 0 0;
  background: linear-gradient(90deg, #f3f4f6 25%, #eceff1 37%, #f3f4f6 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1s linear infinite;
`;

// body with a few lines and bottom icons placeholders
const SkeletonBody = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// small line placeholder
const Line = styled.div`
  height: ${props => props.h || 12}px;
  width: ${props => props.w || '80%'};
  border-radius: 4px;
  background: linear-gradient(90deg, #f3f4f6 25%, #eceff1 37%, #f3f4f6 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1s linear infinite;
  margin-bottom: 6px;
`;

// eslint-disable-next-line react/prop-types
function TooltipContent({ dataForBox }) {
  const d = dataForBox || {};
  return (
    <div
      style={{
        height: 120,
        width: 360,
        border: `1px solid ${theme.colors.darkGrey}`,
        borderRadius: 10,
        background: 'white',
        overflow: 'hidden',
        fontSize: 13,
        boxSizing: 'border-box',

        /* NEW: layout as column and fill vertical space */
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* header */}
      <div
        style={{
          backgroundColor: theme.colors.darkGrey3,
          padding: '6px',
          borderRadius: '10px 10px 0 0',
          fontSize: 13,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 500,
        }}
      >
        <div style={{ color: theme.colors.primary }}>{d.name ?? 'Name'}</div>
        {d.version !== undefined ? (
          <div style={{ marginRight: 5, color: '#111827' }}>V {d.version}</div>
        ) : (
          <div />
        )}
      </div>

      {/* MAIN content: this area will expand so the icons stay pinned to bottom */}
      <div
        style={{
          /* take remaining vertical space */
          padding: 10,
          fontSize: 12,
          color: '#111827',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // keep content at top, icons at bottom
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* top info lines (will stay at top of this area) */}
        <div>
          {d?.bucketName ? (
            <div>
              <strong>Bucket Name:</strong> {d.bucketName}
            </div>
          ) : null}
          {d?.id ? (
            <div>
              <strong>Process Group Id:</strong> {d.id}
            </div>
          ) : null}
          {d?.registryId ? (
            <div>
              <strong>Registry Id:</strong> {d.registryId}
            </div>
          ) : null}
        </div>

        {/* icons row — stays at the bottom because the parent uses justifyContent: 'space-between' */}
        <div
          style={{
            marginTop: 6,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          {typeof d?.runningCount !== 'undefined' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img
                src={IconRunning()}
                alt="running"
                style={{ width: 15, height: 15 }}
              />
              {d?.runningCount}
            </span>
          )}
          {typeof d?.stoppedCount !== 'undefined' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img
                src={IconStopped()}
                alt="stopped"
                style={{ width: 16, height: 16 }}
              />
              {d?.stoppedCount}
            </span>
          )}
          {typeof d?.invalidCount !== 'undefined' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img
                src={IconInvalid()}
                alt="invalid"
                style={{ width: 15, height: 15 }}
              />
              {d?.invalidCount}
            </span>
          )}
          {typeof d?.disabledCount !== 'undefined' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img
                src={IconDisabled()}
                alt="disabled"
                style={{ width: 16, height: 16, opacity: 0.7 }}
              />
              {d?.disabledCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const TreeViewNamespaces = ({
  data = {},
  width = 928,
  height = 600,
  hideRootNode = false,
  enableHoverApi = false,
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: null,
    x: 0,
    y: 0,
  });
  const zoomRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const dispatch = useDispatch();
  const namespacesVersion = useSelector(
    NamespacesSelectors.getNamespacesVersion
  );
  const loadingNamespacesVersion = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchNamespaceVersion')
  );

  useEffect(() => {
    // If API is in-progress, show the skeleton in tooltip (keeps your tooltip state shape unchanged)
    if (loadingNamespacesVersion) {
      setTooltip(prev => ({
        ...prev,
        visible: true,
        content: (
          <TooltipSkeleton>
            <SkeletonHeader />
            <SkeletonBody>
              <div>
                <Line w="60%" />
                <Line w="90%" />
                <Line w="40%" />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Line w="24px" h="16px" />
                <Line w="24px" h="16px" />
                <Line w="24px" h="16px" />
              </div>
            </SkeletonBody>
          </TooltipSkeleton>
        ),
      }));
      return; // wait until loading finishes
    }
    if (!namespacesVersion) return;
    const dataForBox = {
      name: namespacesVersion?.name ?? '',
      version: namespacesVersion?.version ?? '',
      bucketName:
        namespacesVersion?.versionControlInformation?.bucketName ?? '',
      id: namespacesVersion?.id ?? '',
      registryId:
        namespacesVersion?.versionControlInformation?.registryId ?? '',
      runningCount: namespacesVersion?.runningCount ?? '',
      stoppedCount: namespacesVersion?.stoppedCount ?? '',
      invalidCount: namespacesVersion?.invalidCount ?? '',
      disabledCount: namespacesVersion?.disabledCount ?? '',
    };
    setTooltip(prev => ({
      ...prev,
      visible: enableHoverApi,
      content: <TooltipContent dataForBox={dataForBox} />,
    }));
  }, [namespacesVersion, loadingNamespacesVersion]);

  // Initialize zoom behavior
  const initializeZoom = useCallback(() => {
    if (!svgRef.current) return;

    // Create zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 10]) // Min and max zoom levels
      .on('zoom', event => {
        d3.select(svgRef.current)
          .select('.zoom-group')
          .attr('transform', event.transform);
        setCurrentZoom(event.transform.k);
      });

    // Apply zoom to SVG
    d3.select(svgRef.current).call(zoom).on('dblclick.zoom', null); // Disable double-click zoom (we'll handle it separately)

    // Store zoom instance for programmatic control
    zoomRef.current = zoom;
  }, []);

  // Zoom in function
  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleBy, 1.25);
    }
  }, []);

  // Zoom out function
  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleBy, 0.75);
    }
  }, []);

  // Fit to view function
  const handleFit = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.scaleTo, 1); // Reset to original scale

      // Also reset translation to center
      // d3.select(svgRef.current)
      //   .transition()
      //   .duration(500)
      //   .call(zoomRef.current.translateTo, width / 2, height / 2);
    }
  }, [width, height]);

  // Custom double-click handler for zoom in
  const handleDoubleClick = useCallback(
    event => {
      event.preventDefault();
      handleZoomIn();
    },
    [handleZoomIn]
  );

  // ZZ

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Specify the charts' dimensions
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 40;

    // Create the root hierarchy
    const root = d3.hierarchy(data);

    // For vertical tree, we need more vertical spacing to prevent text overlap
    const dx = 120; // Increased horizontal spacing between nodes
    const dy = 150; // Fixed vertical spacing to prevent overlap

    // Define the tree layout for vertical orientation
    const tree = d3.tree().nodeSize([dx, dy]);

    // Use vertical link generator
    const diagonal = d3
      .linkVertical()
      .x(d => d.x)
      .y(d => d.y);

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-marginLeft, -marginTop, width, height])
      .attr(
        'style',
        'max-width: 100%; max-height: 100%; font: 10px sans-serif; user-select: none;'
      )
      .style('background', 'rgb(249, 249, 249)')
      .style('border', '1px solid rgb(229 230 232)')
      .style('background-color', '#f9fafb')
      .style('background-size', '14px 14px')
      .style('border-radius', '10px 10px 10px 10px')
      .style(
        'background-image',
        'linear-gradient(to right, rgba(229, 235, 237, 1) 1px, transparent 1px), linear-gradient(to bottom, rgba(229, 235, 237, 1) 1px, transparent 1px)'
      )
      .style('cursor', 'grab')
      .on('dblclick', handleDoubleClick); // Add double-click handler; ZZ

    // Create zoom group that will be transformed
    const zoomGroup = svg.append('g').attr('class', 'zoom-group'); // ZZ

    initializeZoom(); // ZZ

    const gLink = zoomGroup //ZZ
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#003333')
      .attr('stroke-opacity', 1);
    //   .attr('stroke-width', 1.5);
    //   .attr('stroke-opacity', 0.4)

    const gNode = zoomGroup // ZZ
      .append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

    // NEW: constants for label background rect sizing and text placement
    const TEXT_PADDING_H = 6; // horizontal padding inside the rect
    const TEXT_PADDING_V = 3; // vertical padding inside the rect
    const TEXT_DY = '3em'; // places text below the node
    const TEXT_FONT_SIZE = 11; // px, keep in sync with .attr('font-size')
    const TEXT_BG_FILL = '#f9fafb'; // should match svg background to hide link lines beneath text

    function update(event, source) {
      const duration = event?.altKey ? 2500 : 250;
      let nodes = root.descendants().reverse();
      let links = root.links();

      // Conditionally remove the root node and its immediate links
      nodes = hideRootNode ? nodes.filter(d => d.depth !== 0) : nodes;
      links = hideRootNode ? links.filter(d => d.source.depth !== 0) : links;

      // Compute the new tree layout
      tree(root);

      let left = root;
      let right = root;
      let top = root;
      let bottom = root;

      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
        if (node.y < top.y) top = node;
        if (node.y > bottom.y) bottom = node;
      });

      const treeWidth = right.x - left.x + marginLeft + marginRight + 100; // Extra width for text
      const treeHeight = bottom.y - top.y + marginTop + marginBottom + 50;

      const transition = svg
        .transition()
        .duration(duration)
        .attr('viewBox', [
          left.x - marginLeft - 50,
          top.y - marginTop,
          treeWidth,
          treeHeight,
        ])
        .tween(
          'resize',
          window.ResizeObserver ? null : () => () => svg.dispatch('toggle')
        );

      // Update the nodes
      const node = gNode.selectAll('g').data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('transform', _d => `translate(${source.x0},${source.y0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        })
        // Add tooltip events to the entire node group
        .on('mouseover', function (event, d) {
          const nodeId = d?.data?.instanceIdentifier || '';
          if (
            enableHoverApi &&
            d?.data?.isProcessor !== true &&
            !d.__hoverCalled
          ) {
            d.__hoverCalled = true;
            dispatch(
              NamespacesActions.fetchNamespaceVersion({
                namespaceId: nodeId,
              })
            );

            const name = d.data.name || '';
            //   if (name.length > 15) {
            // condittion to only show tooltip over larger name process groups
            setTooltip({
              visible: false,
              content: null,
              x: event.pageX,
              y: event.pageY,
            });
          }
        })
        .on('mousemove', function (event) {
          setTooltip(prev => ({
            ...prev,
            x: event.pageX,
            y: event.pageY,
          }));
        })
        .on('mouseout', function (event, d) {
          setTooltip({
            visible: false,
            content: null,
            x: 0,
            y: 0,
          });
          d.__hoverCalled = false;
        });

      nodeEnter
        .append('circle')
        .attr('r', 2) // Slightly larger for better visibility
        .attr('fill', d =>
          d?.data?.isProcessor === true ? '#008080' : '#bfdfdf'
        )
        .attr('stroke', d => (d._children ? '#008080' : '#bfdfdf'))
        // .attr('fill', d => (d._children ? '#2d3748' : '#818791'))
        // .attr('stroke', d => (d._children ? '#2d3748' : '#818791'))
        .attr('stroke-width', 10);

      //   Text positioning
      // REPLACED: original text placement -> NEW: center text below node and add a background rect that hides links beneath text
      nodeEnter
        .append('text')
        // NEW: center horizontally below the node
        .attr('x', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', TEXT_DY)
        .attr('font-size', `${TEXT_FONT_SIZE}px`)
        .text(d => {
          const name = d.data.name || '';
          return name.length > 15 ? name.substring(0, 15) + '...' : name;
        })
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 2)
        .attr('stroke', 'white')
        .attr('paint-order', 'stroke');

      // NEW: Insert a background rect behind each text label for node groups that were just entered.
      // We insert the rect before the text and size it based on the text's bbox so it hides links directly behind the label.
      nodeEnter.each(function () {
        const g = d3.select(this);
        const textEl = g.select('text').node();
        if (!textEl) return;
        // getBBox() works because the element is already in the DOM
        const bbox = textEl.getBBox();

        // Insert rect before the text so it is visually below the text but still above links (gNode is above gLink)
        g.insert('rect', 'text')
          .attr('x', bbox.x - TEXT_PADDING_H)
          .attr('y', bbox.y - TEXT_PADDING_V)
          .attr('width', bbox.width + TEXT_PADDING_H * 2)
          .attr('height', bbox.height + TEXT_PADDING_V * 2)
          .attr('rx', 4)
          .attr('fill', TEXT_BG_FILL)
          .attr('stroke', 'none')
          .attr('pointer-events', 'none'); // allow events to pass through to the group
      });

      // Transition nodes to their new position
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      nodeUpdate.select('circle').attr('r', 5);

      // NEW: After nodes are merged/updated, ensure label background rects are correctly sized/positioned for all nodes.
      // This keeps rects aligned when text, font-size, or node position changes.
      gNode.selectAll('g').each(function () {
        const g = d3.select(this);
        const textNode = g.select('text').node();
        if (!textNode) return;
        const bbox = textNode.getBBox();

        let rectSel = g.select('rect');
        if (rectSel.empty()) {
          // If a rect doesn't exist for some reason (older nodes), insert it now before the text
          rectSel = g
            .insert('rect', 'text')
            .attr('pointer-events', 'none')
            .attr('rx', 4);
        }

        rectSel
          .attr('x', bbox.x - TEXT_PADDING_H)
          .attr('y', bbox.y - TEXT_PADDING_V)
          .attr('width', bbox.width + TEXT_PADDING_H * 2)
          .attr('height', bbox.height + TEXT_PADDING_V * 2)
          .attr('fill', TEXT_BG_FILL);
      });

      // Transition exiting nodes to the parent's new position
      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr('transform', _d => `translate(${source.x},${source.y})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      // Update the links
      const link = gLink.selectAll('path').data(links, d => d.target.id);

      // Enter any new links at the parent's previous position
      const linkEnter = link
        .enter()
        .append('path')
        .attr('d', _d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position
      link.merge(linkEnter).transition(transition).attr('d', diagonal);

      // Transition exiting nodes to the parent's new position
      link
        .exit()
        .transition(transition)
        .remove()
        .attr('d', _d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      // Stash the old positions for transition
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Initialize the tree - MATCH THE HORIZONTAL TREE BEHAVIOR
    root.x0 = 0;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      // Exactly like the horizontal tree: only root and nodes with 7-letter names are open initially
      // if (d.depth && d.data.name.length !== 7) d.children = null; // commenting any condition that decides child will be collapse or not will open all children.
    });

    update(null, root);

    // Cleanup function
    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).on('dblclick', null);
      }
    };
  }, [
    data,
    width,
    height,
    handleDoubleClick,
    hideRootNode,
    initializeZoom,
    dispatch,
    enableHoverApi,
  ]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <svg
        ref={svgRef}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          background: '#f7fafc',
        }}
      />
      {tooltip.visible && (
        <TreeTooltip
          ref={tooltipRef}
          className="tree-tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
        >
          {tooltip.content}
        </TreeTooltip>
      )}

      {/* Zoom Controls */}
      <div
        style={{
          position: 'fixed',
          bottom: '26px',
          right: '40px',
          display: 'flex',
          gap: '8px',
          background: 'white',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          zIndex: 2000,
        }}
      >
        {/* 👇 Legends Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            color: '#374151',
            marginRight: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Process Groups */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#008080', // Teal
              }}
            ></div>
            <span>Process Groups</span>
          </div>

          {/* Processors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#bfdfdf', // Light teal
              }}
            ></div>
            <span>Processors</span>
          </div>
        </div>
        <button
          onClick={handleZoomOut}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            minWidth: '70px',
          }}
          title="Zoom Out"
        >
          Zoom Out
        </button>

        <button
          onClick={handleFit}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            minWidth: '50px',
          }}
          title="Fit to View"
        >
          Fit
        </button>

        <button
          onClick={handleZoomIn}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            minWidth: '70px',
          }}
          title="Zoom In"
        >
          Zoom In
        </button>

        <div
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            width: '56px',
            textAlign: 'center',
          }}
        >
          <span>{Math.round(currentZoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default TreeViewNamespaces;

TreeViewNamespaces.propTypes = {
  data: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  hideRootNode: PropTypes.bool,
  enableHoverApi: PropTypes.bool,
};
