import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PlusCircleIcon } from '../../assets';
import { Table } from '../../components';
import { Button, CheckboxField, Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { KDFM } from '../../constants';

const NewClassAddes = styled.div`
  &.mt-n3 {
    margin-top: -1.3rem;
  }
`;

const ConfigurePage = ({
  isOpen,
  onClose,
  handleConfigureSubmit,
  loading,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
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
  };

  const handleSubmit = () => {
    handleConfigureSubmit(selectedItem);
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
      onSubmit={handleSubmit}
    >
      <NewClassAddes className="d-flex justify-content-end w-100 mb-3 mt-n3">
        <Button
          icon={<PlusCircleIcon width={16} height={16} color="white" />}
          type="button"
          className="w-auto px-3"
          size="sm"
          onClick={() => {
            dispatch(NamespacesActions.setIsAddControllerServiceModal(true));
            setIsModalOpen();
            // need to close modal
          }}
        >
          {KDFM.ADD}
        </Button>
      </NewClassAddes>
      <div>
        <Table
          data={listData}
          columns={COLUMNS}
          className="variables-table"
          loading={loading}
        />
      </div>
    </Modal>
  );
};

ConfigurePage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleConfigureSubmit: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func,
};

export default ConfigurePage;
