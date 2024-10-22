/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { CheckboxField, InputField, Modal } from '../../shared';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;

const ConfigurePropertyModal = ({
  setListPropertTableData,
  setUpdatedData,
  updatedData,
}) => {
  setUpdatedData;
  const dispatch = useDispatch();
  const isModalOpen = useSelector(
    NamespacesSelectors.getIsConfigurePropertyControllerServiceModalOpen
  );
  const { register, handleSubmit, reset } = useForm({});

  const handleFormSubmit = data => {
    const filterData = updatedData.filter(item => {
      return item.name != data.name;
    });
    setUpdatedData(() => [
      ...filterData,
      {
        name: data.name,
        value: data.value,
        sensitive: data.sensitive,
      },
    ]);
    setListPropertTableData(prevArray => [
      ...prevArray,
      {
        ...data,
        displayName: data?.name,
        sensitive: data?.sensitive,
        empty_string_set: false,
        new_added: true,
      },
    ]);
    dispatch(
      NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen(false)
    );
  };

  const handleCloseAction = () => {
    dispatch(
      NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen(false)
    );
  };
  useEffect(() => {
    if (!isModalOpen) {
      reset();
    }
  }, [isModalOpen]);

  return (
    <div>
      <Modal
        title={`Add Property`}
        isOpen={isModalOpen}
        onRequestClose={handleCloseAction}
        size="md"
        primaryButtonText="Save"
        onSubmit={handleSubmit(handleFormSubmit)}
        footerAlign="start"
      >
        <ModalBody className="modal-body">
          <InputField
            name="name"
            type="text"
            label="Name"
            icon={<QRIcons />}
            register={register}
          />
          <InputField
            name="value"
            type="text"
            label="Value"
            icon={<QRIcons />}
            register={register}
          />
          <CheckboxField
            name="sensitive"
            label={'Is Sensitive value'}
            defaultChecked={false}
            register={register}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ConfigurePropertyModal;
