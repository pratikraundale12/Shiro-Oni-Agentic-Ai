import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { OpenLinkIcon } from '../../../assets';
import CopyToClipboard from '../../../shared/CopyToClipboard';
import { TextRender } from './TextRender';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
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
      <TextRender text={url} capitalizeText={false} />
      <Container>
        <StyledLink href={url} target="_blank">
          <OpenLinkIcon />
        </StyledLink>
        <CopyToClipboard copyItem={url} />
      </Container>
    </Container>
  );
};

UrlRender.propTypes = {
  url: PropTypes.string.isRequired,
};
