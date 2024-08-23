import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { OpenLinkIcon } from '../../../assets';
import CopyToClipboard from '../../../shared/CopyToClipboard';
// import { theme } from '../../../styles';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const StyleUrl = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledLink = styled.a`
  min-width: 32px;
  min-height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.border};
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const UrlRender = ({ url }) => {
  return (
    <Container>
      <StyleUrl data-tooltip-id={url}>{url}</StyleUrl>
      <Container>
        <StyledLink href={url} target="_blank">
          {/* <LinkIcon color={theme.colors.primary} /> */}
          <OpenLinkIcon />
        </StyledLink>
        <CopyToClipboard copyItem={url} />
      </Container>
      <ReactTooltip id={url} content={url} place="bottom" />
    </Container>
  );
};

UrlRender.propTypes = {
  url: PropTypes.string.isRequired,
};
