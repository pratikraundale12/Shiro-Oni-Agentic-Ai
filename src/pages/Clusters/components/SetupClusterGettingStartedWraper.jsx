/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import ClusterSetupGettingStartedTab from './ClusterSetupGettingStarted';
import { Button } from '../../../shared';
import { useDispatch } from 'react-redux';
import { KDFM } from '../../../constants';
import { history } from '../../../helpers/history';
import { ClustersActions } from '../../../store';
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
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const SetupClusterGettingStartedWrapper = ({ activeTab }) => {
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <Title title={'Add New Cluster'} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <ClusterSetupGettingStartedTab />
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              history.push(`/clusters`);
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            onClick={() => {
              dispatch(
                ClustersActions.setActiveTabClusterSetup('manage_config')
              );
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
SetupClusterGettingStartedWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default SetupClusterGettingStartedWrapper;
