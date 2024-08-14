import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { Modal } from '../../shared';

import { toast } from 'react-toastify';
import {
  DeleteVariableServices,
  GetVariableServices,
  addVariableServices,
} from '../../store/apis';
import { useGlobalContext } from '../../utils';
import AddVariables from './AddVariables';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const Listvariables = ({
  isOpen,
  closePopup,
  handleTertiaryButton,
  setVariablesModalOpen,
}) => {
  const [variableContextItem, setVariableContextItem] = useState({});
  const [newlyAddVariables, setNewlyAddvariables] = useState([]);
  const [loading, setLoading] = useState(false);
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
      renderCell: item => {
        return (
          <TextRender
            text={
              item?.variable?.check || item?.variable?.value === ''
                ? 'Empty string set'
                : item?.variable?.value
                  ? item?.variable?.value
                  : 'No value set'
            }
          />
        );
      },
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            disabled={loading}
            onClick={() => {
              setIsAddVariablesOpen({ isOpen: true, mode: 'edit' });
              setVariablesModalOpen({ isOpen: false, mode: 'add' });
              setVariableContextItem(item);
            }}
          >
            <PencilIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  let variablesData = [];
  if (state?.variablesDetail?.variables) {
    const variables = newlyAddVariables.map(item => {
      return {
        variable: {
          name: item.name,
          value: item.value,
          check: item?.check,
        },
      };
    });

    variablesData = [...state.variablesDetail.variables, ...variables];
  }

  const openVariable = () => {
    setIsAddVariablesOpen({ isOpen: true, mode: 'add' });
    setVariableContextItem({});
    setVariablesModalOpen({ isOpen: false, mode: 'add' });
  };

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    setVariableContextItem({});
    setVariablesModalOpen({ isOpen: true, mode: 'add' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const variables = newlyAddVariables.map(item => ({
        name: item.name,
        value: item.value,
      }));

      const response = await addVariableServices(
        state?.selectedDestinationClusterId,
        state?.updatedCount?.id || state?.deployCountDetails?.data?.id,
        state?.variablesDetail?.version,
        variables
      );

      if (response) {
        const getVariablesResponse = await GetVariableServices(
          state?.selectedDestinationClusterId,
          state?.updatedCount?.id || state?.deployCountDetails?.data?.id,
          response?.data?.requestId
        );

        if (getVariablesResponse) {
          const DeleteVariablesResponse = await DeleteVariableServices(
            state?.selectedDestinationClusterId,
            state?.updatedCount?.id || state?.deployCountDetails?.data?.id,
            response?.data?.requestId
          );

          if (DeleteVariablesResponse) {
            handleTertiaryButton();
          } else {
            toast.error(response.error);
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setNewlyAddvariables([]);
    }
  };

  return (
    <>
      <Modal
        title="Variables"
        isOpen={isOpen.isOpen}
        onRequestClose={() => {
          setNewlyAddvariables([]);
          closePopup();
        }}
        isLoading={loading}
        size="md"
        onSecondarySubmit={openVariable}
        secondaryButtonText="Add Variables"
        primaryButtonText="Save"
        onSubmit={handleSubmit}
        primaryButtonDisabled={loading || !newlyAddVariables?.length}
        secondaryButtonProps={{ icons: <PlusCircleIcon /> }}
      >
        <ModalBody className="modal-body">
          <Table data={variablesData} columns={COLUMNS} />
        </ModalBody>
      </Modal>
      {isAddVariablesOpen && (
        <AddVariables
          variableContextItem={variableContextItem}
          setVariableContextItem={setVariableContextItem}
          newlyAddVariables={newlyAddVariables}
          setNewlyAddvariables={setNewlyAddvariables}
          isOpen={isAddVariablesOpen}
          closePopup={closeAddVariablesModal}
          isAddVariablesOpen={isAddVariablesOpen}
          setIsAddVariablesOpen={setIsAddVariablesOpen}
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
  handleTertiaryButton: PropTypes.func,
};

export default Listvariables;
