import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  height: fit-content;
  padding-left: 8px;
  padding-right: 8px;
`;

const InnerContainer = styled.div`
  border-radius: 15px;
  border: 1px solid #e9e0e0;
  padding: 16px 13px;
  font-weight: 600;
  line-height: 23.81px;
  color: #444445;
  background-color: ${props => props.backgroundCss || 'white'};
  position: relative;
`;

const IconContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  border: 1px solid #e9e0e0;
  margin-top: -30px;
  background-color: white;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CountDisplay = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

const CountNumber = styled.h5`
  font-size: 28px;
  font-weight: 500;
  line-height: 38.14px;
  margin-left: 77px;
  margin-top: -10px !important;
`;

const InsightText = styled.p`
  margin-top: 20px;
`;

export const InsightContainer = ({
  backgroundCss = '#f1f5ff',
  icon: Icon,
  count = '',
  text = '',
}) => (
  <Container className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6">
    <InnerContainer
      backgroundCss={backgroundCss}
      // className={`main-box  w-100 h-100 position-relative ${backgroundCss}`}
    >
      <IconContainer>
        <Icon />
      </IconContainer>
      <CountDisplay>
        <CountNumber>{count}</CountNumber>
      </CountDisplay>
      <InsightText>{text}</InsightText>
    </InnerContainer>
  </Container>
);
InsightContainer.propTypes = {
  backgroundCss: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  text: PropTypes.string,
};

InsightContainer.defaultProps = {
  count: '',
  text: '',
};
