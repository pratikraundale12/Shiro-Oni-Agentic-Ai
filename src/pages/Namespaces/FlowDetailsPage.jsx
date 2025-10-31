import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import * as Yup from 'yup';
import {
  CanvasXIcon,
  CanvasYIcon,
  LinkIcon,
  ProcessorGroupIcon,
  ProcessorIcon,
  QRIcons,
  SelectedProcessGrpIcon,
  TodoIcon,
  UpsideSquareIcon,
} from '../../assets';
import LocalChangesIcon from '../../assets/Icons/LocalChangesIcon';
import RightIcon from '../../assets/Icons/RightIcon';
import { FullPageLoader, Table } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, CheckboxField, InputField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SchedularSelectors } from '../../store/schedular';
import { theme } from '../../styles';
import { VERSION_COLUMNS } from '../ColumnData/namespaceColumns';
import LocalChangesModal from './LocalChangesModal';
import RectangleGraph from './birdEyeViewGraph';
import { SettingsActions } from '../../store/settings';

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
  margin-right: calc(-0.5 * 1.5rem);
  margin-left: calc(-0.5 * 1.5rem);
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const CustomTable = styled(Table)`
  max-height: 400px;
  overflow: auto;
  tr {
    padding: 0;
    height: 0;
  }
  overflow-y: auto;
  overflow-x: hidden;
  td {
    height: auto !important;
    .td-text-wrap {
      word-wrap: normal;
      white-space: normal;
      word-break: break-all;
    }
  }
`;
const VersionDiv = styled.div`
  margin-bottom: 1rem;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const ColLgSix = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }

  @media screen and (min-width: 992px) {
    &.col-lg-6 {
      flex: 0 0 auto;
      width: 50%;
    }
  }
`;

const ColXlTwo = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }

  @media screen and (min-width: 1200px) {
    &.col-xl-2 {
      flex: 0 0 auto;
      width: 16.66666667%;
    }
  }
`;
const ColXlSix = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }

  @media screen and (min-width: 1200px) {
    &.col-xl-5 {
      flex: 0 0 auto;
      width: 41.66666667%;
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

const ProcessorIconDiv = styled.div`
  padding-right: 1.5rem;
`;

const RevertlocalChangesCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: fit-content;
`;

