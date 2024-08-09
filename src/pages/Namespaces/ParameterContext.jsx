import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { PencilIcon, PlusCircleIcon } from '../../assets';
import { IconButton, Table, TextRender } from '../../components';
import { Modal } from '../../shared';
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
  newlyAddedPrameterContext,
}) => {
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <TextRender text={item?.name || 'N/A'} />,
    },
    {
      label: 'Value',
      renderCell: item => (
        <TextRender
          text={
            item.sensitive
              ? 'Sensitive value set'
              : item.value
                ? item.value
                : 'Empty string set' || 'N/A'
          }
        />
      ),
    },
    {
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            onClick={() => {
              setIsAddParameterContextOpen({ isOpen: true, mode: 'edit' });
              setIsParameterContextOpen(false);
              setParameterContextItem(item);
            }}
            style={{ cursor: 'pointer' }}
          >
            <PencilIcon color="black" />
          </IconButton>
        </div>
      ),
    },
  ];

  const { state } = useGlobalContext();
  const parameterDetailsData = state.parameterDetails?.data || {};
  delete parameterDetailsData.version;
  const dummyData = [
    ...Object.values(parameterDetailsData).flat(),
    ...newlyAddedPrameterContext,
  ];

  const handleSaveParameterContext = async () => {
    if (!newlyAddedPrameterContext) return;
    console.log(newlyAddedPrameterContext);
  };

  return (
    <Modal
      title="Parameter Context"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      onSecondarySubmit={openAddParameterContext}
      secondaryButtonText="Add Parameter Context"
      primaryButtonText="Save"
      onSubmit={handleSaveParameterContext}
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
  newlyAddedPrameterContext: PropTypes.array,
};

export default ParameterContext;
