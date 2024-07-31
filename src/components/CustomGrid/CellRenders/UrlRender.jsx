import React from 'react';
import PropTypes from 'prop-types';
import { LinkIcon } from '../../../assets';
import styled from 'styled-components';
import { theme } from '../../../styles';
import { IconButton } from './AtionRender';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledIconButton = styled(IconButton)`
  margin-left: 10px;
`;

export const UrlRender = ({ url }) => {
  return (
    <Container>
      <span>{url}</span>
      <StyledIconButton>
        <LinkIcon color={theme.colors.primary} />
      </StyledIconButton>
    </Container>
  );
};

UrlRender.propTypes = {
  url: PropTypes.string.isRequired,
};
