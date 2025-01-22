/*eslint-disable*/
import { namespace } from 'd3';
import { flow, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  DuplicateIcon,
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { TodoIcon } from '../../assets/Icons/TodoIcon';
import DisbaleIconImage from '../../assets/images/disable.png';
import EnableIconImage from '../../assets/images/enable.png';
import StartIconImage from '../../assets/images/start.png';
import StopIconImage from '../../assets/images/stop.png';
import { FullPageLoader } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, Modal, ModalWithIcon } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import CopyToClipboard from '../../shared/CopyToClipboard';
import {
  ClustersSelectors,
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import {
  SchedularActions,
  SchedularSelectors,
} from '../../store/schedular/redux';
import { ScheduleDeploymentModal } from '../ScheduleDeployment/ScheduleDeploymentModal';
import ScheduleNamespaceDeploy from '../ScheduleDeployment/ScheduleNamespaceDeploy';
import AddParameterContext from './AddParameterContext';
import { DuplicateScheduleModal } from './DuplicateScheduleModal';
import NamespaceDeploy from './NamespaceDeploy';

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
  height: calc(100vh - 324px);
  max-height: calc(100vh - 324px);
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
  .text_info {
    border-left: 5px solid #ff7a00;
    padding: 1rem;
    background: #fff7ed;
  }
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
  .div-btn-1.disabled {
    cursor: not-allowed;
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
  margin-left: 6px;
  max-height: 48px;
  min-height: 48px;
  min-width: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;

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
  const selectedDestCluster =
    useSelector(NamespacesSelectors.getSelectedDestCluster) || [];
  const selectedCluster = useSelector(
    ClustersSelectors.getAllClustersList
  ).filter(cluster => cluster.id === selectedDestCluster.value)[0];

  const checkDestCluster = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const currentSelectedCluster = useSelector(
    NamespacesSelectors.getSelectedCluster
  );
  const versionSelected = useSelector(NamespacesSelectors.getVersionSelect);
  let type = '';
  if (versionSelected?.version > selectedNameSpace?.version) {
    type = 'upgrade';
  } else {
    type = 'downgrade';
  }
  const schedularFromList = useSelector(SchedularSelectors.getScheduleFromList);
  const isDeployedModal = useSelector(NamespacesSelectors.getDeployedModal);
  const [flowControlButtons, setFlowControlButtons] = useState('');
  const [isParameterContextOpen, setIsParameterContextOpen] = useState({
    isOpen: false,
    schedule: false,
  });
  const [successTest, setSuccessTest] = useState(false);
  const [proceedWithDispatch, setProceedWithDispatch] = useState(false);

  const deployByRegistryFlow = useSelector(
    NamespacesSelectors.getdeployRegistryFlow
  );
  const registryAllDetails = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const CSorignalData =
    registryAllDetails?.controllerServicesData?.localServices.map(
      ele => ele.controllerData?.[0]
    );
  const getChangedObjects = (originalData, updatedData) => {
    const updatedMap = updatedData.reduce((acc, item) => {
      acc[item.pgId] = item;
      return acc;
    }, {});

    return originalData
      .map(originalItem => {
        const updatedItem = updatedMap[originalItem.pgId];

        if (!updatedItem) {
          return null;
        }

        const changedVariables = originalItem.variables.filter(
          originalVariable => {
            const updatedVariable = updatedItem.variables.find(
              varItem => varItem.name === originalVariable.name
            );

            return (
              updatedVariable &&
              updatedVariable.value !== originalVariable.value
            );
          }
        );

        if (changedVariables.length > 0) {
          return {
            ...originalItem,
            variables: changedVariables,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const formDataRegistry = useSelector(NamespacesSelectors.getDeployFormData);

  const registryData = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );
  const isRegistryDeploy = useSelector(
    NamespacesSelectors.getdeployRegistryFlow
  );
  const XcordUpdated = useSelector(NamespacesSelectors.getregistryFlowXCord);
  const YcordUpdated = useSelector(NamespacesSelectors.getregistryFlowYCord);
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const variblesReduxData = useSelector(
    NamespacesSelectors.getRegistryDeployVariable
  );
  const orignalVariables = getChangedObjects(
    registryAllDetails?.variablesData,
    variblesReduxData
  );

  const orignalParameterData = [
    ...(registryAllDetails?.parameterContextData?.inherited || []),
    ...(registryAllDetails?.parameterContextData?.parent || []),
  ];

  const controllerServiceReduxData = useSelector(
    NamespacesSelectors.getRegistryDeployControllerService
  );
  const filteredCSArrayDiff = CSorignalData.filter(item1 =>
    controllerServiceReduxData?.localServicesData?.some(
      item2 => item1.identifier === item2.identifier
    )
  );
  const parameterReduxData = useSelector(
    NamespacesSelectors.getRegistryDeployParameterContext
  );
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, 'namespaces')
  );
  const flowControlSelectedScheduleStored = useSelector(
    NamespacesSelectors.getflowControlStateAtScheduleDeploy
  );
  const scheduleUpgradeFromList = useSelector(
    SchedularSelectors.getScheduleFromList
  );
  const result = gridData?.map(item => item?.flowId);
  const paramterDeployArray = [
    ...(parameterReduxData?.inherited || []),
    ...(parameterReduxData?.parent || []),
  ];

  const PColdValues = orignalParameterData
    .filter(item1 =>
      paramterDeployArray.some(item2 => item1.name === item2.name)
    )
    .map(item1 => {
      const matchingItem2 = paramterDeployArray.find(
        item2 => item2.name === item1.name
      );
      return {
        ...item1,
        parameters: item1.parameters.filter(param1 =>
          matchingItem2.parameters.some(param2 => param1.name === param2.name)
        ),
      };
    });
  const filteredArrayPCold = PColdValues.map(item => ({
    parameterName: item.name,
    parameters: item.parameters,
  }));

  const registryFlowVerion = useSelector(NamespacesSelectors.getVersionSelect);

  const [isAddParameterContextOpen, setIsAddParameterContextOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
  const [isUpgrading, setIsUpgrading] = useState(false);
  const parameterContextItem = useSelector(
    NamespacesSelectors.getParameterContextItem
  );
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);
  const scheduleDeploymentFlow = useSelector(
    NamespacesSelectors.getScheduleByRegistry
  );
  const timeDeployScheduleDeployment = useSelector(
    NamespacesSelectors.getScheduleTimeByRegistry
  );
  const checkFlowControlAfterUpgrade = useSelector(
    NamespacesSelectors.getFlowControlAfterUpgrade
  );
  const checkFlowControlAfterDeploy = useSelector(
    NamespacesSelectors.getflowControlAfterDeploy
  );
  const [isVariablesModalOpen, setVariablesModalOpen] = useState({
    isOpen: false,
    mode: 'add',
    schedule: false,
  });
  const [confirmDialogue, setConfirmDialogue] = useState({
    state: false,
    action: '',
    text: '',
    forPopup: false,
  });
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
    { label: 'Configuration Details', path: '/process-group/config-details' },
    { label: 'Summary' },
  ];
  const breadcrumbDataOnUpgrade = [
    {
      label: KDFM.NIFI_FLOW,
      path: '/process-group',
      callback: () => {
        dispatch(NamespacesActions.setSelectedNamespace({}));
      },
    },
    { label: 'Flow Details', path: '/process-group/flow-details' },
    { label: 'Configuration Details', path: '/process-group/config-details' },
    { label: 'Summary' },
  ];
  const [flowControlState, setFlowControlState] = useState(null);
  const getParamerterContext = async () => {
    dispatch(NamespacesActions.setNamespaceSummaryLoadingState(true));
    openParameterContext();
    dispatch(NamespacesActions.setNamespaceSummaryLoadingState(false));
  };
  const getScheduleParamerterContext = async () => {
    setIsParameterContextOpen({ isOpen: true, schedule: true });
    dispatch(SchedularActions.setScheduleDeployModal());
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setSelectedNamespace({}));
    history.push('/process-group');
  };

  const openParameterContext = () => {
    setIsParameterContextOpen({ isOpen: true, schedule: false });
    dispatch(NamespacesActions.fetchParameterContext());
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

  const handleBackClick = () => {
    history.push('/process-group/config-details');
  };

  const [activeButton, setActiveButton] = useState(null);
  const [activeButtonPopup, setActiveButtonPopup] = useState(null);

  const handleUpdateStatus = status => {
    const text =
      status === 'STOPPED'
        ? 'stop'
        : status === 'RUNNING'
          ? 'start'
          : status === 'ENABLED'
            ? 'enable'
            : status === 'DISABLED'
              ? 'disable'
              : '';
    setConfirmDialogue({
      state: true,
      action: status,
      text,
      forPopup: false,
    });
  };

  const handleConfirmUpdateStatus = () => {
    setFlowControlState(confirmDialogue.action);
    if (!confirmDialogue.forPopup) {
      setActiveButton(confirmDialogue.action);
      setFlowControlButtons(confirmDialogue.action);
    }

    setConfirmDialogue({
      state: false,
      action: '',
      text: '',
      forPopup: false,
    });
    if (checkFlowControlAfterUpgrade || checkFlowControlAfterDeploy) {
      dispatch(NamespacesActions.updateNamespaceStatus(confirmDialogue.action));
      return;
    }

    return;
  };

  const handleFlowConfirmPopup = status => {
    setActiveButtonPopup(status);
    const text =
      status === 'STOPPED'
        ? 'stop'
        : status === 'RUNNING'
          ? 'start'
          : status === 'ENABLED'
            ? 'enable'
            : status === 'DISABLED'
              ? 'disable'
              : '';
    setConfirmDialogue({
      state: true,
      action: status,
      text,
      forPopup: true,
    });
  };
  const formatDateTime = date => {
    if (!date) return 'No date selected';
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const handledeployByRegistry = () => {
    const updatedData = paramterDeployArray.map(item => ({
      parameterName: item.name,
      parameters: item.parameters,
    }));
    const payload = {
      namespaceId: checkDestCluster?.value,
      version: registryFlowVerion?.version,
      flowId: registryFlowVerion?.flowId,
      bucketId: registryFlowVerion?.bucketId,
      registryId: registryData?.id,
      flowName: formDataRegistry?.selectedFlowName,
      namespaceStatus: flowControlState,
      position: {
        x: XcordUpdated || registryDetailsData?.positions[0]?.x,
        y: YcordUpdated || registryDetailsData?.positions[0]?.y,
      },
      keep_existing_paramter_contexts: formDataRegistry?.keepParameters,
    };

    if (!isEmpty(variblesReduxData)) {
      payload.variablesData = variblesReduxData;
    }
    if (!isEmpty(updatedData)) {
      payload.parameterData = updatedData;
    }
    if (!isEmpty(controllerServiceReduxData)) {
      payload.controllerServiceData = controllerServiceReduxData;
    }

    dispatch(NamespacesActions.deployNamespaceByRegistryFlow(payload));
  };

  const handleUpgradeByRegistry = () => {
    const updatedData = paramterDeployArray.map(item => ({
      parameterName: item.name,
      parameters: item.parameters,
    }));
    const payload = {
      version: versionSelected?.version,
      namespaceId: checkDestCluster?.id,
      namespaceStatus: flowControlState,
      payload: {
        namespaceId: checkDestCluster?.value,
      },
      flowName: selectedNameSpace?.flowName,
      nameSpaceName: selectedNameSpace?.name,
      position: {
        x: XcordUpdated || selectedNameSpace?.position?.x,
        y: YcordUpdated || selectedNameSpace?.position?.y,
      },
      type: type,
    };

    if (!isEmpty(variblesReduxData)) {
      payload.payload.variablesData = variblesReduxData;
    }
    if (!isEmpty(updatedData)) {
      payload.payload.parameterData = updatedData;
    }
    if (!isEmpty(controllerServiceReduxData)) {
      payload.payload.controllerServiceData = controllerServiceReduxData;
    }
    dispatch(NamespacesActions.upgradeCluster(payload));
  };

  const handleScheduleDeploy = () => {
    const updatedData = paramterDeployArray.map(item => ({
      parameterName: item.name,
      parameters: item.parameters,
    }));
    const payload = {
      version: registryFlowVerion?.version,
      flowId: registryFlowVerion?.flowId,
      bucketId: registryFlowVerion?.bucketId,
      registryId: registryData?.id,
      namespaceId: checkDestCluster?.value,
      mode: 'deploy',
      scheduledTime: timeDeployScheduleDeployment?.toISOString(),
      isScheduled: true,
      flowName: formDataRegistry?.selectedFlowName,
      position: {
        x: XcordUpdated || registryDetailsData?.positions[0]?.x,
        y: YcordUpdated || registryDetailsData?.positions[0]?.y,
      },
      keep_existing_paramter_contexts: formDataRegistry?.keepParameters,
      // namespaceStatus: flowControlSelectedScheduleStored,
      nameSpaceName: registryAllDetails?.processGroupName,
      oldVariablesData: orignalVariables,
      oldParameterContextData: filteredArrayPCold,
      previousControllerServices: { localServicesData: filteredCSArrayDiff },
    };
    //
    if (!isEmpty(flowControlSelectedScheduleStored)) {
      payload.namespaceStatus = flowControlSelectedScheduleStored;
    }
    if (!isEmpty(variblesReduxData)) {
      payload.variablesData = variblesReduxData;
    }
    if (!isEmpty(updatedData)) {
      payload.parameterData = updatedData;
    }
    if (!isEmpty(controllerServiceReduxData)) {
      payload.controllerServiceData = controllerServiceReduxData;
    }
    dispatch(NamespacesActions.fetchDuplicateScheduleData(payload));
  };

  const handleScheduleDeployDuplicate = () => {
    if (scheduleDeploymentFlow) {
      const updatedData = paramterDeployArray.map(item => ({
        parameterName: item.name,
        parameters: item.parameters,
      }));
      const payload = {
        version: registryFlowVerion?.version,
        flowId: registryFlowVerion?.flowId,
        bucketId: registryFlowVerion?.bucketId,
        registryId: registryData?.id,
        namespaceId: checkDestCluster?.value,
        mode: 'deploy',
        scheduledTime: timeDeployScheduleDeployment?.toISOString(),
        isScheduled: true,
        flowName: formDataRegistry?.selectedFlowName,
        position: {
          x: XcordUpdated || registryDetailsData?.positions[0]?.x,
          y: YcordUpdated || registryDetailsData?.positions[0]?.y,
        },
        keep_existing_paramter_contexts: formDataRegistry?.keepParameters,
        namespaceStatus: flowControlSelectedScheduleStored,
        nameSpaceName: registryAllDetails?.processGroupName,
        oldVariablesData: orignalVariables,
        oldParameterContextData: filteredArrayPCold,
        previousControllerServices: { localServicesData: filteredCSArrayDiff },
      };
      //
      if (!isEmpty(variblesReduxData)) {
        payload.variablesData = variblesReduxData;
      }
      if (!isEmpty(updatedData)) {
        payload.parameterData = updatedData;
      }
      if (!isEmpty(controllerServiceReduxData)) {
        payload.controllerServiceData = controllerServiceReduxData;
      }

      dispatch(NamespacesActions.deployNamespaceByRegistryFlow(payload));
    } else {
      const updatedData = paramterDeployArray.map(item => ({
        parameterName: item.name,
        parameters: item.parameters,
      }));
      const payload = {
        version: versionSelected?.version,
        flowId: selectedNameSpace?.flowId,
        namespaceId: checkDestCluster?.id,
        namespaceStatus: flowControlSelectedScheduleStored,
        payload: {
          namespaceId: checkDestCluster?.value,
          oldVariablesData: orignalVariables,
          oldParameterContextData: filteredArrayPCold,
          previousControllerServices: {
            localServicesData: filteredCSArrayDiff,
          },
        },
        flowName: selectedNameSpace?.flowName,
        isScheduled: true,
        mode: 'upgrade',
        type: type,
        nameSpaceName: selectedNameSpace?.name,
        scheduledTime: timeDeployScheduleDeployment?.toISOString(),
        position: {
          x: XcordUpdated || registryDetailsData?.positions[0]?.x,
          y: YcordUpdated || registryDetailsData?.positions[0]?.y,
        },
      };
      if (!isEmpty(variblesReduxData)) {
        payload.payload.variablesData = variblesReduxData;
      }
      if (!isEmpty(updatedData)) {
        payload.payload.parameterData = updatedData;
      }
      if (!isEmpty(controllerServiceReduxData)) {
        payload.payload.controllerServiceData = controllerServiceReduxData;
      }
      dispatch(NamespacesActions.upgradeCluster(payload));
    }
  };

  const handleScheduleUpgrade = () => {
    const updatedData = paramterDeployArray.map(item => ({
      parameterName: item.name,
      parameters: item.parameters,
    }));
    const payload = {
      version: versionSelected?.version,
      flowId: selectedNameSpace?.flowId,
      namespaceId: checkDestCluster?.id,
      namespaceStatus: flowControlSelectedScheduleStored,
      payload: {
        namespaceId: checkDestCluster?.value,
        oldVariablesData: orignalVariables,
        oldParameterContextData: filteredArrayPCold,
        previousControllerServices: { localServicesData: filteredCSArrayDiff },
      },
      flowName: selectedNameSpace?.flowName,
      isScheduled: true,
      mode: 'upgrade',
      nameSpaceName: selectedNameSpace?.name,
      scheduledTime: timeDeployScheduleDeployment?.toISOString(),
      position: {
        x: XcordUpdated || selectedNameSpace?.position?.x,
        y: YcordUpdated || selectedNameSpace?.position?.y,
      },
      type: type,
    };
    if (!isEmpty(variblesReduxData)) {
      payload.payload.variablesData = variblesReduxData;
    }
    if (!isEmpty(updatedData)) {
      payload.payload.parameterData = updatedData;
    }
    if (!isEmpty(controllerServiceReduxData)) {
      payload.payload.controllerServiceData = controllerServiceReduxData;
    }
    dispatch(NamespacesActions.fetchDuplicateScheduleData(payload));
    // dispatch(NamespacesActions.upgradeCluster(payload));
  };
  const loadingregistry = useSelector(state =>
    LoadingSelectors.getLoading(state, 'deployNamespaceByRegistryFlow')
  );
  const loadingreUpdateFlow = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateNamespaceStatus')
  );
  const loadingreUpgradeFlow = useSelector(state =>
    LoadingSelectors.getLoading(state, 'upgradeCluster')
  );

  const [processStatus, setProcessStatus] = useState({
    disabledCount: checkDestCluster?.disabledCount,
    invalidCount: checkDestCluster?.invalidCount,
    runningCount: checkDestCluster?.runningCount,
    stoppedCount: checkDestCluster?.stoppedCount,
  });

  useEffect(() => {
    if (!isEmpty(checkDestCluster) && isEmpty(deployOrUpgradeDetails)) {
      setProcessStatus({
        disabledCount: checkDestCluster?.disabledCount,
        invalidCount: checkDestCluster?.invalidCount,
        runningCount: checkDestCluster?.runningCount,
        stoppedCount: checkDestCluster?.stoppedCount,
      });
    } else if (!isEmpty(deployOrUpgradeDetails)) {
      setProcessStatus({
        disabledCount: deployOrUpgradeDetails?.disabledCount,
        invalidCount: deployOrUpgradeDetails?.invalidCount,
        runningCount: deployOrUpgradeDetails?.runningCount,
        stoppedCount: deployOrUpgradeDetails?.stoppedCount,
      });
    }
  }, [checkDestCluster, deployOrUpgradeDetails]);

  const StyledSpan = styled.span`
    margin-left: 4px !important;
  `;

  const handleClick = () => {
    if (!isUpgrade) {
      if (!registryAllDetails?.nifi_url) return;
      const updatedUrl = registryAllDetails?.nifi_url?.endsWith('/nifi')
        ? `${registryAllDetails.nifi_url}?processGroupId=${checkDestCluster?.value || deployOrUpgradeDetails?.id}`
        : `${registryAllDetails.nifi_url}/nifi?processGroupId=${checkDestCluster?.value || deployOrUpgradeDetails?.id}`;

      window.open(updatedUrl, '_blank');
    } else {
      const updatedUrl = registryAllDetails?.nifi_url?.endsWith('/nifi')
        ? registryAllDetails.nifi_url
        : `${registryAllDetails.nifi_url}/nifi`;

      window.open(updatedUrl, '_blank');
    }
  };

  const handleRegistryClick = () => {
    if (!registryData?.url) return;
    window.open(registryData.url, '_blank');
  };

  return (
    <>
      <MainContainer className="main-space bg-white">
        <FullPageLoader
          loading={
            loadingregistry || loadingreUpdateFlow || loadingreUpgradeFlow
          }
        />
        <TopTitleBar className="d-flex mb-3">
          <MainTitleDiv className="d-flex">
            <ImageContainer>
              <TodoIcon />
            </ImageContainer>
            <MainTitleHfour className="mb-0">
              {`${
                scheduleDeploymentFlow || scheduleUpgradeFromList
                  ? 'Schedule '
                  : ''
              } ${
                !deployByRegistryFlow
                  ? checkDestCluster?.version <= versionSelected.version
                    ? KDFM.UPGRADE
                    : KDFM.DOWNGRADE
                  : KDFM.DEPLOY
              } ${KDFM.NAMESPACE}`}
            </MainTitleHfour>
            :
            <MainTitleHfour className="mb-0">
              {!isUpgrade
                ? selectedNameSpace.label
                : formDataRegistry?.selectedFlowName}
            </MainTitleHfour>
          </MainTitleDiv>
        </TopTitleBar>
        <BreadcrumbContainer className="d-flex mb-3">
          <Breadcrumb
            module="deploy"
            path={
              deployByRegistryFlow ||
              (scheduleDeploymentFlow && !scheduleUpgradeFromList)
                ? breadcrumbDataOnDeploy
                : breadcrumbDataOnUpgrade
            }
          />
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
                        {currentSelectedCluster?.label}
                      </SummaryDetailsPtag>
                    </div>
                  </UseColXl>
                  <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                    <div>
                      <SummaryDetailsHFourTag className="mb-2">
                        {!isUpgrade ? KDFM.NAMESPACE : 'Flow Name'}
                      </SummaryDetailsHFourTag>
                      <SummaryDetailsPtag className="mb-0">
                        {deployByRegistryFlow
                          ? formDataRegistry?.selectedFlowName
                          : checkDestCluster?.name ||
                            formDataRegistry?.selectedFlowName}
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
                          <span
                            onClick={handleRegistryClick}
                            style={{
                              cursor: 'pointer',
                              color: 'blue',
                              textDecoration: 'underline',
                            }}
                          >
                            {registryData?.url}
                          </span>
                          <div
                            data-tooltip-id={`copy-board-namespace-summary1`}
                          >
                            <CopyToClipboard
                              className="summary-clipboard"
                              copyItem={registryData?.url}
                            />
                          </div>
                          <ReactTooltip
                            id={`copy-board-namespace-summary1`}
                            place="bottom"
                            effect="solid"
                            content={'Copy registry URL'}
                            style={{
                              width: '150px',
                              whiteSpace: 'normal',
                              wordWrap: 'break-word',
                              zIndex: 10000,
                            }}
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
                          <span
                            onClick={handleClick}
                            style={{
                              cursor: 'pointer',
                              color: 'blue',
                              textDecoration: 'underline',
                            }}
                          >
                            {registryAllDetails?.nifi_url}
                          </span>
                          <div
                            data-tooltip-id={`copy-board-namespace-summary2`}
                          >
                            <CopyToClipboard
                              className="summary-clipboard"
                              copyItem={registryAllDetails?.nifi_url}
                            />
                          </div>
                          <ReactTooltip
                            id={`copy-board-namespace-summary2`}
                            place="bottom"
                            effect="solid"
                            content={'Copy cluster URL'}
                            style={{
                              width: '150px',
                              whiteSpace: 'normal',
                              wordWrap: 'break-word',
                              zIndex: 10000,
                            }}
                          />
                        </div>
                      </SummaryDetailsPtag>
                    </div>
                  </UseColXl>
                  <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                    <div>
                      <SummaryDetailsHFourTag className="mb-2">
                        {deployByRegistryFlow || scheduleDeploymentFlow
                          ? KDFM.SELECTED_VERSION
                          : KDFM.CURRENT_VERSION}
                      </SummaryDetailsHFourTag>
                      <SummaryDetailsPtag className="mb-0">
                        {isUpgrade
                          ? versionSelected?.version
                          : checkDestCluster?.version || 'N/A'}
                      </SummaryDetailsPtag>
                    </div>
                  </UseColXl>
                  {!deployByRegistryFlow && !scheduleDeploymentFlow && (
                    <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                      <div className="summary-details">
                        <SummaryDetailsHFourTag className="mb-2">
                          {KDFM.UPDATED_VERSION}
                        </SummaryDetailsHFourTag>
                        <SummaryDetailsPtag className="mb-0">
                          {versionSelected.version || ''}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                  )}
                </RowConfig>
              </UseColLg>
              {(scheduleUpgradeFromList || scheduleDeploymentFlow) && (
                <>
                  <div className="col-12 p-3">
                    <ConfigTitle className="config-title">
                      <ConfigTitleHTwo className="p-3 mb-0">
                        <span>{KDFM.SCHEDULE_DIPLOYMENT}</span>
                      </ConfigTitleHTwo>
                    </ConfigTitle>
                  </div>
                  <UseColLg className="col-lg-10 col-12 ">
                    <RowConfig className=" p-3">
                      <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                        <div>
                          <SummaryDetailsHFourTag className="mb-2">
                            {KDFM.SECHEDULED_TIME}
                          </SummaryDetailsHFourTag>
                          <SummaryDetailsPtag className="mb-0">
                            {formatDateTime(timeDeployScheduleDeployment)}
                          </SummaryDetailsPtag>
                        </div>
                      </UseColXl>
                      <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                        <div>
                          <SummaryDetailsHFourTag className="mb-2">
                            {KDFM.FLOW_STATE_AFTER_DEPLOY}
                          </SummaryDetailsHFourTag>
                          <SummaryDetailsPtag className="mb-0">
                            {flowControlSelectedScheduleStored || 'N/A'}
                          </SummaryDetailsPtag>
                        </div>
                      </UseColXl>
                    </RowConfig>
                  </UseColLg>
                </>
              )}
              {!scheduleDeploymentFlow && !scheduleUpgradeFromList && (
                <>
                  <div className="col-12 p-3">
                    <ConfigTitle className="config-title">
                      <ConfigTitleHTwo className="p-3 mb-0">
                        <span>{KDFM.FLOW_CONTROL}</span>
                      </ConfigTitleHTwo>
                    </ConfigTitle>
                  </div>
                  {!deployByRegistryFlow && (
                    <UseColLg className="col-lg-10 col-12 ">
                      <RowConfig className="row p-3">
                        <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                          <div className="summary-details">
                            <SummaryDetailsHFourTag className="mb-2">
                              {KDFM.NAMESPACE}
                            </SummaryDetailsHFourTag>
                            <SummaryDetailsPtag className="mb-0">
                              {checkDestCluster?.name}
                            </SummaryDetailsPtag>
                          </div>
                        </UseColXl>
                        <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                          <div className="summary-details">
                            <SummaryDetailsHFourTag className="mb-2">
                              {KDFM.CURRENT_VERSION}
                            </SummaryDetailsHFourTag>
                            <SummaryDetailsPtag className="mb-0">
                              {checkDestCluster?.version}
                            </SummaryDetailsPtag>
                          </div>
                        </UseColXl>
                        <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                          <div className="summary-details">
                            <SummaryDetailsHFourTag className="mb-2">
                              {KDFM.UPDATED_VERSION}
                            </SummaryDetailsHFourTag>
                            <SummaryDetailsPtag className="mb-0">
                              {versionSelected?.version}
                            </SummaryDetailsPtag>
                          </div>
                        </UseColXl>
                      </RowConfig>
                    </UseColLg>
                  )}
                </>
              )}
            </RowConfig>
            <IconsvgDiv>
              {!scheduleDeploymentFlow && !scheduleUpgradeFromList && (
                <CustomNine className="col-4 mb-3">
                  <ActiveButtonContainer className="d-flex ">
                    <TextDiv className="d-flex">
                      <CountDiv
                        className="div-btn-1 mr-2"
                        count={processStatus.runningCount}
                        activeColor="#58e715"
                      >
                        <TriangleIcons color="#B5BDC8" />
                        <span>{processStatus.runningCount || 0}</span>
                      </CountDiv>
                      <div>{KDFM.RUNNING_PROCESSORS}</div>
                    </TextDiv>
                    <TextDiv className="d-flex">
                      <CountDiv
                        className="div-btn-2 mr-2"
                        count={processStatus.stoppedCount}
                        activeColor="#c52b2b"
                      >
                        <SquareBoxIcon color="#B5BDC8" />
                        <span>{processStatus.stoppedCount || 0}</span>
                      </CountDiv>
                      <div>{KDFM.STOPPED_PROCESSORS}</div>
                    </TextDiv>
                    <TextDiv className="d-flex">
                      <CountDiv
                        className="div-btn-3 mr-2"
                        count={processStatus.invalidCount}
                        activeColor="#CF9F5D"
                      >
                        <TriangleExclamationMarkIcon color="#B5BDC8" />
                        <span>{processStatus.invalidCount || 0}</span>
                      </CountDiv>
                      <div>{KDFM.INVALID_PROCESSORS}</div>
                    </TextDiv>
                    <TextDiv className="d-flex">
                      <CountDiv
                        className="div-btn-4 mr-2"
                        count={processStatus.disabledCount}
                        activeColor="#2c7cf3"
                      >
                        <SmallNotThunderIcon
                          width={20}
                          height={20}
                          color="#B5BDC8"
                        />
                        <StyledSpan>
                          {processStatus.disabledCount || 0}
                        </StyledSpan>
                      </CountDiv>
                      <div>{KDFM.DISABLED_PROCESSORS}</div>
                    </TextDiv>
                  </ActiveButtonContainer>
                </CustomNine>
              )}
              {!scheduleDeploymentFlow && !scheduleUpgradeFromList && (
                <ActiveButtonContainer className="d-flex ">
                  {!(
                    processStatus?.runningCount === 0 &&
                    processStatus?.stoppedCount === 0
                  ) ? (
                    <>
                      <TextsvgDiv className="d-flex">
                        <ActiveButtonDiv className="div-btn-1 mr-2">
                          <ActiveButtonDiv
                            className="div-btn-1"
                            isActive={activeButton === 'RUNNING'}
                            data-tooltip-id="runningProcessor"
                            activeColor="#58e715"
                            hoverColor="#58e715"
                            activeTextColor="#fff"
                            onClick={() => {
                              handleUpdateStatus('RUNNING');
                            }}
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
                            data-tooltip-id="stoppedProcessor"
                            onClick={() => {
                              handleUpdateStatus('STOPPED');
                            }}
                          >
                            <SquareBoxIcon color="#B5BDC8" />
                          </ActiveButtonDiv>
                        </ActiveButtonDiv>
                        <div>{KDFM.STOPPED_FLOW}</div>
                      </TextsvgDiv>
                    </>
                  ) : (
                    <div className="text_info">{KDFM.FLOW_CONTROL_WARNING}</div>
                  )}
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
            {isRegistryDeploy && !scheduleDeploymentFlow && (
              <Button onClick={handledeployByRegistry}>
                {isRegistryDeploy ? KDFM.DEPLOY : KDFM.UPGRADE}
              </Button>
            )}
            {!isRegistryDeploy &&
              !scheduleDeploymentFlow &&
              !scheduleUpgradeFromList && (
                <Button onClick={handleUpgradeByRegistry}>
                  {`${type === 'upgrade' ? KDFM.UPGRADE : KDFM.DOWNGRADE}`}
                </Button>
              )}
            {scheduleDeploymentFlow && (
              <Button size="md" onClick={() => handleScheduleDeploy()}>
                Schedule
              </Button>
            )}
            {scheduleUpgradeFromList && (
              <Button size="md" onClick={() => handleScheduleUpgrade()}>
                {`${type === 'upgrade' ? KDFM.SCHEDULE_UPGRADE : KDFM.SCHEDULE_DOWNGRADE}`}
              </Button>
            )}
          </BottomButtonDiv>
          {isUpgrading && (
            <div className="w-100 mt-3">
              <Progressox className="w-100">
                <ProgressLabel className="progress-label">
                  {deployOrUpgradeDetails?.percentCompleted < 100
                    ? 'Upgrading'
                    : 'Upgraded'}
                </ProgressLabel>
                <CustomRedProgress className="progress w-100 custom-red-progress">
                  <ProgressBar
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${deployOrUpgradeDetails?.percentCompleted || 0}%`,
                    }}
                    aria-valuenow={
                      deployOrUpgradeDetails?.percentCompleted || 0
                    }
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {deployOrUpgradeDetails?.percentCompleted || 0}%
                  </ProgressBar>
                </CustomRedProgress>
              </Progressox>
            </div>
          )}
        </BottomButton>
        <ScheduleDeploymentModal
          showApprover={selectedCluster?.approver_enable}
        />
        <NamespaceDeploy
          isOpen={isDeployedModal}
          closePopup={handleCloseModal}
          openParameterContext={openParameterContext}
          getParamerterContext={getParamerterContext}
          handleTertiaryButton={handleTertiaryButton}
          activeButtonPopup={activeButtonPopup}
          processStatus={processStatus}
          setActiveButtonPopup={setActiveButtonPopup}
          handleFlowConfirmPopup={handleFlowConfirmPopup}
          type={type}
        />
        <ScheduleNamespaceDeploy
          getScheduleParamerterContext={getScheduleParamerterContext}
          handleScheduleTertiaryButton={handleScheduleTertiaryButton}
          flowControlState={flowControlButtons}
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
        <ModalWithIcon
          title={'Flow Confirmation'}
          primaryButtonText={'Confirm'}
          secondaryButtonText="Cancel"
          icon={
            <img
              src={
                confirmDialogue?.action === 'STOPPED'
                  ? StopIconImage
                  : confirmDialogue?.action === 'RUNNING'
                    ? StartIconImage
                    : confirmDialogue?.action === 'ENABLED'
                      ? EnableIconImage
                      : DisbaleIconImage
              }
              height="80px"
              width="80px"
              alt="img"
            />
          }
          isOpen={confirmDialogue?.state}
          onRequestClose={() => {
            setConfirmDialogue({
              state: false,
              action: '',
              text: '',
              forPopup: false,
            });
            setActiveButtonPopup(null);
          }}
          primaryText={
            checkFlowControlAfterUpgrade || checkFlowControlAfterDeploy
              ? `Do you really want to ${confirmDialogue?.text}?`
              : `Flow will be ${confirmDialogue?.text} after the ${isRegistryDeploy ? 'deploy' : 'upgrade'}?`
          }
          onSubmit={handleConfirmUpdateStatus}
        />
        <DuplicateScheduleModal
          handleScheduleDeployDuplicate={handleScheduleDeployDuplicate}
          type={type}
        />
      </MainContainer>
    </>
  );
};

export default Summary;
