import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PlusCircleIcon } from '../../assets';
import { Table } from '../../components';
import { Button, CheckboxField, Modal } from '../../shared'; // Import Button correctly
import { NamespacesActions, NamespacesSelectors } from '../../store';
import NewAddControllerService from './NewAddControllerService';

const NewClassAddes = styled.div`
  &.mt-n3 {
    margin-top: -1.3rem;
  }
`;

const ConfigurePage = ({ isOpen, onClose, handleConfigureSubmit }) => {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null); // Updated state to hold full selected item
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckboxField
            name={`check-${item.id}`}
            label=""
            checked={selectedItem?.id === item.id}
            onChange={() => handleCheckboxChange(item)}
          />
          {item?.name}
        </div>
      ),
      width: '20%',
    },
    { label: 'Type', renderCell: item => item?.typeValue, width: '20%' },
    { label: 'Bundle', renderCell: item => item?.bundleValue, width: '20%' },
    { label: 'State', renderCell: item => item?.state, width: '20%' },
    { label: 'Scope', renderCell: item => item?.scope, width: '20%' },
  ];

  const handleCheckboxChange = item => {
    setSelectedItem(prev => (prev?.id === item.id ? null : item));
    console.log('sdasdd', selectedItem);
  };

  const handleSubmit = () => {
    handleConfigureSubmit(selectedItem);
    console.log('Selected Item Data:', selectedItem);
  };

  return (
    <Modal
      title="Configure Controller Service"
      isOpen={isOpen}
      onRequestClose={onClose}
      size="md"
      primaryButtonText="Submit"
      footerAlign="start"
      contentStyles={{ maxWidth: '60%', maxHeight: '70%' }}
      secondaryButtonText="Back"
      onSubmit={handleSubmit} // Trigger submit handler on click
    >
      <NewClassAddes className="d-flex justify-content-end w-100 mb-3 mt-n3">
        <Button
          icon={<PlusCircleIcon width={16} height={16} color="white" />}
          type="button"
          className="w-auto px-3"
          size="sm"
          onClick={() =>
            dispatch(NamespacesActions.setIsNewAddControllerServiceModal(true))
          }
        >
          Add
        </Button>
      </NewClassAddes>
      <div>
        <NewAddControllerService />
        <Table data={listData} columns={COLUMNS} className="variables-table" />
      </div>
    </Modal>
  );
};

ConfigurePage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleConfigureSubmit: PropTypes.func,
};

export default ConfigurePage;
