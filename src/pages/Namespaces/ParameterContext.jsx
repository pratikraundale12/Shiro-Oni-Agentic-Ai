import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../shared';
import styled from 'styled-components';
import { Table } from '../../components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { useGlobalContext } from '../../utils';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const ParameterContext = ({
  isOpen,
  closePopup,
  openAddParameterContext,
  setIsAddParameterContextOpen,
  setIsParameterContextOpen,
  setParameterContextItem,
}) => {
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <div>{item.context_name}</div>,
    },
    {
      label: 'Value',
      renderCell: item => (
        <div>
          {item.sensitive
            ? 'Sensitive value set'
            : item.value
              ? item.value
              : 'Empty string set'}
        </div>
      ),
    },
    {
      renderCell: item => (
        <button
          onClick={() => {
            setIsAddParameterContextOpen(true);
            setIsParameterContextOpen(false);
            setParameterContextItem(item);
          }}
          style={{ cursor: 'pointer' }}
        >
          <PencilIcon color="black" />
        </button>
      ),
    },
  ];

  const { state } = useGlobalContext();
  const parameterDetailsData = state.parameterDetails?.data || {};
  delete parameterDetailsData.version;
  const dummyData = Object.values(parameterDetailsData).flat();

  return (
    <Modal
      title="Parameter Context"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      onSecondarySubmit={openAddParameterContext}
      secondaryButtonText="Add Parameter Context"
      primaryButtonText="Save"
      secondaryButtonProps={{ icons: <PlusCircleIcon /> }}
    >
      <ModalBody className="modal-body">
        <Table data={dummyData} columns={COLUMNS} />
      </ModalBody>
    </Modal>
  );
};

ParameterContext.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  openAddParameterContext: PropTypes.func,
  parameterDetails: PropTypes.string,
  parameterIds: PropTypes.array,
  setIsAddParameterContextOpen: PropTypes.func.isRequired,
  setIsParameterContextOpen: PropTypes.func.isRequired,
  setParameterContextItem: PropTypes.func,
};

export default ParameterContext;
