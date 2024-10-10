/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { Modal, SelectField } from '../../shared';
import { theme } from '../../styles';
import { useForm } from 'react-hook-form';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;
const StyledSelectField = styled(SelectField)`
  margin-bottom: 0.9rem;
`;

const PropertyDropdownModal = ({
  selectedPropertyToEdit,
  setListPropertTableData,
}) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    NamespacesSelectors.getAddPropertyDropdownModal
  );
  console.log(selectedPropertyToEdit.displayName, 'selectedPropertyToEdit');
  const optionArray = selectedPropertyToEdit?.allowableValues?.map(element => ({
    value: element?.allowableValue?.value,
    label: element?.allowableValue?.displayName,
  }));
  const handleClose = () => {
    dispatch(NamespacesActions.setIsAddPropertyDropdownModalOpen(false));
  };
  const { handleSubmit, control } = useForm({});
  const handleFormSubmit = data => {
    console.log(data, 'data');
    const selectedName = optionArray.find(
      element => element.value === data.value
    )?.label;
    setListPropertTableData(prevData =>
      prevData.map(item =>
        item.name === selectedPropertyToEdit.name
          ? { ...item, value: data?.value, dropDownName: selectedName }
          : item
      )
    );
    handleClose();
  };

  return (
    <div>
      <Modal
        title={`Edit  : ${selectedPropertyToEdit?.displayName}`}
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        size="md"
        primaryButtonText="Save"
        secondaryButtonText="Back"
        onSubmit={handleSubmit(handleFormSubmit)}
        footerAlign="start"
        contentStyles={{ maxWidth: '35%', maxHeight: '50%' }}
      >
        <ModalBody className="modal-body">
          <div style={{ height: '150px' }} className="mb-4">
            <StyledSelectField
              name="value"
              size="sm"
              options={optionArray}
              // errors={errors}
              control={control}
              placeholder="Select Value"
              backgroundColor={theme.colors.lightGrey}
              title="Select Status"
            />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PropertyDropdownModal;
