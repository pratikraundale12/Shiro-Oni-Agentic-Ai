/* eslint-disable */
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  addHours,
  addMinutes,
  endOfDay,
  endOfHour,
  endOfMinute,
  isSameDay,
  isSameHour,
  isSameMinute,
  startOfDay,
  startOfHour,
  startOfMinute,
  subHours,
  subMinutes,
} from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  ListIcon,
  PlusCircleIcon,
  RefreshIcon,
  ScheduleDeploymentIcon,
  SmallSearchIcon,
  TreeIcon,
} from '../../assets';
import {
  ACCESS_OPTIONS,
  ACTIVITY_EVENTS,
  ACTIVITY_STATUS_OPTIONS,
  KDFM,
  MODULE_LIST_MAP,
  SEARCH_INPUT_ERROR,
} from '../../constants';
import { history } from '../../helpers/history';
import { getButtonPermissions } from '../../helpers/permissions';
import FlowAnalysis from '../../pages/FlowAnalysis/FlowAnalysis';
import {
  Button,
  DateRangePickerInput,
  FieldErrorMessage,
  SelectField,
} from '../../shared';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';
import {
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
  DashboardActions,
  GridActions as GridSagsActions,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
  RegistryActions,
  RolesActions,
  RolesSelectors,
  UsersActions,
  UsersSelectors,
} from '../../store';
import { ActivityHistoryActions } from '../../store/activityHistory/redux';
import { FlowValidationActions } from '../../store/flowValidation';
import { GridSelectors } from '../../store/grid';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { FullPageLoader } from '../FullPageLoader';
import { use } from 'react';
import { SettingsActions } from '../../store/settings';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const ButtonsContainer = styled(Flex)`
  gap: 0.5rem;
`;
const ButtonsContainerScheduleList = styled(Flex)`
  gap: 0.5rem;
  margin-left: auto;
`;
const Title = styled.h3`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  @media screen and (max-width: 1400px) {
    font-size: 16px !important;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1 1 auto;

  svg {
    position: absolute;
    top: ${props => props.topPosition};
    left: 16px;
    transform: translateY(-50%);
  }
`;

