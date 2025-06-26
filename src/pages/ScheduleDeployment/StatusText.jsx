import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';

const statusColors = {
  PENDING: '#F2891F',
  APPROVED: '#0cbf59',
  NOT_APPROVED: 'red',
  'IN PROGRESS': '#444445',
  SCHEDULED: '#F2891F',
  DEPLOYED: '#0cbf59',
  'NOT APPROVED': 'red',
  'N/A': '#b5b5bd',
  CANCELLED: 'red',
  FAILED: 'red',
  'DEPLOYED WITH ERROR': 'red',
  'UPGRADED WITH ERRORS': 'red',
  'DOWNGRADED WITH ERRORS': 'red',
  'STARTED WITH ERRORS': 'red',
  'STOPPED WITH ERRORS': 'red',
  REJECTED: 'red',
  'TIME LAPSED': '#F2891F',
};

const StatusTexts = styled.div`
  font-family: 'Red Hat Display', sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const StatusText = ({ text = '', item }) => {
  const color = statusColors[text] || '#b5b5bd';

  function formatText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const displayText = formatText(
    item?.state === 'TIME_LAPSED'
      ? 'TIME_LAPSED'
      : item?.state === 'IN_PROGRESS'
        ? 'IN_PROGRESS'
        : text
  );

  return (
    <>
      <StatusTexts
        color={color}
        data-tooltip-id={item?.state || 'status-tooltip'}
      >
        {displayText}
      </StatusTexts>
      <ReactTooltip
        id={item?.state || 'status-tooltip'}
        content={formatText(item?.state || text)}
        place="left"
      />
    </>
  );
};

StatusText.propTypes = {
  text: PropTypes.string,
  item: PropTypes.object, // corrected from array to object
};
