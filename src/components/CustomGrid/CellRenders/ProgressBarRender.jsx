/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../../../styles';

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 20px;

  & > div:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  & > div:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const Indicator = styled.div`
  height: 12px;
  width: ${props => props.width}%;
  transition: width 0.2s ease-in-out;
  background-color: ${props => props.color || props.theme.colors.background};
`;

export const ProgressBarRender = ({ is_active, count, maxCount }) => {
  const width = (1 / maxCount) * 100;
  const isStandalone = count === 0 && maxCount === 0 && is_active;

  return (
    <ProgressContainer>
      {isStandalone ? (
        <Indicator width={100} color={theme.colors.success} />
      ) : (
        Array(maxCount)
          .fill()
          .map((_, i) => (
            <Indicator
              key={i}
              width={width}
              color={
                i < count ? theme.colors.success : theme.colors.primaryDisabled
              }
            />
          ))
      )}
    </ProgressContainer>
  );
};

ProgressBarRender.propTypes = {
  is_active: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
};
