import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
// import { SchedularActions } from '../../store/schedular/redux';
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
  isVariablesModalOpen,
  setVariablesModalOpen,
}) => {
  const variableContextItem = useSelector(
    NamespacesSelectors.getVariableContextItem
  );
  const newlyAddVariables = useSelector(
    NamespacesSelectors.getNewlyAddVariables
  );

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
              if (isVariablesModalOpen?.schedule) {
                setVariablesModalOpen({
                  isOpen: true,
                  mode: 'add',
                  schedule: true,
                });
              } else {
                setVariablesModalOpen({
                  isOpen: true,
                  mode: 'add',
                  schedule: false,
                });
              }
              dispatch(NamespacesActions.setVariableContextItem(item));
            }}
          >
            <PencilIcon style={{ color: 'black' }} />
          </IconButton>
        </div>
      ),
    },
  ];

  let variablesData = [];
  if (
    (variableList && variableList.variables) ||
    isVariablesModalOpen.schedule
  ) {
    const variables = newlyAddVariables.map(item => {
      return {
        variable: {
          name: item.name,
          value: item.value,
          check: item?.check,
        },
      };
    });
    if (isVariablesModalOpen.schedule) {
      variablesData = [...variables];
    } else {
      variablesData = [...variableList.variables, ...variables];
    }
  }

  const openVariable = () => {
    setIsAddVariablesOpen({ isOpen: true, mode: 'add' });
    dispatch(NamespacesActions.setVariableContextItem({}));
    if (isVariablesModalOpen?.schedule) {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: true });
    } else {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: false });
    }
  };

  const closeAddVariablesModal = () => {
    setIsAddVariablesOpen({ isOpen: false, mode: 'add' });
    dispatch(NamespacesActions.setVariableContextItem({}));
    if (isVariablesModalOpen?.schedule) {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: true });
    } else {
      setVariablesModalOpen({ isOpen: true, mode: 'add', schedule: false });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    dispatch(
      NamespacesActions.addVariableServices({
        variables: newlyAddVariables,
      })
    );

    setLoading(false);

    dispatch(NamespacesActions.setNewlyAddVariables([]));
  };
  const scheduleSubmit = async () => {
    setVariablesModalOpen({ isOpen: false, mode: 'add', schedule: true });
    // dispatch(SchedularActions.setScheduleModal());
  };

  return (
    <>
      <Modal
        title={KDFM.VARIABLES}
        isOpen={isOpen.isOpen}
        onRequestClose={() => {
          dispatch(NamespacesActions.setNewlyAddVariables([]));
          closePopup();
        }}
        isLoading={loading}
        size="md"
        onSecondarySubmit={openVariable}
        // secondaryButtonText={KDFM.ADD_VARIABLES}
        primaryButtonText={isVariablesModalOpen.schedule ? 'Back' : KDFM.SAVE}
        onSubmit={isVariablesModalOpen.schedule ? scheduleSubmit : handleSubmit}
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
          isVariablesModalOpen={isVariablesModalOpen}
          variableContextItem={variableContextItem}
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
  isVariablesModalOpen: PropTypes.object,
  variables: PropTypes.array,
  handleTertiaryButton: PropTypes.func,
};

export default Listvariables;
