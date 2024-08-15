import { isEmpty, isString } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { QRIcons } from '../../assets';
import {
  CheckboxField,
  InputField,
  Modal,
  RadioSelectField,
} from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

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

const AddParameterContext = ({
  isAddParameterContextOpen,
  closePopup,
  setIsAddParameterContextOpen,
  setIsParameterContextOpen,
  parameterContextItem,
  newlyAddedPrameterContext,
  setNewlyAddedParameterContext,
}) => {
  const dispatch = useDispatch();
  const parameterDetails = useSelector(NamespacesSelectors.getParameterDetails);
  const deployOrUpgradeDetails = useSelector(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const parameterContextList =
    parameterDetails?.[deployOrUpgradeDetails?.parameterContextId] || [];
  const { register, handleSubmit, control, reset, setValue } = useForm({
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
        setValue(
          'check',
          !parameterContextItem?.sensitive && !parameterContextItem?.value
            ? true
            : false
        );
      }
    }
  }, [
    reset,
    isAddParameterContextOpen?.isOpen,
    isAddParameterContextOpen?.mode,
    parameterContextItem,
    setValue,
  ]);

  const handleAddEditParameterContext = async data => {
    if (!data) return;
    const nameExists = (contextList, name) =>
      contextList.some(
        parameter => parameter?.name?.toLowerCase() === name?.toLowerCase()
      );
    const parameterAlreadyExist = nameExists(parameterContextList, data?.name);
    const parameterAlreadyExistInNewlyAddedContext = nameExists(
      newlyAddedPrameterContext,
      data?.name
    );

    const isDuplicate =
      (parameterAlreadyExist || parameterAlreadyExistInNewlyAddedContext) &&
      isAddParameterContextOpen?.mode === 'add';

    if (isDuplicate) {
      toast.info('Parameter with same name already exists');
      return;
    }

    if (isAddParameterContextOpen?.mode === 'edit') {
      const updatedData = newlyAddedPrameterContext.map(item =>
        item?.name?.toLowerCase() === data?.name?.toLowerCase()
          ? { ...item, ...data }
          : item
      );
      const filteredParameterContextList = parameterContextList.filter(
        item => item?.name?.toLowerCase() !== data?.name?.toLowerCase()
      );
      const existingParameterContext = parameterContextList.find(
        item => item?.name?.toLowerCase() === data?.name?.toLowerCase()
      );

      if (
        existingParameterContext &&
        Object.values(existingParameterContext)?.length !== 0
      ) {
        dispatch(
          NamespacesActions.setParameterDetails({
            ...parameterDetails,
            [deployOrUpgradeDetails?.parameterContextId]:
              filteredParameterContextList,
          })
        );
        setNewlyAddedParameterContext([...updatedData, data]);
      } else {
        setNewlyAddedParameterContext([...updatedData]);
      }
    } else {
      setNewlyAddedParameterContext([...newlyAddedPrameterContext, data]);
    }
    setIsAddParameterContextOpen({ isOpen: false, mode: 'add' });
    setIsParameterContextOpen(true);
    reset(DEFAULT_VALUES);
  };

  const check = useWatch({
    control,
    name: 'check',
  });

  if (check) {
    setValue('value', '');
  }

  return (
    <Modal
      title={
        isAddParameterContextOpen?.mode === 'add'
          ? 'Add Parameter Context'
          : 'Edit Parameter Context'
      }
      isOpen={isAddParameterContextOpen?.isOpen}
      onRequestClose={closePopup}
      size="md"
      secondaryButtonText="Back"
      primaryButtonText="Save"
      onSubmit={handleSubmit(handleAddEditParameterContext)}
    >
      <ModalBody className="modal-body">
        <ModalBodyDiv className="d-flex">
          <RowModal>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="name"
                  type="text"
                  label="Name"
                  icon={<QRIcons />}
                  disabled={isAddParameterContextOpen?.mode === 'edit'}
                  register={register}
                />
              </InputBox>
            </ColumnSix>
            <ColumnSix className="col-6">
              <InputBox>
                <InputField
                  name="value"
                  type="text"
                  label="Value"
                  icon={<QRIcons />}
                  register={register}
                  placeholder={
                    check ? 'Empty String Set' : 'Sensitive value set'
                  }
                  disabled={check}
                />
              </InputBox>
            </ColumnSix>
            <ColumnOneTwo className="col-12 mb-4">
              <CheckboxField
                name="check"
                label="Set Empty String"
                register={register}
              />
              <RedioButtonDiv>
                <RadioSelectField
                  name="sensitive"
                  label="Sensitive value"
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
                  label="Description"
                  icon={<QRIcons />}
                  register={register}
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
};

export default AddParameterContext;
