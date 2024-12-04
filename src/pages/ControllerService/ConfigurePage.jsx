import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { PlusCircleIcon } from '../../assets';
import { Table } from '../../components';
import { Button, CheckboxField, Modal } from '../../shared'; // Import Button correctly
import { NamespacesActions } from '../../store';
import NewAddControllerService from './NewAddControllerService';

const NewClassAddes = styled.div`
  &.mt-n3 {
    margin-top: -1.3rem;
  }
`;

const controllerServicesData = [
  {
    id: 1,
    name: 'Data Enrichment Service',
    typeValue: 'Data Processor',
    bundleValue: 'Standard Utilities 1.0',
    state: 'Active',
    scope: 'Global',
  },
  {
    id: 2,
    name: 'Notification Service',
    typeValue: 'Event Listener',
    bundleValue: 'Event Handlers 2.3',
    state: 'Inactive',
    scope: 'Local',
  },
  {
    id: 3,
    name: 'Logging Service',
    typeValue: 'Logger',
    bundleValue: 'Debug Toolkit 1.2',
    state: 'Active',
    scope: 'Cluster',
  },
  {
    id: 4,
    name: 'Cache Manager Service',
    typeValue: 'Resource Manager',
    bundleValue: 'Resource Tools 3.1',
    state: 'Paused',
    scope: 'Global',
  },
];

const ConfigurePage = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [selectedItemId, setSelectedItemId] = useState(null);

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckboxField
            name={`check-${item.id}`}
            label=""
            checked={selectedItemId === item.id}
            onChange={() => handleCheckboxChange(item.id)}
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

  const handleCheckboxChange = id => {
    setSelectedItemId(prev => (prev === id ? null : id));
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
        <Table
          data={controllerServicesData}
          columns={COLUMNS}
          className="variables-table"
        />
      </div>
    </Modal>
  );
};

ConfigurePage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConfigurePage;
