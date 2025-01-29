/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import { CheckboxField, InputField, Modal, SelectField } from '../../shared';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { Button } from '../../shared';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { theme } from '../../styles';
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
const DropdownHolder = styled.div`
  height: 150px;
`;

const ConfigurePropertyModal = ({
  setListPropertTableData,
  setUpdatedData,
  updatedData,
  selectedItemFromList = {},
}) => {
  console.log(updatedData, 'updatedData');
  const dispatch = useDispatch();
  const [addNewProperty, setAddNewProperty] = useState(false);
  const isModalOpen = useSelector(
    NamespacesSelectors.getIsConfigurePropertyControllerServiceModalOpen
  );
  const propertyResponse = useSelector(
    NamespacesSelectors.getAddPropertyCSResponse
  );
  const responseOptions1 =
    propertyResponse?.propertyDescriptor?.allowableValues &&
    propertyResponse?.propertyDescriptor?.allowableValues.length > 0 &&
    propertyResponse?.propertyDescriptor?.allowableValues?.map(ele => ({
      label: ele?.allowableValue?.displayName,
      value: ele?.allowableValue?.value,
    }));

  const nameSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
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
    // defaultValues: DEFAULT_VALUES,
    // resolver: yupResolver(!addNewProperty ? nameSchema : null),
  });

  const nameState = watch('name');
  const sensitiveState = watch('sensitive');
  const valueString = watch('valueString');

  const handleFormSubmit = data => {
    console.log(data?.name);
    const payload = {
      id: selectedItemFromList?.id,
      name: data?.name,
      sensitiveState: data?.sensitive,
    };
    setAddNewProperty(true);
    dispatch(NamespacesActions.fetchAddPropertyToAdd(payload));
  };
  const handleCloseAction = () => {
    dispatch(
      NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen(false)
    );
    setAddNewProperty(false);
  };
  const handleFinalSubmit = () => {
    const filterData = updatedData.filter(item => {
      return item.name != nameState;
    });
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
        // ...data,
        displayName: nameState,
        sensitive: sensitiveState,
        empty_string_set: false,
        new_added: true,
      },
    ]);
    toast.success(KDFM.PROPERTY_ADDED);
    setAddNewProperty(false);
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
        onSubmit={handleSubmit(handleFinalSubmit)}
        footerAlign="start"
      >
        <ModalBody className="modal-body">
          {addNewProperty ? (
            <>
              <></>
              <DropdownHolder>
                {propertyResponse &&
                propertyResponse?.propertyDescriptor?.hasOwnProperty(
                  'identifiesControllerService'
                ) ? (
                  <>
                    <StyledSelectField
                      name="value"
                      size="sm"
                      options={responseOptions1 || []}
                      control={control}
                      placeholder="Select Value"
                      backgroundColor={theme.colors.lightGrey}
                      title="Select Status"
                    />
                    <div className="col-4 mt-3">
                      <Button
                        type="button"
                        size={'md'}
                        variant="tertiary"
                        onClick={handleSubmit(handleFormSubmit)}
                      >
                        Add new service
                      </Button>
                    </div>
                  </>
                ) : (
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
                )}
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
              <CheckboxField
                name="sensitive"
                label={'Is Sensitive value'}
                defaultChecked={false}
                register={register}
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

// /* eslint-disable react/prop-types */
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import styled from 'styled-components';
// import { NamespacesActions, NamespacesSelectors } from '../../store';
// import { Button, Modal, SelectField } from '../../shared';
// import { theme } from '../../styles';
// import { useForm } from 'react-hook-form';
// import { isEmpty } from 'lodash';
// import { toast } from 'react-toastify';
// import { KDFM } from '../../constants';

// const ModalBody = styled.div`
//   position: relative;
//   flex: 1 1 auto;
//   & .variables-table {
//     th {
//       background-color: #dde4f0 !important;
//     }
//   }
// `;
// const StyledSelectField = styled(SelectField)`
//   margin-bottom: 0.9rem;
// `;

// const PropertyDropdownModal = ({
//   selectedPropertyToEdit,
//   setListPropertTableData,
//   setUpdatedData,
//   updatedData,
//   isFromControllerServiceTab,
// }) => {
//   const dispatch = useDispatch();
//   const [addNewProperty, setAddNewProperty] = useState(false);
//   const [proprtyOptionsArray, setPropertyOptionsArray] = useState([]);
//   const filterData = updatedData.filter(item => {
//     return item.name != selectedPropertyToEdit.name;
//   });
//   useEffect(() => {
//     if (selectedPropertyToEdit?.allowableValues) {
//       const optionArrayToUpdate = selectedPropertyToEdit?.allowableValues?.map(
//         element => ({
//           value: element?.allowableValue?.value,
//           label: element?.allowableValue?.displayName,
//         })
//       );
//       setPropertyOptionsArray(optionArrayToUpdate);
//     }
//   }, [selectedPropertyToEdit]);
//   const isModalOpen = useSelector(
//     NamespacesSelectors.getAddPropertyDropdownModal
//   );
//   const newPropertyToAdd = useSelector(
//     NamespacesSelectors.getNewProprtyToAddControllerService
//   );
//   const newResponseAddedProperty = useSelector(
//     NamespacesSelectors.getResponseNewAddedProperty
//   );
//   const optionsToNewPropertyAdd = newPropertyToAdd?.map(element => ({
//     value: element?.name,
//     label: element?.name,
//   }));

//   const handleClose = () => {
//     dispatch(NamespacesActions.setIsAddPropertyDropdownModalOpen(false));
//   };
//   const { handleSubmit, control, watch, reset } = useForm({});
//   const selectedNewValue = watch('newService');
//   const selectedProperty = watch('value');
//   const handleFormSubmit = data => {
//     setUpdatedData(() => [
//       ...filterData,
//       {
//         name: selectedPropertyToEdit.name,
//         value: data.value,
//         sensitive: false,
//       },
//     ]);

//     const selectedName = proprtyOptionsArray.find(
//       element => element.value === data.value
//     )?.label;
//     setListPropertTableData(prevData =>
//       prevData.map(item =>
//         item.name === selectedPropertyToEdit.name
//           ? {
//               ...item,
//               value: data?.value,
//               dropDownName: selectedName,
//               empty_string_set: false,
//             }
//           : item
//       )
//     );
//     toast.success(KDFM.PROPERTY_EDITED);
//     handleClose();
//   };

//   const handleNewService = () => {
//     const selectedObject = newPropertyToAdd.find(
//       element => element.name === selectedNewValue
//     );
//     optionsToNewPropertyAdd?.length &&
//       dispatch(
//         NamespacesActions.addControllerServicePropertyByDropdown(selectedObject)
//       );
//     setAddNewProperty(false);
//   };
//   useEffect(() => {
//     if (selectedPropertyToEdit?.add && isModalOpen) {
//       if (isFromControllerServiceTab) {
//         dispatch(
//           NamespacesActions.getNewPropertyControllerServiceUpdated(
//             selectedPropertyToEdit
//           )
//         );
//       } else {
//         dispatch(
//           NamespacesActions.getNewPropertyControllerService(
//             selectedPropertyToEdit
//           )
//         );
//       }
//       setAddNewProperty(false);
//     }
//   }, [selectedPropertyToEdit?.add, isModalOpen]);

//   useEffect(() => {
//     if (!isEmpty(newResponseAddedProperty)) {
//       setPropertyOptionsArray(prevArray => [
//         ...prevArray,
//         newResponseAddedProperty,
//       ]);
//     }
//   }, [newResponseAddedProperty]);
//   useEffect(() => {
//     if (!isModalOpen) {
//       reset();
//     }
//   }, [isModalOpen]);
//   return (
//     <div>
//       <Modal
//         title={
//           addNewProperty
//             ? 'Create New Service'
//             : `Edit  : ${selectedPropertyToEdit?.displayName}`
//         }
//         isOpen={isModalOpen}
//         onRequestClose={handleClose}
//         size="md"
//         primaryButtonText="Save"
//         secondaryButtonText="Back"
//         onSubmit={handleSubmit(handleFormSubmit)}
//         footerAlign="start"
//         contentStyles={{ maxWidth: '35%', maxHeight: '50%' }}
//         primaryButtonDisabled={selectedProperty === null || addNewProperty}
//         noScroll={true}
//       >
//         <ModalBody className="modal-body">
//           <div style={{ height: '150px' }} className="mb-4">
//             {!addNewProperty && (
//               <>
//                 <StyledSelectField
//                   name="value"
//                   size="sm"
//                   options={proprtyOptionsArray}
//                   control={control}
//                   placeholder="Select Value"
//                   backgroundColor={theme.colors.lightGrey}
//                   title="Select Status"
//                 />
//                 <div className="col-4 mt-3">
//                   <Button
//                     type="button"
//                     size={'md'}
//                     variant="tertiary"
//                     onClick={() => setAddNewProperty(true)}
//                   >
//                     Create New Service
//                   </Button>
//                 </div>
//               </>
//             )}
//             {addNewProperty && (
//               <>
//                 <StyledSelectField
//                   name="newService"
//                   size="sm"
//                   options={optionsToNewPropertyAdd}
//                   control={control}
//                   placeholder="Select Value"
//                   backgroundColor={theme.colors.lightGrey}
//                   title="Select Status"
//                 />
//                 <div className="row">
//                   <div className="col-4 mt-3">
//                     <Button
//                       type="button"
//                       size={'md'}
//                       variant="tertiary"
//                       onClick={() => handleNewService()}
//                     >
//                       Add New Service
//                     </Button>
//                   </div>
//                   <div className="col-2 mt-3">
//                     <Button
//                       type="button"
//                       size={'md'}
//                       variant="secondary"
//                       onClick={() => setAddNewProperty(false)}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </ModalBody>
//       </Modal>
//     </div>
//   );
// };

// export default PropertyDropdownModal;
