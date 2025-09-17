import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ControllerServicesIcon,
  InvalidProcessorIcon,
  ParameterContextIcon,
  ScheduleDetailsIcon,
  TodoIcon,
  VariablesIcon,
} from '../../assets';
import { FullPageLoader } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, Modal } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux.js';
import ControllerServiceTab from '../ControllerService/ControllerServiceTab';
import ParameterContextTab from './ParameterContextTab';
import ScheduleDeploymentTab from './ScheduleDetailsPage.jsx';
import VariableTab from './VariableTab';

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
  @media screen and (max-width: 1400px) {
    font-size: 16px !important;
  }
`;
const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
  @media screen and (max-width: 1400px) {
    & svg {
      height: 20px;
    }
  }
`;

const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 5px 10px 0px 10px;
  border-radius: 20px;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;
const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  font: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'rgba(68, 68, 69, 1)'};
  border-color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'transparent'};
  &:hover {
    color: rgba(255, 122, 0, 1);
  }
`;

const TabContent = styled.div`
  width: 100%;
  padding: 0px 0.5rem;
  border-radius: 0.25rem;
`;

const IconContentV2 = styled.div`
  display: inline;
  margin-right: 6px;

  svg path {
    transition: stroke 0.3s;
  }

  ${Tab}:hover & svg path {
    stroke: rgba(255, 122, 0, 1);
  }
`;

const TabLabelWithIcon = styled.div`
  position: relative;
  display: inline-block;
  padding-right: 16px; /* give space for the icon */
`;

const TopRightIcon = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
`;

