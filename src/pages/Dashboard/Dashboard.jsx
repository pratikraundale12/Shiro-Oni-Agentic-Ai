import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { FullPageLoader, Table } from '../../components';
import { DateRangePickerInput, SelectField } from '../../shared';
import { theme } from '../../styles';
import { FlowMetrics, InsightContainer } from './components';
import DeploymentStatistics from './DeploymentStatistics';
import { toast } from 'react-toastify';
import { subHours, isAfter, startOfDay } from 'date-fns';

import {
  ActiveThreadIcon,
  DeploymentStaticsIcon,
  DisabledProcessorIcon,
  ErrorIcon,
  FlowFiledQuedIcon,
  FlowMetricHeaderIcon,
  InvalidProcessorIcon,
  LensIcon,
  RefreshIcon,
  RunningProcessorIcon,
  StoppedProcessorIcon,
  TotalProcessorIcon,
  TotalQuedIcon,
} from '../../assets';
import { CrossIcon } from '../../assets/Icons/CrossIcon';
import {
  // AuthenticationSelectors,
  DashboardActions,
  DashboardSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SettingsActions } from '../../store/settings';
import { KDFM } from '../../constants';
import { useForm } from 'react-hook-form';

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const QuickInsightHeadingText = styled.h4`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  text-align: left;
  @media screen and (max-width: 1400px) {
    font-size: 16px !important;
  }
`;

const InsightIconContiner = styled.div`
  padding-top: 5px;
  /* margin-bottom: 0.5rem; */
  display: flex;
  align-items: start;
  gap: 16px;
  margin-left: 10px;
`;

const InsightDataContiner = styled.div`
  margin: 25px 0;
  display: flex;
  flex-wrap: wrap;
  row-gap: 25px;
`;

const FlowMetricHeader = styled.div`
  background-color: #f5f7fa;
  padding: 10px 11px;
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 25px;
  display: flex;
  align-items: center;
`;

const ErrorsHeader = styled.div`
  background-color: #fff;
  padding: 10px 11px;
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 25px;
  display: flex;
  align-items: center;
`;

const HeaderText = styled.p`
  margin-left: 10px;
  margin-bottom: 0px;
`;

const TextEllipses = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  width: 100%;
  align-items: center;
`;
const ErrorTexts = styled.div`
  width: 90%;
  margin-left: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const DropdownContainer = styled.div`
  margin-left: 10px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  @media (max-width: 1040px) {
    max-width: 100%;
    width: 100%;
  }
  & div > div {
    & > div {
      min-width: 194px;
      cursor: pointer;
    }
  }
  .react-select__menu-list {
    max-width: 100% !important;
    .react-select__option {
      max-width: 100% !important;
    }
  }

  & div > div {
    & > div > * {
      min-width: unset;
      max-width: unset;
      cursor: pointer;
      .react-select__placeholder {
        white-space: nowrap !important;
      }
    }
  }
  /* Apply fixed width to dropdown options */
  .react-select__menu {
    width: 175px;
  }

  .react-select__menu-list {
    max-width: 175px;
    white-space: wrap;
  }

  .react-select__option {
    max-width: 175px;
    overflow-wrap: break-word;
    word-break: normal;
    white-space: normal;
    overflow: hidden;
  }
`;
const DropdownWrapper = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 1040px) {
    width: 100%;
  }
`;

const IdWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledTable = styled(Table)`
  height: 60%;

  > div {
    height: 70%;
  }
`;

const FlowMetricContainer = styled.div`
  box-shadow: 0px 4px 5px 1px #3232470d;
  border-radius: 0px 0px 16px 16px;
  margin-bottom: 20px;
`;

const Loader = styled(FullPageLoader)`
  position: absolute;
  top: ${props => props.theme.header};
  width: 100%;
  height: calc(100% - ${props => props.theme.header});
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
`;

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  /* overflow-x: auto; */
  &::-webkit-scrollbar {
    display: none;
  }
  /* scrollbar-width: none; */
`;
const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
  flex-wrap: nowrap;
  align-items: center;
  min-width: max-content;
