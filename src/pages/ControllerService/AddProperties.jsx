/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
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
  isFromControllerServieTab = false,
  setReferenceListPropertyTableData,
}) => {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm();
  const [sensitiveValueChanged, setSenstiveValueChanged] = useState(false);
  const filterData = updatedData.filter(item => {
    return item.name != selectedPropertyToEdit.name;
  });
  const handleFormSubmit = data => {
    if (
      !data?.check &&
      isEmpty(data?.value) &&
      selectedPropertyToEdit?.required
    ) {
      toast.error(`Can not set "No Value" to ${selectedPropertyToEdit?.name}`);
      !selectedPropertyToEdit?.sensitive &&
        setListPropertTableData(prevData =>
          prevData.map(item =>
            item.name === selectedPropertyToEdit.name
              ? {
                  ...item,
                  value:
                    selectedPropertyToEdit?.defaultValue ||
                    selectedPropertyToEdit?.value,
                }
              : item
          )
        );
      setIsAddpropertiesModalOpen(false);
      return;
    } else {
      setUpdatedData(() => {
        return [
          ...filterData,
          {
            name: selectedPropertyToEdit.name,
            value: isEmpty(data?.value) && !check ? null : data.value,
            sensitive: false,
          },
        ];
      });

      setListPropertTableData(prevData =>
        prevData.map(item =>
          item.name === selectedPropertyToEdit.name
            ? {
                ...item,
                value: isEmpty(data?.value) && !check ? null : data.value,
                empty_string_set: data?.check,
              }
            : item
        )
      );
      if (!isFromControllerServieTab) {
        setReferenceListPropertyTableData(prevData =>
          prevData.map(item =>
            item.name === selectedPropertyToEdit.name
              ? {
                  ...item,
                  value: isEmpty(data?.value) && !check ? null : data.value,
                  empty_string_set: data?.check,
                }
              : item
          )
        );
      }
      toast.success(KDFM.PROPERTY_EDITED);
    }
    setIsAddpropertiesModalOpen(false);
  };
  const check = useWatch({
    control,
    name: 'check',
  });
  useEffect(() => {
    if (check) {
      if (selectedPropertyToEdit?.sensitive) {
        setSenstiveValueChanged(true);
        setValue('value', '');
      } else {
        setValue('value', '');
      }
    } else if (!check) {
      setValue('value', selectedPropertyToEdit?.value);
      setSenstiveValueChanged(false);
    }
  }, [check, setValue, selectedPropertyToEdit]);
  useEffect(() => {
    setSenstiveValueChanged(false);
    reset({
      value: selectedPropertyToEdit?.value,
      check: selectedPropertyToEdit?.empty_string_set || false,
    });
  }, [reset, isOpen]);

  const propertyValue = watch('value');
  useEffect(() => {
    setValue(
      'check',
      selectedPropertyToEdit?.sensitive ? false : selectedPropertyToEdit?.check
    );
  }, [selectedPropertyToEdit, setValue]);

  const disableSaveButton = (value, check, selecetdData) => {
    if (sensitiveValueChanged) {
      return false;
    } else if (value === selecetdData?.value && selecetdData?.sensitive) {
      return true;
    } else if (
      value === selecetdData?.value &&
      !selecetdData?.sensitive &&
      check === selecetdData?.check
    ) {
      return true;
    } else return false;
  };

  const handleKeyDown = e => {
    if (e.key === 'Backspace' && selectedPropertyToEdit?.sensitive) {
      setSenstiveValueChanged(true);
    }
  };
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
        primaryButtonDisabled={disableSaveButton(
          propertyValue,
          check,
          selectedPropertyToEdit
        )}
      >
        <ModalBody className="modal-body">
          <InputField
            name="value"
            type="text"
            label="Value"
            icon={<QRIcons />}
            register={register}
            disabled={check}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedPropertyToEdit?.sensitive && !check
                ? 'Sensitive Value Set'
                : selectedPropertyToEdit?.value?.includes('*') && !check
                  ? 'Sensitive Value Set'
                  : ''
            }
          />
          <CheckboxField
            name="check"
            label={'Set empty string'}
            defaultChecked={
              !selectedPropertyToEdit?.sensitive &&
              (selectedPropertyToEdit?.check ||
                selectedPropertyToEdit?.value === '')
            }
            register={register}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AddProperties;
