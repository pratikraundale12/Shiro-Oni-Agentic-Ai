import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

import styled from 'styled-components';
import {
  DeleteSmallIcon,
  InfoIcon,
  NewLinkIcon,
  NewMessageIcon,
  PropertyIcon,
} from '../../assets';
import {
  Button,
  InputField,
  Modal,
  RadioField,
  SelectField,
} from '../../shared';

const ModelRightSide = styled.div`
  height: 100%;
  border-radius: 12px;
  border: 1px solid #e0d3d3;
  background-color: #fbfcff;
  .list-group {
    border-radius: 12px;
    .list-group-item {
      background-color: #f5f7fa;
      color: #444445;
      padding-top: 0.6rem;
      padding-bottom: 0.6rem;
      &.active {
        background-color: #e9eff9;
        color: #444445;
        border: var(--bs-list-group-border-width) solid
          var(--bs-list-group-border-color);
      }
    }
  }
`;

const PropertyDiv = styled.div`
  margin-bottom: 0.75rem;
  .react-select__control {
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;
const ConditionIcon = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
`;

const FlowValidationModal = () => {
  const dispatch = useDispatch();

  // ✅ Correct way to get state from Redux
  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getFlowValidationModal
  );

  const isClosedFlowValidationModal = () =>
    dispatch(SettingsActions.flowValidationModalOpen(false));

  return (
    <Modal
      title="Add Flow Rule"
      isOpen={isFlowValidationModalOpen}
      onRequestClose={isClosedFlowValidationModal}
      size="md"
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
    >
      <div className="row">
        <div className="col-md-8">
          <InputField
            name="rule_name"
            icon={<NewLinkIcon />}
            label="Rule Name"
            placeholder="Processor Colors"
          />
          <InputField
            name="rule_comments"
            icon={<NewMessageIcon />}
            label="Rule Comments"
            placeholder="Rules for Processor Colors"
          />
          <div className="col-12">
            <ConditionIcon className="d-flex align-items-center gap-3">
              Condition <InfoIcon />
            </ConditionIcon>
          </div>
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <PropertyDiv>
                <SelectField
                  name="select_perperty"
                  icon={<PropertyIcon />}
                  placeholder="Select Perperty"
                />
              </PropertyDiv>
            </div>
            <div className="col-md">
              <PropertyDiv>
                <SelectField
                  name="select_perperty"
                  icon={<PropertyIcon />}
                  placeholder="Select Perperty"
                />
              </PropertyDiv>
            </div>
            <div className="col-md-3">
              <InputField
                name="rule_name"
                icon={<NewLinkIcon />}
                placeholder="Processor Colors"
              />
            </div>
            <div className="col-md-1">
              <Button>+</Button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <ModelRightSide className="p-3">
            <div className="d-flex justify-content-between mb-3">
              <span className="d-flex align-items-center gap-2">
                Rules
                <InfoIcon />
              </span>
              <span>Add New Rule</span>
            </div>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center active">
                <div className="d-flex align-items-center gap-3">
                  <RadioField />
                  Processor Colors
                </div>
                <span>
                  <DeleteSmallIcon color="#FF7A00" />
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex  align-items-center gap-3">
                  <RadioField />
                  Unknown Colors
                </div>
                <span>
                  <DeleteSmallIcon color="#FF7A00" />
                </span>
              </li>
            </ul>
          </ModelRightSide>
        </div>
      </div>
    </Modal>
  );
};

export default FlowValidationModal;
