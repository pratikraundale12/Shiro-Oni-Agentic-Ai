import React, { useState } from 'react';
import styled from 'styled-components';
import { TodoIcon } from '../../assets/Icons/TodoIcon';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import NamespaceDeploy from './NamespaceDeploy';
// import AddParameterContext from './AddParameterContext';
import {
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import ParameterContext from './ParameterContext';
import AddParameterContext from './AddParameterContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getClusterProgress,
  getClusterProgressDelete,
  getCountDetails,
  upgradeCluster,
} from '../../utils/services';

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
  height: 21.88px;
`;
const ProgressBar = styled.div`
  color: white;
  text-align: end;
  background: #c52b2b;
  padding: 0px;
  border-radius: 50px;
`;

const Summary = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isParameterContextOpen, setIsParameterContextOpen] = useState(false);
  const [isAddParameterContextOpen, setIsAddParameterContextOpen] =
    useState(false);
  const [progress, setProgress] = useState(0);
  const [countDetails, setCountDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    upgradeData,
    selectedVersion,
    selectedClusterName,
    selectedClusterId,
  } = location.state || {};
  console.log({ selectedVersion }, '195');
  const breadcrumbData = [
    { id: '1', name: 'Namespace List' },
    { id: '2', name: 'Select Namespace' },
    { id: '3', name: 'Configuration Details' },
  ];
  const handleBreadcrumbClick = breadcrumb => {
    console.log('Breadcrumb clicked:', breadcrumb);
  };
  const handleUpgradeClick = async () => {
    try {
      const response = await upgradeCluster({
        clusterId: selectedClusterId,
        namespaceId: upgradeData?.id,
        version: selectedVersion,
      });

      if (response) {
        let progressData;
        const intervalId = setInterval(async () => {
          progressData = await getClusterProgress({
            clusterId: selectedClusterId,
            progressId: response.requestId,
          });
          setProgress(progressData.percentCompleted);

          if (progressData.percentCompleted >= 100) {
            clearInterval(intervalId);

            await getClusterProgressDelete({
              clusterId: selectedClusterId,
              progressId: response.requestId,
            });
            const countDetails = await getCountDetails({
              clusterId: selectedClusterId,
              namespaceId: upgradeData?.id,
            });
            console.log('Count details:', countDetails);
            setCountDetails(countDetails);
            setModalOpen(true);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const openParameterContext = () => {
    setIsParameterContextOpen(true);
    setModalOpen(false);
  };

  const closeParameterContext = () => {
    setIsParameterContextOpen(false);
  };

  const openAddParameterContext = () => {
    setIsAddParameterContextOpen(true);
    setIsParameterContextOpen(false);
  };

  const closeAddParameterContext = () => {
    setIsAddParameterContextOpen(false);
  };
  const handleBackClick = () => {
    navigate('/namespaces/upgrade');
  };

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
        <Breadcrumb
          breadcrumbs={breadcrumbData}
          onBreadcrumbClick={handleBreadcrumbClick}
        />
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
                      {selectedClusterName}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Namespace
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {upgradeData?.name}
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
                    <SummaryDetailsPtag className="mb-0">
                      {upgradeData?.version}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Updated Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {selectedVersion}
                    </SummaryDetailsPtag>
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
                      {upgradeData?.name}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Current Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {upgradeData?.version}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Updated Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {selectedVersion}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
              </RowConfig>
            </UseColLg>
          </RowConfig>
          <ButtonContainer className="d-flex active-buttons-container">
            <ActiveButtonDiv className="div-btn-1">
              <TriangleIcons color="#B5BDC8" />
            </ActiveButtonDiv>
            <ActiveButtonDiv className="div-btn-2">
              <SquareBoxIcon color="#B5BDC8" />
            </ActiveButtonDiv>
            <ActiveButtonDiv className="div-btn-3">
              <TriangleExclamationMarkIcon color="#B5BDC8" />
            </ActiveButtonDiv>
            <ActiveButtonDiv className="div-btn-4">
              <SmallNotThunderIcon color="#B5BDC8" />
            </ActiveButtonDiv>
          </ButtonContainer>
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            Back
          </Button>
          <Button onClick={handleUpgradeClick}>Upgrade</Button>
        </BottomButtonDiv>
        <Progressox className="w-100">
          <ProgressLabel className="progress-label">
            Updating Flow
          </ProgressLabel>
          <CustomRedProgress className="progress w-100 custom-red-progress">
            <ProgressBar
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={40}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {progress}%
            </ProgressBar>
          </CustomRedProgress>
        </Progressox>
      </BottomButton>
      <NamespaceDeploy
        isOpen={isModalOpen}
        closePopup={handleCloseModal}
        setModalOpen={setModalOpen}
        openParameterContext={openParameterContext}
        countDetails={countDetails}
        upgradeData={upgradeData}
        selectedVersion={selectedVersion}
        selectedClusterName={selectedClusterName}
      />
      <ParameterContext
        isOpen={isParameterContextOpen}
        closePopup={closeParameterContext}
        openAddParameterContext={openAddParameterContext}
      />
      <AddParameterContext
        isOpen={isAddParameterContextOpen}
        closePopup={closeAddParameterContext}
      />
    </MainContainer>
  );
};

export default Summary;
