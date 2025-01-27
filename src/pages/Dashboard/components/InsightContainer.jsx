/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { DashboardSelectors } from '../../../store';

const Container = styled.div`
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
  height: 100%;
  cursor: pointer;
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
  selectedNamespace,
}) => {
  const dashboardData = useSelector(DashboardSelectors.getDashboardData);
  const getActiveCluster = localStorage.getItem('selected_cluster');
  const handleClick = () => {
    if (selectedNamespace?.value) {
      const updatedUrl = dashboardData?.namespaces?.nifiUrl.endsWith('/nifi')
        ? `${dashboardData?.namespaces?.nifiUrl}?processGroupId=${selectedNamespace?.value}`
        : `${dashboardData?.namespaces?.nifiUrl}/nifi?processGroupId=${selectedNamespace?.value}`;
      window.open(updatedUrl, '_blank');
    } else {
      const updatedUrl = dashboardData?.namespaces?.nifiUrl?.endsWith('/nifi')
        ? dashboardData?.namespaces?.nifiUrl
        : `${dashboardData?.namespaces?.nifiUrl}/nifi`;
      window.open(updatedUrl, '_blank');
    }
  };

  return (
    <Container className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6">
      <InnerContainer
        backgroundCss={backgroundCss}
        onClick={getActiveCluster?.label ? handleClick : undefined}
        data-tooltip-id={`tooltip-${text}`}
        style={{ cursor: getActiveCluster?.label ? 'pointer' : 'not-allowed' }}
      >
        <IconContainer>
          <Icon />
        </IconContainer>
        <CountDisplay>
          <CountNumber>{count}</CountNumber>
        </CountDisplay>
        <InsightText>{text}</InsightText>
      </InnerContainer>
      {getActiveCluster?.label && (
        <ReactTooltip
          id={`tooltip-${text}`}
          place="top"
          effect="solid"
          content={`Click on ${text} to view details`}
        />
      )}
    </Container>
  );
};

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
