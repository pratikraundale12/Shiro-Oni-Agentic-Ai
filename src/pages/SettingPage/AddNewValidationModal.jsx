import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { NewLinkIcon, NewMessageIcon } from '../../assets';
import {
  FLOWVALIDATION_CONSTANTS,
  SCOPE_TYPE_OPTIONS,
} from '../../constants/flowValidation.constant';
import { InputField, Modal, SelectField } from '../../shared';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 14px;
`;
const addNewValidationSchema = yup.object().shape({
  scope_type: yup.string().required('Scope Type is required'),
  display_value: yup.string().trim().required('Display Value is required'),
});

const AddNewValidationModal = () => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewValidationSchema),
  });
  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getAddNewValidationModalOpen
  );
  const selectedItem = useSelector(FlowValidationSelectors.getselectedItem);

  useEffect(() => {
    if (isFlowValidationModalOpen && !selectedItem) {
      reset({
        scope_type: '',
        display_value: '',
        description: '',
      });
    }
  }, [isFlowValidationModalOpen, selectedItem, reset]);

  useEffect(() => {
    if (selectedItem) {
      reset({
        scope_type: selectedItem.scope_type,
        display_value: selectedItem.header,
        description: selectedItem.description,
      });
    }
  }, [selectedItem, reset]);

  const isClosedNewAddValidationModal = () => {
    dispatch(SettingsActions.addNewValidationModalOpen(false));
    dispatch(FlowValidationActions.setSelectedItem(null));
  };

  const onSubmit = data => {
    const trimmedData = {
      ...data,
      display_value: data.display_value.trim(),
      description: data.description?.trim() || '',
    };

    if (selectedItem) {
      dispatch(
        FlowValidationActions.updateRuleScope({
          id: selectedItem?.id,
          header: trimmedData?.display_value,
          description: trimmedData?.description,
        })
      );
    } else {
      dispatch(
        FlowValidationActions.addRuleScope({
          scope_type: trimmedData?.scope_type,
          header: trimmedData?.display_value,
          description: trimmedData?.description,
        })
      );
    }
    isClosedNewAddValidationModal();
  };

  return (
    <div>
      <Modal
        title={
          selectedItem
            ? FLOWVALIDATION_CONSTANTS.EDIT_NEW_VALIDATION
            : FLOWVALIDATION_CONSTANTS.ADD_NEW_VALIDATION
        }
        isOpen={isFlowValidationModalOpen}
        onRequestClose={isClosedNewAddValidationModal}
        size="md"
        primaryButtonText={FLOWVALIDATION_CONSTANTS.SAVE}
        secondaryButtonText={FLOWVALIDATION_CONSTANTS.CANCEL}
        onSubmit={handleSubmit(onSubmit)}
        contentStyles={{ minWidth: '30%' }}
      >
        <div className="mb-4">
          <LabelSelect>{FLOWVALIDATION_CONSTANTS.SELECT_SCOPE}</LabelSelect>
          <SelectField
            name="scope_type"
            icon={<NewLinkIcon />}
            placeholder={FLOWVALIDATION_CONSTANTS.SELECT_SCOPE_TYPE}
            options={SCOPE_TYPE_OPTIONS}
            control={control}
            disabled={selectedItem}
            errors={errors}
          />
        </div>
        <InputField
          name="display_value"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.DISPLAY_VALUE}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_DISPLAY_VALUE}
          icon={<NewMessageIcon />}
          register={register}
          errors={errors}
          required
        />
        <InputField
          name="description"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.DESCRIPTION}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_DESCRIPTION}
          icon={<NewMessageIcon />}
          register={register}
        />
      </Modal>
    </div>
  );
};

export default AddNewValidationModal;
