/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { CheckboxField, InputField, Modal } from '../../shared';
import { useForm, useWatch } from 'react-hook-form';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;

const AddProperties = ({
  isOpen,
  onClose,
  selectedPropertyToEdit,
  setListPropertTableData,
  setIsAddpropertiesModalOpen,
  setUpdatedData,
  updatedData,
}) => {
  const { register, handleSubmit, control, reset, setValue } = useForm({});
  const filterData = updatedData.filter(item => {
    return item.name != selectedPropertyToEdit.name;
  });
  const handleFormSubmit = data => {
    // setUpdatedData(prevState => {
    //   return [
    //     ...prevState,
    //     {
    //       name: selectedPropertyToEdit.name,
    //       value: data.value,
    //       sensitive: false,
    //     },
    //   ];
    // });
    setUpdatedData(() => {
      return [
        ...filterData,
        {
          name: selectedPropertyToEdit.name,
          value: data.value,
          sensitive: false,
        },
      ];
    });

    setListPropertTableData(prevData =>
      prevData.map(item =>
        item.name === selectedPropertyToEdit.name
          ? { ...item, value: data?.value }
          : item
      )
    );
    setIsAddpropertiesModalOpen(false);
  };
  const check = useWatch({
    control,
    name: 'check',
  });

  if (check) {
    setValue('value', '');
  }
  useEffect(() => {
    reset({ value: selectedPropertyToEdit?.value || '' });
  }, [reset, isOpen]);

  return (
    <div>
      <Modal
        title={`Edit  : ${selectedPropertyToEdit?.displayName}`}
        isOpen={isOpen}
        onRequestClose={onClose}
        size="md"
        primaryButtonText="Save"
        onSubmit={handleSubmit(handleFormSubmit)}
        footerAlign="start"
      >
        <ModalBody className="modal-body">
          <InputField
            name="value"
            type="text"
            label="Value"
            icon={<QRIcons />}
            register={register}
            disabled={check}
          />
          <CheckboxField
            name="check"
            label={'Set empty string'}
            defaultChecked={false}
            register={register}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AddProperties;
