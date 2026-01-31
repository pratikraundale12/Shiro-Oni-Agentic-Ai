import React from 'react';
import styled from 'styled-components';
import { Gauge } from './Gauge';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
  // padding: 40px;
  background-color: #ffffff;
`;

export default function MetricsGauges() {
  const data = [
    { label: 'CPU Utilization', value: 21.0, max: 100, precision: 1 },
    {
      label: 'Memory Utilization',
      value: 65.5,
      max: 100,
      precision: 1,
    },
    {
      label: 'Storage Utilization',
      value: 61.7,
      max: 100,
      precision: 1,
    },
    {
      label: 'Thread Count',
      value: 24,
      max: 100,
      showPercentSymbol: false,
    },
  ];

  return (
    <Container>
      {data.map((item, index) => (
        <Gauge
          key={index}
          value={item.value === 0 ? null : item.value}
          label={item.label}
          {...item}
        />
      ))}
    </Container>
  );
}
