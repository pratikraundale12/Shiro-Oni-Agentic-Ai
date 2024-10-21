/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { CLUSTER_STATUS } from '../../../constants/index';
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
  background-color: #b8b7b7;
`;

export const ProgressBarRender = ({ is_active, count, maxCount, status }) => {
  const width = (1 / maxCount) * 100;
  const isStandalone = count === 0 && maxCount === 0 && is_active;

  if (status === CLUSTER_STATUS.DEACTIVATED) {
    return null;
  }

  if (status === CLUSTER_STATUS.DISCONNECTED) {
    return (
      <ProgressContainer>
        <Indicator width={100} color={theme.colors.error} />
      </ProgressContainer>
    );
  }

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
              color={i < count ? theme.colors.success : theme.colors.error}
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
  status: PropTypes.string.isRequired,
};
