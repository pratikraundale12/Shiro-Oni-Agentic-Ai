import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// Styled components based on the provided CSS
const MainTableDiv = styled.div`
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
  color: var(--col-0CBF59);
  &::after {
    background-color: var(--col-0CBF59);
  }
`;

const RedInactive = styled(ActiveTd)`
  color: var(--col-error);
  &::after {
    background-color: var(--col-error);
  }
`;

// Usage in your component
export const StatusRender = ({ status }) => {
  return (
    <MainTableDiv>
      {status === 'Active' ? (
        <GreenActiveness>{status}</GreenActiveness>
      ) : (
        <RedInactive>{status}</RedInactive>
      )}
    </MainTableDiv>
  );
};

StatusRender.propTypes = {
  status: PropTypes.string,
};
