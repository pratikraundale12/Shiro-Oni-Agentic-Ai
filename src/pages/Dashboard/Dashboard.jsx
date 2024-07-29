import React, { useEffect, useState } from 'react';
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
  DownArrowIcon,
  ErrorIcon,
} from '../../assets';
import { CrossIcon } from '../../assets/Icons/CrossIcon';
import { getAllClustersApi, getInitialClusterData } from '../../utils/services';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

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
`;
const DropdoenContainer = styled.div`
  margin-left: 10px;
`;
const DropdownWrapper = styled.div`
  display: flex;
`;
export const Dashboard = () => {
  const [clusterArray, setClusterArray] = useState([]);
  const [clusterDetails, setClusterDetails] = useState([]);
  const [namespaceArray, setNamespaceArray] = useState([]);
  const { control } = useForm();

  const COLUMNS = [
    {
      label: 'Process Group',
      renderCell: item => <div>{item.name}</div>,
    },
    {
      label: 'Process ID',
      renderCell: item => <div>{item.id}</div>,
      width: '20%',
    },
    {
      label: 'Process Name',
      renderCell: item => <div>{item.name}</div>,
    },
    {
      label: 'Error Message',
      renderCell: item => (
        <TextEllipses>
          <CrossIcon color="red" />
          <ErrorTexts>{item.message}</ErrorTexts>
        </TextEllipses>
      ),
      width: '50%',
    },
    {
      label: '',
      renderCell: () => <DownArrowIcon />,
      width: '10%',
    },
  ];
  const data = [
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 1',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 2',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 3',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 4',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 1',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 2',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 3',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
    {
      id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
      name: 'Group 4',
      message: (
        <div>
          <div>Error Code: 404 - File Not Found</div>
          <TextEllipses>
            Description: The requested resource could not be found on the
            server. The requested resource could not be found on the server.
          </TextEllipses>
        </div>
      ),
    },
  ];

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
    } else {
      toast.error('error occured');
    }
  };

  const getAllCluster = async () => {
    const response = await getAllClustersApi();
    if (response.status == 200) {
      const filteredArray = response.data.data.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      getClusterDetalis(filteredArray[0].value);
      setClusterArray(filteredArray);
    } else {
      toast.error('error occured');
    }
  };

  useEffect(() => {
    getAllCluster();
  }, []);

  const onClusterSelect = async selectedItem => {
    try {
      if (selectedItem) {
        getClusterDetalis(selectedItem?.value);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onNamespaceSelect = async selectedItem => {
    try {
      if (selectedItem) {
        console.log(selectedItem);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
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
          <DropdoenContainer>
            <form>
              <SelectField
                name="selectedItem"
                control={control}
                options={clusterArray}
                label="Select Cluster"
                onChange={onClusterSelect}
              />
            </form>
          </DropdoenContainer>
          <DropdoenContainer>
            <form>
              <SelectField
                name="selectedItem"
                control={control}
                options={namespaceArray || []}
                label="Select Namespace"
                onChange={onNamespaceSelect}
              />
            </form>
          </DropdoenContainer>
        </DropdownWrapper>
      </TopSection>
      <BottomSectionScroll>
        <InsightDataContiner>
          <InsightContainer
            backgroundCss="#F1F5FF"
            icon={TotalProcessorIcon}
            count={clusterDetails?.total_processors || ' '}
            text="Total Processor"
          />
          <InsightContainer
            backgroundCss="#FEFBEC"
            icon={RunnigProcessorIcon}
            count={clusterDetails?.running_processors}
            text="Running Processor"
          />

          <InsightContainer
            backgroundCss="#EEF9FB"
            icon={StoppedProcessorIcon}
            count={clusterDetails?.stopped_processors}
            text="Stopped Processor"
          />
          <InsightContainer
            backgroundCss="#FDF3FC"
            icon={DisabledProcessorIcon}
            count={clusterDetails?.disabled_processors}
            text="Disabled Processor"
          />
          <InsightContainer
            backgroundCss="#FFF7ED"
            icon={InvalidProcessorIcon}
            count={clusterDetails?.invalid_count}
            text="Invalid Processor"
          />
          <InsightContainer
            backgroundCss="#F0F0F2"
            icon={ActiveThreadIcon}
            count={clusterDetails?.active_thread_count}
            text="Active Thread"
          />
          <InsightContainer
            backgroundCss="#EEF8FF"
            icon={TotalQuedIcon}
            count={clusterDetails?.total_queued}
            text="Total Queued"
          />
          <InsightContainer
            backgroundCss="#EEF0F4"
            icon={FlowFiledQuedIcon}
            count={clusterDetails?.flow_files_queued}
            text="Flow Files Queued"
          />
        </InsightDataContiner>
        <FlowMetricHeader>
          <FlowMetricHeaderIcon />
          <HeaderText>Flow Metrics</HeaderText>
        </FlowMetricHeader>
        <FlowMetrics />
        <ErrorsHeader>
          <ErrorIcon />

          <HeaderText>Errors</HeaderText>
        </ErrorsHeader>
        <Table data={data} columns={COLUMNS} />
      </BottomSectionScroll>
    </Continer>
  );
};
