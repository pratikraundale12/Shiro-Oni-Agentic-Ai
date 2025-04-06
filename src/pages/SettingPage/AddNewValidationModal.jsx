import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
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

const AddNewValidationModal = () => {
  const dispatch = useDispatch();
  const { handleSubmit, register, control, reset } = useForm();
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
    if (selectedItem) {
      dispatch(
        FlowValidationActions.updateRuleScope({
          id: selectedItem.id,
          header: data.display_value,
          description: data.description,
        })
      );
    } else {
      dispatch(
        FlowValidationActions.addRuleScope({
          scope_type: data.scope_type,
          description: data.description,
          header: data.display_value,
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
          />
        </div>
        <InputField
          name="display_value"
          type="text"
          label={FLOWVALIDATION_CONSTANTS.DISPLAY_VALUE}
          placeholder={FLOWVALIDATION_CONSTANTS.ENTER_DISPLAY_VALUE}
          icon={<NewMessageIcon />}
          register={register}
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
