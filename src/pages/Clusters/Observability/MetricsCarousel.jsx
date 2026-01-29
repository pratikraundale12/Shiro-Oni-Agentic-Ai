import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import MetricCard from './MetricCard';

const Container = styled.div`
  background: #fcfcfc;
  border-bottom: 1px solid #f0f0f0;
`;

const CarouselWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  padding: 10px 0;
`;

const CardTrack = styled(motion.div)`
  display: flex;
  gap: 16px;
  padding: 10px 5px;
`;

const BarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
`;

const ProgressBar = styled.div`
  width: 25px;
  height: 4px;
  background: ${({ $active }) => ($active ? '#ff7a00' : '#e2e8f0')};
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.3s ease;
`;

const METRIC_CARDS = [
  {
    id: 1,
    label: 'CPU Utilization',
    value: '21.0%',
    color: '#48bb78',
    trend: '2.3%',
    isDown: true,
    type: 'ring',
  },
  {
    id: 2,
    label: 'Memory Utilization',
    value: '45.5%',
    color: '#48bb78',
    trend: '1.2%',
    isDown: false,
    type: 'ring',
  },
  {
    id: 3,
    label: 'Node Storage',
    value: '51.7%',
    color: '#ff7a00',
    trend: '3.5%',
    isDown: false,
    type: 'ring',
  },
  { id: 5, label: 'Max CPU', value: '21.7%', color: '#48bb78', type: 'ring' },
  {
    id: 6,
    label: 'Max Memory',
    value: '45.8%',
    color: '#48bb78',
    type: 'ring',
  },
  {
    id: 7,
    label: 'Max Storage',
    value: '51.7%',
    color: '#ff7a00',
    type: 'ring',
  },
  {
    id: 4,
    label: 'Pods Created',
    value: 'N/A',
    color: '#9f7aea',
    type: 'text',
  },
  {
    id: 8,
    label: 'Pods Evicted',
    value: '2',
    color: '#ff7a00',
    trend: '+1',
    isDown: false,
    type: 'text',
  },
];

/* ---------- component ---------- */

export const MetricsCarousel = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const visibleCount = 4;
  const maxIndex = METRIC_CARDS.length - visibleCount;

  const nextSlide = useCallback(() => {
    setIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  return (
    <Container>
      <CarouselWrapper>
        <CardTrack
          animate={{ x: `calc(-${index * 25}% - ${index * 12}px)` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {METRIC_CARDS.map(card => (
            <MetricCard key={card.id} data={card} onHover={setIsHovered} />
          ))}
        </CardTrack>

        <BarContainer>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <ProgressBar
              key={i}
              $active={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </BarContainer>
      </CarouselWrapper>
    </Container>
  );
};
