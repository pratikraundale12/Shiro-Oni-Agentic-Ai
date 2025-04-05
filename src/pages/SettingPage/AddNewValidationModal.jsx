import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NewLinkIcon, NewMessageIcon } from '../../assets';
import {
  FLOWVALIDATION_CONSTANTS,
  SCOPE_TYPE_OPTIONS,
} from '../../constants/flowValidation.constant';
import { InputField, Modal, SelectField } from '../../shared';
import { FlowValidationActions } from '../../store/flowValidation';
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
  const { handleSubmit, register, control } = useForm();
  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getAddNewValidationModalOpen
  );

  const isClosedNewAddValidationModal = () =>
    dispatch(SettingsActions.addNewValidationModalOpen(false));

  const onSubmit = data => {
    const selectedScope = SCOPE_TYPE_OPTIONS.find(
      option => option.value === data?.scope_type
    );

    dispatch(
      FlowValidationActions.addRuleScope({
        scope_type: selectedScope ? selectedScope.value : data.scope_type,
        description: data?.description,
        header: data?.dispaly_value,
      })
    );
  };

  return (
    <div>
      <Modal
        title={FLOWVALIDATION_CONSTANTS.ADD_NEW_VALIDATION}
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
          />
        </div>
        <InputField
          name="dispaly_value"
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
