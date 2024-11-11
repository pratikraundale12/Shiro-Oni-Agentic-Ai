import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

// Styled components based on the provided CSS
const Container = styled.div`
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 500;
  .action-td {
    gap: 8px;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const ActiveTd = styled.div`
  font-weight: var(--fw-500);
  line-height: 19.36px;
  letter-spacing: -0.005em;
  padding-left: 20px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0px;
    top: 7px;
    height: 7px;
    width: 7px;
    border-radius: 100%;
  }
`;

const GreenActiveness = styled(ActiveTd)`
  color: ${props => props.theme.colors.success};
  text-transform: capitalize;
  &::after {
    background-color: ${props => props.theme.colors.success};
  }
`;

const RedInactive = styled(ActiveTd)`
  color: #808080;
  text-transform: capitalize;
  &::after {
    background-color: #808080;
  }
`;

// Usage in your component
export const StatusRender = ({ status }) => {
  const statusText = status?.toLowerCase();
  return (
    <Container>
      {['active', 'connected', 'success'].includes(statusText) ? (
        <GreenActiveness>{statusText}</GreenActiveness>
      ) : (
        <RedInactive>{statusText}</RedInactive>
      )}
    </Container>
  );
};

StatusRender.propTypes = {
  status: PropTypes.string,
};
