import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../styles';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-right: 5px;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
`;

const AnimatedProgressBar = ({
  width = '100%',
  color = theme.colors.primary,
  id = null,
}) => {
  return (
    <Container>
      <div
        className="progress"
        style={{ height: '13px', width: 'inherit' }}
        data-tooltip-id={`progress-${id}`}
      >
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: width, backgroundColor: color }}
        />
      </div>
      <ReactTooltip
        id={`progress-${id}`}
        place="bottom"
        effect="solid"
        content="View progress"
        style={{
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          zIndex: 10000,
        }}
      />
    </Container>
  );
};
AnimatedProgressBar.propTypes = {
  width: PropTypes.string,
  color: PropTypes.string,
  id: PropTypes.string,
};
export default AnimatedProgressBar;
