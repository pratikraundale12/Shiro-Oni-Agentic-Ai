/* eslint-disable  */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Table } from '../../components';
import { Button, InputField, Modal } from '../../shared';
// import { NamespacesSelectors } from '../../store';
import ValueRender from './ValueRender';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { DeleteSmallIcon, QRIcons } from '../../assets';
import { isEmpty } from 'lodash';
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
  setUpdatedData,
  isFromControllerServiceTab,
  handlePropertyUpdate,
  isFromExternalService,
  versionList,
}) => {
  const dispatch = useDispatch();

  const propertyUpdateResponse = useSelector(
    NamespacesSelectors.getPropertyUpdateResponse
  );
  const handleDeleteClick = item => {
    const filterData = updatedData.filter(ele => {
      return ele.name != item.name;
    });

    const sortedList = listPropertyTableData.filter(
      element => element.displayName !== item.displayName
    );
    setListPropertTableData(sortedList);
    if (item?.dynamic) {
      setUpdatedData(() => [
        ...filterData,
        {
          name: item?.name,
          value: null,
          sensitive: item?.sensitive || false,
        },
      ]);
    } else {
      const sortedUpdatedList = updatedData.filter(
        element => element.name !== item.displayName
      );
      setUpdatedData(sortedUpdatedList);
    }
  };
  // useEffect(() => {
  //   if(!isEmpty(propertyUpdateResponse)){
  //     setVersion(propertyUpdateResponse?.version);
  //   }
  // },[propertyUpdateResponse]);

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => item?.displayName || item?.name,
      width: '40%',
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
      width: '50%',
    },
    {
      label: 'Action',
      renderCell: item =>
        (item?.new_added || item.dynamic) && (
          <div onClick={() => handleDeleteClick(item)}>
            {' '}
            <DeleteSmallIcon color="black" height="28" />
          </div>
        ),
      width: '10%',
    },
  ];

  const { register, handleSubmit, reset } = useForm({});

  const updateProperties = (targetObject, newProperties) => {
    const existingProperties = targetObject.properties || [];
    const updatedProperties = [...existingProperties];
    newProperties.forEach(newProp => {
      const existingPropIndex = updatedProperties.findIndex(
        prop => prop.name === newProp.name
      );

      if (existingPropIndex !== -1) {
        updatedProperties[existingPropIndex] = {
          ...updatedProperties[existingPropIndex],
          ...newProp,
        };
      } else {
        updatedProperties.push(newProp);
      }
    });
    return {
      ...targetObject,
      properties: updatedProperties,
    };
  };
  const handleFormSubmit = data => {
    const resultObject = updatedData.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});

    const sensitiveNames = updatedData
      .filter(item => item.sensitive === true)
      .map(item => item.name);

    const currentVersion = versionList?.find(
      version =>
        version?.uniqueId ===
        (selectedItemFromList?.id || selectedItemFromList?.updatedValue)
    );
    const payload = {
      id: selectedItemFromList.id || selectedItemFromList?.updatedValue,
      version: currentVersion?.version ? currentVersion?.version : selectedItemFromList?.version,
      properties: resultObject,
      sensitiveDynamicPropertyNames: sensitiveNames,
      currentState: selectedItemFromList?.state,
      name: data?.name,
    };
    const configPayload = updateProperties(selectedItemFromList, updatedData);
    if (isFromControllerServiceTab && !isFromExternalService) {
      handlePropertyUpdate(configPayload);
      onClose();
    } else {
      dispatch(NamespacesActions.addPropertyControllerService(payload));
      onClose();
      !isFromExternalService &&
        setTimeout(() => {
          dispatch(NamespacesActions.getControllerServiceList());
        }, 500);
    }
    setUpdatedData([]);
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
          <div className="col-11 ">
            <InputField
              name="name"
              type="text"
              label="Name"
              icon={<QRIcons />}
              register={register}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
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
