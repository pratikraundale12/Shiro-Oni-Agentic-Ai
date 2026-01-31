import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SIZE = 240;
const INNER_STROKE = 24;
const OUTER_STROKE = 3;
const INNER_RADIUS = 85;
const GAP = 0;
const OUTER_RADIUS = INNER_RADIUS + INNER_STROKE / 2 + GAP + OUTER_STROKE / 2;

const CIRCUMFERENCE = Math.PI * INNER_RADIUS;
const OUTER_CIRC = Math.PI * OUTER_RADIUS;

const GaugeWrapper = styled.div`
  width: ${SIZE}px;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SvgContainer = styled.svg`
  overflow: visible;
`;

const CenterContent = styled.div`
  margin-top: -45px;
  text-align: center;
  z-index: 2;
`;

export const Gauge = ({
  value = 0,
  max = 100,
  label,
  showPercentSymbol = true,
  precision = 1,
}) => {
  const isNoData = value === null || value === undefined;

  // 1. Normalize the value against the max
  const normalizedValue = isNoData ? 0 : (value / max) * 100;
  const clampedValue = Math.min(100, Math.max(0, normalizedValue));

  // 2. Determine Severity based on normalized percentage
  const color = isNoData
    ? '#52c41a'
    : clampedValue <= 60
      ? '#52c41a'
      : clampedValue <= 80
        ? '#faad14'
        : '#f5222d';

  const progress = (clampedValue / 100) * CIRCUMFERENCE;

  // Format display value: use precision for decimals, or toLocaleString for large numbers
  const displayValue = isNoData
    ? 'No data'
    : value.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });

  return (
    <GaugeWrapper>
      <SvgContainer
        width={SIZE}
        height={SIZE / 2 + 20}
        viewBox={`0 0 ${SIZE} ${SIZE / 2 + 20}`}
      >
        <g transform={`translate(${SIZE / 2}, ${SIZE / 2 + 10})`}>
          {/* Inner Background Track */}
          <path
            d={`M -${INNER_RADIUS} 0 A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 1 ${INNER_RADIUS} 0`}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={INNER_STROKE}
          />
          {/* Progress Arc */}
          <path
            d={`M -${INNER_RADIUS} 0 A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 1 ${INNER_RADIUS} 0`}
            fill="none"
            stroke={color}
            strokeWidth={INNER_STROKE}
            strokeDasharray={`${progress}, ${CIRCUMFERENCE}`}
            style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.5s' }}
          />

          {/* Outer Threshold Rings (Mapped to 60/80/100 segments) */}
          <path
            d={`M -${OUTER_RADIUS} 0 A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${OUTER_RADIUS} 0`}
            fill="none"
            stroke="#52c41a"
            strokeWidth={OUTER_STROKE}
            strokeDasharray={`${OUTER_CIRC * 0.6}, ${OUTER_CIRC}`}
          />
          <path
            d={`M -${OUTER_RADIUS} 0 A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${OUTER_RADIUS} 0`}
            fill="none"
            stroke="#faad14"
            strokeWidth={OUTER_STROKE}
            strokeDasharray={`${OUTER_CIRC * 0.2}, ${OUTER_CIRC}`}
            strokeDashoffset={-(OUTER_CIRC * 0.6)}
          />
          <path
            d={`M -${OUTER_RADIUS} 0 A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${OUTER_RADIUS} 0`}
            fill="none"
            stroke="#f5222d"
            strokeWidth={OUTER_STROKE}
            strokeDasharray={`${OUTER_CIRC * 0.2}, ${OUTER_CIRC}`}
            strokeDashoffset={-(OUTER_CIRC * 0.8)}
          />
        </g>
      </SvgContainer>

      <CenterContent>
        <div style={{ fontSize: '24px', fontWeight: 800, color: color }}>
          {displayValue}
          {!isNoData && showPercentSymbol ? '%' : ''}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#8c8c8c',
            marginTop: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      </CenterContent>
    </GaugeWrapper>
  );
};

Gauge.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.string,
  showPercentSymbol: PropTypes.bool,
  precision: PropTypes.number,
};
