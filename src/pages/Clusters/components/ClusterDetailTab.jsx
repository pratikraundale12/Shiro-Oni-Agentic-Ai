/* eslint-disable */
import React, { useEffect } from 'react';
import { Button, InputField, SelectField } from '../../../shared';
import {
  DeleteSmallIcon,
  NoDataIcon,
  PencilIcon,
  PlusIcon,
  QRIcons,
} from '../../../assets';
import styled from 'styled-components';
import {
  FullPageLoader,
  IconButton,
  LoaderContainer,
  StatusRender,
  Table,
} from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { AddHostIPModal } from './AddHostIPModal';
import { isEmpty } from 'lodash';

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
  padding-right: 10px;
`;
const ActiveButtonDiv = styled.div`
  height: 48px;
  width: 48px;
  max-width: 48px;
  max-height: 48px;
  min-height: 48px;
  min-width: 48px;
  border: 1px solid #444445;
  border-radius: 8px;
  background-color: #f5f7fa;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
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
`;

const ClusterDetailTab = ({ control, errors, register }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getNiFiVersions')
  );
  const loadingAddAPI = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );

  const nifiVersionsData = useSelector(ClustersSelectors.getNifiVersions);
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);

  const mockData = [
    {
      host_ip: '192.168.1.11',
      port: '9090',
      username: 'Hermione Granger',
      status: true,
    },
    {
      host_ip: '192.168.1.12',
      port: '7070',
      username: 'Ron Weasley',
      status: false,
    },
    {
      host_ip: '192.168.1.13',
      port: '6060',
      username: 'Albus Dumbledore',
      status: true,
    },
    {
      host_ip: '192.168.1.14',
      port: '5050',
      username: 'Severus Snape',
      status: false,
    },
    {
      host_ip: '192.168.1.15',
      port: '4040',
      username: 'Rubeus Hagrid',
      status: true,
    },
    {
      host_ip: '192.168.1.16',
      port: '3030',
      username: 'Draco Malfoy',
      status: false,
    },
    {
      host_ip: '192.168.1.17',
      port: '2020',
      username: 'Minerva McGonagall',
      status: true,
    },
    {
      host_ip: '192.168.1.18',
      port: '1919',
      username: 'Sirius Black',
      status: false,
    },
    {
      host_ip: '192.168.1.19',
      port: '1818',
      username: 'Remus Lupin',
      status: true,
    },
    {
      host_ip: '192.168.1.20',
      port: '1717',
      username: 'Luna Lovegood',
      status: false,
    },
    {
      host_ip: '192.168.1.21',
      port: '1616',
      username: 'Neville Longbottom',
      status: true,
    },
    {
      host_ip: '192.168.1.22',
      port: '1515',
      username: 'Bellatrix Lestrange',
      status: false,
    },
    {
      host_ip: '192.168.1.23',
      port: '1414',
      username: 'Lord Voldemort',
      status: true,
    },
    {
      host_ip: '192.168.1.24',
      port: '1313',
      username: 'Ginny Weasley',
      status: false,
    },
    {
      host_ip: '192.168.1.25',
      port: '1212',
      username: 'Fred Weasley',
      status: true,
    },
  ];
  const nifiVerionsOptions =
    !isEmpty(nifiVersionsData) &&
    nifiVersionsData?.map(ele => ({ label: ele, value: ele }));

  useEffect(() => {
    dispatch(ClustersActions.getNiFiVersions());
  }, [dispatch]);

  const COLUMNS = [
    {
      label: 'Host IP',
      renderCell: item => <>{item?.host_ip}</>,
      resize: true,
    },
    {
      label: 'Port No.',
      renderCell: item => <>{item?.port}</>,
      resize: true,
    },
    {
      label: 'Username',
      renderCell: item => <>{item?.username}</>,
      resize: true,
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusRender
          status={item?.status ? 'Active' : 'Inactive'}
          redColor="#FF0000"
        />
      ),
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={event => {
              console.log(event);
              dispatch(ClustersActions.setIsAddHostIPModalOpen(true));
            }}
            className="pencil-icon-schedule-list"
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          <IconButton
            onClick={event => {
              console.log(event);
            }}
            className="pencil-icon-schedule-list"
          >
            <DeleteSmallIcon width={16} height={16} color="red" />
          </IconButton>
        </ActionTd>
      ),
      resize: true,
    },
  ];

  return (
    <>
      <FullPageLoader loading={loading || loadingAddAPI} />
      <div className="row mt-2 ms-2 me-2">
        {' '}
        <div className="col-8">
          <LabelSelect className="mb-3">Cluster Name</LabelSelect>

          <InputField
            name="clusterName"
            type="text"
            // label="Cluster Name"
            placeholder="Enter your Cluster Name"
            required
            register={register}
            errors={errors}
            icon={<QRIcons />}
            // rightIcon={getRightIcon(watch, errors, setValue)}
          />
        </div>
        <div className="col-4">
          <LabelSelect className="mb-3">NiFi Version</LabelSelect>
          <SelectField
            name="nifi_version"
            icon={<QRIcons />}
            register={register}
            errors={errors}
            control={control}
            options={nifiVerionsOptions || []}
            placeholder="Select NiFi Version"
          />
        </div>
      </div>

      <div className="col-auto ms-3">
        <Button
          size="md"
          onClick={() =>
            dispatch(ClustersActions.setIsAddHostIPModalOpen(true))
          }
          className="w-auto px-3"
          style={{ minWidth: 'auto' }}
        >
          <div
            className="d-flex "
            style={{ fontSize: '14px', fontWeight: '750' }}
          >
            <PlusIcon height={19} width={19} color={'#fff'} />
            Add New Host IP
          </div>
        </Button>
      </div>
      <div
        className="mt-4 px-3"
        style={{ height: 'calc(100% - 240px)', overflow: 'auto' }}
      >
        <Table
          data={mockData || listHostIpData}
          columns={COLUMNS}
          customNoDataText="No Host IP Available"
          tableWithFullHeight={true}
        />
      </div>
      <AddHostIPModal />
    </>
  );
};
export default ClusterDetailTab;
