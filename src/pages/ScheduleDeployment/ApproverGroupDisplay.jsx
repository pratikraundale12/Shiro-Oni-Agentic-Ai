import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';

const TextColor = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 400;
  text-transform: ${props => (props.capitalizeText ? 'capitalize' : 'none')};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  z-index: 2;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

export const ApproverGroupDisplay = ({
  item,
  capitalizeText = true,
  tooltipPlacement = 'right',
  toolTip = true,
  ...rest
}) => {
  const textToRender =
    typeof text === 'number'
      ? String(item?.approver_group)
      : item?.approver_group;

  function capitalizeFirstLetter(text) {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const tooltipData = !isEmpty(item.groupUsersData) ? (
    item.groupUsersData.map(element => (
      <div key={element.id}>{capitalizeFirstLetter(element.username)}</div>
    ))
  ) : (
    <div>{'N/A'}</div>
  );
  return (
    <TextColor {...rest} capitalizeText={capitalizeText}>
      <span data-tooltip-id={item.id}>{textToRender}</span>

      {toolTip && (
        <ReactTooltip
          id={item.id}
          content={tooltipData}
          place={tooltipPlacement}
          positionStrategy="fixed"
          style={{
            zIndex: 9999,
          }}
        />
      )}
    </TextColor>
  );
};

ApproverGroupDisplay.propTypes = {
  item: PropTypes.object,
  capitalizeText: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  toolTip: PropTypes.bool,
};
