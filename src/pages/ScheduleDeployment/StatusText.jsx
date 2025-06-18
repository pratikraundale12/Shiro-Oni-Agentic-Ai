import { isEmpty } from 'lodash';
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
  'UPGRADED WITH ERROR': 'red',
  'DOWNGRADED WITH ERROR': 'red',
  'STARTED WITH ERROR': 'red',
  'STOPPED WITH ERROR': 'red',
  REJECTED: 'red',
  'TIME LAPSED': '#F2891F',
};

const StatusTexts = styled.div`
  font-family: 'Red Hat Display', sans-serif;
  font-size: 16px;
  font-weight: 500;
  // line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  // cursor: pointer;
`;
export const StatusText = ({ text = '', item }) => {
  console.log('WWWWWWWWWWWWWWW', text);
  const color = statusColors[text] || statusColors.DEFAULT;
  function capitalizeFirstLetter(text) {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  const tooltipData = !isEmpty(item.approvers) ? (
    item.approvers.map(element => (
      <div key={element.scheduler_id}>
        {capitalizeFirstLetter(element.approver_name)} : &nbsp;
        {element.is_approved === true
          ? 'Approved'
          : element.is_approved === false
            ? 'Not Approved'
            : 'N/A'}{' '}
      </div>
    ))
  ) : (
    <div>{'N/A'}</div>
  );
  return (
    <>
      <StatusTexts color={color} data-tooltip-id={item.scheduler_id}>
        {capitalizeFirstLetter(
          item?.state === 'TIME_LAPSED'
            ? 'Time Lapsed'
            : item?.state === 'IN_PROGRESS'
              ? 'In Progress'
              : text
        )}
      </StatusTexts>{' '}
      <ReactTooltip
        id={item.scheduler_id}
        content={tooltipData}
        place={'left'}
      />
    </>
  );
};

StatusText.propTypes = {
  text: PropTypes.string,
  item: PropTypes.array,
};
