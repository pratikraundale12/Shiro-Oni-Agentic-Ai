/* eslint-disable */
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useForm } from 'react-hook-form';
import { endOfDay, startOfDay } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  PlusCircleIcon,
  RefreshIcon,
  ScheduleDeploymentIcon,
  SmallSearchIcon,
  TodoIcon,
} from '../../assets';
import {
  ACCESS_OPTIONS,
  ACTIVITY_EVENTS,
  KDFM,
  MODULE_LIST_MAP,
} from '../../constants';
import { history } from '../../helpers/history';
import { getButtonPermissions } from '../../helpers/permissions';
import { Button, DateRangePickerInput, SelectField } from '../../shared';
import {
  AuthenticationSelectors,
  ClustersSelectors,
  DashboardActions,
  GridActions as GridSagsActions,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
  RolesActions,
  RolesSelectors,
  UsersSelectors,
} from '../../store';
import { ActivityHistoryActions } from '../../store/activityHistory/redux';
import { GridSelectors } from '../../store/grid';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { FullPageLoader } from '../FullPageLoader';

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

  svg {
    position: absolute;
    top: 50%;
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
    min-width: 10rem;
  }

  > div {
    margin-top: 0;
  }
  /* Apply fixed width to dropdown options */
  .react-select__menu {
    width: 175px;
  }

  .react-select__menu-list {
    max-width: 175px;
    white-space: wrap;
    text-overflow: ellipsis;
  }

  .react-select__option {
    max-width: 175px;
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

// const checkIfPropertyExists = (data, key) => {
//   if (Object.prototype.hasOwnProperty.call(data, key)) {
//     return data[key];
//   }
//   return false;
// };

export const GridActions = ({
  title,
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
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const accessType = useSelector(RolesSelectors.getAccessType);
  const userModalOpen = useSelector(UsersSelectors.getUserModalOpen);
  const roles = useSelector(RolesSelectors.getRoles);
  const breadcrumbs = useSelector(state =>
    GridSelectors.getGridBreadcrumb(state, module)
  );
  const { setState } = useGlobalContext();
  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(roles.map(role => role.name))).map(name => {
      return roles.find(role => role.name === name);
    });
  }, [roles]);
  const inputRef = useRef(null);
  const entity = watch('entityName');
  const event = watch('activityEvent');
  const getModuleBasedStatusKey = module => {
    if (module === 'activityHistory') {
      return 'status';
    } else if (module === 'scheduler') {
      return 'deployment_status';
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

  const handleRefresh = () => {
    window.localStorage.removeItem('scheduleTokenid');
    setState(prev => ({ ...prev, search: null }));
    inputRef.current.value = '';

    if (module === 'namespaces') {
      dispatch(
        GridActions.fetchGridSuccess({ module: 'namespaces', data: {} })
      );
      setState(prev => ({ ...prev, search: null }));
      inputRef.current.value = '';
    }
    setSortingState(null);
    if (module === 'scheduler') {
      dispatch(
        GridSagsActions.fetchGrid({
          module,
          clusterId,
          params: {
            page: 1,
            ...(selectedRange && {
              start_date: selectedRange?.[0]?.toISOString(),
              end_date: selectedRange?.[1]?.toISOString(),
            }),
            ...(watchStatus &&
              watchStatus !== 'all' && {
                [getModuleBasedStatusKey(module)]: watchStatus,
              }),
          },
        })
      );
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
      dispatch(GridActions.fetchGrid({ module: 'namespaces' }));
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
  }, [dispatch]);
  const scheduleToken = window.localStorage.getItem('scheduleTokenid');
  useEffect(() => {
    if (
      watchStatus ||
      selectedRange ||
      selectedRole ||
      clusterSelectedValue ||
      selectEvent ||
      selectEntity
    ) {
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
              selectEvent?.value !== 'all' && {
                event: selectEvent?.value,
              }),
            ...(location?.pathname?.includes('activity-history') &&
              selectEntity?.value !== 'all' && {
                entity: selectEntity?.value,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watchStatus,
    entity,
    event,
    search,
    selectedRange,
    selectEvent,
    selectEntity,
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

  const handleClick = () => {
    history.push('/process-group/DeployPage');
    dispatch(NamespacesActions.setdeployRegistryFlow(true));
  };
  const loadingNamespaces = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchDashboard')
  );
  const handleScheduleClick = () => {
    history.push('/process-group/DeployPage');
    dispatch(NamespacesActions.setdeployRegistryFlow(false));
    dispatch(NamespacesActions.setScheduleByRegistry(true));
  };

  const handleChange = value => {
    dispatch(SchedularActions.setScheduleSelectRange(value));
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
    }
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
    setSelectedRole(selectedOption);
  };
  const handleEventChange = selectedEventOption => {
    setSelectEvent(selectedEventOption);
  };
  const handleEntityChange = selectedEntityOption => {
    setSelectEntity(selectedEntityOption);
  };
  const handleClusterChange = selectedClusterOption => {
    setClusterSelectedValue(selectedClusterOption);
  };

  const handleClearFilter = () => {
    if (module === 'scheduler') {
      setValue('is_active', null);
      dispatch(SchedularActions.setScheduleSelectRange([]));
      dispatch(GridSagsActions.fetchGrid({ module, clusterId, params: {} }));
      setState(prev => ({ ...prev, search: null }));
      inputRef.current.value = '';
      setClusterSelectedValue(null);
      setSortingState(null);
    } else if (module === 'activityHistory') {
      setValue('is_active', null);
      setState(prev => ({ ...prev, search: null }));
      inputRef.current.value = '';
      setSelectEvent(null);
      setSelectEntity(null);
      setSortingState(null);
    } else if (module === 'users') {
      setValue('is_active', null);
      setSelectedRole(null);
      setState(prev => ({ ...prev, search: null }));
      inputRef.current.value = '';
      setSortingState(null);
    }
  };

  return (
    <>
      <Flex className="flex-wrap gap-2">
        <FullPageLoader loading={loadingNamespaces}></FullPageLoader>
        <Flex>
          <ImageContainer>
            <TodoIcon width={22} height={24} />
          </ImageContainer>
          <Title>
            <span>{title}</span>
            {module === 'namespaces' && Boolean(gridCount) && (
              <span>({gridCount})</span>
            )}
          </Title>
        </Flex>
        {module === 'scheduler' && (
          <>
            {
              <ButtonsContainerScheduleList>
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

                <DateRangePickerInput
                  value={selectedRange}
                  handleChange={handleChange}
                  customRanges={customRanges}
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
              </ButtonsContainerScheduleList>
            }
          </>
        )}

        <ButtonsContainer>
          {module === 'users' && (
            <DropdownContainer>
              <StyledSelectField
                size="sm"
                name="roles"
                control={control}
                title="Select Roles"
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
                title={KDFM.SELECT_STATUS}
                control={control}
                options={statusOptions}
                placeholder={KDFM.STATUS}
                backgroundColor={theme.colors.lightGrey}
              />
            </DropdownContainer>
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
              <StyledSelectField
                size="sm"
                name="activityEvent"
                title={KDFM.SELECT_EVENT}
                className="entity-dropdown"
                placeholder={KDFM.SELECT_EVENT}
                options={ACTIVITY_EVENTS}
                value={selectEvent}
                backgroundColor={theme.colors.lightGrey}
                onChange={handleEventChange}
              />
              <StyledSelectField
                size="sm"
                name="entityName"
                className="entity-dropdown"
                title={KDFM.SELECT_ENTITY}
                placeholder={KDFM.SELECT_ENTITY}
                options={MODULE_LIST_MAP}
                value={selectEntity}
                backgroundColor={theme.colors.lightGrey}
                onChange={handleEntityChange}
              />
              <SpanEle onClick={handleClearFilter}>{'Clear Filters'}</SpanEle>
            </>
          )}
          {!isEmpty(buttonText) &&
            userPermissions.includes(getButtonPermissions(module)) && (
              <Button
                icon={<PlusCircleIcon width={16} height={16} color="white" />}
                onClick={() => history.push(`/${module}/add`)}
                size="sm"
              >
                {buttonText}
              </Button>
            )}
          {userPermissions.includes(getButtonPermissions(module)) &&
            !userModalOpen && <Modal />}
        </ButtonsContainer>
        {['scheduler', 'namespaces'].includes(module) && (
          <ButtonsContainer>
            {module === 'namespaces' && (
              <>
                {selectedCluster?.value && (
                  <Button
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
                    disabled={!canWrite}
                    size="md"
                    style={{ width: '84px' }}
                    onClick={handleClick}
                  >
                    {KDFM.DEPLOY}
                  </Button>
                )}
              </>
            )}
            {['scheduler', 'namespaces'].includes(module) && (
              <>
                <RefreshIocn
                  // onClick={handleRefresh}
                  onClick={isButtonDisabled ? null : handleRefresh}
                  style={{
                    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                    opacity: isButtonDisabled ? 0.5 : 1,
                  }}
                  data-tooltip-id={`tooltip-group-namespace-refresh`}
                >
                  <RefreshIcon style={{ cursor: 'pointer' }} />
                </RefreshIocn>
                <ReactTooltip
                  id={`tooltip-group-namespace-refresh`}
                  place="left"
                  content={
                    isButtonDisabled
                      ? 'Log in to a cluster to Refresh.'
                      : 'Refresh'
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
      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="search"
          value={search}
          ref={inputRef}
          placeholder={placeholder}
          onChange={e => {
            const value = e.target.value;
            if (value.length <= 100) {
              setState(prev => ({ ...prev, search: value }));
            }
          }}
        />
      </SearchContainer>
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
};
