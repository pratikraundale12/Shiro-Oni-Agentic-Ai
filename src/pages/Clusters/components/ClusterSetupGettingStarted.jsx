import React from 'react';
import styled from 'styled-components';
import {
  ManageClusterIcon,
  ManageConfigGearIcon,
  SSHCredentialsPaperIcon,
} from '../../../assets';
const Container = styled.div`
  height: calc(100% - 57px);
`;
const HighlightTextTop = styled.span`
  font-family: Noto Sans;
  font-weight: 600;
  font-size: 36px;
  line-height: 49.03px;
  letter-spacing: 0%;
`;
const HeadingText = styled.span`
  font-family: Red Hat Display;
  font-weight: 600;
  font-size: 24px;
  line-height: 31.75px;
  letter-spacing: 0%;
  text-align: center;
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
  color: #444445;
`;
const ClusterSetupGettingStartedTab = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center w-100 ">
      <div className="d-flex justify-content-center w-100 mb-3">
        <div className="col-md-8 d-flex flex-column justify-content-center text-center">
          <div>
            <HighlightTextTop>Getting Started</HighlightTextTop>
          </div>
          <div>
            <HeadingText>This is demo text which will be updated</HeadingText>
          </div>
        </div>
      </div>
      <div className="row w-100 px-lg-5">
        <div className="col-md-6 col-xl-4">
          <div className="d-flex row align-items-center  h-100 mx-auto">
            <LeftHolder className="col-auto align-items-center justify-content-center h-100 ">
              <ManageClusterIcon height="60" width="60" color={'black'} />
            </LeftHolder>
            <RightHolder className="col h-100 row">
              <div className="col-10 h-100">
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <HighLightText>Cluster & Node Details</HighLightText>
                </div>
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <BottomText>Add Cluster & Node Details</BottomText>
                </div>
              </div>
            </RightHolder>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="d-flex row align-items-center  h-100 mx-auto">
            <LeftHolder className="col-auto align-items-center justify-content-center h-100 ">
              <SSHCredentialsPaperIcon height="60" width="60" color={'black'} />
            </LeftHolder>
            <RightHolder className="col h-100 row">
              <div className="col-10 h-100">
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <HighLightText>SSH Credentials</HighLightText>
                </div>
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <BottomText>Add SSH Credentials</BottomText>
                </div>
              </div>
            </RightHolder>
          </div>
        </div>
        <div className="col-md-6 col-xl-4">
          <div className="d-flex row align-items-center  h-100 mx-auto">
            <LeftHolder className="col-auto align-items-center justify-content-center h-100 ">
              <ManageConfigGearIcon height="60" width="60" color={'black'} />
            </LeftHolder>
            <RightHolder className="col h-100 row">
              <div className="col-10 h-100">
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <HighLightText>Manage Config Profile</HighLightText>
                </div>
                <div className="h-50 d-flex align-items-center justify-content-start">
                  <BottomText>Manage & Create Config file</BottomText>
                </div>
              </div>
            </RightHolder>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default ClusterSetupGettingStartedTab;
