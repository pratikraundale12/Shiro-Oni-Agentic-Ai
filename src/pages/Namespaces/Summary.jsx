import React, { useState } from 'react';
import styled from 'styled-components';
import { TodoIcon } from '../../assets/Icons/TodoIcon';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import NamespaceDeploy from './NamespaceDeploy';
// import AddParameterContext from './AddParameterContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  SmallNotThunderIcon,
  SmallThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  // TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { FullPageLoader } from '../../components';
import {
  deployCluster,
  fetchParameterContext,
  fetchVariables,
  getClusterProgress,
  getClusterProgressDelete,
  getCountDetails,
  updateNamespaceStatus,
  upgradeCluster,
} from '../../store';
import { useGlobalContext } from '../../utils';
import Listvariables from './Listvariables';
import AddParameterContext from './AddParameterContext';
import ParameterContext from './ParameterContext';

const MainContainer = styled.div`
  // height: calc(100vh - 78px);
  // width: calc(100vw - 250px);
  // overflow: hidden;
  // padding: 37px 50px 22px 20px;
  // --bs-bg-opacity: 1;
  // background-color: white !important;
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
const ActiveButtonContainer = styled.div`
  gap: 7px;
  justify-content: center;
  flex-direction: column;
`;

const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #dde4f0;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: 1px solid
      ${props => (props.isActive ? props.activeColor : '#c52b2b')};
  }

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }

  svg path {
    fill: ${props => (props.isActive ? props.activeColor : '#b5bdc8')};
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
const CountDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #dde4f0;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    color: #b5bdc8;
  }

  svg path {
    fill: ${props => (props.count > 0 ? props.activeColor : '#b5bdc8')};
  }
`;
const CustomNine = styled.div`
  margin-bottom: 1rem !important;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-4 {
    flex: 0 0 auto;
    width: 33%;
    text-align: end;
  }
`;
const IconsvgDiv = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
`;
const TextsvgDiv = styled.div`
  display: flex;
  align-items: center;
`;
const TextDiv = styled.div`
  display: flex;
  align-items: center;
