import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { isEmpty } from 'lodash';

const statusColors = {
  PENDING: '#b5b5bd',
  APPROVED: '#0cbf59',
  NOT_APPROVED: 'red',
  'IN PROGRESS': '#444445',
  SCHEDULED: '#F2891F',
  DEPLOYED: '#0cbf59',
  'NOT APPROVED': 'red',
  'N/A': '#b5b5bd',
};

const StatusTexts = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  display: flex;
  align-items: center;
  cursor: pointer;
  div {
    align-items: center;
    height: 8px;
    width: 8px;
    background: ${props => props.color || '#b5b5bd'};
    margin-right: 5px;
    border-radius: 50%;
  }
`;
export const StatusText = ({ text = '', item }) => {
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
        {capitalizeFirstLetter(text)}
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
