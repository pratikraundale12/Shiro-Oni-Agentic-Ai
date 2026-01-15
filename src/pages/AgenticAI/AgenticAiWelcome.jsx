import React from 'react';
import styled from 'styled-components';
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

const Greeting = styled.h1`
  font-size: ${props => (props.isFullscreen ? '32px' : '22px')};
  font-weight: 500;
  color: #616161;
  margin-bottom: ${props => (props.isFullscreen ? '80px' : '50px')};
  text-align: center;
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
  const data = [
    { id: 1, text: 'Know more about NiFi' },
    { id: 2, text: 'Know more about DFM' },
    { id: 3, text: 'Know more about NiFi' },
  ];

  return (
    <WelcomeContainer isFullscreen={isFullscreen}>
      <WelcomeCenterLogo />

      <Greeting isFullscreen={isFullscreen}>How may I help you?</Greeting>

      <CardsRow isFullscreen={isFullscreen}>
        {data.map(item => (
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
