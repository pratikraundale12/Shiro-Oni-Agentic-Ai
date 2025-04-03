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
import { history } from '../../../helpers/history';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { FullPageLoader, IconButton, Table } from '../../../components';
import {
  CopyIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  PencilIcon,
  PlusCircleIcon,
} from '../../../assets';

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
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const TableContainer = styled.div`
  height: calc(100% - 130px);
`;
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
  padding-right: 10px;
`;
const SetupClusterManageConfigWrapper = ({ activeTab }) => {
  const dispatch = useDispatch();
  const congigListData = useSelector(ClustersSelectors.getConfigNameList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState({});
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getConfigList')
  );

  const schema = yup.object().shape({
    clusterName: yup.string().required('Cluster Name is required'),
    nifi_version: yup.string().required('Port is required'),
  });
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

  const handleEditConfig = ({configItem}) =>{
    dispatch(ClustersActions.updateConfigClusterSetup(configItem));
    history.push('/clusters/new-config-details');
  }

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <>{item.config_name}</>,
      resize: true,
    },
    {
      label: 'Config Version',
      renderCell: item => <>{item.config_version}</>,
      resize: true,
    },
    {
      label: 'Comments',
      renderCell: item => <>{item.comments}</>,
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={event => {
              handleEditConfig({configItem:item});
            }}
            className="pencil-icon-schedule-list"
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          {/* <IconButton
            onClick={event => {
              console.log(event);
            }}
            className="pencil-icon-schedule-list"
          >
            <CopyIcon width={16} height={16} color="black" />
          </IconButton> */}
          <IconButton
            onClick={event => {
              setConfigToDelete(item);
              setIsDeleteModalOpen(true);
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
    dispatch(ClustersActions.getConfigList());
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
                onClick={() => {
                  history.push('/clusters/new-config-details');
                }}
                className="w-auto px-3"
                style={{ minWidth: 'auto' }}
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <PlusCircleIcon height={19} width={19} color={'#fff'} />
                  {KDFM.ADD_NEW_CONFIG}
                </div>
              </Button>
            </div>
          </div>

          <Table
            data={congigListData}
            columns={COLUMNS}
            customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
            tableWithFullHeight={true}
          />
        </TableContainer>
        <ModalWithIcon
          title={'Delete Config'}
          primaryButtonText={'Delete'}
          secondaryButtonText={'Cancel'}
          icon={<DeleteDustbinIcon />}
          isOpen={isDeleteModalOpen}
          onSubmit={() => {
            dispatch(
              ClustersActions.deleteConfig({ configId: configToDelete?.id })
            );
            setIsDeleteModalOpen(false);
          }}
          onRequestClose={() => {
            setIsDeleteModalOpen(false);
            setConfigToDelete({});
          }}
          primaryText={`Are you sure you want to delete config !`}
        />
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              dispatch(
                ClustersActions.setActiveTabClusterSetup('getting_started')
              );
            }}
          >
            {KDFM.BACK}
          </Button>

          {/* <Button type="submit" onClick={handleSubmit(handleContinue)}> */}
          <Button
            type="submit"
            onClick={() => {
              //   history.push(`/clusters/manage-configuration-details`);
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
SetupClusterManageConfigWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default SetupClusterManageConfigWrapper;
