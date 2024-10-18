/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Table } from '../../components';
import { Button, InputField, Modal } from '../../shared';
// import { NamespacesSelectors } from '../../store';
import ValueRender from './ValueRender';
import { NamespacesActions } from '../../store';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { QRIcons } from '../../assets';
// import AddProperties from './AddProperties';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  & .variables-table {
    th {
      background-color: #dde4f0 !important;
    }
  }
`;

export const ConfigControllerService = ({
  isOpen,
  onClose,
  handleAddValueModal,
  selectedItemFromList,
  listPropertyTableData,
  setListPropertTableData,
  setSelectedPropertyToEdit,
  updatedData,
}) => {
  const dispatch = useDispatch();
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item?.displayName,
      // width: '40%',
    },
    {
      label: 'Value',
      renderCell: item => (
        <ValueRender
          item={item}
          handleAddValueModal={handleAddValueModal}
          setSelectedPropertyToEdit={setSelectedPropertyToEdit}
        />
      ),
      // width: '60%',
    },
  ];

  const { register, handleSubmit, reset } = useForm({});
  const handleFormSubmit = data => {
    const resultObject = updatedData.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    const sensitiveNames = updatedData
      .filter(item => item.sensitive === true)
      .map(item => item.name);

    const payload = {
      id: selectedItemFromList.id,
      version: selectedItemFromList?.version,
      properties: resultObject,
      sensitiveDynamicPropertyNames: sensitiveNames,
      currentState: selectedItemFromList?.state,
      name: data?.name,
    };
    dispatch(NamespacesActions.addPropertyControllerService(payload));
    onClose();
    setTimeout(() => {
      dispatch(NamespacesActions.getControllerServiceList());
    }, 500);
  };
  useEffect(() => {
    setListPropertTableData(selectedItemFromList?.properties);
  }, [selectedItemFromList?.properties]);
  useEffect(() => {
    reset({
      name: selectedItemFromList?.name || '',
    });
  }, [reset, isOpen]);
  return (
    <Modal
      title={` ${selectedItemFromList?.name} : Properties`}
      isOpen={isOpen}
      onRequestClose={onClose}
      size="md"
      primaryButtonText="Apply"
      onSubmit={handleSubmit(handleFormSubmit)}
      footerAlign="start"
      contentStyles={{ maxWidth: '60%', maxHeight: '70%' }}
      secondaryButtonText="Back"
    >
      <ModalBody className="modal-body">
        <div className=" row d-flex justify-content-between">
          <div className="col-8 ">
            <InputField
              name="name"
              type="text"
              label="Name"
              icon={<QRIcons />}
              register={register}
            />
          </div>

          <div className=" col-1 mt-4 pt-3">
            <Button
              type="button"
              onClick={() =>
                dispatch(
                  NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen(
                    true
                  )
                )
              }
            >
              +
            </Button>
          </div>
        </div>
        <Table
          data={listPropertyTableData || []}
          columns={COLUMNS}
          className="variables-table"
        />
      </ModalBody>
    </Modal>
  );
};

export default ConfigControllerService;