const FlowDetailsPage = () => {
  const dispatch = useDispatch();
  const registryAllDetails = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  const formDataRegistry = useSelector(NamespacesSelectors.getDeployFormData);
  const registryData = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );

  const registryDropdownOptions = registryData.map(item => ({
    label: item?.name,
    value: item?.nifiRegistryId,
    default_registry_id: item?.is_default,
    url: item?.url,
  }));

  const defaultRegistry = registryDropdownOptions.find(
    item => item.default_registry_id === true
  );
  const defaultRegistryUrl = defaultRegistry?.url || '';
  const registryDetailsData = useSelector(
    NamespacesSelectors.getRegistryAllDetails
  );
  const scheduleUpgradeFromList = useSelector(
    SchedularSelectors.getScheduleFromList
  );
  const scheduleDeploymentFlow = useSelector(
    NamespacesSelectors.getScheduleByRegistry
  );
  const scheduleStartFlow = useSelector(
    NamespacesSelectors.getScheduleStartFlow
  );
  const userStoryValue = useSelector(NamespacesSelectors.getUserStory);
  const changeRequestValue = useSelector(NamespacesSelectors.getChangeRequest);
  const storedXcord = useSelector(NamespacesSelectors.getregistryFlowXCord);
  const storedYcord = useSelector(NamespacesSelectors.getregistryFlowYCord);
  const versionListData = useSelector(NamespacesSelectors.getVersionListData);
  const versionSelected = useSelector(NamespacesSelectors.getVersionSelect);
  const [selectedVersion, setSelectedVersion] = useState(
    versionSelected?.version
  );
  const [xStateCoordinate, setXStateCoordiate] = useState(null);
  const [yStateCoordinate, setYStateCoordiate] = useState(null);
  const tableRef = useRef(null);
  const shouldRevertChanges = useSelector(
    NamespacesSelectors.getShouldRevertChanges
  );
  const registrySelectedId = useSelector(
    NamespacesSelectors.getSelectedRegistryOnDeploy
  );

  useEffect(() => {
    if (isUpgrade) {
      if (registryDetailsData?.positions?.[0]?.x !== undefined) {
        setXStateCoordiate(registryDetailsData?.positions[0]?.x);
        setYStateCoordiate(registryDetailsData?.positions?.[0]?.y);
      }
    }
    if (!isUpgrade) {
      if (selectedNameSpace?.position?.x !== undefined) {
        setXStateCoordiate(selectedNameSpace?.position?.x);
        setYStateCoordiate(selectedNameSpace?.position?.y);
      }
    }
  }, [registryDetailsData, selectedNameSpace, isUpgrade]);

  const sortedArray = useMemo(() => {
    const data = versionListData?.graphData?.data ?? [];
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(item => ({
      x: Number(item?.position?.x),
      y: Number(item?.position?.y),
      width: 384,
      height: 176,
      color: item?.isProcessor ? '#BFDFDF' : 'teal',
    }));
  }, [versionListData]);

  const updatedDataForGraph = useMemo(() => {
    const newBox = {
      x:
        storedXcord ||
        xStateCoordinate ||
        registryDetailsData?.position?.[0]?.x ||
        0,
      y:
        storedYcord ||
        yStateCoordinate ||
        registryDetailsData?.position?.[0]?.y ||
        0,
      width: 384,
      height: 176,
      color: theme.colors.primary,
    };
    return [...sortedArray, newBox];
  }, [
    sortedArray,
    xStateCoordinate,
    yStateCoordinate,
    registryDetailsData,
    theme,
  ]);

  const enhancedData = useMemo(() => {
    return updatedDataForGraph.map((d, index) => ({
      ...d,
      id: index,
    }));
  }, [updatedDataForGraph]);

  const updatedDataForUpgrade = useMemo(() => {
    return sortedArray.map(d => {
      if (
        d?.x === selectedNameSpace?.position?.x &&
        d?.y === selectedNameSpace?.position?.y
      ) {
        return {
          x: storedXcord || xStateCoordinate || selectedNameSpace?.position?.x,
          y: storedYcord || yStateCoordinate || selectedNameSpace?.position?.y,
          width: 384,
          height: 176,
          color: theme.colors.primary,
        };
      } else return d;
    });
  }, [
    sortedArray,
    selectedNameSpace,
    storedXcord,
    xStateCoordinate,
    storedYcord,
    yStateCoordinate,
    theme,
  ]);
  const enhancedDataForUpgrade = useMemo(() => {
    return updatedDataForUpgrade.map((d, index) => ({
      ...d,
      id: index,
    }));
  }, [updatedDataForUpgrade]);

  const breadcrumbOnDeploy = [
    {
      label: KDFM.NIFI_FLOW,
      path: '/process-group',
      callback: () => {
        dispatch(NamespacesActions.setSelectedNamespace({}));
      },
    },
    { label: 'Registry & Flow Name', path: '/process-group/deployPage' },
    { label: 'Flow Details' },
  ];
  const breadcrumbOnUpgrade = [
    {
      label: KDFM.NIFI_FLOW,
      path: '/process-group',
      callback: () => {
        dispatch(NamespacesActions.setSelectedNamespace({}));
      },
    },
    { label: KDFM.FLOW_DETAILS },
  ];

  const handleClick = () => {
    if (isUpgrade) {
      history.push('/process-group/config-details');
    } else {
      if (scheduleStartFlow) {
        dispatch(
          NamespacesActions.fetchRegistryFlowDetails({
            bucketId: selectedNameSpace?.bucketId,
            flowId: selectedNameSpace?.flowId,
            version: selectedVersion,
          })
        );
      } else if (selectedVersion === selectedNameSpace?.version) {
        toast.info('The selected version is already deployed.');
      } else {
        dispatch(
          NamespacesActions.fetchRegistryFlowDetails({
            bucketId: selectedNameSpace?.bucketId,
            flowId: selectedNameSpace?.flowId,
            version: selectedVersion,
          })
        );
      }
    }
  };

  const handleScrollOnClick = () => {
    if (!tableRef?.current);
    if (selectedVersion === selectedNameSpace?.version) {
      tableRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
    handleClick();
  };

  const handleRowClick = item => {
    if (scheduleStartFlow) {
      toast.info('Version selection is disabled in schedule start flow');
      return;
    }
    setSelectedVersion(item?.version);
    dispatch(NamespacesActions.setVersionSelect({ version: item?.version }));
    if (item?.version !== selectedVersion) {
      dispatch(NamespacesActions.setCsLocalData({}));
      dispatch(NamespacesActions.setIsLocalCsConfigured(false));
      dispatch(NamespacesActions.setPcLocalData({}));
      dispatch(NamespacesActions.setVariableLocalData([]));
      dispatch(NamespacesActions.setIsLocalPcUpdated(false));
      dispatch(NamespacesActions.setIsLocalVariableUpdated(false));
      dispatch(NamespacesActions.setRegistryDeployControllerService({}));
      dispatch(NamespacesActions.setRegistryDeployParameterContext([]));
      dispatch(NamespacesActions.setRegistryDeployVariable([]));
      dispatch(NamespacesActions.setVersionListReduxData([]));
      dispatch(NamespacesActions.setAlreadyFetchedLsIdentifierForUpgrade([]));
      dispatch(NamespacesActions.setLocalServiceInUpgrade([]));
    }
  };

  const handleBackClick = () => {
    !isUpgrade
      ? history.push('/process-group')
      : history.push('/process-group/deployPage');
    if (!isUpgrade) {
      dispatch(NamespacesActions.setSelectedNamespace({}));
    }
  };

  const handleXCoordinateChangeInput = e => {
    if (e.target.value && e.target.value !== '-') {
      setXStateCoordiate(Number(e.target.value));
      dispatch(NamespacesActions.setRegistryFlowXCord(Number(e.target.value)));
    } else if (e.target.value === '-') {
      setXStateCoordiate(Number(0));
      dispatch(NamespacesActions.setRegistryFlowXCord(Number(0)));
    } else {
      setXStateCoordiate(null);
      dispatch(NamespacesActions.setRegistryFlowXCord(null));
    }
  };
  const handleRadioChange = item => {
    dispatch(NamespacesActions.setVersionSelect({ version: item?.version }));
  };
  const sortedData = versionListData?.versionList
    ?.slice()
    .sort((a, b) => b?.version - a?.version);

  const handleYCoordinateChangeInput = e => {
    if (e.target.value) {
      setYStateCoordiate(Number(e.target.value));
      dispatch(NamespacesActions.setRegistryFlowYCord(Number(e.target.value)));
    } else {
      setYStateCoordiate(null);
      dispatch(NamespacesActions.setRegistryFlowYCord(null));
    }
  };

  const loadingregistry = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryFlowDetails')
  );

  const loadingVersion = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchVersionData')
  );

  const loadingRevertChanges = useSelector(state =>
    LoadingSelectors.getLoading(state, 'revertLocalChanges')
  );

  const enableTour = useSelector(AuthenticationSelectors.getDfmTour);
  const stepIndex = useSelector(ClustersSelectors.getTourIndex);
  if (enableTour) {
    if (stepIndex != 9) {
      setTimeout(() => {
        setTimeout(() => {
          dispatch(ClustersActions.setTourIndex(9));
          dispatch(ClustersActions.setTourStart(true));
        }, 50);
      }, 300);
    }
  }
  const getIconForState = state => {
    switch (state) {
      case 'LOCALLY_MODIFIED_AND_STALE':
        return <LocalChangesIcon />;
      case 'STALE':
        return <UpsideSquareIcon color="#BB564A" />;
      case 'LOCALLY_MODIFIED':
        return <LocalChangesIcon />;
      case 'UP_TO_DATE':
        return <RightIcon />;
      default:
        return null;
    }
  };

  const isStateStale =
    selectedNameSpace?.state === 'STALE' ||
    selectedNameSpace?.state === 'UP_TO_DATE';

  const isButtonDisabled =
    versionListData?.versionList?.length === 1 && !scheduleStartFlow;

  useEffect(() => {
    if (!isUpgrade && !scheduleStartFlow) {
      if (versionListData?.versionList?.length === 1) {
        toast.info(
          "This process group can't be upgraded as there is only one version available"
        );
      }
    }
  }, [versionListData?.versionList, isUpgrade, scheduleStartFlow]);
  const schemaForStoryAndChangeRequest = Yup.object().shape({
    change_request: Yup.string()
      .trim()
      .matches(
        /^[a-zA-Z0-9]{10}$/,
        'Change request number must be exactly 10 alphanumeric characters'
      )
      .required('Change request is required'),
  });
  const emptySchema = Yup.object().shape({});
  const getSchemaForValidation = () => {
    if (!(scheduleDeploymentFlow || scheduleUpgradeFromList)) {
      return emptySchema;
    }
    if (scheduleDeploymentFlow || scheduleUpgradeFromList) {
      return registryDetailsData?.change_request_enable ||
        versionListData?.change_request_enable
        ? schemaForStoryAndChangeRequest
        : emptySchema;
    }
    return emptySchema;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchemaForValidation()),
  });
  const user_story_var = watch('user_story');
  const change_request_var = watch('change_request');
  useEffect(() => {
    if (dispatch && !isEmpty(user_story_var)) {
      dispatch(NamespacesActions.setUserStory(user_story_var));
    } else if (isEmpty(user_story_var)) {
      dispatch(NamespacesActions.setUserStory(null));
    }
  }, [dispatch, user_story_var]);
  useEffect(() => {
    if (dispatch && !isEmpty(change_request_var)) {
      dispatch(NamespacesActions.setChangeRequest(change_request_var));
    } else if (isEmpty(change_request_var)) {
      dispatch(NamespacesActions.setChangeRequest(null));
    }
  }, [dispatch, change_request_var]);

  const localRegistryIdArr = registryData?.filter(
    item =>
      item?.nifiRegistryId ===
      (selectedNameSpace?.registryId || registrySelectedId)
  );

  useEffect(() => {
    dispatch(SettingsActions.setSettingsData({}));
  }, [dispatch]);

  return (
    <div>
      <FullPageLoader
        loading={loadingregistry || loadingVersion || loadingRevertChanges}
      />
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {scheduleDeploymentFlow || scheduleUpgradeFromList
              ? 'Schedule '
              : ''}
            {!isUpgrade ? 'Upgrade Process Group' : 'Deploy Process Group'}
          </MainTitleHfour>
          :
          <MainTitleHfour className="mb-0">
            {!isUpgrade
              ? selectedNameSpace.label
              : formDataRegistry?.selectedFlowName}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb
          module="upgrade"
          path={!isUpgrade ? breadcrumbOnUpgrade : breadcrumbOnDeploy}
        />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <RowConfig className="row">
            <div className={`${isUpgrade ? 'col-lg' : 'col-lg'}`}>
              <div className="d-flex justify-content-between align-items-center">
                <InputField
                  name="namespace"
                  type="text"
                  label={'Selected Flow Name'}
                  value={
                    !isUpgrade
                      ? selectedNameSpace?.label
                      : formDataRegistry?.selectedFlowName
                  }
                  icon={<QRIcons />}
                  disabled
                />
              </div>
            </div>

            {!isUpgrade && (
              <ColXlSix className="col-lg" data-tooltip-id="state-tooltip">
                <InputField
                  name="currentState"
                  type="text"
                  label={KDFM.CURRENT_STATE}
                  value={selectedNameSpace?.stateExplanation || 'N/A'}
                  icon={getIconForState(selectedNameSpace?.state)}
                  disabled
                />
                <ReactTooltip
                  id="state-tooltip"
                  place="top"
                  effect="solid"
                  content={
                    selectedNameSpace?.stateExplanation ||
                    'No explanation provided'
                  }
                />
              </ColXlSix>
            )}

            <ColXlTwo className={`${isUpgrade ? 'col-lg-3' : 'col-lg-3'}`}>
              <InputField
                name="currentVersion"
                type="text"
                label={KDFM.CURRENT_VERSION}
                placeholder="N/A"
                value={
                  !isUpgrade
                    ? selectedNameSpace?.version
                    : versionSelected?.version || 'N/A'
                }
                icon={<QRIcons />}
                disabled
              />
            </ColXlTwo>
            <div className="col-12 px-3"></div>
            <div className="col-12 px-3">
              <RowConfig className="row">
                <ColLgSix className="col-lg-6 col-12">
                  <VersionDiv>{KDFM.NAVIGATE}</VersionDiv>
                  {
                    <RectangleGraph
                      data={!isUpgrade ? enhancedDataForUpgrade : enhancedData}
                      setXStateCoordiate={setXStateCoordiate}
                      setYStateCoordiate={setYStateCoordiate}
                      xCurrent={
                        storedXcord ||
                        xStateCoordinate ||
                        selectedNameSpace?.position?.x
                      }
                      yCurrent={
                        storedYcord ||
                        yStateCoordinate ||
                        selectedNameSpace?.position?.y
                      }
                      referenceDataArray={
                        versionListData?.graphData?.data || []
                      }
                    />
                  }
                </ColLgSix>
                <ColLgSix className="col-lg-6 col-12 d-flex flex-column">
                  <RowConfig className="row align-items-end order-2 order-lg-1">
                    <ColLgSix className="col-lg-6 col-12">
                      <InputField
                        name="x"
                        type="text"
                        disabled="true"
                        label={KDFM.CANVAS_POSITION}
                        value={
                          storedXcord ||
                          xStateCoordinate ||
                          selectedNameSpace?.position?.x ||
                          0
                        }
                        icon={<CanvasXIcon />}
                        onChange={e => handleXCoordinateChangeInput(e)}
                      />
                    </ColLgSix>
                    <ColLgSix className="col-lg-6 col-12">
                      <InputField
                        name="y"
                        type="text"
                        label=""
                        disabled="true"
                        value={
                          storedYcord ||
                          yStateCoordinate ||
                          selectedNameSpace?.position?.y ||
                          0
                        }
                        icon={<CanvasYIcon />}
                        onChange={e => handleYCoordinateChangeInput(e)}
                      />
                    </ColLgSix>
                  </RowConfig>
                  {(scheduleDeploymentFlow || scheduleUpgradeFromList) && (
                    <RowConfig className="row align-items-end order-2 order-lg-1">
                      <ColLgSix className="col-lg-6 col-12">
                        <InputField
                          name="user_story"
                          type="text"
                          label={KDFM.USER_STORY}
                          value={userStoryValue ?? ''}
                          icon={<QRIcons />}
                          register={register}
                          errors={errors}
                        />
                      </ColLgSix>
                      {(registryDetailsData?.change_request_enable ||
                        versionListData?.change_request_enable) && (
                        <ColLgSix className="col-lg-6 col-12">
                          <InputField
                            name="change_request"
                            type="text"
                            label={KDFM.CHANGE_REQUEST}
                            value={changeRequestValue ?? ''}
                            icon={<QRIcons />}
                            register={register}
                            errors={errors}
                            isFromUserStory={true}
                          />
                        </ColLgSix>
                      )}
                    </RowConfig>
                  )}
                  <ColLgSix className="order-1 order-lg-2 ps-0 mt-3 mt-lg-0 mb-3 mb-lg-0">
                    <VersionDiv>{KDFM.LEGENDS}</VersionDiv>
                    <ColLgSix className="d-flex flex-wrap gap-3 ps-0">
                      <ProcessorGroupIcon />
                      <ProcessorIconDiv>
                        <ProcessorIcon />
                      </ProcessorIconDiv>
                      <SelectedProcessGrpIcon />
                    </ColLgSix>
                  </ColLgSix>
                </ColLgSix>
              </RowConfig>
            </div>
            <div className="col-12 p-3">
              <RowConfig className="row">
                <ColLgSix className="col-lg-6 col-12">
                  <InputField
                    name="nifiurl"
                    type="text"
                    label={KDFM.NIFI_URL}
                    placeholder={KDFM.ENTER_NIFI_URL}
                    value={
                      registryAllDetails?.nifi_url ||
                      registryData?.nifiUrl ||
                      versionListData?.graphData?.nifiUrl
                    }
                    icon={<LinkIcon />}
                    disabled
                  />
                </ColLgSix>
                <ColLgSix className="col-lg-6 col-12">
                  <InputField
                    name="registry_url"
                    type="text"
                    label={KDFM.REGISTRY_URL}
                    placeholder={KDFM.ENTER_REGISTRY_URL}
                    value={
                      selectedNameSpace?.registryUrl ||
                      registryData?.url ||
                      localRegistryIdArr?.[0]?.url ||
                      registryDropdownOptions?.[0]?.url ||
                      defaultRegistryUrl
                    }
                    icon={<LinkIcon />}
                    disabled
                  />
                </ColLgSix>
              </RowConfig>
            </div>
          </RowConfig>
          {!isUpgrade && (
            <>
              <VersionDiv ref={tableRef}>{KDFM.VERSION_CONTROL}</VersionDiv>
              <CustomTable
                className="td-text-wrap"
                data={sortedData || []}
                columns={VERSION_COLUMNS({
                  selectedVersion,
                  handleRadioChange,
                  handleRowClick,
                  disabled: scheduleStartFlow,
                })}
              />
            </>
          )}
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
          <Button
            id="process-group-flow-details-continue-btn"
            disabled={
              isUpgrade
                ? false
                : (!isStateStale || isButtonDisabled) &&
                  (!scheduleUpgradeFromList || !shouldRevertChanges)
            }
            onClick={handleSubmit(handleScrollOnClick)}
          >
            Continue
          </Button>
        </BottomButtonDiv>
        <BottomButtonDiv className="btn-div d-flex">
          {!isUpgrade && !isStateStale && (
            <div>
              <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                {scheduleDeploymentFlow || scheduleUpgradeFromList ? (
                  <RevertlocalChangesCheckbox
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: 'fit-content',
                    }}
                  >
                    <CheckboxField
                      name="check"
                      label="Revert Local Changes"
                      checked={shouldRevertChanges}
                      onChange={e =>
                        dispatch(
                          NamespacesActions.setShouldRevertChanges(
                            e.target.checked
                          )
                        )
                      }
                    />
                  </RevertlocalChangesCheckbox>
                ) : (
                  <Button
                    onClick={() => {
                      dispatch(
                        NamespacesActions.setLocalChangesModalType('revert')
                      );
                      dispatch(
                        NamespacesActions.setLocalChangesModalOpen(true)
                      );
                    }}
                  >
                    Revert Local Changes
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    dispatch(
                      NamespacesActions.setLocalChangesModalType('show')
                    );
                    dispatch(NamespacesActions.setLocalChangesModalOpen(true));
                  }}
                >
                  Show Local Changes
                </Button>
              </div>
            </div>
          )}
        </BottomButtonDiv>
      </BottomButton>

      {/* Add Local Changes Modal */}
      <LocalChangesModal />
    </div>
  );
};

export default FlowDetailsPage;