`;

const breadcrumbData = [
  { id: '1', name: 'Namespace List', path: '/namespaces' },
  { id: '2', name: 'Select Namespace', path: '/namespaces/deploy' },
  { id: '3', name: 'Configuration Details', path: '/namespaces/upgrade' },
  { id: '4', name: 'Summary' },
];

const Summary = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isParameterContextOpen, setIsParameterContextOpen] = useState(false);
  const [isAddParameterContextOpen, setIsAddParameterContextOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const [parameterContextItem, setParameterContextItem] = useState({});
  const [isVariablesModalOpen, setVariablesModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const { state, setState } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const handleBreadcrumbClick = breadcrumb => {
    navigate(breadcrumb.path);
  };

  const getParamerterContext = async () => {
    try {
      setLoading(true);
      openParameterContext();
      const response = await fetchParameterContext(
        state.selectedClusterId,
        state.deployCountDetails?.data?.parameterContextId ||
          state?.updatedCount?.parameterContextId
      );
      const data = response.data;

      console.log(data.version);
      setState(prevState => ({
        ...prevState,
        parameterDetails: response,
        parameterVersion: response.data.version,
      }));
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching parameter context:', error.message);
    }
  };

  const handleUpgradeClick = async () => {
    try {
      const response = await upgradeCluster({
        clusterId: state.selectedClusterId,
        namespaceId: state?.upgradeData?.id,
        version: state.selectedVersion,
      });
      setLoading(true);
      if (response) {
        let progressData;
        const intervalId = setInterval(async () => {
          progressData = await getClusterProgress({
            clusterId: state.selectedClusterId,
            progressId: response.requestId,
          });
          setProgress(progressData.percentCompleted);

          if (progressData.percentCompleted >= 100) {
            clearInterval(intervalId);

            await getClusterProgressDelete({
              clusterId: state.selectedClusterId,
              progressId: response.requestId,
            });
            const countDetails = await getCountDetails({
              clusterId: state.selectedClusterId,
              namespaceId: state?.upgradeData?.id,
            });
            setState(prevState => ({
              ...prevState,
              updatedCount: countDetails,
            }));
            setModalOpen(true);
          }
        }, 1000);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Upgrade failed:', error.message);
    }
  };

  const handleDeploy = async () => {
    try {
      const result = await deployCluster({
        namespaceId: state.depolyNamespaceId?.id,
        clusterId: state.selectedClusterId,
        flowId: state?.deployData?.flowId,
        bucketId: state?.deployData?.bucketId,
        bucketName: state?.deployData.bucketName,
        registryId: state?.deployData?.registryId,
        version: state.selectedVersion,
      });
      setLoading(true);
      setState(prevState => ({
        ...prevState,
        deployCountDetails: result,
      }));
      setLoading(false);
      setModalOpen(true);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleCloseModal = () => {
    setState(prevState => ({
      ...prevState,
      // selectedSourceClusterId: null,
      selectedPaths: [],
      selectedClusterId: null,
      selectedVersion: null,
      // deployCountDetails: result,
      deployNamespaceId: null,
      // selectedClusterId: null,
      deployData: {
        flowId: null,
        bucketId: null,
        bucketName: null,
        registryId: null,
        version: null,
      },
      upgradeData: {},
      updatedCount: null,
    }));
    navigate('/namespaces');
    setModalOpen(false);
  };

  const openParameterContext = () => {
    setIsParameterContextOpen(true);
    setModalOpen(false);
  };

  const closeParameterContext = () => {
    setIsParameterContextOpen(false);
    setModalOpen(true);
  };

  const openAddParameterContext = () => {
    setIsAddParameterContextOpen({ isOpen: true, mode: 'add' });
    setParameterContextItem({});
    setIsParameterContextOpen(false);
  };

  const closeAddParameterContext = () => {
    setIsAddParameterContextOpen({ isOpen: false, mode: 'add' });
    setParameterContextItem({});
    setIsParameterContextOpen(true);
  };

  const handleTertiaryButton = async () => {
    const response = await fetchVariables(
      state?.selectedDestinationClusterId,
      state?.deployCountDetails?.data?.id || state?.updatedCount?.id
    );

    if (response) {
      setState(prevState => ({
        ...prevState,
        variablesDetail: response?.data,
      }));
      setVariablesModalOpen(true);
      setModalOpen(false);
    } else {
      toast.error(response.message);
    }
    setVariablesModalOpen(true);
    setModalOpen(false);
  };

  const closeVariablesModal = () => {
    setVariablesModalOpen(false);
    setModalOpen(true);
  };

  const handleBackClick = () => {
    navigate('/namespaces/upgrade');
  };

  const [activeButton, setActiveButton] = useState(null);

  const handleUpdateStatus = async (status, buttonId) => {
    try {
      await updateNamespaceStatus(
        state.selectedClusterId,
        state?.upgradeData?.id || state.deployCountDetails?.data?.id,
        status
      );
      setActiveButton(buttonId);
      toast.success(`Namespace status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(`Failed to update namespace status to ${status}`);
    }
  };

  return (
    <MainContainer className="main-space bg-white">
      <FullPageLoader loading={loading} />
      <TopTitleBar className="d-flex mb-3">
        <MainTitleDiv className="d-flex">
          <div>
            <TodoIcon />
          </div>
          <MainTitleHfour className="mb-0">
            {state?.upgradeData?.mode !== 'upgrade' ? 'Deploy' : 'Upgrade'}{' '}
            Namespace
          </MainTitleHfour>
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
                      {state.selectedClusterName}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Namespace
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {state?.upgradeData?.name || state?.deployData?.name}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Registry URL
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {state?.upgradeData?.registryUrl ||
                        state?.deployData?.registryUrl}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      NiFi URL
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {state?.upgradeData?.nifiUrl ||
                        state?.deployData?.nifiUrl}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      Current Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {state?.upgradeData?.version || 'N/A'}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      Updated Version
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {state.selectedVersion}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
              </RowConfig>
            </UseColLg>
            {/* versions */}
            {state?.upgradeData?.mode && (
              <>
                <div className="col-12 p-3">
                  <ConfigTitle className="config-title">
                    <ConfigTitleHTwo className="p-3 mb-0">
                      <span>Flow Control</span>
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
                          {state?.upgradeData?.name}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                    <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                      <div className="summary-details">
                        <SummaryDetailsHFourTag className="mb-2">
                          Current Version
                        </SummaryDetailsHFourTag>
                        <SummaryDetailsPtag className="mb-0">
                          {state?.upgradeData?.version}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                    <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                      <div className="summary-details">
                        <SummaryDetailsHFourTag className="mb-2">
                          Updated Version
                        </SummaryDetailsHFourTag>
                        <SummaryDetailsPtag className="mb-0">
                          {state.selectedVersion}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                  </RowConfig>
                </UseColLg>
              </>
            )}
          </RowConfig>
          <IconsvgDiv>
            {state?.upgradeData?.mode && (
              <CustomNine className="col-4 mb-3">
                <ActiveButtonContainer className="d-flex ">
                  <TextDiv className="d-flex">
                    {' '}
                    <CountDiv
                      className="div-btn-1 mr-2"
                      count={
                        state?.deployCountDetails?.data?.runningCount ||
                        state?.upgradeData?.runningCount
                      }
                      activeColor="#58e715"
                    >
                      <TriangleIcons color="#B5BDC8" />
                      <span>
                        {state?.deployCountDetails?.data?.runningCount ||
                          state?.upgradeData?.runningCount}
                      </span>
                    </CountDiv>
                    <div>Running Processors</div>
                  </TextDiv>
                  <TextDiv className="d-flex">
                    <CountDiv
                      className="div-btn-2 mr-2"
                      count={
                        state?.upgradeData?.stoppedCount ||
                        state?.deployCountDetails?.data?.stoppedCount
                      }
                      activeColor="#c52b2b"
                    >
                      <SquareBoxIcon color="#B5BDC8" />
                      <span>
                        {state?.upgradeData?.stoppedCount ||
                          state?.deployCountDetails?.data?.stoppedCount}
                      </span>
                    </CountDiv>
                    <div>Stopped Processors</div>
                  </TextDiv>
                  <TextDiv className="d-flex">
                    <CountDiv
                      className="div-btn-3 mr-2"
                      count={
                        state?.upgradeData?.invalidCount ||
                        state?.deployCountDetails?.data?.invalidCount
                      }
                      activeColor="#CF9F5D"
                    >
                      <TriangleExclamationMarkIcon color="#B5BDC8" />
                      <span>
                        {state?.upgradeData?.invalidCount ||
                          state?.deployCountDetails?.data?.invalidCount}
                      </span>
                    </CountDiv>
                    <div>Invalid Processors</div>
                  </TextDiv>
                  <TextDiv className="d-flex">
                    <CountDiv
                      className="div-btn-4 mr-2"
                      count={
                        state?.upgradeData?.disabledCount ||
                        state?.deployCountDetails?.data?.disabledCount
                      }
                      activeColor="#2c7cf3"
                    >
                      <SmallNotThunderIcon color="#B5BDC8" />
                      <span>
                        {state?.deployCountDetails?.data?.disabledCount ||
                          state?.upgradeData?.disabledCount}
                      </span>
                    </CountDiv>
                    <div>Disabled Processors</div>
                  </TextDiv>
                </ActiveButtonContainer>
              </CustomNine>
            )}
            {state?.upgradeData?.mode && (
              <ActiveButtonContainer className="d-flex ">
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-1 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1 "
                      isActive={activeButton === 'RUNNING'}
                      activeColor="#58e715"
                      hoverColor="#58e715"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('RUNNING', 'RUNNING')}
                    >
                      <TriangleIcons color="#B5BDC8" />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div className="mr-2">Running Flow</div>
                </TextsvgDiv>
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-2 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1"
                      isActive={activeButton === 'STOPPED'}
                      activeColor="#c52b2b"
                      hoverColor="#c52b2b"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('STOPPED', 'STOPPED')}
                    >
                      <SquareBoxIcon
                        color="#B5BDC8"
                        onClick={() => handleUpdateStatus('STOPPED')}
                      />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div>Stopped Flow</div>
                </TextsvgDiv>
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-3 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1"
                      isActive={activeButton === 'ENABLED'}
                      activeColor="#cf9f5d"
                      hoverColor="#cf9f5d"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('ENABLED', 'ENABLED')}
                    >
                      <SmallThunderIcon
                        color="#B5BDC8"
                        onClick={() => handleUpdateStatus('ENABLED')}
                      />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div>Enabled Flow</div>
                </TextsvgDiv>
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-4 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1"
                      isActive={activeButton === 'DISABLED'}
                      activeColor="#2c7cf3"
                      hoverColor="#2c7cf3"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('DISABLED', 'DISABLED')}
                    >
                      <SmallNotThunderIcon
                        color="#B5BDC8"
                        onClick={() => handleUpdateStatus('DISABLED')}
                      />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div>Disabled Flow</div>
                </TextsvgDiv>
              </ActiveButtonContainer>
            )}
          </IconsvgDiv>
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            Back
          </Button>
          <Button
            onClick={
              state?.upgradeData?.mode !== 'upgrade'
                ? handleDeploy
                : handleUpgradeClick
            }
          >
            {state?.upgradeData?.mode !== 'upgrade' ? 'Deploy' : 'Upgrade'}
          </Button>
        </BottomButtonDiv>
        {state?.upgradeData?.mode && (
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
        )}
      </BottomButton>
      <NamespaceDeploy
        isOpen={isModalOpen}
        closePopup={handleCloseModal}
        setModalOpen={setModalOpen}
        openParameterContext={openParameterContext}
        getParamerterContext={getParamerterContext}
        handleTertiaryButton={handleTertiaryButton}
      />
      <ParameterContext
        key={isParameterContextOpen}
        isOpen={isParameterContextOpen}
        closePopup={closeParameterContext}
        openAddParameterContext={openAddParameterContext}
        setIsAddParameterContextOpen={setIsAddParameterContextOpen}
        setIsParameterContextOpen={setIsParameterContextOpen}
        setParameterContextItem={setParameterContextItem}
      />
      <AddParameterContext
        key={isParameterContextOpen.mode}
        parameterContextItem={parameterContextItem}
        isAddParameterContextOpen={isAddParameterContextOpen}
        closePopup={closeAddParameterContext}
        setIsAddParameterContextOpen={setIsAddParameterContextOpen}
        setIsParameterContextOpen={setIsParameterContextOpen}
      />
      <Listvariables
        isOpen={isVariablesModalOpen}
        closePopup={closeVariablesModal}
        setVariablesModalOpen={setVariablesModalOpen}
      />
    </MainContainer>
  );
};

export default Summary;
