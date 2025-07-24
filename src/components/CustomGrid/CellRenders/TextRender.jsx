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
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const TextDispalyEllipses = styled.span`
  max-width: 12ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
`;

// Helper function to parse HTML content safely
const parseHTMLContent = text => {
  if (!text || typeof text !== 'string') return text;

  // Check if text contains HTML tags
  const hasHTMLTags = /<[^>]*>/g.test(text);
  if (!hasHTMLTags) return text;

  // Parse <strong> tags specifically
  const strongRegex = /<strong>(.*?)<\/strong>/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = strongRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the bold text
    parts.push(<strong key={`strong-${keyCounter++}`}>{match[1]}</strong>);

    lastIndex = strongRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 1 ? parts : text;
};

// Helper function to strip HTML tags for tooltip
const stripHTMLTags = text => {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/<[^>]*>/g, '');
};

export const TextRender = ({
  text,
  capitalizeText = true,
  tooltipPlacement = 'right',
  toolTip = true,
  ListForTooltip = null,
  withEllipses = false,
  ...rest
}) => {
  const originalText = text ? text : 'N/A';
  const textToRender =
    typeof originalText === 'number' ? String(originalText) : originalText;

  // Parse HTML content for display
  const parsedContent = parseHTMLContent(textToRender);

  // Clean text for tooltip (remove HTML tags)
  const cleanTextForTooltip = stripHTMLTags(textToRender);

  // Use clean text for tooltip ID to avoid issues with HTML characters
  const tooltipId = `tooltip-${cleanTextForTooltip.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <TextColor
      {...rest}
      capitalizeText={capitalizeText}
      data-tooltip-id={tooltipId}
    >
      {withEllipses ? (
        <TextDispalyEllipses>
          {Array.isArray(parsedContent) ? (
            <span>{parsedContent}</span>
          ) : (
            parsedContent
          )}
        </TextDispalyEllipses>
      ) : (
        <span>
          {Array.isArray(parsedContent) ? parsedContent : parsedContent}
        </span>
      )}

      {toolTip && (
        <ReactTooltip
          id={tooltipId}
          content={ListForTooltip ? ListForTooltip : cleanTextForTooltip}
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
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  capitalizeText: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  toolTip: PropTypes.bool,
  ListForTooltip: PropTypes.string,
  withEllipses: PropTypes.bool,
};
