import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../shared';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import styled from 'styled-components';
import { IconButton, Table, TextRender } from '../../components';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const Listvariables = ({ isOpen, closePopup }) => {
  const dummyData = [
    { id: 1, name: 'Variable 1', value: 'Value 1' },
    { id: 2, name: 'Variable 2', value: 'Value 2' },
    { id: 3, name: 'Variable 3', value: 'Value 3' },
  ];
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <TextRender text={item.name} />,
    },
    {
      label: 'Value',
      renderCell: item => <TextRender text={item.name} />,
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => handleEdit(item)}>
            <PencilIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      ),
    },
  ];
  const handleEdit = item => {
    console.log('Edit item:', item);
  };

  return (
    <Modal
      title="Variables"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      // onSecondarySubmit={openAddParameterContext}
      secondaryButtonText="Add Variables"
      primaryButtonText="Save"
      secondaryButtonProps={{ icons: <PlusCircleIcon /> }}
    >
      <ModalBody className="modal-body">
        <Table data={dummyData} columns={COLUMNS} />
      </ModalBody>
    </Modal>
  );
};

Listvariables.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default Listvariables;
