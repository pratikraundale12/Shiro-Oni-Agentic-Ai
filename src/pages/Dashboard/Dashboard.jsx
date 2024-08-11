import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { theme } from '../../styles';
import { SelectField } from '../../shared';
import { Table } from '../../components';
import { InsightContainer, FlowMetrics } from './components';
import { useGlobalContext } from '../../utils';
import {
  ActiveThreadIcon,
  DisabledProcessorIcon,
  FlowFiledQuedIcon,
  FlowMetricHeaderIcon,
  LensIcon,
  RunnigProcessorIcon,
  StoppedProcessorIcon,
  TotalProcessorIcon,
  TotalQuedIcon,
  InvalidProcessorIcon,
  ErrorIcon,
} from '../../assets';
import { CrossIcon } from '../../assets/Icons/CrossIcon';
import {
  fetchGridData,
  getInitialClusterData,
  getNamespaceData,
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
  padding-botton: 5px;
`;

const InsightIconContiner = styled.div`
  padding-top: 5px;
  margin-bottom: 0.5rem;
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
const DropdownWrapper = styled.div`
  display: flex;
`;

const IdWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;
const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;
  margin-right: 1.4rem;
  padding: 0;
  > div {
    margin-top: 0;
  }
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

export const Dashboard = () => {
  const { state, setState } = useGlobalContext();
  const [clusterDetails, setClusterDetails] = useState([]);
  const [namespaceArray, setNamespaceArray] = useState([]);
  const [selectedClusterId, setSelectedClusterId] = useState('');
  const [namespaceIdSelected, setNamespaceIdSelected] = useState('');
  const [errorsLogs, setErrorLogs] = useState([]);
  const [refreshState, setRefreshSelect] = useState(false);
  const intervalRef = useRef(null);
  const { control } = useForm();
  const COLUMNS = [
    {
      label: 'Process Group',
      renderCell: item => <div>{item.processor_group}</div>,
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
      width: '20%',
    },
    {
      label: 'Processor Name',
      renderCell: item => <div>{item.processor_name}</div>,
    },
    {
      label: 'Error Message',
      renderCell: item => (
        <TextEllipses>
          <CrossIcon color="red" />
          <ErrorTexts data-tooltip-id={`tooltip-${item.processor_group_id}-m`}>
            {item.message}
          </ErrorTexts>
          <ReactTooltip
            id={`tooltip-${item.processor_group_id}-m`}
            place="right"
            content={item.message}
            style={{
              width: '400px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </TextEllipses>
      ),
      width: '50%',
    },
    // {
    //   label: '',
    //   renderCell: () => <DownArrowIcon />,
    //   width: '10%',
    // },
  ];

  const getNamespaceDetails = async id => {
    const response = await getNamespaceData(selectedClusterId, id);
    if (response.status == 200) {
      setClusterDetails(response?.data);
      setErrorLogs(response.data.errors);
    } else {
      toast.error(response?.message || 'Something went wrong');
    }
  };

  const getClusterDetalis = async id => {
    const response = await getInitialClusterData(id);
    if (response.status == 200) {
      setClusterDetails(response.data);
      const filteredNamespaceArray = response.data.namespaces.data.map(
        ({ id, name }) => ({
          value: id,
          label: name,
        })
      );
      setNamespaceArray(filteredNamespaceArray);
      setErrorLogs(response.data.errors);
    } else {
      toast.error(response?.message || 'Something went wrong');
    }
  };

  const onClusterSelect = async selectedItem => {
    try {
      if (selectedItem) {
        getClusterDetalis(selectedItem?.value);
        setSelectedClusterId(selectedItem?.value);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onNamespaceSelect = async selectedItem => {
    try {
      if (selectedItem) {
        setNamespaceIdSelected(selectedItem?.value);
        await getNamespaceDetails(selectedItem?.value);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const onRefreshSelect = selectedItem => {
    if (selectedItem) {
      setRefreshSelect(selectedItem.value);
    }
  };
  const RefreshArray = [
    { value: false, label: 'Off' },
    { value: 5000, label: '5 Seconds' },
    { value: 30000, label: '30 Seconds' },
    { value: 100000, label: '1 Minute' },
  ];

  const clusterOptions = state.clusterList
    .filter(item => item.is_active)
    .map(item => ({
      label: item.name,
      value: item.id,
    }));

  const handleRefreshFunctionality = () => {
    if (namespaceIdSelected) {
      getNamespaceDetails(namespaceIdSelected);
    } else if (selectedClusterId) {
      getClusterDetalis(selectedClusterId);
    }
    return;
  };

  useEffect(() => {
    fetchGridData({
      setState,
      module: 'clusters',
    });
  }, [setState]);

  useEffect(() => {
    if (refreshState !== false) {
      intervalRef.current = setInterval(
        handleRefreshFunctionality,
        refreshState
      );
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [selectedClusterId, namespaceIdSelected, refreshState]);

  return (
    <>
      <TopSection>
        <QuickInsightHeading>
          <InsightIconContiner>
            <LensIcon />
          </InsightIconContiner>
          <QuickInsightHeadingText>Quick Insight</QuickInsightHeadingText>
        </QuickInsightHeading>
        <DropdownWrapper>
          <DropdownContainer>
            <StyledSelectField
              name="selectedItem"
              control={control}
              options={clusterOptions}
              onChange={onClusterSelect}
              placeholder="Select Cluster"
              title="Select Cluster"
              backgroundColor={theme.colors.lightGrey}
              size="sm"
            />
          </DropdownContainer>
          <DropdownContainer>
            <SelectField
              name="selectedItem"
              control={control}
              options={namespaceArray || []}
              onChange={onNamespaceSelect}
              placeholder="Select Namespace"
              title="Select Namespace"
              backgroundColor={theme.colors.lightGrey}
              size="sm"
            />
          </DropdownContainer>
          <DropdownContainer>
            <SelectField
              name="selectedItem"
              control={control}
              options={RefreshArray}
              onChange={onRefreshSelect}
              placeholder={` Refresh`}
              title="Refresh"
              backgroundColor={theme.colors.lightGrey}
              size="sm"
            />
          </DropdownContainer>
        </DropdownWrapper>
      </TopSection>
      <InsightDataContiner>
        <InsightContainer
          backgroundCss="#F1F5FF"
          icon={TotalProcessorIcon}
          count={clusterDetails?.total_processors || '0'}
          text="Total Processor"
        />
        <InsightContainer
          backgroundCss="#FEFBEC"
          icon={RunnigProcessorIcon}
          count={clusterDetails?.running_processors || '0'}
          text="Running Processor"
        />

        <InsightContainer
          backgroundCss="#EEF9FB"
          icon={StoppedProcessorIcon}
          count={clusterDetails?.stopped_processors || '0'}
          text="Stopped Processor"
        />
        <InsightContainer
          backgroundCss="#FDF3FC"
          icon={DisabledProcessorIcon}
          count={clusterDetails?.disabled_processors || '0'}
          text="Disabled Processor"
        />
        <InsightContainer
          backgroundCss="#FFF7ED"
          icon={InvalidProcessorIcon}
          count={clusterDetails?.invalid_count || '0'}
          text="Invalid Processor"
        />
        <InsightContainer
          backgroundCss="#F0F0F2"
          icon={ActiveThreadIcon}
          count={clusterDetails?.active_thread_count || '0'}
          text="Active Thread"
        />
        <InsightContainer
          backgroundCss="#EEF8FF"
          icon={TotalQuedIcon}
          count={clusterDetails?.queued_size || '0 MB'}
          text="Total Queued"
        />
        <InsightContainer
          backgroundCss="#EEF0F4"
          icon={FlowFiledQuedIcon}
          count={clusterDetails?.flow_files_queued || '0'}
          text="Flow Files Queued"
        />
      </InsightDataContiner>
      <FlowMetricContainer>
        <FlowMetricHeader>
          <FlowMetricHeaderIcon />
          <HeaderText>Flow Metrics</HeaderText>
        </FlowMetricHeader>
        <FlowMetrics
          flowMetricsDataDynamic={clusterDetails?.flowMetrixYData || [0, 0, 0]}
        />
      </FlowMetricContainer>
      <ErrorsHeader>
        <ErrorIcon />

        <HeaderText>Errors</HeaderText>
      </ErrorsHeader>
      <StyledTable data={[...errorsLogs] || []} columns={COLUMNS} />
    </>
  );
};
