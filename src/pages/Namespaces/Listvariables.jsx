import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { Modal } from '../../shared';
// import { useGlobalContext } from '../../utils';
import { addVariableServices } from '../../store';
import { useGlobalContext } from '../../utils';
import AddVariables from './AddVariables';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const Listvariables = ({
  variables,
  setVariables,
  isOpen,
  closePopup,
  setVariablesModalOpen,
}) => {
  const { state } = useGlobalContext();
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState({
    isOpen: false,
    mode: 'add',
  });
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
    setIsAddVariablesOpen({ isOpen: true, mode: 'add' });
    setVariablesModalOpen(false);
  };

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    setVariablesModalOpen(true);
  };
  console.log({ state });

  const handleSubmit = async e => {
    e.preventDefault();
    const variables = [
      {
        name: 'vd',
        value: 'md',
      },
    ];

    const response = await addVariableServices(
      state?.selectedDestinationClusterId,
      state?.updatedCount?.id,
      state?.variablesDetail?.version,
      variables
    );

    if (response) {
      console.log('Variables successfully submitted:', response);
    } else {
      console.log(response.error);
    }
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
        onSubmit={handleSubmit}
        secondaryButtonProps={{ icons: <PlusCircleIcon /> }}
      >
        <ModalBody className="modal-body">
          <Table data={variables} columns={COLUMNS} />
        </ModalBody>
      </Modal>
      {isAddVariablesOpen && (
        <AddVariables
          isOpen={isAddVariablesOpen}
          closePopup={closeAddVariablesModal}
          isAddVariablesOpen={isAddVariablesOpen}
          setVariables={setVariables}
          variables={variables}
          setVariablesModalOpen={setVariablesModalOpen}
        />
      )}
    </>
  );
};

Listvariables.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  setVariablesModalOpen: PropTypes.func.isRequired,
  setVariables: PropTypes.func,
  variables: PropTypes.array,
};

export default Listvariables;