`;
const Tab = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  font: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: ${props =>
    props.active ? 'rgb(255, 122, 0)' : 'rgba(68, 68, 69, 1)'};
  border-color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'transparent'};
  &:hover {
    color: rgba(255, 122, 0, 1);
  }
`;

export const Dashboard = () => {
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const clusterChanged = useSelector(
    DashboardSelectors.getResetNamespaceOption
  );
  const [selectedNamespace, setSelectedNamespace] = useState(null);
  const { control, setValue } = useForm();

  const [selectedRange, setSelectedRange] = useState(null); // Add selectedRange state
  const namespaces = useSelector(NamespacesSelectors.getNamespaces);
  const dashboardData = useSelector(DashboardSelectors.getDashboardData);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchDashboard')
  );
  const [updatedErrors, setUpdatedErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('QuickInsights');

  // Reset selectedRange when cluster changes
  useEffect(() => {
    setSelectedRange(null);
  }, [selectedCluster]);

  const now = new Date();

  const customRanges = [
    {
      label: 'Last 1 hour',
      value: [subHours(now, 1), now],
      placement: 'left',
    },
    {
      label: 'Last 7 Days',
      value: [subHours(now, 24 * 7), now],
      placement: 'left',
    },
    {
      label: 'Last Month',
      value: [subHours(now, 24 * 30), now],
      placement: 'left',
    },
    {
      label: 'Last 6 Months',
      value: [subHours(now, 24 * 30 * 6), now],
      placement: 'left',
    },
  ];

  const COLUMNS = [
    {
      label: 'Process Group',
      renderCell: item => <div>{item.processor_group}</div>,
      width: '25%',
    },
    {
      label: 'Process Group ID',
      renderCell: item => (
        <div>
          <IdWrapper data-tooltip-id={`tooltip-${item.processor_group_id}`}>
            {item.processor_group_id}
          </IdWrapper>
          <ReactTooltip
            id={`tooltip-${item.processor_group_id}`}
            place="right"
            content={item.processor_group_id}
            style={{
              width: '320px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </div>
      ),
      width: '25%',
    },
    {
      label: 'Processor Name',
      renderCell: item => <div>{item.processor_name}</div>,
      width: '25%',
    },
    {
      label: 'Error Message',
      renderCell: item => (
        <TextEllipses>
          <CrossIcon color="red" />
          <ErrorTexts data-tooltip-id={`tooltip-${item.index}-m`}>
            {item.message}
          </ErrorTexts>
          <ReactTooltip
            id={`tooltip-${item.index}-m`}
            place="right"
            content={item.message}
            style={{
              width: '400px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: theme.zIndex,
            }}
          />
        </TextEllipses>
      ),
      width: '25%',
    },
  ];

  const onNamespaceSelect = selectedItem => {
    dispatch(DashboardActions.setResetNamespaceOption(false));
    setSelectedNamespace(selectedItem);
  };

  const handleDateRangeChange = dateRange => {
    if (dateRange && dateRange.length === 2) {
      let [startDate, endDate] = dateRange;
      const now = new Date();
      if (
        startDate.toDateString() === endDate.toDateString() &&
        startDate.getTime() === endDate.getTime()
      ) {
        const adjustedEnd = new Date(endDate);
        adjustedEnd.setHours(23, 59, 0, 0);
        endDate = adjustedEnd;
      }
      if (
        isAfter(startOfDay(startDate), startOfDay(now)) ||
        isAfter(startOfDay(endDate), startOfDay(now))
      ) {
        toast.error(
          'Future dates are not allowed. Please select a date range up to today.'
        );
        return;
      }

      const adjustedRange = [startDate, endDate];
      setSelectedRange(adjustedRange);
      if (!isEmpty(selectedCluster)) {
        dispatch(
          DashboardActions.fetchDashboard({
            payload: { selectedNamespace, dateRange },
          })
        );
      }
    } else {
      setSelectedRange(null);
    }
  };

  useEffect(() => {
    if (!isEmpty(selectedCluster) && !clusterChanged) {
      const payload = {
        selectedNamespace: selectedNamespace,
      };
      dispatch(
        DashboardActions.fetchDashboard({
          payload,
        })
      );
    } else {
      const payload = {
        selectedNamespace: '',
      };
      dispatch(
        DashboardActions.fetchDashboard({
          payload,
        })
      );
      setValue('namespaceDropdown', 'All');
    }
  }, [dispatch, selectedCluster, selectedNamespace, clusterChanged]);

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(NamespacesActions.fetchNamespaces());
    }
  }, [dispatch, selectedCluster]);

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem('keycloakConfig'));
    if (storedConfig) {
      dispatch(SettingsActions.fetchSettings());
    }
  }, [dispatch]);

  useEffect(() => {
    if (dashboardData?.errors) {
      let updatedError = dashboardData?.errors.map((element, index) => ({
        ...element,
        index: index,
      }));
      setUpdatedErrors(updatedError);
    }
  }, [dashboardData]);

  const handleRefresh = () => {
    if (selectedCluster && selectedNamespace) {
      dispatch(
        DashboardActions.fetchDashboard({
          payload: { selectedNamespace: selectedNamespace },
        })
      );
    } else {
      dispatch(DashboardActions.fetchDashboard());
    }
  };

  let ClusterActivated = localStorage.getItem('clusters');

  const handleDeploymentStatisticsClick = () => {
    if (!selectedCluster?.value) {
      toast.info(KDFM.PLEASE_LOGIN_TO_CLUSTER, {
        toastId: 'please-login-cluster-toast',
      });
      return;
    }
    setActiveTab('DeploymentStatistics');
  };

  return (
    <>
      <Loader loading={loading} />
      <TabsContainer>
        <TabWrapper className="justify-content-between w-100">
          <div className="d-flex align-items-center">
            <Tab
              active={activeTab === 'QuickInsights'}
              onClick={() => setActiveTab('QuickInsights')}
            >
              <InsightIconContiner active={activeTab === 'QuickInsights'}>
                <LensIcon
                  color={activeTab === 'QuickInsights' ? '#f0701a' : '#6c757d'}
                />
              </InsightIconContiner>
              <QuickInsightHeadingText>Quick Insights</QuickInsightHeadingText>
            </Tab>

            <Tab
              active={activeTab === 'DeploymentStatistics'}
              onClick={handleDeploymentStatisticsClick}
            >
              <InsightIconContiner
                active={activeTab === 'DeploymentStatistics'}
              >
                <DeploymentStaticsIcon
                  color={
                    activeTab === 'DeploymentStatistics' ? '#f0701a' : '#6c757d'
                  }
                />
              </InsightIconContiner>
              <QuickInsightHeadingText>
                Deployment Statistics
              </QuickInsightHeadingText>
            </Tab>
          </div>

          <TopSection>
            <DropdownWrapper>
              {activeTab === 'QuickInsights' && (
                <DropdownContainer
                  disabled={!ClusterActivated}
                  style={{
                    cursor:
                      selectedCluster?.value && !isEmpty(selectedCluster?.value)
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                >
                  <SelectField
                    options={
                      Array.isArray(namespaces)
                        ? [
                            ClusterActivated ? { value: '', label: 'All' } : [],
                            ...namespaces
                              .filter(space => !space.isProcessor)
                              .map(({ id, name }) => ({
                                value: id,
                                label: name,
                              })),
                          ]
                        : []
                    }
                    onChange={onNamespaceSelect}
                    placeholder="Select Process Group"
                    title={
                      selectedCluster?.value && !isEmpty(selectedCluster?.value)
                        ? KDFM.SELECT_PROCESS_GROUP
                        : KDFM.PLEASE_LOGIN_TO_CLUSTER
                    }
                    backgroundColor={theme.colors.lightGrey}
                    size="sm"
                    disabled={!selectedCluster?.value}
                    control={control}
                    name="namespaceDropdown"
                  />
                </DropdownContainer>
              )}
              {activeTab === 'DeploymentStatistics' && (
                <div>
                  <DateRangePickerInput
                    value={selectedRange}
                    handleChange={handleDateRangeChange}
                    customRanges={customRanges}
                    showTime={{ format: 'hh:mm A' }}
                    format="YYYY-MM-DD hh:mm A"
                    placeholder={['Start Time', 'End Time']}
                  />
                </div>
              )}
              <RefreshIocn
                onClick={handleRefresh}
                data-tooltip-id={`tooltip-group-dashboard-refresh`}
                style={{
                  cursor:
                    selectedCluster?.value && !isEmpty(selectedCluster?.value)
                      ? 'pointer'
                      : 'not-allowed',
                }}
              >
                {' '}
                <RefreshIcon
                  style={{
                    cursor:
                      selectedCluster?.value && !isEmpty(selectedCluster?.value)
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                />
              </RefreshIocn>
              <ReactTooltip
                id={`tooltip-group-dashboard-refresh`}
                place="left"
                content={
                  selectedCluster?.value && !isEmpty(selectedCluster?.value)
                    ? 'Refresh'
                    : 'Login to Cluster'
                }
                style={{
                  width: 'auto',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </DropdownWrapper>
          </TopSection>
        </TabWrapper>
      </TabsContainer>
      {activeTab === 'QuickInsights' && (
        <>
          <InsightDataContiner>
            <InsightContainer
              backgroundCss="#F1F5FF"
              icon={TotalProcessorIcon}
              count={dashboardData?.total_processors || '0'}
              text="Total Processors"
              selectedNamespace={selectedNamespace}
            />
            <InsightContainer
              backgroundCss="#FEFBEC"
              icon={RunningProcessorIcon}
              count={dashboardData?.running_processors || '0'}
              text="Running Processors"
              selectedNamespace={selectedNamespace}
            />

            <InsightContainer
              backgroundCss="#EEF9FB"
              icon={StoppedProcessorIcon}
              count={dashboardData?.stopped_processors || '0'}
              text="Stopped Processors"
              selectedNamespace={selectedNamespace}
            />
            <InsightContainer
              backgroundCss="#FDF3FC"
              icon={DisabledProcessorIcon}
              count={dashboardData?.disabled_processors || '0'}
              text="Disabled Processors"
              selectedNamespace={selectedNamespace}
            />
            <InsightContainer
              backgroundCss="#FFF7ED"
              icon={InvalidProcessorIcon}
              count={dashboardData?.invalid_count || '0'}
              text="Invalid Processors"
              selectedNamespace={selectedNamespace}
            />
            <InsightContainer
              backgroundCss="#F0F0F2"
              icon={ActiveThreadIcon}
              count={dashboardData?.active_thread_count || '0'}
              text="Active Threads"
              selectedNamespace={selectedNamespace}
            />
            <InsightContainer
              backgroundCss="#EEF8FF"
              icon={TotalQuedIcon}
              count={dashboardData?.queued_size || '0 MB'}
              text="Total Queued"
              selectedNamespace={selectedNamespace}
            />
            <InsightContainer
              backgroundCss="#EEF0F4"
              icon={FlowFiledQuedIcon}
              count={dashboardData?.flow_files_queued || '0'}
              text="Flow Files Queued"
              selectedNamespace={selectedNamespace}
            />
          </InsightDataContiner>
          <FlowMetricContainer>
            <FlowMetricHeader>
              <FlowMetricHeaderIcon />
              <HeaderText>Flow Metrics</HeaderText>
            </FlowMetricHeader>
            <FlowMetrics
              flowMetricsDataDynamic={
                dashboardData?.flowMetrixYData || [0, 0, 0]
              }
            />
          </FlowMetricContainer>
          <ErrorsHeader>
            <ErrorIcon />

            <HeaderText>Errors</HeaderText>
          </ErrorsHeader>
          <StyledTable data={updatedErrors || []} columns={COLUMNS} />
        </>
      )}
      {activeTab === 'DeploymentStatistics' && (
        <DeploymentStatistics selectedRange={selectedRange} />
      )}
    </>
  );
};
