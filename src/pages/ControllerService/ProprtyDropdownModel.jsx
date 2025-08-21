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
  padding: 10px 20px 20px 20px;
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
  setReferenceListPropertyTableData = () => {},
  isFromControllerServieTab = false,
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
  const isModalOpen = useSelector(
    NamespacesSelectors.getAddPropertyDropdownModal
  );

  useEffect(() => {
    const updatedOptions =
      selectedPropertyToEdit?.allowableValues?.map(element => ({
        value: element?.allowableValue?.value,
        label: element?.allowableValue?.displayName,
      })) ?? [];

    setPropertyOptionsArray([
      { value: '', label: 'No value set' },
      ...updatedOptions,
    ]);
  }, [selectedPropertyToEdit]);

  const newPropertyToAdd = useSelector(
    NamespacesSelectors.getNewProprtyToAddControllerService
  );

  const newResponseAddedProperty = useSelector(
    NamespacesSelectors.getResponseNewAddedProperty
  );

  const propertyOptionOnDeploy = useSelector(
    NamespacesSelectors.getPropertyOptionOnDeploy
  );

  const serviceDefinition = useSelector(
    NamespacesSelectors.getServiceDefinition
  );

  const extractedProperties = serviceDefinition?.properties?.filter(
    prop => prop?.name === selectedPropertyToEdit?.name
  );

  // change data here
  const optionsToNewPropertyAdd =
    extractedProperties?.[0]?.serviceImplementation?.map(element => ({
      value: element?.name,
      label: element?.name,
    }));
  const optionsToNewPropertyAddNewService = newPropertyToAdd?.map(element => ({
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
    const regex = /^[a-zA-Z\s'-]+$/;
    const isAlphabet = regex.test(data.value);
    const selectedName = proprtyOptionsArray.find(
      element => element.value === data.value
    )?.label;
    const selectedNameOnDeploy = propertyOptionsDeploy.find(
      element => element.id === data.value
    )?.label;
    const selectedId = proprtyOptionsArray.find(
      element => element.value === data.value
    )?.id;
    setUpdatedData(() => [
      ...filterData,
      {
        name: selectedPropertyToEdit.name,
        value: data.value === '' ? null : !isAlphabet ? data.value : selectedId,
        sensitive: false,
        dropDownName: selectedName ?? selectedNameOnDeploy,
      },
    ]);

    setListPropertTableData(prevData =>
      prevData.map(item =>
        item.name === selectedPropertyToEdit.name
          ? {
              ...item,
              value:
                data.value === ''
                  ? null
                  : !isAlphabet
                    ? data.value
                    : selectedId,
              dropDownName: selectedName ?? selectedNameOnDeploy,
              empty_string_set: false,
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
                value:
                  data.value === ''
                    ? null
                    : !isAlphabet
                      ? data.value
                      : selectedId,
                dropDownName: selectedName ?? selectedNameOnDeploy,
                empty_string_set: false,
              }
            : item
        )
      );
    }
    toast.success(KDFM.PROPERTY_EDITED);
    handleClose();
  };

  const handleNewService = () => {
    const selectedObject = extractedProperties?.[0]?.serviceImplementation.find(
      element => element.name === selectedNewValue
    );
    const selectedObjectNewService = newPropertyToAdd.find(
      element => element.name === selectedNewValue
    );

    const selectedPayload =
      serviceDefinition?.properties?.length === 0
        ? selectedObjectNewService
        : selectedObject;

    selectedNewValue !== null &&
      dispatch(
        NamespacesActions.addControllerServicePropertyByDropdown(
          selectedPayload
        )
      );
    setAddNewProperty(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      const payload = {
        selectedPropertyToEdit,
        isFromExternalService: isFromExternalService,
        type: selectedPropertyToEdit?.type,
        serviceImplementation:
          extractedProperties?.[0]?.serviceImplementation || [],
      };

      dispatch(
        NamespacesActions.getNewPropertyControllerServiceUpdated(payload)
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

  useEffect(() => {
    if (!addNewProperty) {
      reset({
        newService: null,
      });
    }
    if (addNewProperty) {
      reset({
        value: null,
      });
    }
  }, [addNewProperty]);

  const onRefParamsClick = () => {
    setIsRefParams(true);
  };

  const handlebackBtnClick = () => {
    if (isRefParams && !addNewProperty) {
      setIsRefParams(false);
    } else if (addNewProperty && !isRefParams) {
      setAddNewProperty(false);
    } else if (!addNewProperty && !isRefParams) {
      handleClose();
    }
  };

  const getRefParamDefaultValue = (data, selecetdData) => {
    return data?.some(item => item.value === selecetdData?.value)
      ? selecetdData?.value?.replace(/^#\{(.+)\}$/, '$1')
      : '';
  };

  console.log('propertyOptionsDeploy----', propertyOptionsDeploy);

  return (
    <div>
      <Modal
        title={
          addNewProperty
            ? 'Create New Service'
            : isRefParams
              ? 'Select Referencing Parameter'
              : `Edit  : ${selectedPropertyToEdit?.displayName}`
        }
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        size="md"
        primaryButtonText="Save"
        secondaryButtonText="Back"
        onSecondarySubmit={handlebackBtnClick}
        onSubmit={handleSubmit(handleFormSubmit)}
        footerAlign="start"
        contentStyles={{
          minWidth: selectedPropertyToEdit?.add ? '30%' : '15%',
          maxWidth: selectedPropertyToEdit?.add ? '34%' : '25%',
          maxHeight: '50%',
        }}
        primaryButtonDisabled={
          selectedProperty === null ||
          selectedProperty === selectedPropertyToEdit?.dropDownName ||
          selectedProperty?.value === selectedPropertyToEdit?.value ||
          selectedProperty === selectedPropertyToEdit?.value ||
          (selectedProperty === '' && selectedPropertyToEdit?.value === null) ||
          addNewProperty
        }
        noScroll={true}
        noPadding={true}
      >
        <ModalBody className="modal-body">
          {isRefParams && (
            <div className="d-flex align-items-center justify-content-start mt-2">
              <div
                className="py-2 d-flex align-items-center gap-2"
                style={{
                  backgroundColor: '#F5F7FA',
                  borderRadius: '10px',
                  fontSize: '16px',
                  border: `1px solid ${theme.colors.primary}`,
                  color: '#444445',
                  padding: '6px',
                  marginBottom: '20px',
                }}
              >
                <span style={{ color: 'red' }}>*</span>
                <span style={{ fontStyle: 'italic' }}>
                  Note: Configuring the reference parameters incorrectly will
                  fail the deployment.
                </span>
              </div>
            </div>
          )}
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
                    !isUpgrade ||
                    isFromExternalService ||
                    !selectedPropertyToEdit?.add
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
                  defaultValue={
                    selectedPropertyToEdit?.dropDownName ||
                    selectedPropertyToEdit?.value
                  }
                />
                <div className="d-flex gap-3">
                  {selectedPropertyToEdit?.add && (
                    <div className="col-4 mt-3">
                      <Button
                        type="button"
                        size={'md'}
                        variant="tertiary"
                        onClick={() => setAddNewProperty(true)}
                      >
                        Create New Service
                      </Button>
                    </div>
                  )}
                  <div className="col-4 mt-3" style={{ width: '188px' }}>
                    <Button
                      type="button"
                      size={'md'}
                      variant="tertiary"
                      onClick={() => onRefParamsClick()}
                    >
                      Referencing Parameter
                    </Button>
                  </div>
                </div>
              </>
            )}
            {addNewProperty && (
              <>
                <StyledSelectField
                  name="newService"
                  size="sm"
                  options={
                    isFromExternalService
                      ? optionsToNewPropertyAddNewService
                      : optionsToNewPropertyAdd
                  }
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
                      isBtnDisable={
                        selectedNewValue === null ||
                        selectedNewValue === undefined
                      }
                    >
                      Add New Service
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
                  defaultValue={getRefParamDefaultValue(
                    refParamsData,
                    selectedPropertyToEdit
                  )}
                />
              </>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PropertyDropdownModal;
