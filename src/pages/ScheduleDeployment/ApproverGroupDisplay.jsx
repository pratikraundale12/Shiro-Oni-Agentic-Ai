import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles';

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

const TooltipContent = styled.div`
  max-height: 150px;
  overflow-y: auto;
  position: fixed;
  transform: translateX(-50%);
  padding: 8px;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 9999;
  &::before {
    content: ' ';
    position: absolute;
    top: 50%;
    left: -8px;
    margin-top: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent #333 transparent transparent;
  }
`;

export const ApproverGroupDisplay = ({
  item,
  capitalizeText = true,
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

  const CustomTooltip = ({ children, content, placement = 'top' }) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, right: 0 });

    const handleMouseEnter = e => {
      const rect = e.target.getBoundingClientRect();

      const tooltipPosition = {
        top: placement === 'top' ? rect.top - 30 : rect.bottom + 10,
        left: rect.right + 75,
      };

      setPosition(tooltipPosition);
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    return (
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          verticalAlign: 'middle',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}

        {visible && toolTip && (
          <TooltipContent style={{ top: position.top, left: position.left }}>
            {content}
          </TooltipContent>
        )}
      </div>
    );
  };

  return (
    <TextColor {...rest} capitalizeText={capitalizeText}>
      {item?.action_by ? (
        <span>{item?.action_by}</span>
      ) : (
        <CustomTooltip content={tooltipData}>
          <span
            data-tooltip-id={item.id}
            style={{ color: theme.colors.primary }}
          >
            {textToRender}
          </span>
        </CustomTooltip>
      )}
    </TextColor>
  );
};

ApproverGroupDisplay.propTypes = {
  item: PropTypes.object,
  capitalizeText: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  toolTip: PropTypes.bool,
  children: PropTypes.any,
  content: PropTypes.any,
  placement: PropTypes.string,
};
