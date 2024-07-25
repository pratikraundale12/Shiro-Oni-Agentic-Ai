import React from 'react';
import styled from 'styled-components';
import { TodoIcon } from '../../assets/Icons/TodoIcon';
import { LessArrowIcon } from '../../assets';
import { Button } from '../../shared';

const MainContainer = styled.div`
  height: calc(100vh - 78px);
  width: calc(100vw - 250px);
  overflow: hidden;
  padding: 37px 50px 22px 20px;
  --bs-bg-opacity: 1;
  background-color: white !important;
`;
const TopTitleBar = styled.div`
  height: 37px;
  align-items: center;
  justify-content: space-between !important;
`;
const MainTitleDiv = styled.div`
  gap: 10px;
  align-items: center;
`;
const MainTitleHfour = styled.h4`
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  color: #444445;
`;
const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;

const BreadcrumbItem = styled.span`
  cursor: pointer;

  &.active {
    color: #c52b2b;
  }
`;
const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 22px 19px;
  border-radius: 20px;
`;
const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const RowConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: -1rem;
  margin-left: -1rem;
`;
const ConfigTitle = styled.div`
  border-bottom: 1px solid #dde4f0;
`;
const ConfigTitleHTwo = styled.div`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #c52b2b;
  position: relative;
  border-bottom: 1px solid #c52b2b;
  width: fit-content;
`;
const UseColLg = styled.div`
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }
  @media (min-width: 992px) {
    &.col-lg-10 {
      flex: 0 0 auto;
      width: 83.33333333%;
    }
  }
`;
const UseColXl = styled.div`
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
  @media screen and (min-width: 1200px) {
    &.col-xl-4 {
      flex: 0 0 auto;
      width: 33.33333333%;
    }
  }

  padding-right: 1rem;
  padding-left: 1rem;
`;

const SummaryDetailsHFourTag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #2d343f;
`;
const SummaryDetailsPtag = styled.h4`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #7a7a7a;
`;
const ButtonContainer = styled.div`
  gap: 7px;
  align-items: center;
  justify-content: center;
`;
const ActiveButtonDiv = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #dde4f0;
  border-radius: 8px;
  // background-color: #f5f7fa;
  cursor: pointer;
  background-color: white !important;

  &:hover {
    border: 1px solid #c52b2b;
  }
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
`;
const Progressox = styled.div`
  padding-left: 43px;
`;
const ProgressLabel = styled.h5`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  text-align: left;
  color: #444445;
  margin-bottom: 4px;
`;
const CustomRedProgress = styled.div`
  background: #56585c;
  border-radius: 50px;
  height: 18.88px;
`;
const ProgressBar = styled.div`
  text-align: end;
  background: #c52b2b;
  padding: 0px;
  border-radius: 50px;
`;

