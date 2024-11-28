/* eslint-disable react/prop-types */
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ConfirmScheduleDeploymentIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  FlashCutIcon,
  FlashIcon,
  GreaterArrowIcon,
  SettingSmallIcon,
  SmallSearchIcon,
  TodoIcon,
} from '../../assets';
import { Table } from '../../components';
import { Button, ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { theme } from '../../styles';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import AddControllerServiceModal from '../ControllerService/AddControllerServiceModal';
import AddProperties from '../ControllerService/AddProperties';
import ConfigControllerService from '../ControllerService/ConfigControllerService';
import ConfigurePropertyModal from '../ControllerService/ConfigurePropertyModal';
import PropertyDropdownModal from '../ControllerService/ProprtyDropdownModel';

const SearchContainer = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;
const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;
const StatusTexts = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  letter-spacing: -0.005em;
  text-align: left;
  color: ${props => props.color || '#b5b5bd'};
  display: flex;
  align-items: center;
  cursor: pointer;
  div {
    align-items: center;
    height: 8px;
    width: 8px;
    background: ${props => props.color || '#b5b5bd'};
    margin-right: 5px;
    border-radius: 50%;
  }
`;
const statusColors = {
  DISABLED: '#b5b5bd',
  SCHEDULED: '#0cbf59',
  INVALID: 'red',
  'IN PROGRESS': '#444445',
  DEFAULT: '#F2891F',
  ENABLED: '#0cbf59',
};
const StatusText = ({ text = '', item }) => {
  const color = statusColors[text] || statusColors.DEFAULT;
  function capitalizeFirstLetter(text) {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return (
    <>
      <StatusTexts color={color} data-tooltip-id={`tooltip-cs-${item?.id}`}>
        {capitalizeFirstLetter(text)}
      </StatusTexts>{' '}
      {!isEmpty(item?.tooltip) && (
        <ReactTooltip
          id={`tooltip-cs-${item?.id}`}
          place="right"
          content={item?.tooltip ? item?.tooltip : null}
          style={{
            width: '520px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        />
      )}
    </>
  );
};
export const ListControllerService = () => {
  const [search, setSearch] = useState('');
  const [updatedData, setUpdatedData] = useState([]);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );

  const [isAddpropertiesModalOpen, setIsAddpropertiesModalOpen] =
    useState(false);
  const [selectedItemFromList, setSelectedItemFromList] = useState({});
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState({});
  const modalOpenState = useSelector(
    NamespacesSelectors.getIsAddControllerServiceMOdalOpen
  );
  const [listPropertyTableData, setListPropertTableData] = useState(
    selectedItemFromList?.properties
  );
  const filteredModulesData = listData.filter(
    module =>
      module?.name?.toLowerCase().includes(search.toLowerCase()) ||
      module?.type?.toLowerCase().includes(search.toLowerCase())
  );
  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
  );
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const selectedNamespaceId = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getAllRootControllerServiceNamespace')
  );
  const handleEnableClick = item => {
    setSelectedItemFromList(item);
    setIsEnableModalOpen(true);
  };

  const handleDeleteClick = item => {
    setSelectedItemFromList(item);
    setIsDeleteModalOpen(true);
  };
  const handleStatusClick = () => {
    dispatch(
      NamespacesActions.changeStatusControllerService({
        state:
          selectedItemFromList?.state == 'DISABLED' ? 'ENABLED' : 'DISABLED',
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
      })
    );
    setTimeout(() => {
      dispatch(NamespacesActions.getControllerServiceList());
    }, 500);
    setIsEnableModalOpen(false);
  };
  const handleDeleteControllerServiceClick = () => {
    dispatch(
      NamespacesActions.deleteControllerService({
        version: selectedItemFromList?.version,
        id: selectedItemFromList?.id,
      })
    );

    setTimeout(() => {
      dispatch(NamespacesActions.getControllerServiceList());
    }, 500);
    setIsDeleteModalOpen(false);
  };

  const controllerPermissions = useSelector(
    AuthenticationSelectors.getPermissions
  );

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item?.name,
      width: '21%',
    },
    {
      label: 'Type',
      renderCell: item => item?.typeValue,
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => item?.bundleValue,
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item => <StatusText text={item?.state} item={item} />,
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope,
      width: '11%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <>
          {controllerPermissions.includes('edit_controller_services') && (
            <>
              <button
                className="border-0 bg-white"
                onClick={() => handleSettingClick(item)}
                data-tooltip-id={'Settings'}
              >
                <SettingSmallIcon />
              </button>
              <ReactTooltip
                id={'Settings'}
                place="left"
                content={'Settings'}
                style={{
                  width: '100px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </>
          )}
          {item?.state != 'INVALID' &&
            item?.state != 'VALIDATING' &&
            item?.state != 'DISABLING' &&
            controllerPermissions.includes('edit_controller_services') && (
              <>
                <button
                  className="border-0 bg-white ms-1"
                  onClick={() => handleEnableClick(item)}
                  data-tooltip-id={item?.id}
                >
                  {item?.state !== 'DISABLED' ? (
                    <FlashCutIcon />
                  ) : (
                    <FlashIcon />
                  )}
                </button>
                <ReactTooltip
                  id={item?.id}
                  place="left"
                  content={item?.state !== 'DISABLED' ? 'Enable' : 'Disable'}
                  style={{
                    width: '100px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
          {item?.state != 'ENABLED' &&
            item?.state != 'ENABLING' &&
            item?.state != 'DISABLING' &&
            controllerPermissions.includes('delete_controller_services') && (
              <>
                <button
                  className="border-0 bg-white ms-1"
                  onClick={() => handleDeleteClick(item)}
                  data-tooltip-id={'Delete'}
                >
                  <DeleteSmallIcon color="black" height="28" />
                </button>
                <ReactTooltip
                  id={'Delete'}
                  place="left"
                  content={'Delete'}
                  style={{
                    width: '80px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </>
            )}
        </>
      ),
      width: '14%',
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList());
  }, [dispatch, modalOpenState, selectedCluster]);

  const handleSettingClick = item => {
    setSelectedItemFromList(item);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
    dispatch(NamespacesActions.getControllerServiceList());
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };
  return (
    <>
      {controllerPermissions.includes('add_controller_services') && (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex  align-items-center gap-3">
            <button
              className="d-flex bg-white border-0 "
              onClick={handleBackButtonClick}
            >
              <GreaterArrowIcon />
            </button>
            <div className="d-flex  align-items-center gap-2">
              <TodoIcon width={22} height={24} />
              <HeadingStyle>{selectedNamespaceId?.label}</HeadingStyle>
            </div>
          </div>
          <div className="row mb-2 d-flex justify-content-end">
            <div>
              <Button
                type="button"
                size={'md'}
                onClick={() =>
                  dispatch(
                    NamespacesActions.setIsAddControllerServiceModal(true)
                  )
                }
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      <SearchContainer>
        <SmallSearchIcon
          width={18}
          height={18}
          color={theme.colors.darkGrey1}
        />
        <Search
          type="search"
          value={search}
          placeholder="Search Controller Service by Name and Type"
          onChange={e => setSearch(e.target.value)}
        />
      </SearchContainer>

      <AddControllerServiceModal />

      <Table
        data={filteredModulesData || []}
        columns={COLUMNS}
        controllerModule={true}
        loading={loading}
      />

      <ConfigControllerService
        isOpen={isListProprtyModel}
        onClose={handleCloseModal}
        selectedItemFromList={selectedItemFromList}
        handleAddValueModal={handleAddValueModal}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setSelectedPropertyToEdit={setSelectedPropertyToEdit}
        updatedData={updatedData}
        setUpdatedData={setUpdatedData}
      />
      <AddProperties
        isOpen={isAddpropertiesModalOpen}
        onClose={() => {
          setIsAddpropertiesModalOpen(false);
          dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
        }}
        selectedPropertyToEdit={selectedPropertyToEdit}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setIsAddpropertiesModalOpen={setIsAddpropertiesModalOpen}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
      />
      <PropertyDropdownModal
        selectedPropertyToEdit={selectedPropertyToEdit}
        setListPropertTableData={setListPropertTableData}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
      />
      <ConfigurePropertyModal
        setListPropertTableData={setListPropertTableData}
        setUpdatedData={setUpdatedData}
        updatedData={updatedData}
      />
      <ModalWithIcon
        title={`${selectedItemFromList?.state !== 'DISABLED' ? 'Disable' : 'Enable'}  : ${selectedItemFromList?.name}`}
        primaryButtonText={
          selectedItemFromList?.state !== 'DISABLED' ? 'Disable' : 'Enable'
        }
        secondaryButtonText="Cancel"
        icon={<ConfirmScheduleDeploymentIcon />}
        isOpen={isEnableModalOpen}
        onRequestClose={() => setIsEnableModalOpen(false)}
        primaryText={`Are you sure you want to ${selectedItemFromList?.state !== 'DISABLED' ? 'disable' : 'enable'} ${selectedItemFromList?.name}?`}
        onSubmit={handleStatusClick}
      />
      <ModalWithIcon
        title={`Delete : ${selectedItemFromList?.name}`}
        primaryButtonText={'Delete'}
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        primaryText={`Are you sure you want to delete ${selectedItemFromList?.name}?`}
        onSubmit={handleDeleteControllerServiceClick}
      />
    </>
  );
};

export default ListControllerService;
