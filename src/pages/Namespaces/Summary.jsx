// import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  SmallNotThunderIcon,
  SmallThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { TodoIcon } from '../../assets/Icons/TodoIcon';
import { FullPageLoader } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import CopyToClipboard from '../../shared/CopyToClipboard';
import {
  // LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import { ScheduleDeploymentModal } from '../ScheduleDeployment/ScheduleDeploymentModal';
import ScheduleNamespaceDeploy from '../ScheduleDeployment/ScheduleNamespaceDeploy';
import AddParameterContext from './AddParameterContext';
import Listvariables from './Listvariables';
import NamespaceDeploy from './NamespaceDeploy';
import ParameterContext from './ParameterContext';

const MainContainer = styled.div``;
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
  text-transform: capitalize;
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
  color: #ff7a00;
  position: relative;
  border-bottom: 1px solid #ff7a00;
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

  & > div {
    display: flex;
    gap: 0.5rem;

    & .summary-clipboard {
      margin-top: -0.5rem;
    }
  }

  & span {
    max-width: 18rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
      ${props => (props.isActive ? props.activeColor : '#FF7A00')};
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
  text-align: center;
  background: #ff7a00;
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & span {
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 16px;
    font-weight: 500;
    line-height: 23px;
    margin-left: 8px;
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

export const scheduleSchema = yup.object().shape({
  approver_ids: yup.array().required('Approver is required'),
});

const Summary = () => {
  const dispatch = useDispatch();
  const selectedDestCluster = useSelector(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );

  const formData = useSelector(NamespacesSelectors.getFormData);
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const isDeployedModal = useSelector(NamespacesSelectors.getDeployedModal);
  const [flowControlButtons, setFlowControlButtons] = useState('');
  const [isParameterContextOpen, setIsParameterContextOpen] = useState({
    isOpen: false,
    schedule: false,
  });
  // const isParentEdit = useSelector(NamespacesSelectors.getParameterEditParent);
  const [isAddParameterContextOpen, setIsAddParameterContextOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  // const newlyAddVariables = useSelector(
  //   NamespacesSelectors.getNewlyAddVariables
  // );
  const parameterContextItem = useSelector(
    NamespacesSelectors.getParameterContextItem
  );
  // const newlyAddParameters = useSelector(
  //   NamespacesSelectors.getNewlyAddedParameterContext
  // );

  const [isVariablesModalOpen, setVariablesModalOpen] = useState({
    isOpen: false,
    mode: 'add',
    schedule: false,
  });
  const [loading, setLoading] = useState(false);

  const breadcrumbData = [
    { label: KDFM.NAMESPACE_LIST, path: '/process-group' },
    ...(checkDestCluster?.mode !== 'upgrade'
      ? [{ label: KDFM.SELECT_NAMESPACE, path: '/process-group/deploy' }]
      : []),
    { label: KDFM.CONFIGURATION_DETAILS, path: '/process-group/upgrade' },
    { label: KDFM.SUMMARY },
  ];

  const getParamerterContext = async () => {
    setLoading(true);
    openParameterContext();
    setLoading(false);
  };
  const getScheduleParamerterContext = async () => {
    setIsParameterContextOpen({ isOpen: true, schedule: true });
    dispatch(SchedularActions.setScheduleDeployModal());
  };
  const handleUpgradeClick = async () => {
    dispatch(NamespacesActions.upgradeCluster());
    if (!isEmpty(flowControlButtons)) {
      dispatch(NamespacesActions.updateNamespaceStatus(flowControlButtons));
    }
  };
  const handleDeploy = () => {
    dispatch(NamespacesActions.deployCluster());
  };

  const handleCloseModal = () => {
    history.push('/process-group');
  };

  const openParameterContext = () => {
    setIsParameterContextOpen({ isOpen: true, schedule: false });
    dispatch(NamespacesActions.fetchParameterContext());
  };

  const closeParameterContext = () => {
    setIsParameterContextOpen(prev => ({ ...prev, isOpen: false }));
    if (isParameterContextOpen.schedule) {
      dispatch(SchedularActions.setScheduleDeployModal());
    } else {
      dispatch(NamespacesActions.setDeployedModal());
    }
    // if (isParentEdit?.parent) {
    //   dispatch(NamespacesActions.setDeployedModal());
    // }
    // isParentEdit;
    dispatch(NamespacesActions.setNewlyAddedParameterContext([]));
    dispatch(NamespacesActions.setParameterEditParent(false));
    dispatch(NamespacesActions.setParentParameterList([]));
    // dispatch(NamespacesActions.setDeployedModal()); // adding to open namespace deploy
  };

  const openAddParameterContext = () => {
    setIsAddParameterContextOpen({ isOpen: true, mode: 'add' });
    dispatch(NamespacesActions.setParameterContextItem({}));
    if (isParameterContextOpen.schedule) {
      setIsParameterContextOpen({ isOpen: false, schedule: true });
    } else {
      setIsParameterContextOpen({ isOpen: false, schedule: false });
    }
  };

  const closeAddParameterContext = () => {
    setIsAddParameterContextOpen({ isOpen: false, mode: 'add' });
    dispatch(NamespacesActions.setParameterContextItem({}));
    if (isParameterContextOpen.schedule) {
      setIsParameterContextOpen({ isOpen: true, schedule: true });
    } else {
      setIsParameterContextOpen({ isOpen: true, schedule: false });
    }
  };

  const handleTertiaryButton = async () => {
    dispatch(NamespacesActions.fetchVariableList());
    setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: false });
  };

  const handleScheduleTertiaryButton = async () => {
    setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: true });
    // dispatch(SchedularActions.setScheduleModal());
  };
  const closeVariablesModal = () => {
    setVariablesModalOpen(prev => ({ ...prev, isOpen: false }));
    if (isVariablesModalOpen.schedule) {
      // dispatch(SchedularActions.setScheduleModal());
    } else {
      dispatch(NamespacesActions.setDeployedModal());
    }
  };

  const handleBackClick = () => {
    history.push('/process-group/upgrade');
  };

  const [activeButton, setActiveButton] = useState(null);
  const handleUpdateStatus = status => {
    setActiveButton(status);
    setFlowControlButtons(status);
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
            {`${
              checkDestCluster.mode === 'upgrade'
                ? checkDestCluster?.version <= formData.version
                  ? KDFM.UPGRADE
                  : KDFM.DOWNGRADE
                : KDFM.DEPLOY
            } ${KDFM.NAMESPACE}`}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex mb-3">
        <Breadcrumb module="deploy" path={breadcrumbData} />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className=" pe-1">
          <RowConfig>
            <div className="col-12 p-3">
              <ConfigTitle className="config-title">
                <ConfigTitleHTwo className="p-3 mb-0">
                  <span>{KDFM.SUMMARY}</span>
                </ConfigTitleHTwo>
              </ConfigTitle>
            </div>
            <UseColLg className="col-lg-10 col-12 ">
              <RowConfig className=" p-3">
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      {KDFM.SELECTED_CLUSTER}
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {selectedDestCluster?.label}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      {KDFM.NAMESPACE}
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {checkDestCluster.name}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      {KDFM.REGISTRY_URL}
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      <div>
                        <span>{checkDestCluster.registryUrl}</span>
                        <CopyToClipboard
                          className="summary-clipboard"
                          copyItem={checkDestCluster.registryUrl}
                        />
                      </div>
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      {KDFM.NIFI_URL}
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      <div>
                        <span>{checkDestCluster.nifiUrl}</span>
                        <CopyToClipboard
                          className="summary-clipboard"
                          copyItem={checkDestCluster.nifiUrl}
                        />
                      </div>
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div>
                    <SummaryDetailsHFourTag className="mb-2">
                      {KDFM.CURRENT_VERSION}
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {checkDestCluster.version || 'N/A'}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
                <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                  <div className="summary-details">
                    <SummaryDetailsHFourTag className="mb-2">
                      {KDFM.UPDATED_VERSION}
                    </SummaryDetailsHFourTag>
                    <SummaryDetailsPtag className="mb-0">
                      {formData.version || checkDestCluster.version}
                    </SummaryDetailsPtag>
                  </div>
                </UseColXl>
              </RowConfig>
            </UseColLg>
            {checkDestCluster.mode === 'upgrade' && (
              <>
                <div className="col-12 p-3">
                  <ConfigTitle className="config-title">
                    <ConfigTitleHTwo className="p-3 mb-0">
                      <span>{KDFM.FLOW_CONTROL}</span>
                    </ConfigTitleHTwo>
                  </ConfigTitle>
                </div>
                <UseColLg className="col-lg-10 col-12 ">
                  <RowConfig className="row p-3">
                    <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                      <div className="summary-details">
                        <SummaryDetailsHFourTag className="mb-2">
                          {KDFM.NAMESPACE}
                        </SummaryDetailsHFourTag>
                        <SummaryDetailsPtag className="mb-0">
                          {checkDestCluster.name}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                    <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                      <div className="summary-details">
                        <SummaryDetailsHFourTag className="mb-2">
                          {KDFM.CURRENT_VERSION}
                        </SummaryDetailsHFourTag>
                        <SummaryDetailsPtag className="mb-0">
                          {checkDestCluster.version}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                    <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                      <div className="summary-details">
                        <SummaryDetailsHFourTag className="mb-2">
                          {KDFM.UPDATED_VERSION}
                        </SummaryDetailsHFourTag>
                        <SummaryDetailsPtag className="mb-0">
                          {formData.version || checkDestCluster.version}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                  </RowConfig>
                </UseColLg>
              </>
            )}
          </RowConfig>
          <IconsvgDiv>
            {checkDestCluster.mode === 'upgrade' && (
              <CustomNine className="col-4 mb-3">
                <ActiveButtonContainer className="d-flex ">
                  <TextDiv className="d-flex">
                    <CountDiv
                      className="div-btn-1 mr-2"
                      count={checkDestCluster?.runningCount}
                      activeColor="#58e715"
                    >
                      <TriangleIcons color="#B5BDC8" />
                      <span>{checkDestCluster?.runningCount}</span>
                    </CountDiv>
                    <div>{KDFM.RUNNING_PROCESSORS}</div>
                  </TextDiv>
                  <TextDiv className="d-flex">
                    <CountDiv
                      className="div-btn-2 mr-2"
                      count={checkDestCluster?.stoppedCount}
                      activeColor="#c52b2b"
                    >
                      <SquareBoxIcon color="#B5BDC8" />
                      <span>{checkDestCluster?.stoppedCount}</span>
                    </CountDiv>
                    <div>{KDFM.STOPPED_PROCESSORS}</div>
                  </TextDiv>
                  <TextDiv className="d-flex">
                    <CountDiv
                      className="div-btn-3 mr-2"
                      count={checkDestCluster?.invalidCount}
                      activeColor="#CF9F5D"
                    >
                      <TriangleExclamationMarkIcon color="#B5BDC8" />
                      <span>{checkDestCluster?.invalidCount}</span>
                    </CountDiv>
                    <div>{KDFM.INVALID_PROCESSORS}</div>
                  </TextDiv>
                  <TextDiv className="d-flex">
                    <CountDiv
                      className="div-btn-4 mr-2"
                      count={checkDestCluster?.disabledCount}
                      activeColor="#2c7cf3"
                    >
                      <SmallNotThunderIcon color="#B5BDC8" />
                      <span>{checkDestCluster?.disabledCount}</span>
                    </CountDiv>
                    <div>{KDFM.DISABLED_PROCESSORS}</div>
                  </TextDiv>
                </ActiveButtonContainer>
              </CustomNine>
            )}
            {checkDestCluster.mode === 'upgrade' && (
              <ActiveButtonContainer className="d-flex ">
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-1 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1 "
                      isActive={activeButton === 'RUNNING'}
                      activeColor="#58e715"
                      hoverColor="#58e715"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('RUNNING')}
                    >
                      <TriangleIcons color="#B5BDC8" />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div className="mr-2">{KDFM.RUNNING_FLOW}</div>
                </TextsvgDiv>
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-2 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1"
                      isActive={activeButton === 'STOPPED'}
                      activeColor="#c52b2b"
                      hoverColor="#c52b2b"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('STOPPED')}
                    >
                      <SquareBoxIcon color="#B5BDC8" />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div>{KDFM.STOPPED_FLOW}</div>
                </TextsvgDiv>
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-3 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1"
                      isActive={activeButton === 'ENABLED'}
                      activeColor="#cf9f5d"
                      hoverColor="#cf9f5d"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('ENABLED')}
                    >
                      <SmallThunderIcon color="#B5BDC8" />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div>{KDFM.ENABLED_FLOW}</div>
                </TextsvgDiv>
                <TextsvgDiv className="d-flex">
                  <ActiveButtonDiv className="div-btn-4 mr-2">
                    <ActiveButtonDiv
                      className="div-btn-1"
                      isActive={activeButton === 'DISABLED'}
                      activeColor="#2c7cf3"
                      hoverColor="#2c7cf3"
                      activeTextColor="#fff"
                      onClick={() => handleUpdateStatus('DISABLED')}
                    >
                      <SmallNotThunderIcon color="#B5BDC8" />
                    </ActiveButtonDiv>
                  </ActiveButtonDiv>
                  <div>{KDFM.DISABLED_FLOW}</div>
                </TextsvgDiv>
              </ActiveButtonContainer>
            )}
          </IconsvgDiv>
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
          <Button
            onClick={
              checkDestCluster.mode !== 'upgrade'
                ? handleDeploy
                : handleUpgradeClick
            }
          >
            {checkDestCluster.mode === 'upgrade'
              ? checkDestCluster.version <= formData.version
                ? KDFM.UPGRADE
                : KDFM.DOWNGRADE
              : KDFM.DEPLOY}
          </Button>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => dispatch(SchedularActions.setScheduleModal())}
          >
            Schedule
          </Button>
        </BottomButtonDiv>
        {checkDestCluster.mode === 'upgrade' && (
          <Progressox className="w-100">
            <ProgressLabel className="progress-label">
              {KDFM.UPDATING_FLOW}
            </ProgressLabel>
            <CustomRedProgress className="progress w-100 custom-red-progress">
              <ProgressBar
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${deployOrUpgradeDetails?.percentCompleted || 0}%`,
                }}
                aria-valuenow={40}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {deployOrUpgradeDetails?.percentCompleted || 0}%
              </ProgressBar>
            </CustomRedProgress>
          </Progressox>
        )}
      </BottomButton>
      <ScheduleDeploymentModal />
      <NamespaceDeploy
        isOpen={isDeployedModal}
        closePopup={handleCloseModal}
        openParameterContext={openParameterContext}
        getParamerterContext={getParamerterContext}
        handleTertiaryButton={handleTertiaryButton}
      />
      <ScheduleNamespaceDeploy
        getScheduleParamerterContext={getScheduleParamerterContext}
        handleScheduleTertiaryButton={handleScheduleTertiaryButton}
        flowControlState={flowControlButtons}
      />
      <ParameterContext
        isParameterContextOpen={isParameterContextOpen}
        key={isParameterContextOpen.isOpen}
        isOpen={isParameterContextOpen.isOpen}
        closePopup={closeParameterContext}
        openAddParameterContext={openAddParameterContext}
        setIsAddParameterContextOpen={setIsAddParameterContextOpen}
        setIsParameterContextOpen={setIsParameterContextOpen}
        getParamerterContext={getParamerterContext}
        parameterContextId={deployOrUpgradeDetails?.parameterContextId}
      />
      <AddParameterContext
        key={isParameterContextOpen.mode}
        isParameterContextOpen={isParameterContextOpen}
        parameterContextItem={parameterContextItem}
        isAddParameterContextOpen={isAddParameterContextOpen}
        closePopup={closeAddParameterContext}
        setIsAddParameterContextOpen={setIsAddParameterContextOpen}
        setIsParameterContextOpen={setIsParameterContextOpen}
      />
      <Listvariables
        isOpen={isVariablesModalOpen}
        closePopup={closeVariablesModal}
        isVariablesModalOpen={isVariablesModalOpen}
        setVariablesModalOpen={setVariablesModalOpen}
        handleTertiaryButton={handleTertiaryButton}
      />
    </MainContainer>
  );
};

export default Summary;
