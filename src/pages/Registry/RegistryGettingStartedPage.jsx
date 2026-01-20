/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
// import { ClustersActions, ClustersSelectors } from '../store';
import { Button } from '../../shared';
import { Title } from '../Clusters/components/Title';
import { ClustersActions, ClustersSelectors } from '../../store';
import RegistryNavigationTab from './RegistryNavigationTab';
import {
  ClusterDetailsIcon,
  GettingStartedIcon,
  ManageConfigIcon,
  ManageKubeClusterIcon,
} from '../../assets';
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
const HighlightTextTop = styled.span`
  font-family: Noto Sans;
  font-weight: 600;
  font-size: 36px;
  line-height: 49.03px;
  letter-spacing: 0%;
`;
const ContainerGettingStarted = styled.div`
  height: calc(100% - 57px);
`;

const LeftHolder = styled.div`
  padding: 35px 16px;
`;
const RightHolder = styled.div`
  padding: 26px 5px;
`;

const HighLightText = styled.span`
  font-family: Noto Sans;
  font-weight: 600;
  font-size: 20px;
  line-height: 27.24px;
  letter-spacing: 0%;
  color: #444445;
`;
const BottomText = styled.span`
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  line-height: 21.17px;
  letter-spacing: 0%;
  color: ${({ linkColor }) => (linkColor ? `#ff7a00` : `#444445`)};
`;
const RegistryCreationGettingStarted = ({ activeTab }) => {
  const dispatch = useDispatch();
  const lastVisit = useSelector(ClustersSelectors.getlastVisitedTab);

  return (
    <Wrapper>
      <Title title={'Add New Registry'} />
      <Container>
        <RegistryNavigationTab activeTab={activeTab} />
        {/*  */}

        <ContainerGettingStarted className="d-flex flex-column justify-content-center align-items-center w-100 ">
          <div className="d-flex justify-content-center w-100 mb-3">
            <div className="col-md-8 d-flex flex-column justify-content-center text-center">
              <div>
                <GettingStartedIcon /> <br />
                <HighlightTextTop>{KDFM.GETTING_STARTED}</HighlightTextTop>
              </div>
            </div>
          </div>
          <div className="row w-100 px-lg-5">
            {' '}
            <div className="col-md-6 col-xl-4">
              <div className="d-flex row align-items-center  h-100 mx-auto">
                <LeftHolder className="col-auto align-items-center justify-content-center h-100 ">
                  <ManageKubeClusterIcon
                    height="75"
                    width="75"
                    color={'black'}
                  />
                </LeftHolder>
                <RightHolder className="col h-100 row">
                  <div className="col-10 h-100">
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <HighLightText>Kubernetes Configuration</HighLightText>
                    </div>
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <BottomText>Manage Kubernetes Configuration</BottomText>
                    </div>
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <BottomText
                        linkColor={true}
                        onClick={() =>
                          history.push('/registry-management/kube-config')
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        Kubernetes Configuration
                      </BottomText>
                    </div>
                  </div>
                </RightHolder>
              </div>
            </div>
            <div className="col-md-6 col-xl-4">
              <div className="d-flex row align-items-center  h-100 mx-auto">
                <LeftHolder className="col-auto align-items-center justify-content-center h-100 ">
                  <ManageConfigIcon height="75" width="75" color={'black'} />
                </LeftHolder>
                <RightHolder className="col h-100 row">
                  <div className="col-10 h-100">
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <HighLightText> Registry Configuration</HighLightText>
                    </div>
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <BottomText>Manage Registry Configuration</BottomText>
                    </div>
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <BottomText
                        linkColor={true}
                        onClick={() =>
                          history.push('/registry-management/configuration')
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        Registry Configuration
                      </BottomText>
                    </div>
                  </div>
                </RightHolder>
              </div>
            </div>{' '}
            <div className="col-md-6 col-xl-4">
              <div className="d-flex row align-items-center  h-100 mx-auto">
                <LeftHolder className="col-auto align-items-center justify-content-center h-100 ">
                  <ClusterDetailsIcon height="75" width="75" color={'black'} />
                </LeftHolder>
                <RightHolder className="col h-100 row">
                  <div className="col-10 h-100">
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <HighLightText>Cluster Details</HighLightText>
                    </div>
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <BottomText>Manage Cluster Details</BottomText>
                    </div>
                    <div className="h-50 d-flex align-items-center justify-content-start">
                      <BottomText
                        linkColor={true}
                        onClick={() =>
                          history.push('/registry-management/details')
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        {KDFM.CLUSTER_DETAILS}
                      </BottomText>
                    </div>
                  </div>
                </RightHolder>
              </div>
            </div>
          </div>
        </ContainerGettingStarted>

        {/*  */}
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              history.back();
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            onClick={() => {
              history.push('/registry-management/kube-config');
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
RegistryCreationGettingStarted.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default RegistryCreationGettingStarted;
