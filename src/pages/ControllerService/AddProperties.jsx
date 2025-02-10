/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { CheckboxField, InputField, Modal } from '../../shared';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { KDFM } from '../../constants';
import { isEmpty } from 'lodash';

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
  const { register, handleSubmit, control, reset, setValue, watch } = useForm();
  const filterData = updatedData.filter(item => {
    return item.name != selectedPropertyToEdit.name;
  });
  const handleFormSubmit = data => {
    console.log('selectedPropertyToEdit--', selectedPropertyToEdit);
    console.log('data--', data, check);
    setUpdatedData(() => {
      return [
        ...filterData,
        {
          name: selectedPropertyToEdit.name,
          value:
            isEmpty(data?.value) && !check
              ? selectedPropertyToEdit.value
              : data.value,
          sensitive: false,
        },
      ];
    });

    console.log('updatedData---', updatedData);

    setListPropertTableData(prevData =>
      prevData.map(item =>
        item.name === selectedPropertyToEdit.name
          ? {
              ...item,
              value:
                isEmpty(data?.value) && !check
                  ? selectedPropertyToEdit.value
                  : data.value,
              empty_string_set: data?.check,
            }
          : item
      )
    );
    !(isEmpty(data?.value) && !check) && toast.success(KDFM.PROPERTY_EDITED);
    setIsAddpropertiesModalOpen(false);
  };
  const check = useWatch({
    control,
    name: 'check',
  });

  useEffect(() => {
    if (check) {
      setValue('value', '');
    } else if (!check) {
      setValue('value', selectedPropertyToEdit?.value);
    }
  }, [check, setValue]);
  useEffect(() => {
    reset({
      value: selectedPropertyToEdit?.value,
      check: selectedPropertyToEdit?.empty_string_set || false,
    });
  }, [reset, isOpen]);

  const propertyValue = watch('value');
  // useEffect(() => {
  //   if (isEmpty(propertyValue) && !check) {
  //     setValue('value', null);
  //   }
  // }, [check, propertyValue]);

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
        primaryButtonDisabled={
          propertyValue === selectedPropertyToEdit?.value ?? false
        }
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
            defaultChecked={
              selectedPropertyToEdit?.check ||
              selectedPropertyToEdit?.value === ''
            }
            register={register}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AddProperties;
