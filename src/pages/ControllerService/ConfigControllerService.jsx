/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Table } from '../../components';
import { Modal } from '../../shared';
import { NamespacesSelectors } from '../../store';
// import AddProperties from './AddProperties';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;

export const ConfigControllerService = ({
  isOpen,
  onClose,
  onSubmit,
  selectedItemId,
}) => {
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item?.name,
    },
    {
      label: 'Value',
      renderCell: item => item?.value,
    },
  ];
  const listData = useSelector(
    NamespacesSelectors?.getRootControllerServiceNamespace
  );
  const selectedItem = listData.find(item => item.id === selectedItemId);
  console.log(selectedItem, 'selectedItem');
  const properties = selectedItem ? selectedItem.properties : {};
  console.log(properties, 'properties');
  console.log(listData, 'listData');
  return (
    <Modal
      title="Properties"
      isOpen={isOpen}
      onRequestClose={onClose}
      size="md"
      primaryButtonText="Add"
      onSubmit={onSubmit}
      footerAlign="start"
    >
      <ModalBody className="modal-body">
        <Table
          data={properties ? properties : []}
          columns={COLUMNS}
          className="variables-table"
        />
      </ModalBody>
    </Modal>
  );
};

export default ConfigControllerService;
