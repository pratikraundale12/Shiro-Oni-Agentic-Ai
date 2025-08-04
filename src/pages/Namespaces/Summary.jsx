/*eslint-disable*/
import { namespace } from 'd3';
import { flow, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  CrossIcon,
  DuplicateIcon,
  ExclamationIcon,
  InfoIcon,
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
import { NAMESPACE_CONSTANTS } from '../../constants/namespace.constant';
import { history } from '../../helpers/history';
import { Button, CheckboxField, Modal, ModalWithIcon } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import CopyToClipboard from '../../shared/CopyToClipboard';
import {
  ClustersActions,
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
import { theme } from '../../styles';
import { DiffModalScheduleList } from '../ScheduleDeployment/DiffModalSchedule';
import { ScheduleDeploymentModal } from '../ScheduleDeployment/ScheduleDeploymentModal';
import ScheduleNamespaceDeploy from '../ScheduleDeployment/ScheduleNamespaceDeploy';
import AddParameterContext from './AddParameterContext';
import { DuplicateScheduleModal } from './DuplicateScheduleModal';
import NamespaceDeploy from './NamespaceDeploy';
import SanityCheckDeployModal from './SanityCheckDeployModal';
import Upgrade from './Upgrade';

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
  width: 100%;
  gap: 12px;
  max-height: 48px;
  min-height: 48px;
  padding: 8px;
  border: 1px solid
    ${({ className, isActive }) => {
      if (isActive) {
        if (className?.includes('div-btn-1')) return '#58e715'; // Start (RUNNING) button
        if (className?.includes('div-btn-2')) return '#c52b2b'; // Stop (STOPPED) button
      }
      return '#dde4f0';
    }};
  border-radius: 8px;
  background-color: ${({ isActive, className }) => {
    if (isActive) {
      if (className?.includes('div-btn-1')) return '#58e715'; // green
      if (className?.includes('div-btn-2')) return '#c52b2b'; // red
    }
    return '#f5f7fa'; // default inactive
  }};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  color: ${({ isActive, className }) => {
    if (isActive) {
      if (className?.includes('div-btn-1')) return '#fff'; // green
      if (className?.includes('div-btn-2')) return '#fff'; // red
    }
    return 'black'; // default inactive
  }};
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 16px;
    font-weight: 600;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
  }
  &:hover {
    background-color: ${({ disabled, className, isActive, hoverColor }) => {
      if (disabled) return undefined; // no hover effect
      if (hoverColor) return hoverColor;
      return '#F6F7F9';
    }};

    border: 1px solid
      ${({ className, isActive }) => {
        if (isActive) {
          if (className?.includes('div-btn-1')) return '#58e715';
          if (className?.includes('div-btn-2')) return '#c52b2b';
        }
        return '#dde4f0';
      }};

    color: ${({ disabled, isActive }) => {
      if (disabled) return undefined; // don't override the original color
      return isActive ? '#000' : '#fff'; // active = black, inactive = white
    }};

    border-radius: 8px; // always applied, even on hover
  }
`;

const ActiveButtonDivResetFlow = styled.div`
  width: 100%;
  gap: 12px;
  max-height: 48px;
  min-height: 48px;
  padding: 8px;
  border: 1px solid
    ${({ className, isActive }) => {
      if (isActive) {
        if (className?.includes('div-btn-1')) return '#58e715'; // Start (RUNNING) button
        if (className?.includes('div-btn-2')) return '#c52b2b'; // Stop (STOPPED) button
      }
      return '#dde4f0';
    }};
  border-radius: 8px;
  background-color: #dde4f0;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;

  & span {
    position: absolute;
    top: 0px;
    right: 2px;
    font-family: ${props => props.theme.fontNato};
    font-size: 16px;
    font-weight: 600;
    line-height: 23px;
    color: ${props => (props.isActive ? '#fff' : '#b5bdc8')};
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
const SanityLabel = styled.h5`
  font-family: ${props => props.theme.fontRedHat};
  font-size: 16px;
  font-weight: 600;
  line-height: 18.52px;
  text-align: left;
  margin-bottom: 4px;
`;
const IconCover = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dde4f0;
`;
const TextDetails = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  text-transform: capitalize;
  color: #444445;
  margin-bottom: 25px;
`;
export const scheduleSchema = yup.object().shape({
  approver_ids: yup.array().required('Approver is required'),
});

const Summary = () => {
  const dispatch = useDispatch();
  const shouldRevertChanges = useSelector(
    NamespacesSelectors.getShouldRevertChanges
  );
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
  const sanityCheckAfterDeploy = useSelector(
    NamespacesSelectors.getSanityCheckAtDeploy
  );
  let type = '';
  if (versionSelected?.version > selectedNameSpace?.version) {
    type = 'upgrade';
  } else {
    type = 'downgrade';
  }
  const isDeployedModal = useSelector(NamespacesSelectors.getDeployedModal);
  const [flowControlButtons, setFlowControlButtons] = useState('');
  const [isParameterContextOpen, setIsParameterContextOpen] = useState({
    isOpen: false,
    schedule: false,
  });

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
  const userStoryValue = useSelector(NamespacesSelectors.getUserStory);
  const changeRequestValue = useSelector(NamespacesSelectors.getChangeRequest);
  const [openConfigDetailsModal, setOpenConfigDetailsModal] = useState(false);
  const [isSanityCheckModalOpen, setIsSanityCheckModalOpen] = useState(false);
  const selectedClusterMethod = useSelector(
    NamespacesSelectors.getSelectedCluster
  );

  useEffect(() => {
    if (!isEmpty(selectedClusterMethod?.value)) {
      dispatch(ClustersActions.fetchClusters());
    }
  }, [dispatch, selectedClusterMethod]);

  const clusters_new_list = useSelector(ClustersSelectors.getAllClustersList);
  const matchedCluster = clusters_new_list.find(
    cluster => cluster.id === selectedClusterMethod?.value
  );
  const hasSanityCheckAccess = matchedCluster?.view_sanity_check;

  const handleSanityCheckModalSubmit = () => {
    setIsSanityCheckModalOpen(false);
    dispatch(NamespacesActions.setSanityCheckAtDeploy(true));
  };
  const getChangedVariables = (originalVariables, updatedVariables) => {
    const updatedMap = updatedVariables.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});

    return originalVariables.filter(
      ({ name, value }) =>
        updatedMap[name] !== undefined && updatedMap[name] !== value
    );
  };
  const getChangedObjects = (originalData, updatedData) => {
    if (!originalData || !updatedData) return [];

    const updatedMap = updatedData.reduce((acc, item) => {
      acc[item.pgId] = item;
      return acc;
    }, {});

    return originalData.reduce((result, originalItem) => {
      const updatedItem = updatedMap[originalItem.pgId];
      if (!updatedItem) return result;

      const changedVariables = getChangedVariables(
        originalItem.variables,
        updatedItem.variables
      );
      if (changedVariables.length > 0) {
        result.push({ ...originalItem, variables: changedVariables });
      }

      return result;
    }, []);
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
  const localServiceData =
    registryAllDetails?.controllerServicesData?.localServices;
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);

  const updatedLocalCsPayloadOnDeploy =
    controllerServiceReduxData?.localServicesData
      ?.map(service => {
        const matchingController = localServiceData
          ?.flatMap(item => item?.controllerData || [])
          ?.find(controller => controller?.identifier === service?.identifier);

        if (!matchingController) return null;
        const updatedProperties = service?.properties
          ?.filter(prop => {
            const matchingProp = matchingController?.properties?.find(
              p => p.name === prop.name
            );
            return matchingProp && matchingProp.value !== prop.value;
          })
          ?.map(prop => ({ name: prop.name, value: prop.value }));
        return {
          name: service?.name,
          identifier: service?.identifier,
          instanceIdentifier: matchingController?.instanceIdentifier,
          properties: updatedProperties || [],
          ...(service?.version && { version: service?.version }),
          ...(service?.referencingComponents && {
            referencingComponents: service?.referencingComponents,
          }),
          ...(service?.state && { state: service?.state }),
          ...(service?.id && { id: service?.id }),
        };
      })
      .filter(Boolean);
  const cleanedPayloadForExternalCs =
    controllerServiceReduxData?.externalServicesData?.map(item => ({
      ...item,
      processors: item.processors.map(processor => {
        const { groupHierarchy, ...rest } = processor;
        return rest;
      }),
    }));
  const singleNamespaceData1 = useSelector(
    NamespacesSelectors.getSingleNamespaceData
  );

  const newProcessorEC =
    registryAllDetails.controllerServicesData?.externalControllerServices?.filter(
      element => element?.newProcessorAvailable === true
    );
  const array2Map = new Map(
    controllerServiceReduxData?.externalServicesData?.map(item => [
      item?.identifier,
      item,
    ])
  );
  const updatedArrayForES = newProcessorEC
    ?.map(item => array2Map?.get(item.identifier) || item)
    ?.map(item => ({
      ...item,
      configuredData: [],
      processors: item.processors.map(processor => {
        const { groupHierarchy, ...rest } = processor;
        return rest;
      }),
    }));

  const filteredCSArrayDiff = CSorignalData?.filter(item1 =>
    controllerServiceReduxData?.localServicesData?.some(
      item2 => item1?.identifier === item2?.identifier
    )
  )
    .map(diffdata => {
      const matchingService =
        controllerServiceReduxData?.localServicesData?.find(
          service => service?.identifier === diffdata?.identifier
        );

      if (!matchingService) return null;

      const filteredProperties =
        diffdata?.properties?.filter(diffProp =>
          matchingService.properties?.some(
            prop =>
              prop?.name === diffProp?.name && prop?.value !== diffProp?.value
          )
        ) || [];

      return {
        identifier: diffdata?.identifier,
        instanceIdentifier: diffdata?.instanceIdentifier,
        name: diffdata?.name,
        properties: filteredProperties,
      };
    })
    .filter(item => item !== null);
  const hasExternalServices =
    !isEmpty(newProcessorEC) || controllerServiceReduxData.externalServicesData;
  const newControllerServiceData = {
    ...(hasExternalServices && {
      externalServicesData: !isEmpty(newProcessorEC)
        ? updatedArrayForES
        : cleanedPayloadForExternalCs,
    }),
    localServicesData: updatedLocalCsPayloadOnDeploy,
  };
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
  const updatedParametersData = paramterDeployArray.map(item => ({
    parameterName: item.name,
    parameters: item.parameters,
  }));
  const currentParametersData = orignalParameterData.map(item => ({
    parameterName: item.name,
    parameters: item.parameters,
  }));
  const registrySelectedId = useSelector(
    NamespacesSelectors.getSelectedRegistryOnDeploy
  );

  const localRegistryIdArr = registryData?.filter(
    item => item?.nifiRegistryId === registrySelectedId
  );

  const getChangedParameterObjects = (obj1, obj2) => {
    const result = [];

    obj1.forEach(group1 => {
      const group2 = obj2.find(g => g.parameterName === group1.parameterName);
      if (!group2) return;

      const changedParameters = group1.parameters
        .filter(param1 => {
          const param2 = group2.parameters.find(p => p.name === param1.name);
          if (!param2) return false;
          return (
            param1.value !== param2.value ||
            param1.description !== param2.description
          );
        })
        .map(param1 => {
          const param2 = group2.parameters.find(p => p.name === param1.name);
          return {
            ...param2,
            value: param1.value !== param2.value ? param2.value : 'N/A',
            description:
              param1.description !== param2.description
                ? param2.description
                : '',
          };
        });

      if (changedParameters.length > 0) {
        result.push({
          parameterName: group1.parameterName,
          parameters: changedParameters,
        });
      }
    });

    return result;
  };

  const getUpdatedPcForPayload = (obj1, obj2) => {
    const result = [];

    obj1.forEach(group1 => {
      const group2 = obj2.find(g => g.parameterName === group1.parameterName);
      if (!group2) return;

      const changedParameters = group1.parameters
        .filter(param1 => {
          const param2 = group2.parameters.find(p => p.name === param1.name);
          if (!param2) return false;

          return (
            param1.value !== param2.value ||
            param1.description !== param2.description
          );
        })
        .map(param1 => {
          const param2 = group2.parameters.find(p => p.name === param1.name);
          return { ...param2 };
        });
      if (changedParameters.length > 0) {
        result.push({
          parameterName: group1.parameterName,
          parameters: changedParameters,
        });
      }
    });

    return result;
  };

  const getOriginalPcPayload = (obj1, obj2) => {
    const result = [];

    obj1.forEach(group1 => {
      const group2 = obj2.find(g => g.parameterName === group1.parameterName);
      if (!group2) return;

      const changedParameters = group1.parameters
        .filter(param1 => {
          const param2 = group2.parameters.find(p => p.name === param1.name);
          if (!param2) return false;

          return (
            param1.value !== param2.value ||
            param1.description !== param2.description
          );
        })
        .map(param1 => ({ ...param1 }));

      if (changedParameters.length > 0) {
        result.push({
          parameterName: group1.parameterName,
          parameters: changedParameters,
        });
      }
    });

    return result;
  };
  const parameterPayload = getUpdatedPcForPayload(
    currentParametersData,
    updatedParametersData
  );

  const originalPc = getOriginalPcPayload(
    currentParametersData,
    updatedParametersData
  );

  const newParametersData = getChangedParameterObjects(
    currentParametersData,
    updatedParametersData
  );

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
  const scheduleStartFlow = useSelector(
    NamespacesSelectors.getScheduleStartFlow
  );

  const scheduleFlowType = useSelector(NamespacesSelectors.getScheduleFlowType);

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

  const breadcrumbDataOnUpgrade = scheduleStartFlow
    ? [
        {
          label: 'Process Group Details',
          path: `/process-group/${selectedNameSpace?.id}`,
        },
        {
          label: 'Configuration Details',
          path: '/process-group/config-details',
        },
        { label: 'Summary' },
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
        {
          label: 'Configuration Details',
          path: '/process-group/config-details',
        },
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
    setIsSanityCheckModalOpen(false);
    const updatedData = paramterDeployArray.map(item => ({
      parameterName: item.name,
      parameters: item.parameters,
    }));
    const payload = {
      namespaceId: checkDestCluster?.value,
      version: registryFlowVerion?.version,
      flowId: registryFlowVerion?.flowId,
      bucketId: registryFlowVerion?.bucketId,
      registryId: registrySelectedId || registryData?.id,
      flowName: formDataRegistry?.selectedFlowName,
      namespaceStatus: flowControlState,
      position: {
        x: XcordUpdated || registryDetailsData?.positions[0]?.x,
        y: YcordUpdated || registryDetailsData?.positions[0]?.y,
      },
      keep_existing_paramter_contexts: formDataRegistry?.keepParameters,
      performSanity: sanityCheckAfterDeploy,
    };

    if (!isEmpty(variblesReduxData)) {
      payload.variablesData = variblesReduxData;
    }
    if (!isEmpty(parameterPayload)) {
      payload.parameterData = parameterPayload;
    }
    if (!isEmpty(newControllerServiceData)) {
      payload.controllerServiceData = newControllerServiceData;
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
      bucketId: checkDestCluster?.bucketId,
      registryId: registrySelectedId || registryData?.id,
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
    if (!isEmpty(parameterPayload)) {
      payload.payload.parameterData = parameterPayload;
    }
    if (!isEmpty(newControllerServiceData)) {
      payload.payload.controllerServiceData = newControllerServiceData;
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
      registryId: registrySelectedId || registryData?.id,
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
      nameSpaceName: registryAllDetails?.processGroupName,
      oldVariablesData: orignalVariables,
      oldParameterContextData: originalPc,
      previousControllerServices: { localServicesData: filteredCSArrayDiff },
      ...(userStoryValue && { user_story_url: userStoryValue }),
      ...(changeRequestValue && { change_request: changeRequestValue }),
    };
    if (!isEmpty(flowControlSelectedScheduleStored)) {
      payload.namespaceStatus = flowControlSelectedScheduleStored;
    }
    if (!isEmpty(variblesReduxData)) {
      payload.variablesData = variblesReduxData;
    }
    if (!isEmpty(parameterPayload)) {
      payload.parameterData = parameterPayload;
    }
    if (!isEmpty(newControllerServiceData)) {
      payload.controllerServiceData = newControllerServiceData;
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
        registryId: registrySelectedId || registryData?.id,
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
        oldParameterContextData: originalPc,
        previousControllerServices: { localServicesData: filteredCSArrayDiff },
        ...(userStoryValue && { user_story_url: userStoryValue }),
        ...(changeRequestValue && { change_request: changeRequestValue }),
      };
      if (!isEmpty(variblesReduxData)) {
        payload.variablesData = variblesReduxData;
      }
      if (!isEmpty(parameterPayload)) {
        payload.parameterData = parameterPayload;
      }
      if (!isEmpty(newControllerServiceData)) {
        payload.controllerServiceData = newControllerServiceData;
      }

      dispatch(NamespacesActions.deployNamespaceByRegistryFlow(payload));
    } else {
      const updatedData = paramterDeployArray.map(item => ({
        parameterName: item.name,
        parameters: item.parameters,
      }));
      const payload = {
        version: versionSelected?.version,
       flowId: selectedNameSpace?.flowId || singleNamespaceData1?.flowId,
      namespaceId: checkDestCluster?.id || singleNamespaceData1?.id,
      registryId: registrySelectedId || registryData?.id || singleNamespaceData1?.registryId,
      bucketId: selectedNameSpace?.bucketId || singleNamespaceData1?.bucketId,
        namespaceStatus: flowControlSelectedScheduleStored || scheduleFlowType,
        payload: {
          namespaceId: checkDestCluster?.value,
          oldVariablesData: orignalVariables,
          oldParameterContextData: originalPc,
          previousControllerServices: {
            localServicesData: filteredCSArrayDiff,
          },
        },
        previousVersion: selectedNameSpace?.version || 1,
        flowName: selectedNameSpace?.flowName || singleNamespaceData1?.flowName,
        isScheduled: true,
        mode: scheduleStartFlow ? scheduleflowtypeMethod : 'upgrade',
        type: scheduleStartFlow ? scheduleflowtypeMethod : type,
        nameSpaceName: selectedNameSpace?.name || singleNamespaceData1?.name,
        scheduledTime: timeDeployScheduleDeployment?.toISOString(),
        revert_local_changes: shouldRevertChanges,
        position: {
          x: XcordUpdated || registryDetailsData?.positions[0]?.x,
          y: YcordUpdated || registryDetailsData?.positions[0]?.y,
        },
        ...(userStoryValue && { user_story_url: userStoryValue }),
        ...(changeRequestValue && { change_request: changeRequestValue }),
      };
      if (!isEmpty(variblesReduxData)) {
        payload.payload.variablesData = variblesReduxData;
      }
      if (!isEmpty(parameterPayload)) {
        payload.payload.parameterData = parameterPayload;
      }
      if (!isEmpty(newControllerServiceData)) {
        payload.payload.controllerServiceData = newControllerServiceData;
      }
      dispatch(NamespacesActions.upgradeCluster(payload));
    }
  };
  const scheduleflowtypeMethod =
    scheduleFlowType === 'STOPPED'
      ? 'stop'
      : scheduleFlowType === 'RUNNING'
        ? 'start'
        : '';

  const scheduleafterDeploy =
    scheduleFlowType === 'STOPPED'
      ? 'STOPPED'
      : scheduleFlowType === 'RUNNING'
        ? 'RUNNING'
        : '';

  const handleScheduleUpgrade = () => {
    const updatedData = paramterDeployArray.map(item => ({
      parameterName: item.name,
      parameters: item.parameters,
    }));
    const payload = {
      version: versionSelected?.version,
      flowId: selectedNameSpace?.flowId || singleNamespaceData1?.flowId,
      namespaceId: checkDestCluster?.id || singleNamespaceData1?.id,
      registryId: registryData?.id || singleNamespaceData1?.registryId,
      bucketId: selectedNameSpace?.bucketId || singleNamespaceData1?.bucketId,
      namespaceStatus: flowControlSelectedScheduleStored || scheduleFlowType,
      revert_local_changes: shouldRevertChanges,
      payload: {
        namespaceId: checkDestCluster?.value,
        oldVariablesData: orignalVariables,
        oldParameterContextData: originalPc,
        previousControllerServices: { localServicesData: filteredCSArrayDiff },
      },
      previousVersion: selectedNameSpace?.version || 1,
      flowName: selectedNameSpace?.flowName || singleNamespaceData1?.flowName,
      isScheduled: true,
      mode: scheduleStartFlow ? scheduleflowtypeMethod : 'upgrade',
      nameSpaceName: selectedNameSpace?.name || singleNamespaceData1?.name,
      scheduledTime: timeDeployScheduleDeployment?.toISOString(),
      position: {
        x: XcordUpdated || selectedNameSpace?.position?.x,
        y: YcordUpdated || selectedNameSpace?.position?.y,
      },
      type: scheduleStartFlow ? scheduleflowtypeMethod : type,
      ...(userStoryValue && { user_story_url: userStoryValue }),
      ...(changeRequestValue && { change_request: changeRequestValue }),
    };

    if (!isEmpty(variblesReduxData)) {
      payload.payload.variablesData = variblesReduxData;
    }
    if (!isEmpty(parameterPayload)) {
      payload.payload.parameterData = parameterPayload;
    }
    if (!isEmpty(newControllerServiceData)) {
      payload.payload.controllerServiceData = newControllerServiceData;
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
    if (!localRegistryIdArr?.[0]?.url) return;
    window.open(localRegistryIdArr?.[0]?.url, '_blank');
  };
  const isScheduled = scheduleDeploymentFlow || scheduleUpgradeFromList;

  const getDeploymentAction = () => {
    // return KDFM.DEPLOY;
    // if (deployByRegistryFlow)
    // return checkDestCluster?.version <= versionSelected.version
    //   ? KDFM.UPGRADE
    //   : KDFM.DOWNGRADE;
    if (!isUpgrade) {
      return type;
    } else return KDFM.DEPLOY;
  };

  const deploymentAction = getDeploymentAction();

  const providePrimaryTextForFlowConfirmationModal = () => {
    return checkFlowControlAfterUpgrade || checkFlowControlAfterDeploy
      ? `Do you really want to ${confirmDialogue?.text}?`
      : `Flow will be ${confirmDialogue?.text} after the ${isRegistryDeploy ? 'deploy' : 'upgrade'}?`;
  };

  const actionIcons = {
    STOPPED: StopIconImage,
    RUNNING: StartIconImage,
    ENABLED: EnableIconImage,
  };

  const defaultIcon = DisbaleIconImage;
  const selectedIcon = actionIcons[confirmDialogue?.action] || defaultIcon;
  const progressbarText =
    deployOrUpgradeDetails?.percentCompleted < 100 ? 'Upgrading' : 'Upgraded';
  const provideScheduleUpgradeBtnText = () => {
    return `${type === 'upgrade' ? KDFM.SCHEDULE_UPGRADE : KDFM.SCHEDULE_DOWNGRADE}`;
  };
  const provideUpgradeBtnText = () => {
    return `${type === 'upgrade' ? KDFM.UPGRADE : KDFM.DOWNGRADE}`;
  };
  const provideRegistryFlowBtnText = () => {
    return isRegistryDeploy ? KDFM.DEPLOY : KDFM.UPGRADE;
  };
  const provideFlowConfigDetails = () => {
    if (scheduleFlowType === 'RUNNING') {
      return 'Scheduled Start Flow';
    }
    if (scheduleFlowType === 'STOPPED') {
      return 'Scheduled Stop Flow';
    }
  };
  const getSelectedFlowName = () => {
    if (deployByRegistryFlow) return formDataRegistry?.selectedFlowName;
    return checkDestCluster?.name || formDataRegistry?.selectedFlowName;
  };

  const selectedFlowNameProvider = getSelectedFlowName();

  // Helper to merge old and new variables for diff modal (only changed)
  const getMergedVariablesData = (original, updated) => {
    if (!original || !updated) return [];
    const updatedMap = updated.reduce((acc, item) => {
      acc[item.pgId] = item;
      return acc;
    }, {});
    return original
      .map(origPg => {
        const updPg = updatedMap[origPg.pgId];
        if (!updPg) return null;
        // Map variable name to value for old and new
        const updVarMap = (updPg.variables || []).reduce((acc, v) => {
          acc[v.name] = v.value;
          return acc;
        }, {});
        const origVarMap = (origPg.variables || []).reduce((acc, v) => {
          acc[v.name] = v.value;
          return acc;
        }, {});
        // Only include changed variables
        const changedNames = Object.keys(updVarMap).filter(
          name =>
            origVarMap[name] !== undefined &&
            updVarMap[name] !== origVarMap[name]
        );
        if (changedNames.length === 0) return null;
        return {
          pgId: origPg.pgId,
          pgName: origPg.pgName,
          variables: changedNames.map(name => ({
            name,
            old_value: origVarMap[name],
            new_value: updVarMap[name],
          })),
        };
      })
      .filter(Boolean);
  };

  // Helper to merge old and new parameters for diff modal (only changed)
  const getMergedParametersData = (original, updated) => {
    if (!original || !updated) return [];
    return original
      .map(origGroup => {
        const updGroup = updated.find(
          g => g.parameterName === origGroup.parameterName
        );
        if (!updGroup) return null;
        // Map param name to value/desc for old and new
        const updParamMap = (updGroup.parameters || []).reduce((acc, p) => {
          acc[p.name] = { value: p.value, description: p.description };
          return acc;
        }, {});
        const origParamMap = (origGroup.parameters || []).reduce((acc, p) => {
          acc[p.name] = { value: p.value, description: p.description };
          return acc;
        }, {});
        // Only include changed parameters
        const changedNames = Object.keys(updParamMap).filter(name => {
          const oldVal = origParamMap[name];
          const newVal = updParamMap[name];
          return (
            oldVal &&
            (oldVal.value !== newVal.value ||
              oldVal.description !== newVal.description)
          );
        });
        if (changedNames.length === 0) return null;
        return {
          parameterName: origGroup.parameterName,
          parameters: changedNames.map(name => ({
            name,
            old_value: origParamMap[name],
            new_value: updParamMap[name],
            description:
              updParamMap[name]?.description || origParamMap[name]?.description,
          })),
        };
      })
      .filter(Boolean);
  };

  // Helper to merge old and new controller service properties for diff modal (only changed)
  const getMergedControllerServicesData = (original, updated) => {
    if (!original || !updated) return [];
    // Flatten original to map by identifier
    const origMap = (original || [])
      .flatMap(item => item?.controllerData || [])
      .reduce((acc, cs) => {
        acc[cs.identifier] = cs;
        return acc;
      }, {});
    return (updated || [])
      .map(service => {
        const orig = origMap[service.identifier];
        if (!orig) return null;
        // Map property name to value for old and new
        const updPropMap = (service.properties || []).reduce((acc, p) => {
          acc[p.name] = p.value;
          return acc;
        }, {});
        const origPropMap = (orig.properties || []).reduce((acc, p) => {
          acc[p.name] = p.value;
          return acc;
        }, {});
        // Only include changed properties
        const changedNames = Object.keys(updPropMap).filter(
          name =>
            origPropMap[name] !== undefined &&
            updPropMap[name] !== origPropMap[name]
        );
        // Detect name change
        const nameChanged =
          service.name !== undefined &&
          orig.name !== undefined &&
          service.name !== orig.name;

        if (changedNames.length === 0 && !nameChanged) return null;
        return {
          identifier: service.identifier,
          name: orig.name,
          new_name: nameChanged ? service.name : '',
          properties: changedNames.map(name => ({
            name,
            old_value: origPropMap[name],
            new_value: updPropMap[name],
          })),
        };
      })
      .filter(Boolean);
  };

  const mergedVariablesData = getMergedVariablesData(
    registryAllDetails?.variablesData,
    variblesReduxData
  );
  const mergedParametersData = getMergedParametersData(
    currentParametersData,
    updatedParametersData
  );
  const mergedControllerServicesData = getMergedControllerServicesData(
    registryAllDetails?.controllerServicesData?.localServices,
    controllerServiceReduxData?.localServicesData
  );

  // Function to determine loading text based on current operation
  const getLoadingText = () => {
    if (loadingregistry) {
      if (scheduleDeploymentFlow || scheduleUpgradeFromList) {
        // For scheduled operations
        if (scheduleStartFlow) {
          // Handle schedule start/stop flow
          if (scheduleFlowType === 'RUNNING') {
            return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_STARTING_FLOW;
          } else if (scheduleFlowType === 'STOPPED') {
            return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_STOPPING_FLOW;
          }
        }
        // For schedule deploy, check scheduleDeploymentFlow first
        if (scheduleDeploymentFlow) {
          return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DEPLOYING_FLOW;
        }
        // For schedule upgrade/downgrade
        if (scheduleUpgradeFromList) {
          return type === 'upgrade'
            ? NAMESPACE_CONSTANTS.LOADING_SCHEDULE_UPGRADING_FLOW
            : NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DOWNGRADING_FLOW;
        }
        // Fallback for other schedule operations
        if (deployByRegistryFlow) {
          return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DEPLOYING_FLOW;
        } else {
          return type === 'upgrade'
            ? NAMESPACE_CONSTANTS.LOADING_SCHEDULE_UPGRADING_FLOW
            : NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DOWNGRADING_FLOW;
        }
      } else {
        // For manual operations
        if (deployByRegistryFlow) {
          return NAMESPACE_CONSTANTS.LOADING_DEPLOYING_FLOW;
        } else {
          return type === 'upgrade'
            ? NAMESPACE_CONSTANTS.LOADING_UPGRADING_FLOW
            : NAMESPACE_CONSTANTS.LOADING_DOWNGRADING_FLOW;
        }
      }
    }
    if (loadingreUpgradeFlow) {
      if (scheduleDeploymentFlow || scheduleUpgradeFromList) {
        if (scheduleStartFlow) {
          // Handle schedule start/stop flow
          if (scheduleFlowType === 'RUNNING') {
            return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_STARTING_FLOW;
          } else if (scheduleFlowType === 'STOPPED') {
            return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_STOPPING_FLOW;
          }
        }
        // For schedule deploy, check scheduleDeploymentFlow first
        if (scheduleDeploymentFlow) {
          return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DEPLOYING_FLOW;
        }
        // For schedule upgrade/downgrade
        if (scheduleUpgradeFromList) {
          return type === 'upgrade'
            ? NAMESPACE_CONSTANTS.LOADING_SCHEDULE_UPGRADING_FLOW
            : NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DOWNGRADING_FLOW;
        }
        // Fallback for other schedule operations
        if (deployByRegistryFlow) {
          return NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DEPLOYING_FLOW;
        } else {
          return type === 'upgrade'
            ? NAMESPACE_CONSTANTS.LOADING_SCHEDULE_UPGRADING_FLOW
            : NAMESPACE_CONSTANTS.LOADING_SCHEDULE_DOWNGRADING_FLOW;
        }
      } else {
        return type === 'upgrade'
          ? NAMESPACE_CONSTANTS.LOADING_UPGRADING_FLOW
          : NAMESPACE_CONSTANTS.LOADING_DOWNGRADING_FLOW;
      }
    }
    if (loadingreUpdateFlow) {
      return NAMESPACE_CONSTANTS.LOADING_UPDATING_FLOW_STATUS;
    }
    return KDFM.LOADING;
  };

  return (
    <>
      <MainContainer className="main-space bg-white">
        <FullPageLoader
          loading={
            loadingregistry || loadingreUpdateFlow || loadingreUpgradeFlow
          }
          text={getLoadingText()}
        />
        <TopTitleBar className="d-flex mb-3">
          <MainTitleDiv className="d-flex">
            <ImageContainer>
              <TodoIcon />
            </ImageContainer>
            <MainTitleHfour className="mb-0">
              {scheduleStartFlow
                ? scheduleFlowType === 'RUNNING'
                  ? 'Schedule Start Flow'
                  : scheduleFlowType === 'STOPPED'
                    ? 'Schedule Stop Flow'
                    : null
                : `${isScheduled ? 'Schedule ' : ''}${deploymentAction} ${KDFM.NAMESPACE}`}
            </MainTitleHfour>
            :
            <MainTitleHfour className="mb-0">
              {!isUpgrade
                ? selectedNameSpace?.label
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
                        {selectedFlowNameProvider}
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
                              color: '#FF7A00',
                              textDecoration: 'underline',
                            }}
                          >
                            {localRegistryIdArr?.[0]?.url}
                          </span>
                          <div
                            data-tooltip-id={`copy-board-namespace-summary1`}
                          >
                            <CopyToClipboard
                              className="summary-clipboard"
                              copyItem={localRegistryIdArr?.[0]?.url}
                            />
                          </div>
                          <ReactTooltip
                            id={`copy-board-namespace-summary1`}
                            place="bottom"
                            effect="solid"
                            content={'Copy Registry URL'}
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
                              color: '#FF7A00',
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
                            content={'Copy Cluster URL'}
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
                          {versionSelected?.version}
                        </SummaryDetailsPtag>
                      </div>
                    </UseColXl>
                  )}
                  <UseColXl className="col-xl-4 col-6 mb-4 pb-1">
                    <div className="summary-details">
                      <SummaryDetailsHFourTag className="mb-2">
                        {KDFM.CONFIGURATION_DETAILS}
                      </SummaryDetailsHFourTag>
                      <SummaryDetailsPtag
                        onClick={() => {
                          setOpenConfigDetailsModal(true);
                        }}
                        className="mb-0"
                        style={{
                          cursor: 'pointer',
                          color: '#FF7A00',
                          textDecoration: 'underline',
                        }}
                      >
                        View Configurations Details
                      </SummaryDetailsPtag>
                    </div>
                  </UseColXl>
                  {isRegistryDeploy && (
                    <>
                      <UseColXl className="col-xl-4 col-6 mb-4 pb-1 row">
                        {hasSanityCheckAccess === true && (
                          <div className="summary-details d-flex">
                            <SummaryDetailsHFourTag className="mb-2">
                              <CheckboxField
                                name="check"
                                label="Sanity Check and Deploy"
                                checked={sanityCheckAfterDeploy}
                                onChange={e =>
                                  dispatch(
                                    NamespacesActions.setSanityCheckAtDeploy(
                                      e.target.checked
                                    )
                                  )
                                }
                              />
                            </SummaryDetailsHFourTag>
                            <div
                              className="d-flex align-items-center ms-2"
                              data-tooltip-id={`sanity-check-info`}
                            >
                              <InfoIcon color={theme.colors.primary} />
                            </div>
                            <ReactTooltip
                              id={`sanity-check-info`}
                              place="bottom"
                              effect="solid"
                              content={
                                'This deployment will be performed using the DFM (Data Flow Manager) UI in NiFi. Also upon deployment, it ensures that all processors remain in the STOPPED state and are not scheduled to run automatically'
                              }
                              style={{
                                width: '400px',
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                zIndex: 10000,
                              }}
                            />
                          </div>
                        )}
                      </UseColXl>
                    </>
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
                            {scheduleStartFlow
                              ? scheduleafterDeploy
                              : flowControlSelectedScheduleStored || 'N/A'}
                          </SummaryDetailsPtag>
                        </div>
                      </UseColXl>
                    </RowConfig>
                  </UseColLg>
                </>
              )}
              {!scheduleDeploymentFlow &&
                !scheduleUpgradeFromList &&
                !sanityCheckAfterDeploy && (
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
              {!scheduleDeploymentFlow &&
                !scheduleUpgradeFromList &&
                !sanityCheckAfterDeploy && (
                  <CustomNine className="col-4 mb-3">
                    <ActiveButtonContainer className="d-flex ">
                      <TextDetails className="col-lg-12">
                        Processor Details
                      </TextDetails>
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
              {!scheduleDeploymentFlow &&
                !scheduleUpgradeFromList &&
                !sanityCheckAfterDeploy && (
                  <ActiveButtonContainer className="d-flex ">
                    <TextDetails className="col-lg-12">
                      Control Action
                    </TextDetails>
                    {!(
                      processStatus?.runningCount === 0 &&
                      processStatus?.stoppedCount === 0
                    ) ? (
                      <>
                        <TextsvgDiv className="d-flex">
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
                            <IconCover>
                              <TriangleIcons color="#58e715" />
                            </IconCover>
                            <div className="mr-2">{KDFM.RUNNING_FLOW}</div>
                          </ActiveButtonDiv>
                        </TextsvgDiv>
                        <TextsvgDiv className="d-flex">
                          <ActiveButtonDiv
                            className="div-btn-2"
                            isActive={activeButton === 'STOPPED'}
                            activeColor="#c52b2b"
                            hoverColor="#c52b2b"
                            activeTextColor="#fff"
                            data-tooltip-id="stoppedProcessor"
                            onClick={() => {
                              handleUpdateStatus('STOPPED');
                            }}
                          >
                            <IconCover>
                              <SquareBoxIcon color="#c52b2b" />
                            </IconCover>
                            <div>{KDFM.STOPPED_FLOW}</div>
                          </ActiveButtonDiv>
                        </TextsvgDiv>
                        {activeButton && (
                          <TextsvgDiv className="d-flex">
                            <ActiveButtonDivResetFlow
                              className="div-btn-3"
                              activeTextColor="#fff"
                              onClick={() => {
                                setActiveButton(null);
                                setFlowControlState(null);
                              }}
                            >
                              <IconCover>
                                {' '}
                                <CrossIcon color="#B5BDC8" />{' '}
                              </IconCover>
                              <div>Reset Flow</div>
                            </ActiveButtonDivResetFlow>
                          </TextsvgDiv>
                        )}
                      </>
                    ) : (
                      <div className="text_info">
                        {KDFM.FLOW_CONTROL_WARNING}
                      </div>
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
              <Button
                id="process-group-summary-deploy-btn"
                onClick={() => {
                  sanityCheckAfterDeploy
                    ? setIsSanityCheckModalOpen(true)
                    : handledeployByRegistry();
                }}
              >
                {provideRegistryFlowBtnText()}
              </Button>
            )}
            {!isRegistryDeploy &&
              !scheduleDeploymentFlow &&
              !scheduleUpgradeFromList && (
                <Button
                  id="process-group-summary-upgrade-btn"
                  onClick={handleUpgradeByRegistry}
                >
                  {provideUpgradeBtnText()}
                </Button>
              )}
            {scheduleDeploymentFlow && (
              <Button
                id="summary-schedule-btn"
                size="md"
                onClick={() => handleScheduleDeploy()}
              >
                Schedule
              </Button>
            )}
            {scheduleUpgradeFromList && (
              <Button
                id="summary-schedule-upgrade-btn"
                size="md"
                onClick={() => handleScheduleUpgrade()}
              >
                {scheduleStartFlow
                  ? provideFlowConfigDetails()
                  : provideScheduleUpgradeBtnText()}
              </Button>
            )}
          </BottomButtonDiv>
          {isUpgrading && (
            <div className="w-100 mt-3">
              <Progressox className="w-100">
                <ProgressLabel className="progress-label">
                  {progressbarText}
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
          icon={<img src={selectedIcon} height="80px" width="80px" alt="img" />}
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
          primaryText={providePrimaryTextForFlowConfirmationModal()}
          onSubmit={handleConfirmUpdateStatus}
        />
        <DuplicateScheduleModal
          handleScheduleDeployDuplicate={handleScheduleDeployDuplicate}
          type={type}
        />
        {openConfigDetailsModal && (
          <DiffModalScheduleList
            isModalOpen={openConfigDetailsModal}
            setIsModalOpen={setOpenConfigDetailsModal}
            title={`${
              !isUpgrade
                ? selectedNameSpace.label
                : formDataRegistry?.selectedFlowName
            }: ${
              isScheduled && isUpgrade
                ? 'Schedule Deployment'
                : isScheduled && !isUpgrade
                  ? `Schedule ${type === 'downgrade' ? 'Downgrade' : 'Upgrade'}`
                  : !isScheduled && !isUpgrade
                    ? type === 'downgrade'
                      ? 'Downgrade'
                      : 'Upgrade'
                    : 'Deployment'
            } Changes`}
            versionText={`Version: ${
              isUpgrade
                ? versionSelected?.version
                : checkDestCluster?.version || 'N/A'
            }`}
            isFromDeploySummary={true}
            parametersData={mergedParametersData}
            variablesData={mergedVariablesData}
            csData={mergedControllerServicesData}
          />
        )}
        <SanityCheckDeployModal />
      </MainContainer>
      <ModalWithIcon
        title={'Sanity Check Confirmation'}
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
        icon={<ExclamationIcon height={120} width={150} />}
        isOpen={isSanityCheckModalOpen}
        onRequestClose={() => setIsSanityCheckModalOpen(false)}
        primaryText={'Would you like to perform a Sanity Check ?'}
        secondaryText={'The process group will be automatically stopped'}
        onSubmit={handledeployByRegistry}
      />
    </>
  );
};

export default Summary;
