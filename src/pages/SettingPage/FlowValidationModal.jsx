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
  NoDataIcon,
  PropertyIcon,
} from '../../assets';
import {
  CONDITION_JOIN_OPERATORS,
  CONDITION_OPERATORS,
  FLOWVALIDATION_CONSTANTS,
} from '../../constants/flowValidation.constant';
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
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;
const RadioContainer = styled.div`
  > div {
    margin: 0px;
  }
`;
const InputContainer = styled.div`
  > div {
    margin: 0px;
  }
  > div > div {
    margin-top: 0px !important;
  }
`;

const FlowValidationModal = () => {
  const dispatch = useDispatch();
  const fetchRules = useSelector(FlowValidationSelectors.getRules);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [editedConditions, setEditedConditions] = useState([]);
  const [isCreatingNewRule, setIsCreatingNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    output_value: '',
    conditions: [],
  });
  const [editedRule, setEditedRule] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const fetchPropertyData = useSelector(FlowValidationSelectors.getProperty);
  const selectedItem = useSelector(FlowValidationSelectors.getselectedItem);
  const { control } = useForm();

  const selectedRule = fetchRules?.data?.find(
    rule => rule.id === selectedRuleId
  );

  useEffect(() => {
    if (selectedRule) {
      setEditedRule(selectedRule);
      setHasChanges(false);
    }
  }, [selectedRule]);

  useEffect(() => {
    if (fetchRules?.data?.length > 0) {
      setSelectedRuleId(fetchRules.data[0].id);
      setEditedConditions(fetchRules.data[0]?.conditions || []);
      setHasChanges(false);
    }
  }, [fetchRules?.data]);

  useEffect(() => {
    if (selectedRuleId) {
      const selectedRule = fetchRules?.data?.find(
        rule => rule.id === selectedRuleId
      );
      setEditedConditions(selectedRule?.conditions || []);
      setHasChanges(false);
    }
  }, [selectedRuleId, fetchRules?.data]);

  const handleRuleSelection = id => {
    setSelectedRuleId(id);
    setHasChanges(false);
  };

  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getFlowValidationModal
  );

  const handleRuleNameChange = value => {
    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        name: value,
      }));
      setHasChanges(true);
    } else {
      setEditedRule(prev => ({
        ...prev,
        name: value,
      }));
      setHasChanges(true);
    }
  };

  const handleOutputValueChange = value => {
    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        output_value: value,
      }));
      setHasChanges(true);
    } else {
      setEditedRule(prev => ({
        ...prev,
        output_value: value,
      }));
      setHasChanges(true);
    }
  };

  const handleConditionValueChange = (conditionIndex, value) => {
    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        conditions: prev.conditions.map((condition, i) =>
          i === conditionIndex
            ? { ...condition, condition_value: value }
            : condition
        ),
      }));
      setHasChanges(true);
    } else {
      const updatedConditions = [...editedConditions];
      updatedConditions[conditionIndex] = {
        ...updatedConditions[conditionIndex],
        condition_value: value,
      };
      setEditedConditions(updatedConditions);
      setHasChanges(true);
    }
  };

  const handleConditionPropertyChange = (conditionIndex, value) => {
    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        conditions: prev.conditions.map((condition, i) =>
          i === conditionIndex
            ? { ...condition, condition_property: value }
            : condition
        ),
      }));
      setHasChanges(true);
    } else {
      const updatedConditions = [...editedConditions];
      updatedConditions[conditionIndex] = {
        ...updatedConditions[conditionIndex],
        condition_property: value,
      };
      setEditedConditions(updatedConditions);
      setHasChanges(true);
    }
  };

  const handleConditionExpressionChange = (conditionIndex, value) => {
    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        conditions: prev.conditions.map((condition, i) =>
          i === conditionIndex
            ? { ...condition, condition_expression: value }
            : condition
        ),
      }));
      setHasChanges(true);
    } else {
      const updatedConditions = [...editedConditions];
      updatedConditions[conditionIndex] = {
        ...updatedConditions[conditionIndex],
        condition_expression: value,
      };
      setEditedConditions(updatedConditions);
      setHasChanges(true);
    }
  };

  const handleConditionJoinOperatorChange = (conditionIndex, value) => {
    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        conditions: prev.conditions.map((condition, i) =>
          i === conditionIndex
            ? { ...condition, logic_operator: value }
            : condition
        ),
      }));
      setHasChanges(true);
    } else {
      const updatedConditions = [...editedConditions];
      updatedConditions[conditionIndex] = {
        ...updatedConditions[conditionIndex],
        logic_operator: value,
      };
      setEditedConditions(updatedConditions);
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    if (isCreatingNewRule) {
      if (
        newRule.name &&
        newRule.output_value &&
        newRule.conditions.length > 0
      ) {
        dispatch(
          FlowValidationActions.createRule({
            ...newRule,
            priority: fetchRules?.data?.length + 1,
            scope_id: selectedItem.id,
            conditions: newRule.conditions.map(condition => ({
              condition_value: condition.condition_value,
              condition_property: condition.condition_property,
              condition_expression: condition.condition_expression,
              logic_operator: condition.logic_operator,
            })),
          })
        );
        setIsCreatingNewRule(false);
        dispatch(SettingsActions.flowValidationModalOpen(false));
      }
    } else if (editedRule) {
      dispatch(
        FlowValidationActions.updateRule({
          ruleId: editedRule.id,
          data: {
            name: editedRule.name,
            output_value: editedRule.output_value,
            conditions: editedConditions.map(condition => ({
              condition_value: condition.condition_value,
              condition_property: condition.condition_property,
              condition_expression: condition.condition_expression,
              logic_operator: condition.logic_operator,
            })),
          },
        })
      );
      dispatch(SettingsActions.flowValidationModalOpen(false));
    }
  };

  const handleAddNewRule = () => {
    setIsCreatingNewRule(true);
    setNewRule({
      name: '',
      output_value: '',
      conditions: [],
    });
    setHasChanges(true);
  };

  const handleAddCondition = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        conditions: [
          ...prev.conditions,
          {
            condition_property: '',
            condition_expression: '',
            condition_value: '',
          },
        ],
      }));
      setHasChanges(true);
    } else {
      setEditedConditions(prev => [
        ...prev,
        {
          condition_property: '',
          condition_expression: '',
          condition_value: '',
        },
      ]);
      setHasChanges(true);
    }
  };

  const handleNewRuleChange = (field, value) => {
    setNewRule(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = id => {
    dispatch(FlowValidationActions.deleteRule(id));
    // Update local state immediately
    if (fetchRules?.data) {
      const updatedRules = fetchRules.data.filter(rule => rule.id !== id);
      dispatch(FlowValidationActions.fetchRulesSuccess({ data: updatedRules }));
    }
  };

  const handleDeleteCondition = index => {
    if (isCreatingNewRule) {
      setNewRule(prev => ({
        ...prev,
        conditions: prev.conditions.filter((_, i) => i !== index),
      }));
      setHasChanges(true);
    } else {
      setEditedConditions(prev => prev.filter((_, i) => i !== index));
      setHasChanges(true);
    }
  };
  return (
    <Modal
      title={selectedItem?.header}
      isOpen={isFlowValidationModalOpen}
      onRequestClose={() => {
        dispatch(SettingsActions.flowValidationModalOpen(false));
        setIsCreatingNewRule(false);
        setHasChanges(false);
        setNewRule({
          name: '',
          output_value: '',
          conditions: [],
        });
        setEditedRule(null);
        setEditedConditions([]);
      }}
      size="md"
      primaryButtonText={FLOWVALIDATION_CONSTANTS.SAVE}
      secondaryButtonText="Cancel"
      contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
      onSubmit={handleSave}
      primaryButtonDisabled={
        !hasChanges ||
        (isCreatingNewRule
          ? newRule.conditions.length === 0
          : editedConditions.length === 0)
      }
    >
      <div className="row">
        <div className="col-md-8 col-xl-9">
          {isCreatingNewRule ? (
            <>
              <InputField
                name="rule_name"
                icon={<NewLinkIcon />}
                label={FLOWVALIDATION_CONSTANTS.RULE_NAME}
                value={newRule.name}
                onChange={e => handleNewRuleChange('name', e.target.value)}
                placeholder={FLOWVALIDATION_CONSTANTS.ENTER_RULE_NAME}
              />
              <InputField
                name="rule_comments"
                icon={<NewMessageIcon />}
                label={FLOWVALIDATION_CONSTANTS.OUTPUT_VALUE}
                value={newRule.output_value}
                onChange={e =>
                  handleNewRuleChange('output_value', e.target.value)
                }
                placeholder={FLOWVALIDATION_CONSTANTS.ENTER_OUPUT_VALUE}
              />
              <div className="col-12 d-flex justify-content-between">
                <ConditionIcon className="d-flex align-items-center gap-3">
                  {FLOWVALIDATION_CONSTANTS.CONDITION} <InfoIcon />
                </ConditionIcon>
                {selectedItem?.deletable && (
                  <div>
                    <Button
                      onClick={e => {
                        handleAddCondition(e);
                      }}
                    >
                      <AddIcon color="#fff" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="row g-2 align-items-center">
                {newRule.conditions.map((condition, index) => (
                  <Fragment key={index}>
                    <div className="col-md-3">
                      <SelectField
                        name={`condition_property_${index}`}
                        icon={<PropertyIcon />}
                        placeholder={FLOWVALIDATION_CONSTANTS.SELECT_PROPERTY}
                        options={fetchPropertyData?.data?.map(property => ({
                          label: property?.propName,
                          value: property?.propName,
                        }))}
                        value={
                          condition.condition_property
                            ? {
                                label: condition.condition_property,
                                value: condition.condition_property,
                              }
                            : null
                        }
                        onChange={e => {
                          handleConditionPropertyChange(index, e?.value);
                        }}
                        control={control}
                        disabled={!isCreatingNewRule}
                      />
                    </div>
                    <div className="col-md-3">
                      <PropertyDiv>
                        <SelectField
                          name={`condition_expression_${index}`}
                          placeholder={FLOWVALIDATION_CONSTANTS.CONDITION}
                          options={CONDITION_OPERATORS}
                          value={
                            isCreatingNewRule
                              ? condition.condition_expression
                                ? {
                                    label: condition.condition_expression,
                                    value: condition.condition_expression,
                                  }
                                : null
                              : CONDITION_OPERATORS.find(
                                  option =>
                                    option.value ===
                                    condition.condition_expression
                                )
                          }
                          onChange={e => {
                            handleConditionExpressionChange(index, e?.value);
                          }}
                          control={control}
                          disabled={!isCreatingNewRule}
                        />
                      </PropertyDiv>
                    </div>
                    <InputContainer className="col-md-3 ">
                      <InputField
                        name={`condition_value_${index}`}
                        icon={<NewLinkIcon />}
                        value={condition.condition_value}
                        onChange={e =>
                          handleConditionValueChange(index, e.target.value)
                        }
                      />
                    </InputContainer>
                    <div className="col-md-2">
                      <SelectField
                        name={`condition_join_${index}`}
                        placeholder={FLOWVALIDATION_CONSTANTS.LOGIC_OPERATOR}
                        options={CONDITION_JOIN_OPERATORS}
                        value={CONDITION_JOIN_OPERATORS.find(
                          option => option.value === condition.logic_operator
                        )}
                        onChange={e =>
                          handleConditionJoinOperatorChange(index, e?.value)
                        }
                        control={control}
                        disabled={!selectedItem?.deletable}
                      />
                    </div>
                    {selectedItem?.deletable && (
                      <div className="col-md-1 d-flex align-items-center">
                        <button
                          onClick={() => handleDeleteCondition(index)}
                          className="btn btn-link p-0"
                        >
                          <DeleteSmallIcon color="#FF7A00" />
                        </button>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </>
          ) : (
            <>
              {fetchRules?.data?.length === 0 ? (
                <>
                  <div className="d-flex flex-column align-items-center mt-5">
                    <NoDataIcon width={130} />
                    <NoDataText>No Data Found!!</NoDataText>
                  </div>{' '}
                </>
              ) : (
                <>
                  <>
                    <InputField
                      name="rule_name"
                      icon={<NewLinkIcon />}
                      label={FLOWVALIDATION_CONSTANTS.RULE_NAME}
                      value={
                        isCreatingNewRule
                          ? newRule.name
                          : editedRule?.name || ''
                      }
                      placeholder={FLOWVALIDATION_CONSTANTS.ENTER_RULE_NAME}
                      disabled={!selectedItem?.deletable}
                      onChange={e => handleRuleNameChange(e.target.value)}
                    />

                    <InputField
                      name="rule_comments"
                      icon={<NewMessageIcon />}
                      label={FLOWVALIDATION_CONSTANTS.OUTPUT_VALUE}
                      value={
                        isCreatingNewRule
                          ? newRule.output_value
                          : editedRule?.output_value || ''
                      }
                      placeholder={FLOWVALIDATION_CONSTANTS.ENTER_OUPUT_VALUE}
                      disabled={!selectedItem?.deletable}
                      onChange={e => handleOutputValueChange(e.target.value)}
                    />
                    <div className="col-12 d-flex justify-content-between">
                      <ConditionIcon className="d-flex align-items-center gap-3">
                        {FLOWVALIDATION_CONSTANTS.CONDITION} <InfoIcon />
                      </ConditionIcon>
                      {selectedItem?.deletable && (
                        <div>
                          <Button
                            onClick={e => {
                              handleAddCondition(e);
                            }}
                          >
                            <AddIcon color="#fff" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="row g-2 align-items-center">
                      {editedConditions?.map((condition, index) => (
                        <Fragment key={index}>
                          <div className="col-md-3">
                            <SelectField
                              name={`condition_property_${index}`}
                              icon={<PropertyIcon />}
                              placeholder={
                                FLOWVALIDATION_CONSTANTS.SELECT_PROPERTY
                              }
                              options={fetchPropertyData?.data?.map(
                                property => ({
                                  label: property?.propName,
                                  value: property?.propName,
                                })
                              )}
                              value={
                                condition.condition_property
                                  ? {
                                      label: condition.condition_property,
                                      value: condition.condition_property,
                                    }
                                  : null
                              }
                              onChange={e => {
                                handleConditionPropertyChange(index, e?.value);
                              }}
                              control={control}
                              disabled={!selectedItem?.deletable}
                            />
                          </div>
                          <div className="col-md-3">
                            <PropertyDiv>
                              <SelectField
                                name={`condition_expression_${index}`}
                                placeholder={FLOWVALIDATION_CONSTANTS.CONDITION}
                                options={CONDITION_OPERATORS}
                                value={CONDITION_OPERATORS.find(
                                  option =>
                                    option.value ===
                                    condition.condition_expression
                                )}
                                onChange={e =>
                                  handleConditionExpressionChange(
                                    index,
                                    e?.value
                                  )
                                }
                                control={control}
                                disabled={!selectedItem?.deletable}
                              />
                            </PropertyDiv>
                          </div>
                          <InputContainer className="col-md-3">
                            <InputField
                              name={`condition_value_${index}`}
                              icon={<NewLinkIcon />}
                              value={condition?.condition_value || ''}
                              onChange={e =>
                                handleConditionValueChange(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                          </InputContainer>
                          <div className="col-md-2">
                            <SelectField
                              name={`condition_join_${index}`}
                              placeholder={
                                FLOWVALIDATION_CONSTANTS.LOGIC_OPERATOR
                              }
                              options={CONDITION_JOIN_OPERATORS}
                              value={CONDITION_JOIN_OPERATORS.find(
                                option =>
                                  option.value === condition.logic_operator
                              )}
                              onChange={e =>
                                handleConditionJoinOperatorChange(
                                  index,
                                  e?.value
                                )
                              }
                              control={control}
                              disabled={!selectedItem?.deletable}
                            />
                          </div>
                          {selectedItem?.deletable && (
                            <div className="col-md-1 d-flex align-items-center">
                              <button
                                onClick={() => handleDeleteCondition(index)}
                                className="btn btn-link p-0"
                              >
                                <DeleteSmallIcon color="#FF7A00" />
                              </button>
                            </div>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  </>
                </>
              )}{' '}
            </>
          )}
        </div>
        <div className="col-md-4 col-xl-3">
          <ModelRightSide className="p-3">
            <div className="d-flex justify-content-between mb-3">
              <span className="d-flex align-items-center gap-2">
                {FLOWVALIDATION_CONSTANTS.RULES}
                <InfoIcon />
              </span>
              <Button
                className="w-auto"
                onClick={handleAddNewRule}
                disabled={selectedItem?.deletable === false}
              >
                {FLOWVALIDATION_CONSTANTS.ADD_NEW_RULE}
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
                  <button onClick={() => handleDelete(item.id)}>
                    {selectedItem?.deletable === true && (
                      <DeleteSmallIcon color="#FF7A00" />
                    )}
                  </button>
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