const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;
  min-width: 8.5rem;

  &.entity-dropdown {
    min-width: 12rem;
  }

  > div {
    margin-top: 0;
  }
  /* Apply fixed width to dropdown options */
  .react-select__menu {
  }

  .react-select__menu-list {
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .react-select__option {
    word-break: break-all;
    overflow: hidden;
  }
`;

const DropdownContainer = styled.div`
  min-width: 175px;
  max-width: 175px;
  cursor: pointer;

  & div > div {
    & > div {
      min-width: 175px;
      max-width: 175px;
      cursor: pointer;
    }
  }
  & div > div {
    & > div > * {
      min-width: unset;
      max-width: unset;
      cursor: pointer;
    }
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

const RefreshIocn = styled.div`
  cursor: pointer;
  background-color: #f5f7fa;
  border: 1px solid #dde4f0;
  width: 37px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  min-width: 37px;
`;

const SpanEle = styled.span`
  width: 100%;
  cursor: pointer;
  color: #ff7a00;
  &:hover {
    text-decoration: underline;
  }
`;

const ViewToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
  .active {
    fill: ${props => props.theme.colors.primary};
  }
`;

const IconContainer = styled.div`
  width: 50px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: ${props =>
    props.active ? '1px solid #FF7A00' : '1px solid #dde4f0'};
  background-color: ${props => (props.active ? '#FF7A00' : '#fff')};
  ${props => props.disabled && 'pointer-events: none;'}
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;

export const GridActions = ({
  title = '',
  module,
  statusOptions,
  search,
  placeholder = 'Search...',
  buttonText,
  gridCount,
  addModal: Modal,
  clusterId,
  watchStatus,
  watch,
  control,
  setSelectedRole,
  selectedRole,
  sortingState,
  setValue,
  clusterSelectedValue,
  setClusterSelectedValue,
  selectEvent,
  setSelectEvent,
  selectEntity,
  setSelectEntity,
  setSortingState,
  setCurrentPage,
  isClusterLoggedIn = true,
  is_kube_cluster = false,
  onItemsPerPageChange,
  scheduleType,
  setScheduleType,
  selectStatus,
  setSelectStatus,
  removeSearch = false,
  setIsExportReportOpen,
  setRemoveSearch,
  viewMode = 'list_view',
  setViewMode = () => {},
  itemsPerPage,
  FlowAnalysisPage = false,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  // const itemPerClusterList = useSelector(ClustersSelectors.getClusterListItems);
  const accessType = useSelector(RolesSelectors.getAccessType);
  const userModalOpen = useSelector(UsersSelectors.getUserModalOpen);
  const roles = useSelector(RolesSelectors.getRoles);
  const breadcrumbs = useSelector(state =>
    GridSelectors.getGridBreadcrumb(state, module)
  );
  const { setState } = useGlobalContext();
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    if (removeSearch && (module === 'namespaces' || module === 'users')) {
      setSearchValue('');
    }
  }, [removeSearch]);
  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(roles.map(role => role.name))).map(name => {
      return roles.find(role => role.name === name);
    });
  }, [roles]);
  const inputRef = useRef(null);
  const entity = watch('entityName');
  const event = watch('activityEvent');
  const getModuleBasedStatusKey = module => {
    setCurrentPage(1);
    if (module === 'activityHistory') {
      return 'status';
    } else if (module === 'scheduler') {
      return 'deployment_status';
    } else if (module === 'clusters') {
      return 'status';
    } else {
      return 'is_active';
    }
  };
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const selectedRange = useSelector(SchedularSelectors.getScheduleSelectRange);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const clusters = useSelector(ClustersSelectors.getAllClustersList);

  useEffect(() => {
    setIsButtonDisabled(isEmpty(selectedCluster?.value));
  }, [selectedCluster]);

  const selecedNamespaceDetails = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );

  function getDynamicRangeStartEnd(start, end) {
    if (!start || !end) return [null, null];

    // Only round if EXACTLY the same minute
    if (isSameMinute(start, end)) {
      return [startOfMinute(start), endOfMinute(end)];
    }

    // Optional: remove this block if you don't want rounding
    // if (isSameHour(start, end)) {
    //   return [startOfHour(start), endOfHour(end)];
    // }

    // If same day and covering full day, round
    if (isSameDay(start, end)) {
      const sameTime =
        start.getHours() === 0 &&
        start.getMinutes() === 0 &&
        start.getSeconds() === 0 &&
        end.getHours() === 23 &&
        end.getMinutes() === 59;
      if (sameTime) {
        return [startOfDay(start), endOfDay(end)];
      }
      return [start, end]; // keep original times
    }

    // Different days → keep exact
    return [start, end];
  }

  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, 'activityHistory')
  );
  const gridDataNamespace = useSelector(state =>
    GridSelectors.getGridData(state, 'namespaces')
  );

  const handleRefresh = () => {
    window.localStorage.removeItem('scheduleTokenid');
    setState(prev => ({ ...prev, search: null }));
    setSearchValue('');
    setSearchErrorMsg({});
    inputRef.current.value = '';
    setCurrentPage(1);
    onItemsPerPageChange(10);

    if (module === 'clusters') {
      setValue('is_active', null);
      dispatch(
        GridSagsActions.fetchGrid({
          module: 'clusters',
          params: {
            page: 1,
            limit: itemsPerPage || 10,
            ...(sortingState && {
              sort: sortingState,
            }),
          },
        })
      );
      setSortingState('name');
    }

    if (module === 'namespaces' && viewMode === 'tree_view') {
      if (!selectedCluster?.value || isEmpty(selectedCluster?.value)) {
        return;
      }
      dispatch(NamespacesActions.fetchNamespacesDownload());
      return;
    }

    if (module === 'namespaces') {
      if (!selectedCluster?.value || isEmpty(selectedCluster?.value)) {
        return;
      }
      dispatch(SettingsActions.fetchSettings());
      dispatch(
        GridSagsActions.fetchGridSuccess({ module: 'namespaces', data: {} })
      );
      setState(prev => ({ ...prev, search: null }));
      setSearchValue('');
      setSearchErrorMsg({});
      inputRef.current.value = '';
    }
    if (module === 'scheduler') {
      dispatch(
        GridSagsActions.fetchGrid({
          module,
          clusterId,
          params: {
            page: 1,
            limit: 10,
            ...(selectedRange && {
              start_date: selectedRange?.[0]?.toISOString(),
              end_date: selectedRange?.[1]?.toISOString(),
            }),
            ...(watchStatus &&
              watchStatus !== 'all' && {
                [getModuleBasedStatusKey(module)]: watchStatus,
              }),
            ...(location?.pathname?.includes('schedule-deployment') &&
              clusterSelectedValue?.label !== 'All' && {
                clusterName: clusterSelectedValue?.label,
              }),
          },
        })
      );
      return;
    } else {
      dispatch(GridSagsActions.fetchGrid({ module, clusterId, params: {} }));
    }
    if (!isEmpty(selectedCluster) && breadcrumbs?.length > 1) {
      const payload = {
        selectedNamespace: selecedNamespaceDetails,
      };
      dispatch(
        DashboardActions.fetchDashboard({
          payload,
        })
      );
    } else {
      dispatch(GridSagsActions.fetchGrid({ module: 'namespaces' }));
    }
  };

  const handleRefreshClusterList = () => {
    window.localStorage.removeItem('scheduleTokenid');
    setState(prev => ({ ...prev, search: null }));
    setSearchValue('');
    setSearchErrorMsg({});
    inputRef.current.value = '';
    setCurrentPage(1);
    onItemsPerPageChange(10);

    if (module === 'clusters') {
      setValue('is_active', null);
      dispatch(
        GridSagsActions.fetchGrid({
          module: 'clusters',
          params: {
            page: 1,
            limit: itemsPerPage || 10,
            ...(sortingState && {
              sort: sortingState,
            }),
          },
        })
      );
      setSortingState('name');
    }
  };

  useEffect(() => {
    if (location.pathname !== '/schedule-deployment') {
      window.localStorage.removeItem('scheduleTokenid');
    }
  }, []);
  useEffect(() => {
    if (location.pathname !== '/schedule-deployment') {
      dispatch(SchedularActions.setScheduleSelectRange([]));
    }
    return () => dispatch(SchedularActions.setScheduleSelectRange([]));
  }, [dispatch, location.pathname]);

  const scheduleToken = window.localStorage.getItem('scheduleTokenid');

  useEffect(() => {
    if (
      (module === 'nodes' && !isClusterLoggedIn) ||
      (module === 'nodes' && is_kube_cluster)
    ) {
      return;
    }
    if (
      watchStatus ||
      selectedRange ||
      selectedRole ||
      clusterSelectedValue ||
      selectEvent ||
      selectEntity ||
      scheduleType ||
      selectStatus
    ) {
      if (module === 'namespaces' && selectedCluster?.value === '') {
        return;
      } else {
        dispatch(
          GridSagsActions.fetchGrid({
            module,
            clusterId,
            params: {
              page: 1,
              limit: itemsPerPage || 10,
              id: scheduleToken,
              ...(search && { search: search }),
              ...(watchStatus &&
                watchStatus !== 'all' && {
                  [getModuleBasedStatusKey(module)]: watchStatus,
                }),
              ...(selectedRange && {
                start_date: selectedRange?.[0]?.toISOString(),
                end_date: selectedRange?.[1]?.toISOString(),
              }),
              ...(location?.pathname?.includes('user-management') &&
                selectedRole?.value !== 'all' && {
                  role_id: selectedRole?.value,
                }),
              ...(location?.pathname?.includes('schedule-deployment') &&
                clusterSelectedValue?.label !== 'All' && {
                  clusterName: clusterSelectedValue?.label,
                }),
              ...(location?.pathname?.includes('activity-history') &&
                selectEvent &&
                selectEvent.length > 0 && {
                  event: selectEvent.map(event => event.value).join(','),
                }),

              ...(location?.pathname?.includes('activity-history') &&
                selectEntity &&
                selectEntity.length > 0 && {
                  entity: selectEntity.map(entity => entity.value).join(','),
                }),

              ...(location?.pathname?.includes('activity-history') &&
                selectStatus &&
                selectStatus.length > 0 && {
                  status: selectStatus.map(status => status.value).join(','),
                }),
              ...(location?.pathname?.includes('schedule-deployment') &&
                scheduleType?.value !== 'all' && {
                  type: scheduleType?.value,
                }),
              ...(location?.pathname?.match(
                /user-management|clusters|schedule-deployment|activity-history/
              ) &&
                sortingState && {
                  sort: sortingState,
                }),
            },
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watchStatus,
    entity,
    event,
    search,
    selectedRange,
    selectEvent,
    selectEntity,
    scheduleType,
    selectStatus,
  ]);
  const [canWrite, setCanWrite] = useState(false); // State to store canWrite value
  const gridPermissions = useSelector(state =>
    GridSelectors.getGridDataPermissions(state, module)
  );

  // Only set the canWrite value once when gridPermissions are first available
  useEffect(() => {
    if (gridPermissions?.canWrite !== undefined) {
      setCanWrite(gridPermissions?.canWrite);
    }
  }, [gridPermissions]);

  const registryData = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );

  const handleClick = () => {
    if (isEmpty(registryData)) {
      toast.error(
        'Registry is linked to the cluster, but not found in the NiFi setup. Please check the NiFi registry configuration'
      );
      return;
    }
    history.push('/process-group/DeployPage');
    dispatch(NamespacesActions.setdeployRegistryFlow(true));
  };

  const loadingNamespaces = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchDashboard')
  );
  const handleScheduleClick = () => {
    if (isEmpty(registryData)) {
      toast.error(
        'Registry is linked to the cluster, but not found in the NiFi setup. Please check the NiFi registry configuration'
      );
      return;
    }
    history.push('/process-group/DeployPage');
    dispatch(NamespacesActions.setdeployRegistryFlow(false));
    dispatch(NamespacesActions.setScheduleByRegistry(true));
  };

  const handleChange = value => {
    if (!value) {
      dispatch(SchedularActions.setScheduleSelectRange([]));
      dispatch(
        GridSagsActions.fetchGrid({
          module,
          clusterId,
          params: {
            page: 1,
            id: scheduleToken,
            ...(search && { search: search }),
            ...(watchStatus &&
              watchStatus !== 'all' && {
                [getModuleBasedStatusKey(module)]: watchStatus,
              }),
          },
        })
      );
      return;
    }
    setCurrentPage(1);
    let [start, end] = value;
    if (
      start &&
      end &&
      start.toDateString() === end.toDateString() &&
      start.getTime() === end.getTime()
    ) {
      const adjustedEnd = new Date(end);
      adjustedEnd.setHours(23, 59, 0, 0);
      end = adjustedEnd;
    }

    const [dynamicStart, dynamicEnd] = getDynamicRangeStartEnd(start, end);

    dispatch(
      SchedularActions.setScheduleSelectRange([dynamicStart, dynamicEnd])
    );
  };

  const customRanges = [
    {
      label: 'Next Year',
      value: [
        startOfDay(new Date()),
        endOfDay(
          new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        ),
      ],
      placement: 'left',
    },
    {
      label: 'Next 6 Months',
      value: [
        startOfDay(new Date()),
        endOfDay(new Date(new Date().setMonth(new Date().getMonth() + 6))),
      ],
      placement: 'left',
    },
    {
      label: 'Next Month',
      value: [
        startOfDay(new Date()),
        endOfDay(new Date(new Date().setMonth(new Date().getMonth() + 1))),
      ],
      placement: 'left',
    },
    {
      label: 'Next 7 Days',
      value: [
        startOfDay(new Date()),
        endOfDay(new Date(new Date().setDate(new Date().getDate() + 7))),
      ],
      placement: 'left',
    },
    {
      label: 'Last 1 hour',
      value: [subHours(new Date(), 1), new Date()],
      placement: 'left',
    },
    // {
    //   label: 'Last 30 minutes',
    //   value: [subMinutes(new Date(), 30), new Date()],
    //   placement: 'left',
    // },
    // {
    //   label: 'Last 15 minutes',
    //   value: [subMinutes(new Date(), 15), new Date()],
    //   placement: 'left',
    // },
    {
      label: 'Next 1 hour',
      value: [new Date(), addHours(new Date(), 1)],
      placement: 'left',
    },
    // {
    //   label: 'Next 30 minutes',
    //   value: [new Date(), addMinutes(new Date(), 30)],
    //   placement: 'left',
    // },
    // {
    //   label: 'Next 15 minutes',
    //   value: [new Date(), addMinutes(new Date(), 15)],
    //   placement: 'left',
    // },
    {
      label: 'Today',
      value: [startOfDay(new Date()), endOfDay(new Date())],
      placement: 'left',
    },

    {
      label: 'Last 7 Days',
      value: [
        startOfDay(new Date(new Date().setDate(new Date().getDate() - 7))),
        endOfDay(new Date()),
      ],
      placement: 'left',
    },
    {
      label: 'Last Month',
      value: [
        startOfDay(new Date(new Date().setMonth(new Date().getMonth() - 1))),
        endOfDay(new Date()),
      ],
      placement: 'left',
    },
    {
      label: 'Last 6 Months',
      value: [
        startOfDay(new Date(new Date().setMonth(new Date().getMonth() - 6))),
        endOfDay(new Date()),
      ],
      placement: 'left',
    },
    {
      label: 'Last Year',
      value: [
        startOfDay(
          new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        ),
        endOfDay(new Date()),
      ],
      placement: 'left',
    },
  ];

  const handleRolesChange = selectedOption => {
    setCurrentPage(1);
    setSelectedRole(selectedOption);
  };

  // Updated to handle arrays for multi-select
  const handleEventChange = selectedEventOptions => {
    setCurrentPage(1);
    setSelectEvent(selectedEventOptions); // This will now be an array
  };

  const handleStatusChange = selectedStatusOptions => {
    setCurrentPage(1);
    setSelectStatus(selectedStatusOptions); // This will now be an array
  };

  const handleEntityChange = selectedEntityOptions => {
    setCurrentPage(1);
    setSelectEntity(selectedEntityOptions); // This will now be an array
  };

  const handleClusterChange = selectedClusterOption => {
    setCurrentPage(1);
    setClusterSelectedValue(selectedClusterOption);
    dispatch(SchedularActions.setSelectedClusterState(selectedClusterOption));
  };

  const handleClearFilter = () => {
    if (module === 'scheduler') {
      setValue('is_active', null);
      dispatch(SchedularActions.setScheduleSelectRange([]));
      dispatch(GridSagsActions.fetchGrid({ module, clusterId, params: {} }));
      setState(prev => ({ ...prev, search: null }));
      setSearchValue('');
      setSearchErrorMsg({});
      inputRef.current.value = '';
      setClusterSelectedValue(null);
      dispatch(SchedularActions.setSelectedClusterState(null));
      setSortingState(null);
      setScheduleType(null);
    } else if (module === 'activityHistory') {
      setValue('is_active', null);
      setState(prev => ({ ...prev, search: null }));
      setSearchValue('');
      setSearchErrorMsg({});
      inputRef.current.value = '';
      setSelectEvent([]); // Changed to empty array
      setSelectEntity([]); // Changed to empty array
      setSelectStatus([]);
      setSortingState(null);
    } else if (module === 'users') {
      setValue('is_active', null);
      setSelectedRole(null);
      setState(prev => ({ ...prev, search: null }));
      setSearchValue('');
      setSearchErrorMsg({});
      inputRef.current.value = '';
      setSortingState(null);
    }
  };

  useEffect(() => {
    dispatch(SchedularActions.setSelectedStatusState(watchStatus));
  }, [watchStatus]);

  const handleAnalyzeClick = () => {
    dispatch(FlowValidationActions.addNewAnalysisModalOpen(true));
  };

  const [searchErrorMsg, setSearchErrorMsg] = useState({});

  const handleExportReport = () => {
    setIsExportReportOpen(true);
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchEmailReport')
  );

  const sortedActivityEvents = useMemo(() => {
    return [...ACTIVITY_EVENTS].sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const sortedActivityEntity = useMemo(() => {
    return [...MODULE_LIST_MAP].sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const sortedActivityStatus = useMemo(() => {
    return [...ACTIVITY_STATUS_OPTIONS].sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, []);

  return (
    <>
      <Flex className="flex-wrap gap-2">
        <FullPageLoader loading={loading || loadingNamespaces} />
        <Flex>
          <Title>
            {viewMode === 'tree_view' ? (
              <span>{KDFM.NAMESPACE_TREE_VIEW}</span>
            ) : (
              <>
                <span>{title}</span>
                {module === 'namespaces' && Boolean(gridCount) && (
                  <span>({gridCount})</span>
                )}
              </>
            )}
          </Title>
        </Flex>
        {module === 'scheduler' && (
          <>
            {
              <ButtonsContainerScheduleList>
                <DateRangePickerInput
                  value={selectedRange}
                  handleChange={handleChange}
                  customRanges={customRanges}
                  showTime={{ format: 'hh:mm A' }}
                  format="YYYY-MM-DD hh:mm A"
                  placeholder={['Start Time', 'End Time']}
                />
                <DropdownContainer>
                  <StyledSelectField
                    size="sm"
                    name="cluster_id"
                    control={control}
                    options={[
                      { label: 'All', value: 'all' },
                      ...clusters
                        ?.filter(ele => ele.is_active)
                        .map(cluster => ({
                          value: cluster.id,
                          label: cluster.name,
                        })),
                    ]}
                    value={clusterSelectedValue}
                    placeholder="Select Cluster"
                    onChange={handleClusterChange}
                    backgroundColor={theme.colors.lightGrey}
                  />
                </DropdownContainer>
                <DropdownContainer>
                  <StyledSelectField
                    size="sm"
                    name="scheduleType"
                    control={control}
                    options={[
                      { label: 'All', value: 'all' },
                      { label: 'Start', value: 'start' },
                      { label: 'Stop', value: 'stop' },
                      { label: 'Deploy', value: 'deploy' },
                      { label: 'Upgrade', value: 'upgrade' },
                      { label: 'Downgrade', value: 'downgrade' },
                    ]}
                    value={scheduleType}
                    placeholder="Schedule Type"
                    onChange={setScheduleType}
                    backgroundColor={theme.colors.lightGrey}
                  />
                </DropdownContainer>
                {/* {selectedCluster?.value && (
                  <Button
                    size="md"
                    onClick={() => history.push('/process-group')}
                  >
                    <div
                      className="d-flex "
                      style={{ fontSize: '14px', fontWeight: '750' }}
                    >
                      <ScheduleDeploymentIcon
                        height={19}
                        width={19}
                        color={'#fff'}
                      />
                      Schedule Deployment
                    </div>
                  </Button>
                )} */}
              </ButtonsContainerScheduleList>
            }
          </>
        )}

        <ButtonsContainer>
          {['clusters'].includes(module) && (
            <>
              <RefreshIocn
                onClick={handleRefreshClusterList}
                data-tooltip-id={`tooltip-group-namespace-refresh`}
              >
                <RefreshIcon style={{ cursor: 'pointer' }} />
              </RefreshIocn>
              <ReactTooltip
                id={`tooltip-group-namespace-refresh`}
                place="left"
                content={'Refresh'}
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </>
          )}
          {module === 'users' && (
            <DropdownContainer>
              <StyledSelectField
                size="sm"
                name="roles"
                control={control}
                placeholder="Select Roles"
                value={selectedRole}
                options={[
                  { label: 'All', value: 'all' },
                  ...uniqueRoles.map(role => ({
                    label: role.name,
                    value: role.role_id,
                  })),
                ]}
                backgroundColor={theme.colors.lightGrey}
                onChange={handleRolesChange}
              />
            </DropdownContainer>
          )}
          {!isEmpty(statusOptions) && (
            <DropdownContainer>
              <StyledSelectField
                name="is_active"
                size="sm"
                control={control}
                options={statusOptions}
                placeholder={KDFM.STATUS}
                backgroundColor={theme.colors.lightGrey}
              />
            </DropdownContainer>
          )}
          {/*  */}
          {module === 'registry' &&
            userPermissions.includes(getButtonPermissions('registry')) && (
              <Button
                size="md"
                onClick={() =>
                  dispatch(RegistryActions.setIsCreateRegistryModalOpen(true))
                }
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <PlusCircleIcon height={20} width={20} color={'#fff'} />
                  Add Registry
                </div>
              </Button>
            )}
          {module === 'scheduler' && (
            <>
              {' '}
              {selectedCluster?.value && (
                <Button
                  size="md"
                  onClick={() => history.push('/process-group')}
                >
                  <div
                    className="d-flex "
                    style={{ fontSize: '14px', fontWeight: '750' }}
                  >
                    <ScheduleDeploymentIcon
                      height={19}
                      width={19}
                      color={'#fff'}
                    />
                    Schedule Deployment
                  </div>
                </Button>
              )}
            </>
          )}
          {module === 'users' && (
            <SpanEle onClick={handleClearFilter}>{'Clear Filters'}</SpanEle>
          )}
          {location.pathname.includes('permission-matrix') && (
            <StyledSelectField
              size="sm"
              placeholder={KDFM.ACCESS}
              options={ACCESS_OPTIONS}
              defaultValue={accessType}
              backgroundColor={theme.colors.lightGrey}
              onChange={option => dispatch(RolesActions.setAccessType(option))}
            />
          )}
          {module === 'activityHistory' && (
            <>
              <div>
                <MultiSelectField
                  name="activityEvent"
                  control={control}
                  label={KDFM.SELECT_EVENT}
                  placeholder={KDFM.SELECT_EVENT}
                  options={sortedActivityEvents}
                  customValue={selectEvent}
                  customOnChange={(onChange, selectedOptions) => {
                    handleEventChange(selectedOptions);
                    onChange(selectedOptions);
                  }}
                  wrapperCustomClass="entity-dropdown"
                  customWidth="275px"
                  enableCheckboxes={true}
                  selectAllLabel="Select All"
                  hideMultipleOptions={true}
                  enableSelectAll={true} // Enable select all
                />
              </div>
              <div>
                <MultiSelectField
                  name="entityName"
                  control={control}
                  label={KDFM.SELECT_ENTITY}
                  placeholder={KDFM.SELECT_ENTITY}
                  options={sortedActivityEntity}
                  customValue={selectEntity}
                  enableSelectAll={true} // Enable select all
                  selectAllLabel="Select All"
                  customOnChange={(onChange, selectedOptions) => {
                    handleEntityChange(selectedOptions);
                    onChange(selectedOptions);
                  }}
                  wrapperCustomClass="entity-dropdown"
                  customWidth="275px"
                  enableCheckboxes={true}
                  hideMultipleOptions={true}
                />
              </div>
              <div>
                <MultiSelectField
                  name="activityStatus"
                  control={control}
                  label="Select Status"
                  placeholder="Select Status"
                  options={sortedActivityStatus}
                  customValue={selectStatus}
                  customOnChange={(onChange, selectedOptions) => {
                    handleStatusChange(selectedOptions);
                    onChange(selectedOptions);
                  }}
                  wrapperCustomClass="entity-dropdown"
                  customWidth="275px"
                  enableCheckboxes={true}
                  hideMultipleOptions={true}
                  enableSelectAll={true} // Enable select all
                  selectAllLabel="Select All"
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <div>
                  {!isEmpty(gridData) && (
                    <Button onClick={handleExportReport}>Export Report</Button>
                  )}
                </div>
              </div>
              <SpanEle onClick={handleClearFilter}>{'Clear Filters'}</SpanEle>
            </>
          )}
          {!isEmpty(buttonText) &&
            userPermissions.includes(getButtonPermissions(module)) && (
              <Button
                icon={<PlusCircleIcon width={16} height={16} color="white" />}
                onClick={() =>
                  dispatch(ClustersActions.setIsAddorEditClusterModalOpen(true))
                }
                size="sm"
              >
                {buttonText}
              </Button>
            )}{' '}
          {module === 'users' && userPermissions.includes('add_user') && (
            //
            <Button
              icon={<PlusCircleIcon width={16} height={16} color="white" />}
              onClick={() => {
                dispatch(UsersActions.setUserModalOpen(true));
                dispatch(UsersActions.setAddNewUser(true));
                setRemoveSearch(true);
                setState(prevState => ({ ...prevState, search: null }));
                setCurrentPage(1);
                dispatch(SchedularActions.setSearchText(null));
                setSearchValue('');
              }}
              size="sm"
            >
              Add User
            </Button>
          )}
          {userPermissions.includes(getButtonPermissions(module)) &&
            !userModalOpen && <Modal />}
        </ButtonsContainer>

        {['scheduler', 'namespaces'].includes(module) && (
          <ButtonsContainer>
            {module === 'namespaces' &&
              location.pathname === '/process-group' && (
                <>
                  {selectedCluster?.value && (
                    <Button
                      id="process-group-list-schdule-deployment"
                      size="md"
                      disabled={isButtonDisabled}
                      onClick={() => handleScheduleClick()}
                    >
                      <div
                        className="d-flex "
                        style={{ fontSize: '14px', fontWeight: '750' }}
                      >
                        <ScheduleDeploymentIcon
                          height={19}
                          width={19}
                          color={'#fff'}
                        />
                        Schedule Deployment
                      </div>
                    </Button>
                  )}
                  {canWrite && (
                    <Button
                      id="process-group-deploy"
                      disabled={!canWrite}
                      size="md"
                      style={{ width: '84px' }}
                      onClick={handleClick}
                      className="tour-process-group-deploy"
                    >
                      {KDFM.DEPLOY}
                    </Button>
                  )}
                </>
              )}
            {module === 'namespaces' &&
              location.pathname === '/flow-analysis' &&
              selectedCluster?.value && (
                <Button
                  onClick={handleAnalyzeClick}
                  disabled={isButtonDisabled}
                >
                  Flow Validation by ID
                </Button>
              )}
            {['scheduler'].includes(module) && (
              <>
                <RefreshIocn
                  onClick={handleRefresh}
                  data-tooltip-id={`tooltip-group-namespace-refresh`}
                >
                  <RefreshIcon style={{ cursor: 'pointer' }} />
                </RefreshIocn>
                <ReactTooltip
                  id={`tooltip-group-namespace-refresh`}
                  place="left"
                  content={'Refresh'}
                  style={{
                    width: 'auto',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
            {['namespaces'].includes(module) && (
              <>
                <RefreshIocn
                  onClick={handleRefresh}
                  data-tooltip-id={`tooltip-group-namespace-refresh-`}
                  style={{
                    cursor:
                      selectedCluster?.value && !isEmpty(selectedCluster?.value)
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                >
                  <RefreshIcon
                    style={{
                      cursor:
                        selectedCluster?.value &&
                        !isEmpty(selectedCluster?.value)
                          ? 'pointer'
                          : 'not-allowed',
                    }}
                  />
                </RefreshIocn>
                <ReactTooltip
                  id={`tooltip-group-namespace-refresh-`}
                  place="left"
                  content={
                    selectedCluster?.value && !isEmpty(selectedCluster?.value)
                      ? 'Refresh'
                      : 'Login to the cluster'
                  }
                  style={{
                    width: 'auto',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}

            {module === 'scheduler' && (
              <SpanEle onClick={handleClearFilter}>{'Clear Filters'}</SpanEle>
            )}
          </ButtonsContainer>
        )}
      </Flex>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchContainer
          topPosition={Object.keys(searchErrorMsg).length ? '39%' : '50%'}
        >
          <SmallSearchIcon
            width={18}
            height={18}
            color={theme.colors.darkGrey1}
          />
          <Search
            type="search"
            value={searchValue}
            ref={inputRef}
            placeholder={placeholder}
            onChange={e => {
              const value = e.target.value;
              setSearchValue(value);
              if (value.length < 2) {
                setSearchErrorMsg({
                  search: {
                    message: SEARCH_INPUT_ERROR,
                  },
                });
              }
              if (
                value.length <= 100 &&
                (value.length >= 2 || value?.length === 0)
              ) {
                setSearchErrorMsg({});
                setState(prev => ({
                  ...prev,
                  search: value.trim().replace(/\s+/g, ' '),
                }));
              }
            }}
          />
          <FieldErrorMessage name="search" errors={searchErrorMsg} />
        </SearchContainer>
        {module === 'namespaces' && (
          <ViewToggleContainer>
            {!FlowAnalysisPage && (
              <IconContainer
                active={viewMode === 'list_view'}
                onClick={() => setViewMode('list_view')}
                data-tooltip-id={'tooltip-id-list-view'}
              >
                <ListIcon
                  stroke={viewMode === 'list_view' ? '#fff' : '#444445'}
                />
              </IconContainer>
            )}
            <ReactTooltip
              id={'tooltip-id-list-view'}
              place="bottom"
              effect="solid"
              content="List view"
              style={{
                width: 'auto',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                zIndex: 9999,
              }}
            />
            {!FlowAnalysisPage && (
              <IconContainer
                active={viewMode === 'tree_view'}
                onClick={() => {
                  setViewMode('tree_view');
                  dispatch(NamespacesActions.setSelectedNamespace({}));
                }}
                data-tooltip-id={'tooltip-id-tree-view'}
                disabled={
                  isEmpty(selectedCluster) || isEmpty(selectedCluster?.value)
                }
              >
                <TreeIcon
                  stroke={viewMode === 'tree_view' ? '#fff' : '#444445'}
                />
              </IconContainer>
            )}
            <ReactTooltip
              id={'tooltip-id-tree-view'}
              place="bottom"
              effect="solid"
              content="Tree View"
              style={{
                width: 'auto',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                zIndex: 9999,
              }}
            />
          </ViewToggleContainer>
        )}
      </div>
    </>
  );
};

GridActions.propTypes = {
  title: PropTypes.string,
  module: PropTypes.string,
  clusterOptions: PropTypes.array,
  refreshOptions: PropTypes.array,
  statusOptions: PropTypes.array,
  search: PropTypes.string,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  addModal: PropTypes.func,
  gridCount: PropTypes.number,
  handleRefresh: PropTypes.func,
  clusterId: PropTypes.string,
  watchStatus: PropTypes.string,
  watch: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  setSelectedRole: PropTypes.func.isRequired,
  selectedRole: PropTypes.string,
  sortingState: PropTypes.string,
  setValue: PropTypes.func,
  onItemsPerPageChange: PropTypes.func.isRequired,
  setIsExportReportOpen: PropTypes.func,
  setRemoveSearch: PropTypes.func,
  itemsPerPage: PropTypes.number,
  FlowAnalysisPage: PropTypes.bool,
};
