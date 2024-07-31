import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SelectField } from '../../shared';
import { Table } from '../../components';
import { InsightContainer, FlowMetrics } from './components';
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
import { getInitialClusterData, getNamespaceData } from '../../utils/services';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { fetchGridData, useGlobalContext } from '../../utils';

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const QuickInsightHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Continer = styled.div`
  height: calc(100vh - 78px);
  width: calc(100vw - 250px);
  overflow: hidden;
  padding: 20px 50px 22px 20px;
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
`;

const BottomSectionScroll = styled.div`
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  overflow-x: hidden;
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
`;
const DropdownWrapper = styled.div`
  display: flex;
`;

const IdWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
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
      label: 'Process ID',
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
      label: 'Process Name',
      renderCell: item => <div>{item.processor_name}</div>,
    },
    {
      label: 'Error Message',
      renderCell: item => (
        <TextEllipses>
          <CrossIcon color="red" />
          <ErrorTexts data-tooltip-id={`tooltip-${item.processor_group_id}-m`}>
            <div>
              <b>Error Code </b>:404- File not found
            </div>
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
      toast.error('error occured');
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
      toast.error('error occured');
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
    { value: 5000, label: '5 sec' },
    { value: 3000, label: '3 Sec' },
    { value: 1000, label: '1 Sec' },
  ];

  const clusterOptions = state.clusterList.map(item => ({
    label: item.name,
    value: item.id,
  }));

  const handleRefreshFunctionality = () => {
    if (namespaceIdSelected) {
      getNamespaceDetails(selectedClusterId, namespaceIdSelected);
    } else if (selectedClusterId) {
      getClusterDetalis(selectedClusterId);
    }
    console.log('called');
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
    <Continer>
      <TopSection>
        <QuickInsightHeading>
          <InsightIconContiner>
            <LensIcon />
          </InsightIconContiner>
          <QuickInsightHeadingText>Quick Insight</QuickInsightHeadingText>
        </QuickInsightHeading>
        <DropdownWrapper>
          <DropdownContainer>
            <SelectField
              name="selectedItem"
              control={control}
              options={clusterOptions}
              label="Select Cluster"
              onChange={onClusterSelect}
            />
          </DropdownContainer>
          <DropdownContainer>
            <SelectField
              name="selectedItem"
              control={control}
              options={namespaceArray || []}
              label="Select Namespace"
              onChange={onNamespaceSelect}
            />
          </DropdownContainer>
          <DropdownContainer>
            <SelectField
              name="selectedItem"
              control={control}
              options={RefreshArray}
              label={'Refresh'}
              onChange={onRefreshSelect}
              placeholder="Refresh"
            />
          </DropdownContainer>
        </DropdownWrapper>
      </TopSection>
      <BottomSectionScroll>
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
            count={clusterDetails?.flow_files_queued || '0 Mb'}
            text="Flow Files Queued"
          />
        </InsightDataContiner>
        <FlowMetricHeader>
          <FlowMetricHeaderIcon />
          <HeaderText>Flow Metrics</HeaderText>
        </FlowMetricHeader>
        <FlowMetrics
          flowMetricsDataDynamic={clusterDetails?.flowMetrixYData || [0, 0, 0]}
        />
        <ErrorsHeader>
          <ErrorIcon />

          <HeaderText>Errors</HeaderText>
        </ErrorsHeader>
        <Table data={errorsLogs || []} columns={COLUMNS} />
      </BottomSectionScroll>
    </Continer>
  );
};
