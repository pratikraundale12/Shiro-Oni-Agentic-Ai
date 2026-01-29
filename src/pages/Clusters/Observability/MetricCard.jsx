import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CardItem = styled(motion.div)`
  min-width: calc(25% - 12px);
  height: 150px;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const MetricBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ValueSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainValue = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ $color }) => $color};
`;

const TrendBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${({ $isDown }) => ($isDown ? '#f0fff4' : '#fff5f5')};
  color: ${({ $isDown }) => ($isDown ? '#38a169' : '#e53e3e')};
  width: fit-content;
`;

const VisualCircle = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 6px solid #f7fafc;
  }
`;

const ProgressRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 6px solid ${({ $color }) => $color};
  clip-path: inset(0 0 0 50%);
  transform: rotate(${({ $percent }) => $percent * 3.6 - 90}deg);
`;

const RingValue = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
`;

const MetricCard = ({ data, onHover }) => {
  const numericValue = parseFloat(data.value);

  return (
    <CardItem
      whileHover={{
        y: -4,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <MetricHeader>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        {data.label}
      </MetricHeader>

      <MetricBody>
        <ValueSection>
          <MainValue $color={data.value === 'N/A' ? '#a0aec0' : data.color}>
            {data.value}
          </MainValue>

          {data.trend && (
            <TrendBadge $isDown={data.isDown}>
              {data.isDown ? '↓' : '↑'} {data.trend}
            </TrendBadge>
          )}
        </ValueSection>

        {data.type === 'ring' && !Number.isNaN(numericValue) && (
          <VisualCircle>
            <ProgressRing $color={data.color} $percent={numericValue} />
            <RingValue style={{ color: data.color }}>{data.value}</RingValue>
          </VisualCircle>
        )}
      </MetricBody>
    </CardItem>
  );
};

MetricCard.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    color: PropTypes.string,
    trend: PropTypes.string,
    isDown: PropTypes.bool,
    type: PropTypes.oneOf(['ring', 'text']),
  }).isRequired,
  onHover: PropTypes.func.isRequired,
};

export default React.memo(MetricCard);
