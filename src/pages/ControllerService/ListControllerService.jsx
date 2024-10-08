import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingSmallIcon } from '../../assets';
import { Table } from '../../components';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import AddProperties from './AddProperties';
import ConfigControllerService from './ConfigControllerService';

export const ListControllerService = () => {
  const dispatch = useDispatch();
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddpropertiesModalOpen, setIsAddpropertiesModalOpen] =
    useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

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
      renderCell: () => 'hello',
      width: '15%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <button
          className="border-0 bg-white"
          onClick={() => handleSettingClick(item?.id)}
        >
          <SettingSmallIcon />
        </button>
      ),
      width: '10%',
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.getControllerServiceList());
  }, [dispatch]);

  const handleSettingClick = id => {
    setSelectedItemId(id); // Set the selected item ID
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    dispatch(NamespacesActions.setNewlyAddVariables([]));
    setIsModalOpen(false);
  };

  const handleAddPropertiesModal = () => {
    console.log(isAddpropertiesModalOpen, 'isAddpropertiesModalOpen');
    setIsAddpropertiesModalOpen(true);
    setIsModalOpen(false);
  };

  console.log(selectedItemId, 'selectedItemId');

  return (
    <>
      <Table data={listData || []} columns={COLUMNS} />
      <ConfigControllerService
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddPropertiesModal}
        selectedItemId={selectedItemId}
      />
      <AddProperties
        isOpen={isAddpropertiesModalOpen}
        onClose={() => {
          setIsAddpropertiesModalOpen(false);
          setIsModalOpen(true);
        }}
      />
    </>
  );
};

export default ListControllerService;
