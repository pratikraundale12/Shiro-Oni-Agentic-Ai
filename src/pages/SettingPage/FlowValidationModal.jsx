import React, { Fragment, useEffect, useState } from 'react';
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
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
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
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [editedConditions, setEditedConditions] = useState([]);
  const fetchPropertyData = useSelector(FlowValidationSelectors.getProperty);
  const { control } = useForm();
  console.log('hi');
  useEffect(() => {
    if (fetchRules?.data?.length > 0) {
      setSelectedRuleId(fetchRules.data[0].id);
      setEditedConditions(fetchRules.data[0]?.conditions || []);
    }
  }, [fetchRules?.data]);

  useEffect(() => {
    if (selectedRuleId) {
      const selectedRule = fetchRules?.data?.find(
        rule => rule.id === selectedRuleId
      );
      setEditedConditions(selectedRule?.conditions || []);
    }
  }, [selectedRuleId, fetchRules?.data]);

  const handleRuleSelection = id => {
    setSelectedRuleId(id);
  };

  const selectedRule = fetchRules?.data?.find(
    rule => rule.id === selectedRuleId
  );

  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getFlowValidationModal
  );

  const handleConditionValueChange = (conditionIndex, value) => {
    const updatedConditions = [...editedConditions];
    updatedConditions[conditionIndex] = {
      ...updatedConditions[conditionIndex],
      condition_value: value,
    };
    setEditedConditions(updatedConditions);
  };

  const handleSave = () => {
    if (selectedRule) {
      const updatedRule = {
        name: selectedRule.name,
        conditions: editedConditions.map(condition => ({
          condition_value: condition.condition_value,
          condition_property: condition.condition_property,
          condition_expression: condition.condition_expression,
        })),
        output_value: selectedRule.output_value,
      };

      dispatch(
        FlowValidationActions.updateRule({
          ruleId: selectedRule.id,
          data: updatedRule,
        })
      );
      dispatch(SettingsActions.flowValidationModalOpen(false));
    }
  };

  return (
    <Modal
      title="Add Flow Rule"
      isOpen={isFlowValidationModalOpen}
      onRequestClose={() =>
        dispatch(SettingsActions.flowValidationModalOpen(false))
      }
      size="md"
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
      onSubmit={handleSave}
    >
      <div className="row">
        <div className="col-md-8 col-xl-9">
          <InputField
            name="rule_name"
            icon={<NewLinkIcon />}
            label="Rule Name"
            value={selectedRule?.name || ''}
            placeholder="Processor Colors"
            disabled={true}
          />
          <InputField
            name="rule_comments"
            icon={<NewMessageIcon />}
            label="Output Value"
            value={selectedRule?.output_value || ''}
            placeholder="Rules for Processor Colors"
            disabled={true}
          />
          <div className="col-12">
            <ConditionIcon className="d-flex align-items-center gap-3">
              Condition <InfoIcon />
            </ConditionIcon>
          </div>
          <div className="row g-2 align-items-center">
            {editedConditions?.map((condition, index) => (
              <Fragment key={index}>
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
                      disabled={true}
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
                      disabled={true}
                    />
                  </PropertyDiv>
                </div>
                <div className="col-md-3">
                  <InputField
                    name={`condition_value_${index}`}
                    icon={<NewLinkIcon />}
                    value={condition?.condition_value || ''}
                    onChange={e =>
                      handleConditionValueChange(index, e.target.value)
                    }
                  />
                </div>
              </Fragment>
            ))}
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
