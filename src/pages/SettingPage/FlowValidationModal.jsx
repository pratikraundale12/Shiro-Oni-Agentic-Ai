import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  AddIcon,
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
import { FlowValidationSelectors } from '../../store/flowValidation';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

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
const RadioContainer = styled.div`
  > div {
    margin: 0px;
  }
`;

const FlowValidationModal = () => {
  const dispatch = useDispatch();
  const fetchRules = useSelector(FlowValidationSelectors.getRules);
  const [selectedRuleId, setSelectedRuleId] = useState(
    fetchRules?.data?.[0]?.id || null
  );
  const fetchPropertyData = useSelector(FlowValidationSelectors.getProperty);
  const { control } = useForm();
  console.log(fetchRules?.data?.[0]?.id, 'aaaaaaaaaaaaaaaaaaaaaaaaaaa');
  const handleRuleSelection = id => {
    setSelectedRuleId(id);
  };

  const selectedRule = fetchRules?.data?.find(
    rule => rule.id === selectedRuleId
  );

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
        <div className="col-md-8 col-xl-9">
          <InputField
            name="rule_name"
            icon={<NewLinkIcon />}
            label="Rule Name"
            value={selectedRule?.name || ''}
            placeholder="Processor Colors"
          />
          <InputField
            name="rule_comments"
            icon={<NewMessageIcon />}
            label="Output Value"
            value={selectedRule?.output_value || ''}
            placeholder="Rules for Processor Colors"
          />
          <div className="col-12">
            <ConditionIcon className="d-flex align-items-center gap-3">
              Condition <InfoIcon />
            </ConditionIcon>
          </div>
          <div className="row g-2 align-items-center">
            {selectedRule?.conditions?.map((condition, index) => (
              <Fragment key={index}>
                {console.log(condition?.condition_property)};
                <div className="col-md-4">
                  <PropertyDiv>
                    <SelectField
                      name="select_property"
                      icon={<PropertyIcon />}
                      placeholder="Select Property"
                      options={fetchPropertyData?.data?.map(property => ({
                        label: property?.propName,
                        value: property?.propType,
                      }))}
                      defaultValue={condition?.condition_property}
                      control={control}
                      disabled={condition?.condition_property}
                    />
                  </PropertyDiv>
                </div>
                <div className="col-md">
                  <PropertyDiv>
                    <SelectField
                      name="condition"
                      icon={<PropertyIcon />}
                      placeholder="Condition"
                      options={[
                        { label: '===', value: '===' },
                        { label: '!==', value: '!==' },
                        { label: '<', value: '<' },
                        { label: '>', value: '>' },
                        { label: '<=', value: '<=' },
                        { label: '>=', value: '>=' },
                        { label: 'contains', value: 'contains' },
                      ]}
                      defaultValue={condition?.condition_expression}
                      control={control}
                      disabled={condition?.condition_expression}
                    />
                  </PropertyDiv>
                </div>
                <div className="col-md-3">
                  <InputField
                    name="rule_name"
                    icon={<NewLinkIcon />}
                    value={condition?.condition_value || ''}
                  />
                </div>
              </Fragment>
            ))}

            {/* <div className="col-md-1">
              <Button>+</Button>
            </div> */}
          </div>
        </div>
        <div className="col-md-4 col-xl-3">
          <ModelRightSide className="p-3">
            <div className="d-flex justify-content-between mb-3">
              <span className="d-flex align-items-center gap-2">
                Rules
                <InfoIcon />
              </span>
              <Button className="w-auto">
                <AddIcon color="#fff" />
                Add New Rule
              </Button>
            </div>
            <ul className="list-group">
              {(fetchRules?.data && fetchRules?.data.length > 0
                ? fetchRules.data
                : []
              ).map(item => (
                <li
                  key={item.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    item.active ? 'active' : ''
                  }`}
                >
                  <RadioContainer className="d-flex align-items-center gap-2 pe-2">
                    <RadioField
                      className="m-0"
                      name="rules"
                      checked={selectedRuleId === item.id}
                      onChange={() => handleRuleSelection(item.id)}
                    />
                    {item?.name}
                  </RadioContainer>
                  <span>
                    {fetchRules?.data?.deletable === false && (
                      <DeleteSmallIcon color="#FF7A00" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </ModelRightSide>
        </div>
      </div>
    </Modal>
  );
};

export default FlowValidationModal;
