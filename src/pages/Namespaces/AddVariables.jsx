import PropTypes from 'prop-types';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { CheckboxField, InputField, Modal } from '../../shared';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const AddVariables = ({
  variables,
  setVariables,
  closePopup,
  isAddVariablesOpen,
  setVariablesModalOpen,
}) => {
  const { register, handleSubmit, reset, control, setValue } = useForm();
  console.log(variables);
  const onSubmit = data => {
    setVariables(prev => [
      ...prev,
      {
        variable: {
          name: data.name,
          value: data.value,
        },
      },
    ]);
    setVariablesModalOpen(true);
    reset();
  };
  const check = useWatch({
    control,
    name: 'check',
  });

  if (check) {
    setValue('value', '');
  }
  return (
    <Modal
      title={
        isAddVariablesOpen?.mode === 'add' ? 'Add variables' : 'Edit Variables'
      }
      isOpen={isAddVariablesOpen?.isOpen}
      onRequestClose={closePopup}
      size="md"
      secondaryButtonText="Back"
      primaryButtonText="Add"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ModalBody className="modal-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="name"
            type="text"
            label="Name"
            icon={<QRIcons />}
            disabled={isAddVariablesOpen?.mode === 'edit'}
            register={register}
          />
          <InputField
            name="value"
            type="text"
            label="Value"
            icon={<QRIcons />}
            placeholder={check ? 'Empty String Set' : ''}
            disabled={check}
            register={register}
          />
          <CheckboxField
            name="check"
            label="Set Empty String"
            register={register}
          />
          {/* Add a submit button here if not using Modal's submit functionality */}
        </form>
      </ModalBody>
    </Modal>
  );
};

AddVariables.propTypes = {
  closePopup: PropTypes.func.isRequired,
  isAddVariablesOpen: PropTypes.object.isRequired,
  variables: PropTypes.array,
  setVariables: PropTypes.func,
  setVariablesModalOpen: PropTypes.func.isRequired,
};

export default AddVariables;
