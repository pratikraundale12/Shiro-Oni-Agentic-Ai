import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import AddVariables from './AddVariables';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;

const Listvariables = ({
  isOpen,
  closePopup,
  // handleTertiaryButton,
  setVariablesModalOpen,
}) => {
  const [variableContextItem, setVariableContextItem] = useState({});
  const [newlyAddVariables, setNewlyAddvariables] = useState([]);
  const variableList = useSelector(NamespacesSelectors.getVariableList);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isAddVariablesOpen, setIsAddVariablesOpen] = useState({
    isOpen: false,
    mode: 'add',
  });

  const COLUMNS = [
    {
      label: KDFM.NAME,
      renderCell: item => (
        <TextRender
          key={item?.variable?.name}
          text={item?.variable?.name}
          capitalizeText={false}
        />
      ),
    },
    {
      label: KDFM.VALUE,
      renderCell: item => {
        return (
          <TextRender
            key={item?.variable?.value}
            text={
              item?.variable?.check || item?.variable?.value === ''
                ? KDFM.EMPTY_STRING_SET
                : item?.variable?.value
                  ? item?.variable?.value
                  : KDFM.NO_VALUE_SET
            }
            capitalizeText={false}
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
  if (variableList && variableList.variables) {
    const variables = newlyAddVariables.map(item => {
      return {
        variable: {
          name: item.name,
          value: item.value,
          check: item?.check,
        },
      };
    });
    variablesData = [...variableList.variables, ...variables];
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
    dispatch(
      NamespacesActions.addVariableServices({
        variables: newlyAddVariables,
      })
    );

    setLoading(false);
    setNewlyAddvariables([]);
  };

  return (
    <>
      <Modal
        title={KDFM.VARIABLES}
        isOpen={isOpen.isOpen}
        onRequestClose={() => {
          setNewlyAddvariables([]);
          closePopup();
        }}
        isLoading={loading}
        size="md"
        onSecondarySubmit={openVariable}
        secondaryButtonText={KDFM.ADD_VARIABLES}
        primaryButtonText={KDFM.SAVE}
        onSubmit={handleSubmit}
        primaryButtonDisabled={loading || !newlyAddVariables?.length}
        footerAlign="start"
        secondaryButtonProps={{
          icon: <PlusCircleIcon />,
          iconPosition: 'left',
        }}
      >
        <ModalBody className="modal-body">
          <Table
            data={variablesData}
            columns={COLUMNS}
            className={'variables-table'}
          />
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
