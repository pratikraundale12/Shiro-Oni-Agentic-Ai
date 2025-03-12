import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;
const SetupClusterWrapper = ({ children, setAtiveTab, activeTab }) => {
  return (
    <Wrapper>
      <Title title={'Add New Cluster Details'} />
      <Container>
        <ClusterSetupNavigationTab
          setAtiveTab={setAtiveTab}
          activeTab={activeTab}
        />
        {children}
      </Container>
    </Wrapper>
  );
};
SetupClusterWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
  setAtiveTab: PropTypes.func,
};
export default SetupClusterWrapper;
