/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { Button, Modal, SelectField } from '../../shared';
import { theme } from '../../styles';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { KDFM } from '../../constants';

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
  setUpdatedData,
  updatedData,
  isUpgrade,
  isFromExternalService,
  selectedItemFromList,
}) => {
  const dispatch = useDispatch();
  const [addNewProperty, setAddNewProperty] = useState(false);
  const [isRefParams, setIsRefParams] = useState(false);
  const [proprtyOptionsArray, setPropertyOptionsArray] = useState([
    {
      value: '',
      label: 'No value set',
    },
  ]);
  const [refParamsData, setRefParamsData] = useState();

  useEffect(() => {
    let options = [];
    if (selectedItemFromList?.parameters?.length) {
      let data = selectedItemFromList?.parameters?.map(parameter => ({
        value: `#{${parameter}}`,
        label: parameter,
      }));
      options = data;
    }
    setRefParamsData(options || []);
  }, [selectedItemFromList?.parameters]);

  const filterData = updatedData.filter(item => {
    return item.name != selectedPropertyToEdit.name;
  });
  useEffect(() => {
    const updatedOptions = selectedPropertyToEdit?.allowableValues?.map(
      element => ({
        value: element?.allowableValue?.value,
        label: element?.allowableValue?.displayName,
      })
    );

    selectedPropertyToEdit?.allowableValues?.length &&
      setPropertyOptionsArray([
        { value: '', label: 'No value set' },
        ...updatedOptions,
      ]);
  }, [selectedPropertyToEdit]);

  const isModalOpen = useSelector(
    NamespacesSelectors.getAddPropertyDropdownModal
  );
  const newPropertyToAdd = useSelector(
    NamespacesSelectors.getNewProprtyToAddControllerService
  );
  const newResponseAddedProperty = useSelector(
    NamespacesSelectors.getResponseNewAddedProperty
  );
  const propertyOptionOnDeploy = useSelector(
    NamespacesSelectors.getPropertyOptionOnDeploy
  );
  const optionsToNewPropertyAdd = newPropertyToAdd?.map(element => ({
    value: element?.name,
    label: element?.name,
  }));
  const [propertyOptionsDeploy, setPropertyOptionsDeploy] = useState([
    { value: '', label: 'No value set' },
  ]);

  useEffect(() => {
    const options = propertyOptionOnDeploy.map(element => ({
      value: element?.name,
      label: element?.name,
      id: element?.id,
    }));

    setPropertyOptionsDeploy(prevArray => {
      const mergedArray = [...prevArray, ...options];
      const uniqueArray = Array.from(
        new Map(mergedArray.map(item => [item.id, item])).values()
      );
      return uniqueArray;
    });
  }, [propertyOptionOnDeploy]);

  const handleClose = () => {
    dispatch(NamespacesActions.setIsAddPropertyDropdownModalOpen(false));
  };
  const { handleSubmit, control, watch, reset } = useForm({});
  const selectedNewValue = watch('newService');
  const selectedProperty = watch('value');
  const handleFormSubmit = data => {
    setUpdatedData(() => [
      ...filterData,
      {
        name: selectedPropertyToEdit.name,
        value: data.value === '' ? null : data.value,
        sensitive: false,
      },
    ]);

    const selectedName = proprtyOptionsArray.find(
      element => element.value === data.value
    )?.label;
    setListPropertTableData(prevData =>
      prevData.map(item =>
        item.name === selectedPropertyToEdit.name
          ? {
              ...item,
              value: data.value === '' ? null : data.value,
              dropDownName: selectedName,
              empty_string_set: false,
            }
          : item
      )
    );
    toast.success(KDFM.PROPERTY_EDITED);
    handleClose();
  };

  const handleNewService = () => {
    const selectedObject = newPropertyToAdd.find(
      element => element.name === selectedNewValue
    );
    selectedNewValue !== null &&
      dispatch(
        NamespacesActions.addControllerServicePropertyByDropdown(selectedObject)
      );
    setAddNewProperty(false);
  };
  useEffect(() => {
    if (isModalOpen) {
      dispatch(
        NamespacesActions.getNewPropertyControllerServiceUpdated(
          selectedPropertyToEdit
        )
      );
      {
        selectedPropertyToEdit?.add &&
          dispatch(
            NamespacesActions.getNewPropertyControllerService(
              selectedPropertyToEdit
            )
          );
      }
      setAddNewProperty(false);
      setIsRefParams(false);
    }
  }, [selectedPropertyToEdit?.add, isModalOpen]);

  useEffect(() => {
    if (!isEmpty(newResponseAddedProperty)) {
      setPropertyOptionsArray(prevArray => [
        ...prevArray,
        newResponseAddedProperty,
      ]);
      setPropertyOptionsDeploy(prevArray => [
        ...prevArray,
        newResponseAddedProperty,
      ]);
    }
  }, [newResponseAddedProperty]);
  useEffect(() => {
    if (!isModalOpen) {
      reset();
    }
  }, [isModalOpen]);

  const onRefParamsClick = () => {
    setIsRefParams(true);
  };

  return (
    <div>
      <Modal
        title={
          addNewProperty
            ? 'Create New Service'
            : `Edit  : ${selectedPropertyToEdit?.displayName}`
        }
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        size="md"
        primaryButtonText="Save"
        secondaryButtonText="Back"
        onSubmit={handleSubmit(handleFormSubmit)}
        footerAlign="start"
        contentStyles={{
          minWidth: selectedPropertyToEdit?.add ? '30%' : '15%',
          maxWidth: selectedPropertyToEdit?.add ? '30%' : '25%',
          maxHeight: '50%',
        }}
        primaryButtonDisabled={selectedProperty === null || addNewProperty}
        noScroll={true}
      >
        <ModalBody className="modal-body">
          <div
            style={{ height: selectedPropertyToEdit?.add ? '150px' : '70px' }}
            className="mb-4"
          >
            {!addNewProperty && !isRefParams && (
              <>
                <StyledSelectField
                  menuHeight={selectedPropertyToEdit?.add ? '150px' : '120px'}
                  name="value"
                  size="sm"
                  options={
                    !isUpgrade || isFromExternalService
                      ? proprtyOptionsArray
                      : propertyOptionsDeploy
                  }
                  control={control}
                  placeholder={
                    selectedPropertyToEdit?.add
                      ? 'Select Service'
                      : 'Select Value'
                  }
                  backgroundColor={theme.colors.lightGrey}
                  title={
                    selectedPropertyToEdit?.add
                      ? 'Select Service'
                      : 'Select Value'
                  }
                  defaultValue={selectedPropertyToEdit?.dropDownName}
                />
                {selectedPropertyToEdit?.add && (
                  <div className="col-4 mt-3">
                    <Button
                      isBtnDisable={!selectedPropertyToEdit?.add}
                      type="button"
                      size={'md'}
                      variant="tertiary"
                      onClick={() => setAddNewProperty(true)}
                    >
                      Create New Service
                    </Button>
                  </div>
                )}
              </>
            )}
            {addNewProperty && (
              <>
                <StyledSelectField
                  name="newService"
                  size="sm"
                  options={optionsToNewPropertyAdd}
                  control={control}
                  placeholder="Select Service"
                  backgroundColor={theme.colors.lightGrey}
                  title="Select Service"
                />
                <div className="row">
                  <div className="col-4 mt-3">
                    <Button
                      type="button"
                      size={'md'}
                      variant="tertiary"
                      onClick={() => handleNewService()}
                    >
                      Add New Service
                    </Button>
                  </div>
                  <div className="col-2 mt-3">
                    <Button
                      type="button"
                      size={'md'}
                      variant="secondary"
                      onClick={() => setAddNewProperty(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
            {isRefParams && (
              <>
                <StyledSelectField
                  name="value"
                  size="sm"
                  options={refParamsData}
                  control={control}
                  placeholder="Select Value"
                  backgroundColor={theme.colors.lightGrey}
                  title="Select Status"
                />
                <div className="row">
                  <div className="col-2 mt-3">
                    <Button
                      type="button"
                      size={'md'}
                      variant="secondary"
                      onClick={() => setIsRefParams(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PropertyDropdownModal;
