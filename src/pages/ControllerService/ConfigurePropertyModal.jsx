/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { CheckboxField, InputField, Modal, SelectField } from '../../shared';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { Button } from '../../shared';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { theme } from '../../styles';
import { toast } from 'react-toastify';
import { KDFM } from '../../constants';
import { isEmpty } from 'lodash';
import { FullPageLoader } from '../../components';

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
const DropdownHolder = styled.div`
  height: 150px;
`;

const ConfigurePropertyModal = ({
  setListPropertTableData,
  setUpdatedData,
  updatedData,
  selectedItemFromList = {},
  selectedPropertyToEdit = {},
  controllerServiceId,
  listPropertyTableData,
}) => {
  const dispatch = useDispatch();
  const [addNewProperty, setAddNewProperty] = useState(false);
  const [addNewServiceDropdownDisplay, setAddNewServiceDropdownDisplay] =
    useState(false);
  const [
    optionsArrayForFirstRootDropDown,
    setoptionsArrayForFirstRootDropDown,
  ] = useState([]);
  const isModalOpen = useSelector(
    NamespacesSelectors.getIsConfigurePropertyControllerServiceModalOpen
  );
  const propertyResponse = useSelector(
    NamespacesSelectors.getAddPropertyCSResponse
  );
  const newPropertyToAdd = useSelector(
    NamespacesSelectors.getNewProprtyToAddControllerService
  );
  const newResponseAddedProperty = useSelector(
    NamespacesSelectors.getResponseNewAddedProperty
  );
  const loadingDropdownCheckAPI = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchAddPropertyToAdd')
  );
  const loadingAddNewServiceGetAPI = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getNewPropertyControllerService')
  );
  useEffect(() => {
    if (
      !isEmpty(
        propertyResponse?.propertyDescriptor?.identifiesControllerServiceBundle
      )
    ) {
      const payload = {
        type: propertyResponse?.propertyDescriptor?.identifiesControllerService,
        identifiesControllerServiceBundle:
          propertyResponse?.propertyDescriptor
            ?.identifiesControllerServiceBundle,
      };
      dispatch(NamespacesActions.getNewPropertyControllerService(payload));
    }
  }, [propertyResponse]);

  useEffect(() => {
    const responseOptions1 =
      propertyResponse?.propertyDescriptor?.allowableValues &&
      propertyResponse?.propertyDescriptor?.allowableValues.length > 0 &&
      propertyResponse?.propertyDescriptor?.allowableValues?.map(ele => ({
        label: ele?.allowableValue?.displayName,
        value: ele?.allowableValue?.value,
      }));
    if (!isEmpty(responseOptions1)) {
      setoptionsArrayForFirstRootDropDown(responseOptions1);
    }
  }, [propertyResponse?.propertyDescriptor?.allowableValues]);

  const optionsToNewPropertyAdd =
    newPropertyToAdd &&
    newPropertyToAdd.length > 0 &&
    newPropertyToAdd?.map(element => ({
      value: element?.name,
      label: element?.name,
    }));

  const nameSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });
  const optionSchema = yup.object().shape({
    dropdownOne: yup.string().required('Select value'),
  });
  const stringSchema = yup.object().shape({
    valueString: yup.string().required('Value is required'),
  });

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(nameSchema),
    resolver: yupResolver(
      !addNewProperty
        ? nameSchema
        : propertyResponse &&
            propertyResponse?.propertyDescriptor?.hasOwnProperty(
              'identifiesControllerService'
            )
          ? optionSchema
          : stringSchema
    ),
  });

  const nameState = watch('name');
  const sensitiveState = watch('sensitive');
  const valueString = watch('valueString');
  const dropDownOne = watch('dropdownOne');
  const dropDownTwoAddNewProperty = watch('dropdownTwoToAddNewProperty');
  const handleFormSubmit = data => {
    const payload = {
      id: selectedItemFromList?.id || controllerServiceId,
      name: data?.name,
      sensitiveState: data?.sensitive,
    };
    setAddNewProperty(true);
    dispatch(NamespacesActions.fetchAddPropertyToAdd(payload)); // API to check
  };
  const handleCloseAction = () => {
    dispatch(
      NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen(false)
    );
    setAddNewProperty(false);
  };
  const handleFinalSubmit = data => {
    const filterData = updatedData.filter(item => {
      return item.name != nameState;
    });
    const checkDuplicateProperty =
      listPropertyTableData.length > 0 &&
      !listPropertyTableData?.some(ele => ele.name == nameState);

    if (checkDuplicateProperty) {
      if (
        propertyResponse &&
        propertyResponse?.propertyDescriptor?.hasOwnProperty(
          'identifiesControllerService'
        )
      ) {
        setUpdatedData(() => [
          ...filterData,
          {
            name: nameState,
            value: dropDownOne,
            sensitive: sensitiveState,
          },
        ]);
        const selectedName = optionsArrayForFirstRootDropDown.find(
          element => element.value === dropDownOne
        )?.label;
        setListPropertTableData(prevArray => [
          ...prevArray,
          {
            name: nameState,
            displayName: nameState,
            sensitive: sensitiveState,
            empty_string_set: false,
            new_added: true,
            value: dropDownOne,
            isSelective: true,
            dropDownName: selectedName,
            allowableValues:
              propertyResponse?.propertyDescriptor?.allowableValues || [],
          },
        ]);
      } else {
        setUpdatedData(() => [
          ...filterData,
          {
            name: nameState,
            value: valueString,
            sensitive: sensitiveState,
          },
        ]);
        setListPropertTableData(prevArray => [
          ...prevArray,
          {
            name: nameState,
            displayName: nameState,
            sensitive: sensitiveState,
            empty_string_set: false,
            new_added: true,
            value: valueString,
          },
        ]);
      }

      toast.success(KDFM.PROPERTY_ADDED);
      setAddNewProperty(false);
      dispatch(
        NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen(
          false
        )
      );
    } else {
      handleCloseAction();
      toast.error('Property with this name already exists');
    }
  };
  const handleAddNewService = () => {
    setAddNewServiceDropdownDisplay(true);
    const selectedObject = newPropertyToAdd.find(
      element => element.name === dropDownTwoAddNewProperty
    );
    dropDownTwoAddNewProperty !== null &&
      dispatch(
        NamespacesActions.addControllerServicePropertyByDropdown(selectedObject)
      );
    setAddNewServiceDropdownDisplay(false);
  };
  const handleAddNewServiceOption = () => {
    setAddNewServiceDropdownDisplay(true);
  };
  const handleCancelToAddService = () => {
    setAddNewServiceDropdownDisplay(false);
  };

  useEffect(() => {
    if (!isEmpty(newResponseAddedProperty)) {
      const optionToAdd = {
        label: newResponseAddedProperty?.name,
        value: newResponseAddedProperty?.id,
      };
      setoptionsArrayForFirstRootDropDown(prevArray => [
        ...prevArray,
        optionToAdd,
      ]);
    }
  }, [newResponseAddedProperty]);

  useEffect(() => {
    if (!isModalOpen) {
      reset();
    }
  }, [isModalOpen]);

  return (
    <div>
      <FullPageLoader
        loading={loadingDropdownCheckAPI || loadingAddNewServiceGetAPI}
      />
      <Modal
        title={`Add Property`}
        isOpen={isModalOpen}
        onRequestClose={handleCloseAction}
        size="md"
        primaryButtonText="Save"
        onSubmit={handleSubmit(handleFinalSubmit)}
        footerAlign="start"
        primaryButtonDisabled={!(valueString || dropDownOne)}
      >
        <ModalBody className="modal-body">
          {addNewProperty ? (
            <>
              <></>
              <DropdownHolder>
                {propertyResponse &&
                  propertyResponse?.propertyDescriptor?.hasOwnProperty(
                    'identifiesControllerService'
                  ) && (
                    <>
                      {addNewServiceDropdownDisplay ? (
                        <>
                          <StyledSelectField
                            name="dropdownTwoToAddNewProperty"
                            size="sm"
                            options={optionsToNewPropertyAdd || []}
                            control={control}
                            placeholder="Select Value"
                            backgroundColor={theme.colors.lightGrey}
                            title="Select Status"
                            errors={errors}
                          />
                          <div className="row">
                            <div className="col-4 mt-3">
                              <Button
                                type="button"
                                size={'md'}
                                variant="tertiary"
                                onClick={handleAddNewService}
                              >
                                Add
                              </Button>
                            </div>
                            <div className="col-4 mt-3">
                              <Button
                                type="button"
                                size={'md'}
                                variant="tertiary"
                                onClick={handleCancelToAddService}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <StyledSelectField
                            name="dropdownOne"
                            size="sm"
                            options={optionsArrayForFirstRootDropDown || []}
                            control={control}
                            placeholder="Select Value"
                            backgroundColor={theme.colors.lightGrey}
                            title="Select Status"
                            errors={errors}
                          />
                          <div className="col-4 mt-3">
                            <Button
                              type="button"
                              size={'md'}
                              variant="tertiary"
                              onClick={handleAddNewServiceOption}
                            >
                              Add new service
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                <>
                  {!propertyResponse?.propertyDescriptor?.hasOwnProperty(
                    'identifiesControllerService'
                  ) && (
                    <>
                      <InputField
                        name="valueString"
                        type="text"
                        label="Value"
                        control={control}
                        errors={errors}
                        icon={<QRIcons />}
                        register={register}
                        placeholder="Enter value"
                      />
                      <CheckboxField
                        name="sensitive"
                        label={'Is Sensitive value'}
                        defaultChecked={false}
                        register={register}
                      />
                    </>
                  )}
                </>
              </DropdownHolder>
            </>
          ) : (
            <>
              <InputField
                name="name"
                type="text"
                label="Name"
                control={control}
                errors={errors}
                icon={<QRIcons />}
                register={register}
                placeholder="Enter Name"
              />

              <div className="col-4 mt-3">
                <Button
                  type="button"
                  size={'md'}
                  variant="tertiary"
                  onClick={handleSubmit(handleFormSubmit)}
                >
                  Add Value
                </Button>
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ConfigurePropertyModal;
