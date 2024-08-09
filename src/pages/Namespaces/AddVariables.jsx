import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { CheckboxField, InputField, Modal } from '../../shared';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const AddVariables = ({ closePopup, isAddVariablesOpen }) => {
  const handleSubmit = e => {
    e.preventDefault();
    console.log('e');
    // Handle form submission
  };

  return (
    <Modal
      title={
        isAddVariablesOpen?.mode === 'add' ? 'Add variables' : 'Edit Variables'
      }
      isOpen={isAddVariablesOpen?.isOpen}
      onRequestClose={closePopup}
      size="md"
      secondaryButtonText="Back"
      primaryButtonText="Save"
      onSubmit={handleSubmit}
    >
      <ModalBody className="modal-body">
        <InputField
          name="name"
          type="text"
          label="Name"
          icon={<QRIcons />}
          //   register={register}
        />
        <InputField name="value" type="text" label="Value" icon={<QRIcons />} />
        <CheckboxField name="check" label="Set Empty String" />
      </ModalBody>
    </Modal>
  );
};

AddVariables.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  isAddVariablesOpen: PropTypes.object.isRequired,
};

export default AddVariables;
