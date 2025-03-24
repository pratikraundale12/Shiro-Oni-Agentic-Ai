import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NewLinkIcon, NewMessageIcon } from '../../assets';
import { InputField, Modal, SelectField } from '../../shared';
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
  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getAddNewValidationModalOpen
  );
  const isClosedNewAddValidationModal = () =>
    dispatch(SettingsActions.addNewValidationModalOpen(false));
  return (
    <div>
      {' '}
      <Modal
        title="Add New Validation"
        isOpen={isFlowValidationModalOpen}
        onRequestClose={isClosedNewAddValidationModal}
        size="md"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        contentStyles={{ minWidth: '30%' }}
      >
        <div className="mb-4">
          <LabelSelect>Select Scope</LabelSelect>
          <SelectField
            label="Scope Type"
            name="scope_type"
            icon={<NewLinkIcon />}
            placeholder="Select Scope Type"
            options={[
              { label: 'Processor', value: 'Processor' },
              { label: 'Connection', value: 'Connection' },
            ]}
          />
        </div>
        <InputField
          name="dispaly_value"
          type="text"
          label="Display Value"
          placeholder="Enter Display Value"
          icon={<NewMessageIcon />}
        />
        <InputField
          name="description"
          type="text"
          label="Description"
          placeholder="Enter Flow Description"
          icon={<NewMessageIcon />}
        />
      </Modal>
    </div>
  );
};

export default AddNewValidationModal;
