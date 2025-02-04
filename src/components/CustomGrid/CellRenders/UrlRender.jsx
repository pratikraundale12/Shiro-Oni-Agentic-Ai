import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { OpenLinkIcon } from '../../../assets';
import CopyToClipboard from '../../../shared/CopyToClipboard';
import { TextRender } from './TextRender';
import { isEmpty } from 'lodash';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const StyledLink = styled.a`
  min-width: 32px;
  min-height: 32px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

export const UrlRender = ({
  url,
  tooltipPlacement = 'bottom',
  type,
  copy_btn_tooltip,
  tooltipId,
}) => {
  const linkIconTooltipId =
    tooltipId?.length > 0 ? tooltipId : `link-tooltip-${url}`;
  const copyIconTooltipId =
    tooltipId?.length > 0 ? `copy-tooltip-${tooltipId}` : `copy-tooltip-${url}`;
  return (
    <Container>
      <TextRender
        text={url}
        capitalizeText={false}
        tooltipPlacement={tooltipPlacement}
      />
      <Container>
        <StyledLink
          disabled={!url?.length}
          href={url}
          target="_blank"
          data-tooltip-id={linkIconTooltipId}
        >
          <OpenLinkIcon />
        </StyledLink>
        <StyledLink disabled={!url?.length} data-tooltip-id={copyIconTooltipId}>
          <CopyToClipboard copyItem={url} />
        </StyledLink>
      </Container>
      <ReactTooltip
        id={linkIconTooltipId}
        place="bottom"
        effect="solid"
        content={'Navigate to URL'}
        style={{
          width: '140px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          zIndex: 10000,
        }}
      />
      <ReactTooltip
        id={copyIconTooltipId}
        place="bottom"
        effect="solid"
        // content={'Copy URL '}
        content={`${!isEmpty(copy_btn_tooltip) ? copy_btn_tooltip : type === 'Registry' ? 'Copy registry URL' : 'Copy cluster URL'}`}
        style={{
          width: '150px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          zIndex: 10000,
        }}
      />
    </Container>
  );
};

UrlRender.propTypes = {
  url: PropTypes.string.isRequired,
  tooltipPlacement: PropTypes.string,
  type: PropTypes.string,
  copy_btn_tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
};