const Summary = () => {
  return (
    <MainContainer className="main-space bg-white">
      <TopTitleBar className="d-flex mb-3">
        <MainTitleDiv className="d-flex">
          <div>
            <TodoIcon />
          </div>
          <MainTitleHfour className="mb-0">Upgrade Namespace</MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex mb-3">
        <BreadcrumbItem className="cursor-pointer">
          Namespace List
        </BreadcrumbItem>
        <LessArrowIcon />
        <BreadcrumbItem className="cursor-pointer">
          Select Namespace
        </BreadcrumbItem>
        <LessArrowIcon />
        <BreadcrumbItem>Configuration Details</BreadcrumbItem>
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className=" pe-1">
          <RowConfig>
            <div className="col-12 p-3">
              <ConfigTitle className="config-title">
                <ConfigTitleHTwo className="p-3 mb-0">
                  <span>Summary</span>
                </ConfigTitleHTwo>
              </ConfigTitle>
            </div>
            <UseColLg className="col-lg-10 col-12 ">
              <RowConfig className=" p-3">
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Selected Cluster
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      Production Cluster
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Namespace
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      Kafka to Hive
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Registry URL
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      https://localhost:18080/nifi-registry/
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      NiFi URL+
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      https://localhost:8445/nifi/
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Current Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">V4</SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Updated Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">V5</SummaryDetailsPtag>
                  </div>
                </UseColXl>
              </RowConfig>
            </UseColLg>
            {/* versions */}
            <div className="col-12 p-3">
              <ConfigTitle className="config-title">
                <ConfigTitleHTwo className="p-3 mb-0">
                  <span>Version Settings</span>
                </ConfigTitleHTwo>
              </ConfigTitle>
            </div>
            <UseColLg className="col-lg-10 col-12 ">
              <RowConfig className="row p-3">
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Namespace
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      Kafka to Hive
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Current Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">V4</SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Updated Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">V5</SummaryDetailsPtag>
                  </div>
                </UseColXl>
              </RowConfig>
            </UseColLg>
          </RowConfig>
          <ButtonContainer className="d-flex active-buttons-container">
            <ActiveButtonDiv className="div-btn-1">
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 13.4645V2.53687C4 2.01325 4.57597 1.69402 5.02 1.97154L13.7621 7.4354C14.1799 7.69647 14.1799 8.30493 13.7621 8.56607L5.02 14.0299C4.57597 14.3074 4 13.9882 4 13.4645Z"
                  fill="#B5BDC8"
                />
              </svg>
            </ActiveButtonDiv>
            <ActiveButtonDiv className="div-btn-2">
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2.66667C2 2.29848 2.29848 2 2.66667 2H13.3333C13.7015 2 14 2.29848 14 2.66667V13.3333C14 13.7015 13.7015 14 13.3333 14H2.66667C2.29848 14 2 13.7015 2 13.3333V2.66667Z"
                  fill="#B5BDC8"
                />
              </svg>
            </ActiveButtonDiv>
            <ActiveButtonDiv className="div-btn-3">
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.57727 1.99946L14.9281 12.9995C15.1123 13.3183 15.003 13.7261 14.6841 13.9101C14.5828 13.9687 14.4678 13.9995 14.3508 13.9995H1.64909C1.2809 13.9995 0.982422 13.701 0.982422 13.3328C0.982422 13.2157 1.01323 13.1008 1.07174 12.9995L7.4226 1.99946C7.60667 1.6806 8.0144 1.57135 8.33327 1.75544C8.4346 1.81396 8.5188 1.89812 8.57727 1.99946ZM7.33327 10.6661V11.9995H8.6666V10.6661H7.33327ZM7.33327 5.99946V9.33282H8.6666V5.99946H7.33327Z"
                  fill="#B5BDC8"
                />
              </svg>
            </ActiveButtonDiv>
            <ActiveButtonDiv className="div-btn-4">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width={24} height={24} fill="white" />
                <path d="M13 5V11H16L11 19V13H8L13 5Z" fill="#B5BDC8" />
                <line
                  y1="-0.25"
                  x2="18.4889"
                  y2="-0.25"
                  transform="matrix(0.487754 0.872981 -0.462814 0.886455 7.62793 3.19922)"
                  stroke="#B5BDC8"
                  strokeWidth="0.5"
                />
              </svg>
            </ActiveButtonDiv>
          </ButtonContainer>
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary">Back</Button>
          <Button>Upgrade</Button>
        </BottomButtonDiv>
        {/* progress-bar */}
        <Progressox className="w-100">
          <ProgressLabel className="progress-label">
            Updating Flow
          </ProgressLabel>
          <CustomRedProgress className="progress w-100 custom-red-progress">
            <ProgressBar
              className="progress-bar"
              role="progressbar"
              style={{ width: '40%' }}
              aria-valuenow={40}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              40%
            </ProgressBar>
          </CustomRedProgress>
        </Progressox>
      </BottomButton>
    </MainContainer>
  );
};

export default Summary;
