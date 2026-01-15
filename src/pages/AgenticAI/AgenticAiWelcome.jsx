import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { CardLogo, WelcomeCenterLogo } from '../../assets';

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: ${props => (props.isFullscreen ? '1000px' : '90%')};
  margin: 0 auto;
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Greeting = styled.h1`
  font-size: ${props => (props.isFullscreen ? '32px' : '22px')};
  font-weight: 500;
  color: #616161;
  margin-bottom: ${props => (props.isFullscreen ? '80px' : '50px')};
  text-align: center;
  min-height: 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DynamicText = styled.span`
  display: block;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  color: #444445;
`;

const CardsRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => (props.isFullscreen ? '24px' : '12px')};
`;

const StaticCard = styled.div`
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 12px;
  padding: ${props => (props.isFullscreen ? '24px' : '16px')};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: ${props => (props.isFullscreen ? '160px' : '120px')};
  cursor: default;
  gap: ${props => (props.isFullscreen ? '36px' : '12px')};
`;

const CardText = styled.span`
  font-size: ${props => (props.isFullscreen ? '16px' : '13px')};
  color: #666;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
`;

export const AgenticAiWelcome = ({ isFullscreen }) => {
  const dynamicMessages = [
    'Fix invalid process groups.',
    'Get process groups on a cluster.',
    'Know more about NiFi',
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % dynamicMessages.length);
    }, 3500);

    return () => clearInterval(intervalId);
  }, [dynamicMessages.length]);

  const cardData = [
    { id: 1, text: 'Get your cluster list' },
    { id: 2, text: 'Know more about DFM' },
    { id: 3, text: 'Get memory utilization' },
  ];

  return (
    <WelcomeContainer isFullscreen={isFullscreen}>
      <WelcomeCenterLogo />

      <Greeting isFullscreen={isFullscreen}>
        <DynamicText key={messageIndex}>
          {dynamicMessages[messageIndex]}
        </DynamicText>
      </Greeting>

      <CardsRow isFullscreen={isFullscreen}>
        {cardData.map(item => (
          <StaticCard key={item.id} isFullscreen={isFullscreen}>
            <CardLogo />
            <CardText isFullscreen={isFullscreen}>{item.text}</CardText>
          </StaticCard>
        ))}
      </CardsRow>
    </WelcomeContainer>
  );
};

AgenticAiWelcome.propTypes = {
  isFullscreen: PropTypes.bool.isRequired,
};
