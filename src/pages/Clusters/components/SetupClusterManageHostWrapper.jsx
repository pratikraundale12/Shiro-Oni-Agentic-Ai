/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import { Button, ModalWithIcon } from '../../../shared';
import { KDFM } from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import {
  FullPageLoader,
  IconButton,
  StatusRender,
  Table,
} from '../../../components';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  PencilIcon,
  PlusCircleIcon,
} from '../../../assets';
import { AddHostIPModal } from './AddHostIPModal';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;
const TableContainer = styled.div`
  height: calc(100% - 130px);
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
  padding-right: 10px;
`;
const SetupClusterManageHostWrapper = ({ activeTab }) => {
  const [hostToDelete, setHostToDelete] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hostToEdit, setHostToEdit] = useState({});
  const dispatch = useDispatch();
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);
  const schema = yup.object().shape({
    clusterName: yup.string().required('Cluster Name is required'),
    nifi_version: yup.string().required('Port is required'),
  });
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchHostNodesList')
  );
  console.log(hostToDelete, 'hostToDelete');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleContinue = data => {
    console.log(data);
  };
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
          status={item?.status === 'Active' ? 'Active' : 'Inactive'}
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
            onClick={() => {
              setHostToEdit(item);
              dispatch(ClustersActions.setIsAddHostIPModalOpen(true));
            }}
            className="pencil-icon-schedule-list"
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          <IconButton
            onClick={event => {
              setIsDeleteModalOpen(true);
              setHostToDelete(item);
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
  useEffect(() => {
    dispatch(ClustersActions.fetchHostNodesList({ selected: true }));
  }, [dispatch]);
  return (
    <Wrapper>
      <FullPageLoader loading={loading} />
      <Title title={'Add New Cluster'} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <TableContainer>
          <div className="d-flex justify-content-end mt-3 mb-3">
            <div className="col-auto me-3">
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
                  <PlusCircleIcon height={19} width={19} color={'#fff'} />
                  Add New Host
                </div>
              </Button>
            </div>
          </div>

          <Table
            data={listHostIpData || mockData}
            columns={COLUMNS}
            customNoDataText="No Host IP Available"
            tableWithFullHeight={true}
          />
        </TableContainer>
        <ModalWithIcon
          title={'Delete Host IP'}
          primaryButtonText={'Delete'}
          secondaryButtonText={'Cancel'}
          icon={<DeleteDustbinIcon />}
          isOpen={isDeleteModalOpen}
          onSubmit={() => {
            dispatch(
              ClustersActions.deleteIndividualHost({ hostId: hostToDelete?.id })
            );
            setIsDeleteModalOpen(false);
          }}
          onRequestClose={() => {
            setIsDeleteModalOpen(false);
          }}
          primaryText={`Are you sure you want to delete Host IP !`}
        />
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              dispatch(
                ClustersActions.setActiveTabClusterSetup('manage_config')
              );
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            onClick={() => {
              dispatch(
                ClustersActions.setActiveTabClusterSetup('cluster_details')
              );
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
      <AddHostIPModal hostToEdit={hostToEdit} setHostToEdit={setHostToEdit} />
    </Wrapper>
  );
};
SetupClusterManageHostWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default SetupClusterManageHostWrapper;
