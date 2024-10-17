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
  SettingSmallIcon,
  SmallSearchIcon,
} from '../../assets';
import { Loader, Table } from '../../components';
import { Button, ModalWithIcon } from '../../shared';
import {
  AuthenticationSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { theme } from '../../styles';
import AddControllerServiceModal from '../ControllerService/AddControllerServiceModal';
import AddProperties from '../ControllerService/AddProperties';
import ConfigControllerService from '../ControllerService/ConfigControllerService';
import ConfigurePropertyModal from '../ControllerService/ConfigurePropertyModal';
import PropertyDropdownModal from '../ControllerService/ProprtyDropdownModel';
// import AddControllerServiceModal from './AddControllerServiceModal';
// import AddProperties from './AddProperties';
// import ConfigControllerService from './ConfigControllerService';
// import ConfigurePropertyModal from './ConfigurePropertyModal';
// import PropertyDropdownModal from './ProprtyDropdownModel';
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
`;

export const ListControllerService = () => {
  const [search, setSearch] = useState('');
  const [updatedData, setUpdatedData] = useState([]);
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      module.name.toLowerCase().includes(search.toLowerCase()) ||
      module.type.toLowerCase().includes(search.toLowerCase())
  );
  const isListProprtyModel = useSelector(
    NamespacesSelectors.getControllerServicePropertyModel
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
      renderCell: item => item?.type,
      width: '20%',
    },
    {
      label: 'Bundle',
      renderCell: item => item?.bundle?.group,
      width: '18%',
    },
    {
      label: 'State',
      renderCell: item => item?.state,
      width: '16%',
    },
    {
      label: 'Scope',
      renderCell: item => item?.scope,
      width: '15%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <>
          {controllerPermissions.includes('edit_controller_services') && (
            <button
              className="border-0 bg-white"
              onClick={() => handleSettingClick(item)}
            >
              <SettingSmallIcon />
            </button>
          )}
          {item?.state != 'INVALID' &&
            controllerPermissions.includes('edit_controller_services') && (
              <button
                className="border-0 bg-white ms-1"
                onClick={() => handleEnableClick(item)}
              >
                {item?.state !== 'DISABLED' ? <FlashCutIcon /> : <FlashIcon />}
              </button>
            )}
          {item?.state != 'ENABLED' &&
            controllerPermissions.includes('delete_controller_services') && (
              <button
                className="border-0 bg-white ms-1"
                onClick={() => handleDeleteClick(item)}
              >
                <DeleteSmallIcon color="black" height="28" />
              </button>
            )}
        </>
      ),
      width: '10%',
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList());
  }, [dispatch, modalOpenState]);
  useEffect(() => {
    if (isEmpty(filteredModulesData)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [filteredModulesData]);

  const handleSettingClick = item => {
    setSelectedItemFromList(item);
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(true));
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    dispatch(NamespacesActions.setIsControllerServicePropertyModel(false));
  };

  const handleAddValueModal = item => {
    setIsAddpropertiesModalOpen(true);
    setSelectedPropertyToEdit(item);
  };
  return (
    <>
      {loading || !filteredModulesData || filteredModulesData.length === 0 ? (
        <Loader loading={loading} />
      ) : (
        <>
          {controllerPermissions.includes('add_controller_services') && (
            <div className="row mb-2 d-flex justify-content-end">
              <div className="col-1">
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
            loading={loading}
          />
        </>
      )}

      <ConfigControllerService
        isOpen={isListProprtyModel}
        onClose={handleCloseModal}
        selectedItemFromList={selectedItemFromList}
        handleAddValueModal={handleAddValueModal}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setSelectedPropertyToEdit={setSelectedPropertyToEdit}
        updatedData={updatedData}
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
        onRequestClose={() => setIsDeleteModalOpen(true)}
        primaryText={`Are you sure you want to delete ${selectedItemFromList?.name}?`}
        onSubmit={handleDeleteControllerServiceClick}
      />
    </>
  );
};

export default ListControllerService;
