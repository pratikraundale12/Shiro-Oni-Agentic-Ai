import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../shared';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import styled from 'styled-components';
import { IconButton, Table, TextRender } from '../../components';
import { useGlobalContext } from '../../utils';
import AddVariables from './AddVariables';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const Listvariables = ({ isOpen, closePopup, setVariablesModalOpen }) => {
  const { state } = useGlobalContext();
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState(false);
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <TextRender text={item.variable.name} />,
    },
    {
      label: 'Value',
      renderCell: item => <TextRender text={item.variable.value} />,
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => {
              setIsAddVariablesOpen({ isOpen: true, mode: 'edit' });
              setVariablesModalOpen(false);
              handleEdit(item);
            }}
            style={{ cursor: 'pointer' }}
          >
            <PencilIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      ),
    },
  ];
  const handleEdit = item => {
    console.log('Edit item:', item);
  };

  const openVariable = () => {
    setIsAddVariablesOpen(true);
    setVariablesModalOpen(false);
  };

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen(false);
    setVariablesModalOpen(true);
  };

  return (
    <>
      <Modal
        title="Variables"
        isOpen={isOpen}
        onRequestClose={closePopup}
        size="md"
        onSecondarySubmit={openVariable}
        secondaryButtonText="Add Variables"
        primaryButtonText="Save"
        secondaryButtonProps={{ icons: <PlusCircleIcon /> }}
      >
        <ModalBody className="modal-body">
          <Table data={state?.variablesDetail?.variables} columns={COLUMNS} />
        </ModalBody>
      </Modal>
      {isAddVariablesOpen && (
        <AddVariables
          isOpen={isAddVariablesOpen}
          closePopup={closeAddVariablesModal}
          isAddVariablesOpen={isAddVariablesOpen}
        />
      )}
    </>
  );
};

Listvariables.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  setVariablesModalOpen: PropTypes.func.isRequired,
};

export default Listvariables;
