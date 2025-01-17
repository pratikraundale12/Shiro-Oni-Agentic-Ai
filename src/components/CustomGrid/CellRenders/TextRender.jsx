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

export const TextRender = ({
  text,
  capitalizeText = true,
  tooltipPlacement = 'right',
  toolTip = true,
  ListForTooltip = null,
  ...rest
}) => {
  const textToRender = typeof text === 'number' ? String(text) : text;
  return (
    <TextColor
      {...rest}
      capitalizeText={capitalizeText}
      data-tooltip-id={textToRender}
    >
      <span>{textToRender}</span>

      {toolTip && (
        <ReactTooltip
          id={textToRender}
          content={ListForTooltip ? ListForTooltip : textToRender}
          place={tooltipPlacement}
          positionStrategy="fixed"
          style={{
            width: 'max-content',
            maxWidth: '355px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: 9999,
          }}
        />
      )}
    </TextColor>
  );
};

TextRender.propTypes = {
  text: PropTypes.string,
  capitalizeText: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  toolTip: PropTypes.bool,
  ListForTooltip: PropTypes.string,
};
