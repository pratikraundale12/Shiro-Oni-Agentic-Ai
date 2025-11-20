import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { ActivityHistoryIcon, OpenLinkIcon } from '../../../assets';
import CopyToClipboard from '../../../shared/CopyToClipboard';
import { TextRender } from './TextRender';
import { isEmpty } from 'lodash';
import { IconButton } from './AtionRender';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-right: 5px;
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
  copy_btn_tooltip,
  tooltipId,
  displayCert = false,
  handleCert = () => {},
  certTitle,
}) => {
  return (
    <Container>
      <TextRender
        text={url}
        capitalizeText={false}
        tooltipPlacement={tooltipPlacement}
      />
      {!isEmpty(url) && (
        <Container>
          <StyledLink
            disabled={isEmpty(url)}
            href={url}
            target="_blank"
            data-tooltip-id={`link-${tooltipId}`}
          >
            <OpenLinkIcon />
          </StyledLink>
          <StyledLink
            disabled={isEmpty(url)}
            data-tooltip-id={`copy-${tooltipId}`}
          >
            <CopyToClipboard copyItem={url} />
          </StyledLink>
          {displayCert && (
            <IconButton
              onClick={e => {
                handleCert();
                e.currentTarget.blur();
              }}
              data-tooltip-id={`download-cert`}
            >
              <ActivityHistoryIcon width={18} height={18} />
            </IconButton>
          )}
        </Container>
      )}
      <ReactTooltip
        id={`link-${tooltipId}`}
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
        id={`copy-${tooltipId}`}
        place="bottom"
        effect="solid"
        // content={'Copy URL '}
        content={copy_btn_tooltip}
        style={{
          width: '150px',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          zIndex: 10000,
        }}
      />
      {displayCert && (
        <ReactTooltip
          id={`download-cert`}
          place="bottom"
          effect="solid"
          content={certTitle}
          style={{
            width: '180px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            zIndex: 10000,
          }}
        />
      )}
    </Container>
  );
};

UrlRender.propTypes = {
  url: PropTypes.string.isRequired,
  tooltipPlacement: PropTypes.string,
  type: PropTypes.string,
  copy_btn_tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  displayCert: PropTypes.bool,
  handleCert: PropTypes.func,
  certTitle: PropTypes.string,
};
