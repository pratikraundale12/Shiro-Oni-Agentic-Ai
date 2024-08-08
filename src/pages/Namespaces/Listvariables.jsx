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
        <IconButton>
          <PencilIcon color="black" />
        </IconButton>
      ),
    },
  ];
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
