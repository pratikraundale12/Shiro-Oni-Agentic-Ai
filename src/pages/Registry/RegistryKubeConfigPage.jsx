/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, ModalWithIcon } from '../../shared';
import { Title } from '../Clusters/components/Title';
import {
  ClustersSelectors,
  LoadingSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../store';
import RegistryNavigationTab from './RegistryNavigationTab';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  PlusCircleIcon,
} from '../../assets';
import { FullPageLoader, IconButton, Table } from '../../components';
import { KubeRegistryConfigurationModal } from './KubeRegistryConfigurationModal';
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
const RegistryCreationKubeConfigPage = ({ activeTab }) => {
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hostToDelete, setHostToDelete] = useState({});
  const configList = useSelector(RegistrySelectors.getregistryKubeConfigList);
  const toUpperIfAlphanumeric = str => {
    if (typeof str !== 'string') return str;

    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(str);

    return isAlphanumeric ? str.toUpperCase() : str;
  };
  const COLUMNS = [
    {
      label: 'Kubernetes Registry Configuration',
      renderCell: item => (
        <div className="d-flex gap-2">{item?.kube_cluster_name || 'N/A'}</div>
      ),

      resize: true,
      width: '60%',
    },
    {
      label: 'Type',
      renderCell: item => (
        <div className="d-flex gap-2">
          {toUpperIfAlphanumeric(item?.type) || 'N/A'}
        </div>
      ),

      resize: true,
      width: '20%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          {/* <IconButton
              onClick={() => {
                setHostToEdit(item);
                dispatch(ClustersActions.setIsAddHostIPModalOpen(true));
              }}
              className="pencil-icon-schedule-list"
            >
              <PencilIcon width={16} height={16} />
            </IconButton> */}

          <IconButton
            onClick={() => {
              setIsDeleteModalOpen(true);
              setHostToDelete(item);
            }}
            className="pencil-icon-schedule-list"
            disabled={item?.is_selected}
          >
            <DeleteSmallIcon width={16} height={16} color="red" />
          </IconButton>
        </ActionTd>
      ),
      resize: true,
      width: '20%',
    },
  ];
  useEffect(() => {
    dispatch(RegistryActions.fetchRegistryKubeConfigList());
  }, [dispatch]);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryKubeConfigList')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'createRegistryKubeConfig')
  );
  const loading3 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'deleteRegistryKubeConfig')
  );
  return (
    <Wrapper>
      <Title title={'Add New Registry'} />
      <FullPageLoader loading={loading || loading2 || loading3} />
      <Container>
        <RegistryNavigationTab activeTab={activeTab} />
        <TableContainer>
          <div className="d-flex justify-content-between mt-3 mb-3">
            {<div className="ms-3 mt-2"></div>}

            <div className="col-auto me-3">
              <Button
                size="md"
                onClick={() => {
                  dispatch(RegistryActions.setiskubeConfigModalOpen(true));
                }}
                className="w-auto px-3"
                style={{ minWidth: 'auto' }}
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <PlusCircleIcon height={19} width={19} color={'#fff'} />
                  Add Kubernetes Configuration
                </div>
              </Button>
            </div>
          </div>
          <div className="ms-3 me-3">
            {/* <SearchContainer>
              <SmallSearchIcon
                width={18}
                height={18}
                color={theme.colors.darkGrey1}
              />
              <Search
                type="search"
                value={searchText}
                placeholder={
                  createClusterVisKubernetes === 'VM'
                    ? 'Search Host'
                    : 'Search Configuration'
                }
                onChange={e => {
                  const value = e.target.value;
                  setSearchText(value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              />
            </SearchContainer> */}
          </div>
          <div className="ms-3 me-3">
            <Table
              data={configList || []}
              columns={COLUMNS}
              customNoDataText="No Host IP Available"
              tableWithFullHeight={true}
            />
          </div>
        </TableContainer>
      </Container>
      <ModalWithIcon
        title={'Delete Kubernetes Configuration'}
        primaryButtonText={'Delete'}
        secondaryButtonText={'Back'}
        icon={<DeleteDustbinIcon />}
        isOpen={isDeleteModalOpen}
        onSubmit={() => {
          dispatch(RegistryActions.deleteRegistryKubeConfig(hostToDelete?.id));
          setIsDeleteModalOpen(false);
        }}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
        }}
        primaryText={`Are you sure you want to delete kubernetes configuration`}
      />
      <KubeRegistryConfigurationModal />
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              history.back();
            }}
          >
            {KDFM.BACK}
          </Button>

          <Button
            type="submit"
            onClick={() => {
              history.push('/registry-management/configuration');
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
RegistryCreationKubeConfigPage.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default RegistryCreationKubeConfigPage;
