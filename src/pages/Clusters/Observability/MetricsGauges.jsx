import React from 'react';
import styled from 'styled-components';
import { Gauge } from './Gauge';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 48px;
  padding: 40px;
  background-color: #ffffff;
`;

export default function MetricsGauges() {
  const data = [
    {
      label: 'Small Precision',
      value: 0.0004668,
      max: 0.001,
      precision: 7,
      showPercentSymbol: false,
    },
    { label: 'Average CPU Utilization', value: 21.0, max: 100, precision: 1 },
    {
      label: 'Average Memory Utilization',
      value: 65.5,
      max: 100,
      precision: 1,
    },
    {
      label: 'Average Node + Storage Utilization',
      value: 81.7,
      max: 100,
      precision: 1,
    },
    { label: 'Average Pods Created', value: 0 }, // Represents "No data"
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
