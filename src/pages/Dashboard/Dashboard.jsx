import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';

import { FullPageLoader, Table } from '../../components';
import { SelectField } from '../../shared';
import { theme } from '../../styles';
import { FlowMetrics, InsightContainer } from './components';

import {
  ActiveThreadIcon,
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
  DashboardActions,
  DashboardSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const QuickInsightHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  margin-bottom: 0.5rem;
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
  min-width: 175px;
  max-width: 175px;
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
    word-break: break-all;
    overflow: hidden;
  }
`;
const DropdownWrapper = styled.div`
  display: flex;
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
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 27px;
  border-radius: 4px;
`;

export const Dashboard = () => {
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const [selectedNamespace, setSelectedNamespace] = useState(null);
  const namespaces = useSelector(NamespacesSelectors.getNamespaces);
  const dashboardData = useSelector(DashboardSelectors.getDashboardData);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchDashboard')
  );
  const [updatedErrors, setUpdatedErrors] = useState([]);

  const COLUMNS = [
    {
      label: 'Process Group',
      renderCell: item => <div>{item.processor_group}</div>,
      width: '25%',
    },
    {
      label: 'Processor ID',
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
    setSelectedNamespace(selectedItem);
  };
  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      const payload = {
        selectedNamespace: selectedNamespace,
      };
      dispatch(
        DashboardActions.fetchDashboard({
          payload,
        })
      );
    }
  }, [dispatch, selectedCluster, selectedNamespace]);

  useEffect(() => {
    if (!isEmpty(selectedCluster)) {
      dispatch(NamespacesActions.fetchNamespaces());
    }
  }, [dispatch, selectedCluster]);

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

  return (
    <>
      <Loader loading={loading} />
      <TopSection>
        <QuickInsightHeading>
          <InsightIconContiner>
            <LensIcon />
          </InsightIconContiner>
          <QuickInsightHeadingText>Quick Insights</QuickInsightHeadingText>
        </QuickInsightHeading>
        <DropdownWrapper>
          <DropdownContainer disabled={!ClusterActivated}>
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
              placeholder="Select Process Group" // TODO: change it to Process Group
              title="Select Process Group"
              backgroundColor={theme.colors.lightGrey}
              size="sm"
              disabled={!selectedCluster?.value}
            />
          </DropdownContainer>
          <RefreshIocn
            onClick={handleRefresh}
            data-tooltip-id={`tooltip-group-dashboard-refresh`}
          >
            {' '}
            <RefreshIcon style={{ cursor: 'pointer' }} />
          </RefreshIocn>
          <ReactTooltip
            id={`tooltip-group-dashboard-refresh`}
            place="left"
            content={'Refresh'}
            style={{
              width: '100px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </DropdownWrapper>
      </TopSection>
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
          flowMetricsDataDynamic={dashboardData?.flowMetrixYData || [0, 0, 0]}
        />
      </FlowMetricContainer>
      <ErrorsHeader>
        <ErrorIcon />

        <HeaderText>Errors</HeaderText>
      </ErrorsHeader>
      <StyledTable data={updatedErrors || []} columns={COLUMNS} />
    </>
  );
};
