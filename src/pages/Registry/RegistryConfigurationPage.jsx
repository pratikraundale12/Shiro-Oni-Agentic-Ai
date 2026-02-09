/* eslint-disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
// import { ClustersActions, ClustersSelectors } from '../store';
import { Button, ModalWithIcon } from '../../shared';
import { Title } from '../Clusters/components/Title';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
  RegistryActions,
  RegistrySelectors,
} from '../../store';
import RegistryNavigationTab from './RegistryNavigationTab';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  PencilIcon,
  PlusCircleIcon,
} from '../../assets';
import { FullPageLoader, IconButton, Table } from '../../components';
import { Tooltip as ReactTooltip } from 'react-tooltip';
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
  gap: 3px;
`;
const RegistryConfigurationPage = ({ activeTab }) => {
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState({});
  const lastVisit = useSelector(ClustersSelectors.getlastVisitedTab);
  const configList = useSelector(
    RegistrySelectors.getRegistryConfigurationsList
  );
  const toUpperIfAlphanumeric = str => {
    if (typeof str !== 'string') return str;
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(str);
    return isAlphanumeric ? str.toUpperCase() : str;
  };
  const handleEditKubeConfig = ({ configItem }) => {
    dispatch(RegistryActions.setRegistryConfigEditItem(configItem));
    history.push('/registry-management/registry-configuration');
  };
  const KUBE_COLUMNS = [
    {
      label: 'Config Name',
      renderCell: item => <>{item.config_name}</>,
      resize: true,
      width: '50%',
    },
    {
      label: 'Config Type',
      renderCell: item => <>{toUpperIfAlphanumeric(item?.type)}</>,
      resize: true,
      width: '10%',
    },
    {
      label: 'Config Version',
      renderCell: item => <>{item.config_version}</>,
      resize: true,
      width: '20%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={() => {
              handleEditKubeConfig({ configItem: item });
            }}
            className="pencil-icon-schedule-list"
            data-tooltip-id={'config-ansible-edit-option'}
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          {/* <ReactTooltip
            id={`config-ansible-edit-option`}
            place="bottom"
            effect="solid"
            content={'Edit Config'}
            style={{
              width: '105px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          /> */}
          {
            <IconButton
              onClick={() => {
                setConfigToDelete(item);
                setIsDeleteModalOpen(true);
              }}
              className="pencil-icon-schedule-list"
              data-tooltip-id={'config-ansible-delete-option'}
              disabled={item?.is_part_of_registry}
            >
              <DeleteSmallIcon width={16} height={16} color="red" />
            </IconButton>
          }
          {/* <ReactTooltip
            id={`config-ansible-delete-option`}
            place="bottom"
            effect="solid"
            content={'Delete Config'}
            style={{
              width: '125px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          /> */}
        </ActionTd>
      ),
      resize: true,
      width: '20%',
    },
  ];
  const handleAddConfig = () => {
    history.push('/registry-management/registry-configuration');
  };
  useEffect(() => {
    dispatch(RegistryActions.fetchRegistryConfigurationList());
    dispatch(RegistryActions.setRegistryConfigEditItem({}));
  }, [dispatch]);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryConfigurationList')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'deleteRegistryConfiguration')
  );

  return (
    <Wrapper>
      <Title title={'Add New Registry'} />
      <FullPageLoader loading={loading || loading2} />
      <Container>
        <RegistryNavigationTab activeTab={activeTab} />
        <TableContainer>
          <div className="d-flex justify-content-end mt-3 mb-3">
            <div className="col-auto me-3">
              <Button
                size="md"
                onClick={() => {
                  handleAddConfig();
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
          {/* <div className="ms-3 me-3">
            <SearchContainer>
              <SmallSearchIcon
                width={18}
                height={18}
                color={theme.colors.darkGrey1}
              />
              <Search
                type="search"
                value={searchText}
                placeholder={'Search Configuration'}
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
            </SearchContainer>
          </div> */}
          <div className="ms-3 me-3">
            <Table
              data={configList || []}
              columns={KUBE_COLUMNS}
              customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
              tableWithFullHeight={true}
            />
          </div>
        </TableContainer>
      </Container>
      <ModalWithIcon
        title={'Delete Config'}
        primaryButtonText={'Delete'}
        secondaryButtonText={'Cancel'}
        icon={<DeleteDustbinIcon />}
        isOpen={isDeleteModalOpen}
        onSubmit={() => {
          dispatch(
            RegistryActions.deleteRegistryConfiguration(configToDelete?.id)
          );
          setIsDeleteModalOpen(false);
        }}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
          setConfigToDelete({});
        }}
        primaryText={`Are you sure you want to delete config!`}
      />
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
              history.push('/registry-management/details');
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
RegistryConfigurationPage.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default RegistryConfigurationPage;
