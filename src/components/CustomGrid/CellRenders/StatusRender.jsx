import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Styled components based on the provided CSS
const Container = styled.div`
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 500;
  .action-td {
    gap: 8px;
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
  &::after {
    background-color: ${props => props.theme.colors.success};
  }
`;

const RedInactive = styled(ActiveTd)`
  color: ${props => props.theme.colors.error};
  &::after {
    background-color: ${props => props.theme.colors.error};
  }
`;

// Usage in your component
export const StatusRender = ({ status }) => {
  return (
    <Container>
      {['Active', 'Connected'].includes(status) ? (
        <GreenActiveness>{status}</GreenActiveness>
      ) : (
        <RedInactive>{status}</RedInactive>
      )}
    </Container>
  );
};

StatusRender.propTypes = {
  status: PropTypes.string,
};
