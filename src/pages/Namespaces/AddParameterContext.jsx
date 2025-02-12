import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty, isString, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import * as yup from 'yup';
import { QRIcons } from '../../assets';
import { KDFM } from '../../constants';
import {
  CheckboxField,
  InputField,
  Modal,
  RadioSelectField,
} from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';
import { SchedularSelectors } from '../../store/schedular/redux';

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
`;

const ModalBodyDiv = styled.div`
  align-items: center !important;
  justify-content: flex-start !important;
`;

const RowModal = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: calc(-0.5 * 1.5rem);
  margin-left: calc(-0.5 * 1.5rem);
`;

const InputBox = styled.div`
  margin-bottom: 24px;
`;

const ColumnSix = styled.div`
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  margin-top: 0;
  &.col-6 {
    flex: 0 0 auto;
    width: 50%;
  }
`;

const ColumnOneTwo = styled.div`
  max-width: 100%;
  padding-right: 1rem;
  padding-left: 1rem;
  margin-top: 0;
  &.col-12 {
    flex: 0 0 auto;
    width: 100%;
  }
`;

const RedioButtonDiv = styled.div`
  margin-top: 30px;
`;

const OPTIONS = [
  { id: 1, value: 'true', label: 'Yes' },
  { id: 2, value: 'false', label: 'No' },
];

const DEFAULT_VALUES = {
  name: '',
  value: '',
  description: '',
  sensitive: 'false',
};

const parameterContextSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  value: yup.string().nonNullable(),
  description: yup.string().nonNullable(),
  sensitive: yup.string().nullable(),
});

