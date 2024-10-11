import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingSmallIcon, SmallSearchIcon } from '../../assets';
import { Table } from '../../components';
import { Button } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import AddControllerServiceModal from './AddControllerServiceModal';
import AddProperties from './AddProperties';
import ConfigControllerService from './ConfigControllerService';
import styled from 'styled-components';
import { theme } from '../../styles';
import PropertyDropdownModal from './ProprtyDropdownModel';

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
        <button
          className="border-0 bg-white"
          onClick={() => handleSettingClick(item)}
        >
          <SettingSmallIcon />
        </button>
      ),
      width: '10%',
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList());
  }, [dispatch, modalOpenState]);

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
      <div className="row mb-2 d-flex justify-content-end">
        <div className="col-1">
          <Button
            type="button"
            // data-dismiss="modal"
            size={'md'}
            onClick={() =>
              dispatch(NamespacesActions.setIsAddControllerServiceModal(true))
            }
          >
            Add
          </Button>
        </div>
      </div>
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

      <Table data={filteredModulesData || []} columns={COLUMNS} />
      <ConfigControllerService
        isOpen={isListProprtyModel}
        onClose={handleCloseModal}
        selectedItemFromList={selectedItemFromList}
        handleAddValueModal={handleAddValueModal}
        listPropertyTableData={listPropertyTableData}
        setListPropertTableData={setListPropertTableData}
        setSelectedPropertyToEdit={setSelectedPropertyToEdit}
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
      />
      <PropertyDropdownModal
        selectedPropertyToEdit={selectedPropertyToEdit}
        setListPropertTableData={setListPropertTableData}
      />
    </>
  );
};

export default ListControllerService;