const ConfigDetailsPage = () => {
  const dispatch = useDispatch();
  const breadcrumbDataOnDeploy = [
    {
      label: KDFM.NIFI_FLOW,
      path: '/process-group',
      callback: () => {
        dispatch(NamespacesActions.setSelectedNamespace({}));
      },
    },
    { label: 'Registry & Flow Name', path: '/process-group/deployPage' },
    { label: 'Flow Details', path: '/process-group/flow-details' },
    { label: 'Configuration Details' },
  ];
  const scheduleStartFlow = useSelector(
    NamespacesSelectors.getScheduleStartFlow
  );
  const scheduleFlowType = useSelector(NamespacesSelectors.getScheduleFlowType);
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const breadcrumbDataOnUpgrade = scheduleStartFlow
    ? [
        {
          label: 'Process Group Details',
          path: `/process-group/${selectedNameSpace?.id}`,
        },
        { label: 'Configuration Details' },
      ]
    : [
        {
          label: KDFM.NIFI_FLOW,
          path: '/process-group',
          callback: () => {
            dispatch(NamespacesActions.setSelectedNamespace({}));
          },
        },
        { label: 'Flow Details', path: '/process-group/flow-details' },
        { label: 'Configuration Details' },
      ];

  const scheduleDeploymentFlow = useSelector(
    NamespacesSelectors.getScheduleByRegistry
  );
  const scheduleUpgradeFromList = useSelector(
    SchedularSelectors.getScheduleFromList
  );
  const controlSelectedStored = useSelector(
    NamespacesSelectors.getflowControlStateAtScheduleDeploy
  );
  const [controllerServicePayload, setControllerServicePayload] = useState({});
  const [activeTab, setActiveTab] = useState(KDFM.PARAMETER_CONTEXT);
  const [scheduleDeployTime, setScheduleDeployTime] = useState(null);
  const [activeButton, setActiveButton] = useState(controlSelectedStored);
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);
  const [scheduleErrors, setScheduleErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const singleNameSpace = useSelector(NamespacesSelectors.getSelectedNamespace);
  const versionSelected = useSelector(NamespacesSelectors.getVersionSelect);
  let type = '';
  if (versionSelected?.version > singleNameSpace?.version) {
    type = 'upgrade';
  } else if (scheduleFlowType === 'RUNNING') {
    type = 'start';
  } else if (scheduleFlowType === 'STOPPED') {
    type = 'stop';
  } else {
    type = 'downgrade';
  }

  const formattedType =
    type.charAt(0).toUpperCase() + type.slice(1) + ' Process Group';

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (scheduleDeploymentFlow || scheduleUpgradeFromList) {
      setActiveTab(KDFM.SCHEDULE_DETAILS);
    }
  }, [scheduleDeploymentFlow, scheduleUpgradeFromList]);

  const formDataRegistry = useSelector(NamespacesSelectors.getDeployFormData);
  const handleBackClick = () => {
    if (scheduleStartFlow === true) {
      history.push(`/process-group/${selectedNameSpace?.id}`);
      dispatch(SchedularActions.setScheduleFromList(false));
    } else {
      history.push('/process-group/flow-details');
    }

    setScheduleDeployTime(null);
    dispatch(NamespacesActions.setScheduleTimeByRegistry(null));
  };

  const currentTime = new Date();
  const isScheduleTimeValid =
    scheduleDeployTime && scheduleDeployTime > currentTime;
  const handleContinue = () => {
    if (!isUpgrade) {
      if (scheduleUpgradeFromList && !scheduleDeployTime) {
        setScheduleErrors({
          scheduled_time: {
            message: KDFM.SELECT_SCHEDULE_TIME,
          },
        });
        setActiveTab(KDFM.SCHEDULE_DETAILS);
        return;
      }

      if (singleNameSpace?.invalidCount > 0) {
        setIsModalOpen(true);
        return;
      }
    }
    if (isScheduleTimeValid === false) {
      setScheduleErrors({
        scheduled_time: {
          message: KDFM.INCORRECT_SCHEDULE_TIME,
        },
      });
      setActiveTab(KDFM.SCHEDULE_DETAILS);
    } else if (scheduleDeploymentFlow && !scheduleDeployTime) {
      setScheduleErrors({
        scheduled_time: {
          message: KDFM.SELECT_SCHEDULE_TIME,
        },
      });
      setActiveTab(KDFM.SCHEDULE_DETAILS);
    } else if (scheduleUpgradeFromList && !scheduleDeployTime) {
      setScheduleErrors({
        scheduled_time: {
          message: KDFM.SELECT_SCHEDULE_TIME,
        },
      });
      setActiveTab(KDFM.SCHEDULE_DETAILS);
    } else {
      dispatch(NamespacesActions.setScheduleTimeByRegistry(scheduleDeployTime));
      history.push('/process-group/summary');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case KDFM.PARAMETER_CONTEXT:
        return <ParameterContextTab />;
      case KDFM.VARIABLES:
        return <VariableTab />;
      case KDFM.CONTROLLER_SERVICE:
        return (
          <ControllerServiceTab
            controllerServicePayload={controllerServicePayload}
            setControllerServicePayload={setControllerServicePayload}
          />
        );
      case KDFM.SCHEDULE_DETAILS:
        return (
          <ScheduleDeploymentTab
            scheduleErrors={scheduleErrors}
            setScheduleErrors={setScheduleErrors}
            scheduleDeployTime={scheduleDeployTime}
            setScheduleDeployTime={setScheduleDeployTime}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
        );
      default:
        return null;
    }
  };
  // ScheduleDeploymentTab
  const handleSetTab = tab => {
    // if (tab !== 'Parameter Context') {
    //   dispatch(NamespacesActions.setRegistryDeployParameterContext(pcPayload));
    // }
    // if (tab !== 'Variables') {
    //   dispatch(NamespacesActions.setRegistryDeployVariable(variablePayload));
    // }
    // if (tab !== 'Controller Service') {
    //   dispatch(
    //     NamespacesActions.setRegistryDeployControllerService(
    //       controllerServicePayload
    //     )
    //   );
    // }

    setActiveTab(tab);
  };
  const loading1 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRootControllerServiceNamespace')
  );
  const loadingregistry = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryFlowDetails')
  );

  const handleContinueClick = () => {
    setIsModalOpen(false);
    if (isScheduleTimeValid === false) {
      setScheduleErrors({
        scheduled_time: {
          message: KDFM.INCORRECT_SCHEDULE_TIME,
        },
      });
      setActiveTab(KDFM.SCHEDULE_DETAILS);
    } else if (scheduleDeploymentFlow && !scheduleDeployTime) {
      setScheduleErrors({
        scheduled_time: {
          message: KDFM.SELECT_SCHEDULE_TIME,
        },
      });
      setActiveTab(KDFM.SCHEDULE_DETAILS);
    } else if (scheduleUpgradeFromList && !scheduleDeployTime) {
      setScheduleErrors({
        scheduled_time: {
          message: KDFM.SELECT_SCHEDULE_TIME,
        },
      });
      setActiveTab(KDFM.SCHEDULE_DETAILS);
    } else {
      dispatch(NamespacesActions.setScheduleTimeByRegistry(scheduleDeployTime));
      history.push('/process-group/summary');
    }
  };
  return (
    <div>
      <FullPageLoader loading={loading1 || loadingregistry} />
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {scheduleStartFlow ? (
              scheduleFlowType === 'RUNNING' ? (
                'Schedule Start Flow'
              ) : scheduleFlowType === 'STOPPED' ? (
                'Schedule Stop Flow'
              ) : null
            ) : (
              <>
                {scheduleDeploymentFlow || scheduleUpgradeFromList
                  ? 'Schedule '
                  : ''}
                {!isUpgrade ? formattedType : KDFM.DEPLOY_NAMESPACE}
              </>
            )}
          </MainTitleHfour>
          :
          <MainTitleHfour className="mb-0">
            {!isUpgrade
              ? selectedNameSpace?.label
              : formDataRegistry?.selectedFlowName}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb
          module="upgrade"
          path={!isUpgrade ? breadcrumbDataOnUpgrade : breadcrumbDataOnDeploy}
        />
      </BreadcrumbContainer>

      <GreyBoxNamespace className="w-100  mb-3">
        <TabWrapper className="nav">
          {' '}
          {(scheduleDeploymentFlow || scheduleUpgradeFromList) && (
            <Tab
              active={activeTab === KDFM.SCHEDULE_DETAILS}
              onClick={() => handleSetTab(KDFM.SCHEDULE_DETAILS)}
              className="nav-item"
            >
              <IconContentV2 className="nav-item">
                <ScheduleDetailsIcon
                  color={
                    activeTab === `${KDFM.SCHEDULE_DETAILS}`
                      ? '#FF7A00'
                      : '#444445'
                  }
                />
              </IconContentV2>
              {KDFM.SCHEDULE_DETAILS}{' '}
            </Tab>
          )}
          <Tab
            active={activeTab === KDFM.PARAMETER_CONTEXT}
            onClick={() => handleSetTab(KDFM.PARAMETER_CONTEXT)}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <ParameterContextIcon
                color={
                  activeTab === `${KDFM.PARAMETER_CONTEXT}`
                    ? '#FF7A00'
                    : '#444445'
                }
              />
            </IconContentV2>
            {KDFM.PARAMETER_CONTEXT}
          </Tab>
          <Tab
            active={activeTab === KDFM.VARIABLES}
            onClick={() => handleSetTab(KDFM.VARIABLES)}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <VariablesIcon
                color={
                  activeTab === `${KDFM.VARIABLES}` ? '#FF7A00' : '#444445'
                }
              />
            </IconContentV2>
            {KDFM.VARIABLES}{' '}
          </Tab>
          <Tab
            active={activeTab === KDFM.CONTROLLER_SERVICE}
            onClick={() => handleSetTab(KDFM.CONTROLLER_SERVICE)}
            className="nav-item"
          >
            <IconContentV2 className="nav-item">
              <ControllerServicesIcon
                color={
                  activeTab === `${KDFM.CONTROLLER_SERVICE}`
                    ? '#FF7A00'
                    : '#444445'
                }
              />
            </IconContentV2>
            <TabLabelWithIcon>
              {KDFM.CONTROLLER_SERVICE}
              {singleNameSpace?.invalidCount > 0 && (
                <TopRightIcon>
                  <InvalidProcessorIcon width={12} height={12} />
                </TopRightIcon>
              )}
            </TabLabelWithIcon>
          </Tab>
        </TabWrapper>
        <TabContent>{renderContent()}</TabContent>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
          <Button
            id="configuration-details-continue-btn"
            onClick={handleContinue}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
      <Modal
        title="Invalid Component Detected"
        size="sm"
        onRequestClose={handleCloseModal}
        isOpen={isModalOpen}
        primaryButtonText="Continue"
        secondaryButtonText="Cancel"
        onSubmit={handleContinueClick}
      >
        <div className="d-flex justify-content-center align-items-center">
          <InvalidProcessorIcon width={80} height={80} />
        </div>
        <div style={{ fontSize: '16px' }}>
          Invalid components detected in your current deployment. Would you like
          to proceed with {type} your configuration
        </div>
      </Modal>
    </div>
  );
};

export default ConfigDetailsPage;