const AddParameterContext = ({
  isAddParameterContextOpen,
  closePopup,
  setIsAddParameterContextOpen,
  setIsParameterContextOpen,
  parameterContextItem,
  isParameterContextOpen,
}) => {
  const dispatch = useDispatch();
  const parameterDetails = useSelector(NamespacesSelectors.getParameterDetails);
  const isParentEdit = useSelector(NamespacesSelectors.getParameterEditParent);
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const newlyAddParameters = useSelector(
    NamespacesSelectors.getNewlyAddedParameterContext
  );
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const schedularFromList = useSelector(SchedularSelectors.getScheduleFromList);
  const schduleParameterData =
    checkDestCluster?.additionalData?.filteredParameterData;
  const parameterContextList = schedularFromList
    ? schduleParameterData
    : isParentEdit?.parent
      ? parameterDetails?.parameterContexts
      : parameterDetails?.parameterContexts || [];
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(parameterContextSchema),
    defaultValues: DEFAULT_VALUES,
  });
  useEffect(() => {
    if (isAddParameterContextOpen?.isOpen) {
      if (
        isEmpty(parameterContextItem) &&
        isAddParameterContextOpen?.mode === 'add'
      ) {
        reset(DEFAULT_VALUES);
        setValue('check', false);
      } else {
        reset({
          ...parameterContextItem,
          name: parameterContextItem?.name,
          value:
            parameterContextItem?.sensitive === 'true'
              ? ''
              : parameterContextItem?.value,
          sensitive: isString(parameterContextItem?.sensitive)
            ? parameterContextItem?.sensitive
            : parameterContextItem?.sensitive
              ? 'true'
              : 'false',
        });
        setValue('check', parameterContextItem?.value === '' ? true : false);
      }
    }
  }, [
    reset,
    isAddParameterContextOpen?.isOpen,
    isAddParameterContextOpen?.mode,
    parameterContextItem,
    setValue,
  ]);

  // Helper function to check if a name exists in a list
  const nameExists = (list, name) =>
    list?.some(item => item?.name?.toLowerCase() === name?.toLowerCase());

  // Process parameter data based on input
  const getProcessedData = data => ({
    ...data,
    value: data?.check ? '' : isEmpty(data?.value) ? null : data?.value,
  });

  // Handle parameter context update logic
  const handleParameterUpdate = (
    dispatch,
    updatedData,
    processData,
    contextList,
    parameterDetails,
    parentId
  ) => {
    const filteredList = contextList.filter(
      item => item?.name?.toLowerCase() !== processData?.name?.toLowerCase()
    );

    dispatch(
      NamespacesActions.setParameterDetails({
        ...parameterDetails,
        [parentId]: filteredList,
      })
    );

    const uniqueSortedData = uniqBy(updatedData, 'name');
    dispatch(
      NamespacesActions.setNewlyAddedParameterContext([
        ...uniqueSortedData,
        processData,
      ])
    );
  };

  // Main function
  const handleAddEditParameterContext = async data => {
    if (!data) return;

    const processData = getProcessedData(data);

    const parameterAlreadyExist =
      nameExists(parameterContextList, processData?.name) ||
      nameExists(newlyAddParameters, processData?.name);

    const isDuplicate =
      parameterAlreadyExist && isAddParameterContextOpen?.mode === 'add';
    if (isDuplicate) {
      toast.info(KDFM.PARAMETER_ALREADY_EXISTS);
      return;
    }

    if (isAddParameterContextOpen?.mode === 'edit') {
      const updatedData = newlyAddParameters.map(item =>
        item?.name?.toLowerCase() === processData?.name?.toLowerCase()
          ? { ...item, ...processData }
          : item
      );

      const existingContext = parameterContextList.find(
        item => item?.name?.toLowerCase() === processData?.name?.toLowerCase()
      );

      if (existingContext && Object.values(existingContext)?.length) {
        if (isParentEdit?.parent) {
          handleParameterUpdate(
            dispatch,
            updatedData,
            processData,
            parameterContextList,
            parameterDetails,
            isParentEdit?.id
          );
        } else {
          handleParameterUpdate(
            dispatch,
            updatedData,
            processData,
            parameterContextList,
            parameterDetails,
            deployOrUpgradeDetails?.parameterContextId
          );
        }
      } else {
        dispatch(
          NamespacesActions.setNewlyAddedParameterContext([...updatedData])
        );
      }
    } else {
      dispatch(
        NamespacesActions.setNewlyAddedParameterContext([
          ...newlyAddParameters,
          processData,
        ])
      );
    }

    setIsParameterContextOpen({
      isOpen: true,
      schedule: isParameterContextOpen?.schedule || false,
    });
    setIsAddParameterContextOpen({ isOpen: false, mode: 'add' });
    reset(DEFAULT_VALUES);
  };

  const check = useWatch({
    control,
    name: 'check',
  });

  useEffect(() => {
    if (check) {
      setValue('value', '');
    }
  }, [check, setValue]);

  const pcValue = watch('value');
  const pcDesc = watch('description');

  return (
    <Modal
      title={
        isAddParameterContextOpen?.mode === 'add'
          ? KDFM.ADD_PARAMETER_CONTEXT
          : KDFM.EDIT_PARAMETER_CONTEXT
      }
      isOpen={isAddParameterContextOpen?.isOpen}
      onRequestClose={closePopup}
      size="md"
      footerAlign="start"
      secondaryButtonText={KDFM.CANCEL}
      primaryButtonText={KDFM.SAVE}
      onSubmit={handleSubmit(handleAddEditParameterContext)}
      primaryButtonDisabled={
        pcValue === parameterContextItem?.value &&
        pcDesc === parameterContextItem?.description
      }
    >
      <ModalBody className="modal-body">
        <ModalBodyDiv className="d-flex">
          <RowModal>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="name"
                  type="text"
                  label={KDFM.NAME}
                  icon={<QRIcons />}
                  placeholder={KDFM.ENTER_PARAMETER}
                  disabled={isAddParameterContextOpen?.mode === 'edit'}
                  register={register}
                  errors={errors}
                />
              </InputBox>
            </ColumnSix>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="value"
                  type="text"
                  label={KDFM.VALUE}
                  icon={<QRIcons />}
                  register={register}
                  placeholder={
                    isAddParameterContextOpen?.mode === 'add'
                      ? KDFM.ENTER_PARAMETER
                      : ''
                  }
                  disabled={check}
                  errors={errors}
                />
              </InputBox>
            </ColumnSix>
            <ColumnOneTwo className="col-12 mb-4">
              <CheckboxField
                name="check"
                label={KDFM.SET_EMPTY_STRING}
                defaultChecked={parameterContextItem?.check || false}
                register={register}
              />
              <RedioButtonDiv>
                <RadioSelectField
                  name="sensitive"
                  label={KDFM.SENSITIVE_VALUE}
                  options={OPTIONS}
                  disabled={isAddParameterContextOpen?.mode === 'edit'}
                  register={register}
                />
              </RedioButtonDiv>
            </ColumnOneTwo>
            <ColumnOneTwo className="col-12">
              <InputBox>
                <InputField
                  name="description"
                  type="text"
                  label={KDFM.DESCRIPTION}
                  icon={<QRIcons />}
                  register={register}
                  placeholder={KDFM.ENTER_DESCRIPTION}
                  errors={errors}
                />
              </InputBox>
            </ColumnOneTwo>
          </RowModal>
        </ModalBodyDiv>
      </ModalBody>
    </Modal>
  );
};

AddParameterContext.propTypes = {
  isAddParameterContextOpen: PropTypes.object.isRequired,
  closePopup: PropTypes.func.isRequired,
  setIsAddParameterContextOpen: PropTypes.func,
  setIsParameterContextOpen: PropTypes.func,
  parameterContextItem: PropTypes.object,
  newlyAddedPrameterContext: PropTypes.array,
  setNewlyAddedParameterContext: PropTypes.func,
  isParameterContextOpen: PropTypes.object,
};

export default AddParameterContext;
