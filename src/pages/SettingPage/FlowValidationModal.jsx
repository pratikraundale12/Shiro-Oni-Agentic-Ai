import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import * as yup from 'yup';
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

// Styled Components
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
  display: flex;
  align-items: center;
  gap: 8px;
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

const InfoIconDiv = styled.div`
  position: absolute;
  left: 90px;
  top: -4px;
`;

// Validation Schemas
const createRuleSchema = yup.object().shape({
  rule_name: yup.string().required('Rule name is required'),
  rule_comments: yup.string().required('Output value is required'),
});

const conditionSchema = yup.object().shape({
  condition_property: yup.string().required('Property is required'),
  condition_expression: yup.string().required('Condition operator is required'),
  condition_value: yup.string().required('Value is required'),
  condition_join: yup.string(),
});

// Reusable Components
const ConditionRow = React.memo(
  ({
    condition,
    index,
    selectedItem,
    handleConditionPropertyChange,
    handleConditionExpressionChange,
    handleConditionValueChange,
    handleConditionJoinOperatorChange,
    handleDeleteCondition,
    conditionsErrors,
    control,
    fetchPropertyData,
    handleSubConditionProperty,
    totalConditions,
  }) => {
    // Show join operator if:
    // 1. There are 2 conditions and this is the first one
    // 2. There are 3+ conditions and this is not the last one
    const showJoinOperator =
      totalConditions > 1 &&
      ((totalConditions === 2 && index === 0) ||
        (totalConditions > 2 && index < totalConditions - 1));

    return (
      <Fragment>
        <div
          className={
            condition.condition_property &&
            fetchPropertyData?.data?.find(
              prop => prop.propName === condition.condition_property
            )?.dynamic_input
              ? 'col-xl-3 col-md-4'
              : 'col-md-3'
          }
        >
          <SelectField
            name={`condition_property_${index}`}
            icon={<PropertyIcon />}
            placeholder={FLOWVALIDATION_CONSTANTS.SELECT_PROPERTY}
            options={fetchPropertyData?.data?.map(property => ({
              label: property?.propName,
              value: property?.propName,
              dynamic_input: property?.dynamic_input,
            }))}
            value={
              condition.condition_property
                ? {
                    label: condition.condition_property,
                    value: condition.condition_property,
                  }
                : null
            }
            onChange={e => handleConditionPropertyChange(index, e?.value)}
            control={control}
            disabled={!selectedItem?.deletable}
            errors={
              conditionsErrors[index]
                ? {
                    [`condition_property_${index}`]:
                      conditionsErrors[index]?.condition_property,
                  }
                : {}
            }
          />
        </div>
        {condition.condition_property &&
          fetchPropertyData?.data?.find(
            prop => prop.propName === condition.condition_property
          )?.dynamic_input && (
            <InputContainer className="col-xl-2 col-md-4">
              <InputField
                name={`sub_condition_property${index}`}
                icon={<NewLinkIcon />}
                placeholder="Enter value"
                value={condition?.sub_condition_property || ''}
                onChange={e =>
                  handleSubConditionProperty(index, e.target.value)
                }
                control={control}
                errors={
                  conditionsErrors[index]
                    ? {
                        [`sub_condition_property_${index}`]:
                          conditionsErrors[index]?.sub_condition_property,
                      }
                    : {}
                }
              />
            </InputContainer>
          )}

        <div
          className={
            condition.condition_property &&
            fetchPropertyData?.data?.find(
              prop => prop.propName === condition.condition_property
            )?.dynamic_input
              ? 'col-xl-2 col-md-4'
              : 'col-md-3'
          }
        >
          <PropertyDiv>
            <SelectField
              name={`condition_expression_${index}`}
              placeholder={FLOWVALIDATION_CONSTANTS.CONDITION}
              options={CONDITION_OPERATORS}
              value={CONDITION_OPERATORS.find(
                option => option.value === condition.condition_expression
              )}
              onChange={e => handleConditionExpressionChange(index, e?.value)}
              control={control}
              disabled={!selectedItem?.deletable}
              errors={
                conditionsErrors[index]
                  ? {
                      [`condition_expression_${index}`]:
                        conditionsErrors[index]?.condition_expression,
                    }
                  : {}
              }
            />
          </PropertyDiv>
        </div>
        <InputContainer
          className={
            condition.condition_property &&
            fetchPropertyData?.data?.find(
              prop => prop.propName === condition.condition_property
            )?.dynamic_input
              ? 'col-xl-2 col-md-4'
              : 'col-md-3'
          }
        >
          <InputField
            name={`condition_value_${index}`}
            icon={<NewLinkIcon />}
            value={condition?.condition_value || ''}
            onChange={e => handleConditionValueChange(index, e.target.value)}
            control={control}
            placeholder="Enter value"
            errors={
              conditionsErrors[index]
                ? {
                    [`condition_value_${index}`]:
                      conditionsErrors[index]?.condition_value,
                  }
                : {}
            }
          />
        </InputContainer>
        {showJoinOperator && (
          <div
            className={
              condition.condition_property &&
              fetchPropertyData?.data?.find(
                prop => prop.propName === condition.condition_property
              )?.dynamic_input
                ? 'col-xl-2 col-md-4'
                : 'col-md-2'
            }
          >
            <SelectField
              name={`condition_join_${index}`}
              placeholder={FLOWVALIDATION_CONSTANTS.LOGIC_OPERATOR}
              options={CONDITION_JOIN_OPERATORS}
              value={CONDITION_JOIN_OPERATORS.find(
                option => option.value === condition.logic_operator
              )}
              onChange={e => handleConditionJoinOperatorChange(index, e?.value)}
              control={control}
              disabled={!selectedItem?.deletable}
              errors={
                conditionsErrors[index]
                  ? {
                      [`condition_join_${index}`]:
                        conditionsErrors[index]?.condition_join,
                    }
                  : {}
              }
            />
          </div>
        )}
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
    );
  }
);

ConditionRow.displayName = 'ConditionRow';

ConditionRow.propTypes = {
  condition: PropTypes.shape({
    condition_property: PropTypes.string,
    condition_expression: PropTypes.string,
    condition_value: PropTypes.string,
    logic_operator: PropTypes.string,
    sub_condition_property: PropTypes.string,
    dynamic_input: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  selectedItem: PropTypes.shape({
    deletable: PropTypes.bool,
  }).isRequired,
  handleConditionPropertyChange: PropTypes.func.isRequired,
  handleConditionExpressionChange: PropTypes.func.isRequired,
  handleConditionValueChange: PropTypes.func.isRequired,
  handleSubConditionProperty: PropTypes.func.isRequired,
  handleConditionJoinOperatorChange: PropTypes.func.isRequired,
  handleDeleteCondition: PropTypes.func.isRequired,
  conditionsErrors: PropTypes.arrayOf(PropTypes.object),
  control: PropTypes.object.isRequired,
  isCreatingNewRule: PropTypes.bool,
  fetchPropertyData: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        propName: PropTypes.string,
      })
    ),
  }),
  totalConditions: PropTypes.number.isRequired,
};

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
  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getFlowValidationModal
  );
  const [draggedItem, setDraggedItem] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(createRuleSchema),
    mode: 'onChange',
  });

  const [conditionsErrors, setConditionsErrors] = useState([]);

  const selectedRule = useMemo(
    () => fetchRules?.data?.find(rule => rule?.id === selectedRuleId),
    [fetchRules?.data, selectedRuleId]
  );

  // Handlers
  const handleRuleSelection = useCallback(
    id => {
      setSelectedRuleId(id);
      setHasChanges(false);

      const selectedRule = fetchRules?.data?.find(rule => rule?.id === id);
      reset({
        rule_name: selectedRule?.name || '',
        rule_comments: selectedRule?.output_value || '',
      });
    },
    [fetchRules?.data, reset]
  );

  const handleRuleNameChange = useCallback(
    value => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({ ...prev, name: value }));
      } else {
        setEditedRule(prev => ({ ...prev, name: value }));
      }
      setHasChanges(true);
      setValue('rule_name', value);
      trigger('rule_name');
    },
    [isCreatingNewRule, setValue, trigger]
  );

  const handleOutputValueChange = useCallback(
    value => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({ ...prev, output_value: value }));
      } else {
        setEditedRule(prev => ({ ...prev, output_value: value }));
      }
      setHasChanges(true);
      setValue('rule_comments', value);
      trigger('rule_comments');
    },
    [isCreatingNewRule, setValue, trigger]
  );

  const handleConditionValueChange = useCallback(
    (conditionIndex, value) => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({
          ...prev,
          conditions: prev?.conditions?.map((condition, i) =>
            i === conditionIndex
              ? { ...condition, condition_value: value }
              : condition
          ),
        }));
      } else {
        const updatedConditions = [...(editedConditions || [])];
        updatedConditions[conditionIndex] = {
          ...updatedConditions[conditionIndex],
          condition_value: value,
        };
        setEditedConditions(updatedConditions);
      }
      setHasChanges(true);
      setValue(`condition_value_${conditionIndex}`, value);
      trigger(`condition_value_${conditionIndex}`);
    },
    [isCreatingNewRule, editedConditions, setValue, trigger]
  );

  const handleConditionPropertyChange = useCallback(
    (conditionIndex, value) => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({
          ...prev,
          conditions: prev?.conditions?.map((condition, i) =>
            i === conditionIndex
              ? { ...condition, condition_property: value }
              : condition
          ),
        }));
      } else {
        const updatedConditions = [...(editedConditions || [])];
        updatedConditions[conditionIndex] = {
          ...updatedConditions[conditionIndex],
          condition_property: value,
        };
        setEditedConditions(updatedConditions);
      }
      setHasChanges(true);
      setValue(`condition_property_${conditionIndex}`, value);
      trigger(`condition_property_${conditionIndex}`);
    },
    [isCreatingNewRule, editedConditions, setValue, trigger]
  );

  const handleConditionExpressionChange = useCallback(
    (conditionIndex, value) => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({
          ...prev,
          conditions: prev?.conditions?.map((condition, i) =>
            i === conditionIndex
              ? { ...condition, condition_expression: value }
              : condition
          ),
        }));
      } else {
        const updatedConditions = [...(editedConditions || [])];
        updatedConditions[conditionIndex] = {
          ...updatedConditions[conditionIndex],
          condition_expression: value,
        };
        setEditedConditions(updatedConditions);
      }
      setHasChanges(true);
      setValue(`condition_expression_${conditionIndex}`, value);
      trigger(`condition_expression_${conditionIndex}`);
    },
    [isCreatingNewRule, editedConditions, setValue, trigger]
  );

  const handleConditionJoinOperatorChange = useCallback(
    (conditionIndex, value) => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({
          ...prev,
          conditions: prev?.conditions?.map((condition, i) =>
            i === conditionIndex
              ? { ...condition, logic_operator: value }
              : condition
          ),
        }));
      } else {
        const updatedConditions = [...(editedConditions || [])];
        updatedConditions[conditionIndex] = {
          ...updatedConditions[conditionIndex],
          logic_operator: value,
        };
        setEditedConditions(updatedConditions);
      }
      setHasChanges(true);
      setValue(`condition_join_${conditionIndex}`, value);
      trigger(`condition_join_${conditionIndex}`);
    },
    [isCreatingNewRule, editedConditions, setValue, trigger]
  );

  const handleSubConditionProperty = useCallback(
    (conditionIndex, value) => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({
          ...prev,
          conditions: prev?.conditions?.map((condition, i) =>
            i === conditionIndex
              ? { ...condition, sub_condition_property: value }
              : condition
          ),
        }));
      } else {
        const updatedConditions = [...(editedConditions || [])];
        updatedConditions[conditionIndex] = {
          ...updatedConditions[conditionIndex],
          sub_condition_property: value,
        };
        setEditedConditions(updatedConditions);
      }
      setHasChanges(true);
      setValue(`sub_condition_property_${conditionIndex}`, value);
      trigger(`sub_condition_property_${conditionIndex}`);
    },
    [isCreatingNewRule, editedConditions, setValue, trigger]
  );

  const handleDeleteCondition = useCallback(
    index => {
      if (isCreatingNewRule) {
        setNewRule(prev => ({
          ...prev,
          conditions: prev?.conditions?.filter((_, i) => i !== index),
        }));
      } else {
        setEditedConditions(prev => prev?.filter((_, i) => i !== index));
      }
      setHasChanges(true);
    },
    [isCreatingNewRule]
  );

  const handleCloseModal = useCallback(() => {
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
    reset();
  }, [dispatch, reset]);

  const handleAddNewRule = useCallback(() => {
    setIsCreatingNewRule(true);
    setNewRule({
      name: '',
      output_value: '',
      conditions: [],
    });
    setHasChanges(true);
    reset({
      rule_name: '',
      rule_comments: '',
    });
  }, [reset]);

  const handleAddCondition = useCallback(
    e => {
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
              logic_operator: 'AND',
              sub_condition_property: '',
            },
          ],
        }));
      } else {
        setEditedConditions(prev => [
          ...prev,
          {
            condition_property: '',
            condition_expression: '',
            condition_value: '',
            logic_operator: 'AND',
            sub_condition_property: '',
          },
        ]);
      }
      setHasChanges(true);
    },
    [isCreatingNewRule]
  );

  const handleDelete = useCallback(
    id => {
      dispatch(FlowValidationActions.deleteRule(id));
      if (fetchRules?.data) {
        const updatedRules = fetchRules?.data?.filter(rule => rule?.id !== id);
        dispatch(
          FlowValidationActions.fetchRulesSuccess({ data: updatedRules })
        );
      }
    },
    [dispatch, fetchRules?.data]
  );

  const isFormValid = useMemo(() => {
    const hasValidConditions = isCreatingNewRule
      ? newRule?.conditions?.length > 0 &&
        !conditionsErrors?.some(error => error !== null)
      : editedConditions?.length > 0 &&
        !conditionsErrors?.some(error => error !== null);

    return (
      hasChanges && hasValidConditions && Object.keys(errors || {}).length === 0
    );
  }, [
    isCreatingNewRule,
    newRule?.conditions,
    editedConditions,
    conditionsErrors,
    hasChanges,
    errors,
  ]);

  const onFormSubmit = useCallback(
    data => {
      if (isCreatingNewRule) {
        if (
          data.rule_name &&
          data.rule_comments &&
          newRule.conditions.length > 0 &&
          !conditionsErrors.some(error => error !== null)
        ) {
          dispatch(
            FlowValidationActions.createRule({
              name: data.rule_name,
              output_value: data.rule_comments,
              priority: fetchRules?.data?.length + 1,
              scope_id: selectedItem?.id || '',
              conditions: newRule.conditions.map(condition => ({
                condition_value: condition.condition_value,
                condition_property: condition.condition_property,
                condition_expression: condition.condition_expression,
                logic_operator: condition.logic_operator,
                sub_condition_property: condition.sub_condition_property,
                dynamic_input:
                  fetchPropertyData?.data?.find(
                    prop => prop.propName === condition.condition_property
                  )?.dynamic_input || false,
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
              name: data.rule_name,
              output_value: data.rule_comments,
              conditions: editedConditions.map(condition => ({
                condition_value: condition.condition_value,
                condition_property: condition.condition_property,
                condition_expression: condition.condition_expression,
                logic_operator: condition.logic_operator,
                sub_condition_property: condition.sub_condition_property,
                dynamic_input:
                  fetchPropertyData?.data?.find(
                    prop => prop.propName === condition.condition_property
                  )?.dynamic_input || false,
              })),
            },
          })
        );
        dispatch(SettingsActions.flowValidationModalOpen(false));
      }
    },
    [
      isCreatingNewRule,
      newRule.conditions,
      conditionsErrors,
      dispatch,
      fetchRules?.data?.length,
      selectedItem?.id,
      editedRule,
      editedConditions,
      fetchPropertyData?.data,
    ]
  );

  const handleSave = useCallback(() => {
    handleSubmit(onFormSubmit)();
  }, [handleSubmit, onFormSubmit]);

  // Effects
  useEffect(() => {
    if (selectedRule) {
      setEditedRule(selectedRule);
      setHasChanges(false);
      setValue('rule_name', selectedRule.name);
      setValue('rule_comments', selectedRule.output_value);
    }
  }, [selectedRule, setValue]);

  useEffect(() => {
    if (fetchRules?.data?.length > 0) {
      setSelectedRuleId(fetchRules.data[0].id);
      setEditedConditions(fetchRules.data[0]?.conditions || []);
      setHasChanges(false);
      setValue('rule_name', fetchRules.data[0].name);
      setValue('rule_comments', fetchRules.data[0].output_value);
    }
  }, [fetchRules?.data, setValue]);

  useEffect(() => {
    if (selectedRuleId) {
      const selectedRule = fetchRules?.data?.find(
        rule => rule.id === selectedRuleId
      );
      setEditedConditions(selectedRule?.conditions || []);
      setHasChanges(false);
      setValue('rule_name', selectedRule?.name || '');
      setValue('rule_comments', selectedRule?.output_value || '');
    }
  }, [selectedRuleId, fetchRules?.data, setValue]);

  useEffect(() => {
    const validateConditions = async () => {
      const conditions = isCreatingNewRule
        ? newRule.conditions
        : editedConditions;
      const errors = [];

      for (let i = 0; i < conditions.length; i++) {
        try {
          await conditionSchema.validate(
            {
              condition_property: conditions[i].condition_property,
              condition_expression: conditions[i].condition_expression,
              condition_value: conditions[i].condition_value,
              condition_join: conditions[i].logic_operator,
            },
            { abortEarly: false }
          );
          errors.push(null);
        } catch (validationErrors) {
          const fieldErrors = {};
          validationErrors.inner.forEach(error => {
            fieldErrors[error.path] = error.message;
          });
          errors.push(fieldErrors);
        }
      }

      setConditionsErrors(errors);
    };

    validateConditions();
  }, [isCreatingNewRule, newRule.conditions, editedConditions]);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const items = [...(fetchRules?.data || [])];
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    // Update the rules order in the store
    dispatch(FlowValidationActions.fetchRulesSuccess({ data: items }));
    setDraggedItem(null);

    const ruleIds = items.map(rule => rule.id);
    dispatch(
      FlowValidationActions.setRulePriority({
        ruleScopeId: fetchRules?.data[0]?.scope_id,
        ruleOrder: ruleIds,
      })
    );
  };

  return (
    <Modal
      title={selectedItem?.header || ''}
      isOpen={isFlowValidationModalOpen}
      onRequestClose={handleCloseModal}
      size="md"
      primaryButtonText={FLOWVALIDATION_CONSTANTS.SAVE}
      secondaryButtonText="Cancel"
      contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
      onSubmit={handleSave}
      primaryButtonDisabled={!isFormValid}
    >
      <div className="row">
        <div className="col-md-8 col-xl-9">
          {isCreatingNewRule ? (
            <>
              <InputField
                name="rule_name"
                icon={<NewLinkIcon />}
                label={FLOWVALIDATION_CONSTANTS.RULE_NAME}
                value={newRule?.name || ''}
                onChange={e => handleRuleNameChange(e?.target?.value)}
                placeholder={FLOWVALIDATION_CONSTANTS.ENTER_RULE_NAME}
                errors={errors}
                control={control}
              />
              <InputField
                name="rule_comments"
                icon={<NewMessageIcon />}
                label={FLOWVALIDATION_CONSTANTS.OUTPUT_VALUE}
                value={newRule?.output_value || ''}
                onChange={e => handleOutputValueChange(e?.target?.value)}
                placeholder={FLOWVALIDATION_CONSTANTS.ENTER_OUPUT_VALUE}
                errors={errors}
                control={control}
              />
              <div className="col-12 d-flex justify-content-between">
                <ConditionIcon>
                  {FLOWVALIDATION_CONSTANTS.CONDITION}
                  <div data-tooltip-id="condition-tooltip">
                    <InfoIcon />
                  </div>
                  <ReactTooltip
                    id="condition-tooltip"
                    place="right"
                    content="Define conditions for the rule using properties, operators, and values"
                    style={{
                      width: '250px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      zIndex: 9999,
                    }}
                  />
                </ConditionIcon>
                {selectedItem?.deletable && (
                  <div>
                    <Button onClick={handleAddCondition}>
                      <AddIcon color="#fff" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="row g-2 align-items-center">
                {newRule?.conditions?.map((condition, index) => (
                  <ConditionRow
                    key={index}
                    condition={condition}
                    index={index}
                    selectedItem={selectedItem || { deletable: false }}
                    handleConditionPropertyChange={
                      handleConditionPropertyChange
                    }
                    handleConditionExpressionChange={
                      handleConditionExpressionChange
                    }
                    handleConditionValueChange={handleConditionValueChange}
                    handleSubConditionProperty={handleSubConditionProperty}
                    handleConditionJoinOperatorChange={
                      handleConditionJoinOperatorChange
                    }
                    handleDeleteCondition={handleDeleteCondition}
                    conditionsErrors={conditionsErrors}
                    control={control}
                    fetchPropertyData={fetchPropertyData}
                    isCreatingNewRule={isCreatingNewRule}
                    totalConditions={newRule?.conditions?.length || 0}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {fetchRules?.data?.length === 0 ? (
                <div className="d-flex flex-column align-items-center mt-5">
                  <NoDataIcon width={130} />
                  <NoDataText>No Data Found!!</NoDataText>
                </div>
              ) : (
                <>
                  <InputField
                    name="rule_name"
                    icon={<NewLinkIcon />}
                    label={FLOWVALIDATION_CONSTANTS.RULE_NAME}
                    value={editedRule?.name || ''}
                    placeholder={FLOWVALIDATION_CONSTANTS.ENTER_RULE_NAME}
                    disabled={!selectedItem?.deletable}
                    onChange={e => handleRuleNameChange(e?.target?.value)}
                    errors={errors}
                    control={control}
                  />
                  <div className="d-flex position-relative">
                    <InputField
                      name="rule_comments"
                      icon={<NewMessageIcon />}
                      label={FLOWVALIDATION_CONSTANTS.OUTPUT_VALUE}
                      value={editedRule?.output_value || ''}
                      placeholder={FLOWVALIDATION_CONSTANTS.ENTER_OUPUT_VALUE}
                      disabled={!selectedItem?.deletable}
                      onChange={e => handleOutputValueChange(e?.target?.value)}
                      errors={errors}
                      control={control}
                    />
                    <InfoIconDiv data-tooltip-id="condition-tooltip-output">
                      <InfoIcon />
                    </InfoIconDiv>
                    <ReactTooltip
                      id="condition-tooltip-output"
                      place="right"
                      content="output Value:
                      ${concurrent_task} Concurrent Tasks
                     for config properties: ${properties['property_name']
                     "
                      style={{
                        width: '250px',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        zIndex: 9999,
                      }}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-between">
                    <ConditionIcon>
                      {FLOWVALIDATION_CONSTANTS.CONDITION}
                      <div data-tooltip-id="condition-tooltip">
                        <InfoIcon />
                      </div>
                      <ReactTooltip
                        id="condition-tooltip"
                        place="right"
                        content="Define conditions for the rule using properties, operators, and values example: concurrent_tasks > 5"
                        style={{
                          width: '250px',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          zIndex: 9999,
                        }}
                      />
                    </ConditionIcon>
                    {selectedItem?.deletable && (
                      <div>
                        <Button onClick={handleAddCondition}>
                          <AddIcon color="#fff" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="row g-2 align-items-center">
                    {editedConditions?.map((condition, index) => (
                      <ConditionRow
                        key={index}
                        condition={condition}
                        index={index}
                        selectedItem={selectedItem || { deletable: false }}
                        handleConditionPropertyChange={
                          handleConditionPropertyChange
                        }
                        handleConditionExpressionChange={
                          handleConditionExpressionChange
                        }
                        handleConditionValueChange={handleConditionValueChange}
                        handleSubConditionProperty={handleSubConditionProperty}
                        handleConditionJoinOperatorChange={
                          handleConditionJoinOperatorChange
                        }
                        handleDeleteCondition={handleDeleteCondition}
                        conditionsErrors={conditionsErrors}
                        control={control}
                        fetchPropertyData={fetchPropertyData}
                        isCreatingNewRule={isCreatingNewRule}
                        totalConditions={editedConditions?.length || 0}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="col-md-4 col-xl-3">
          <ModelRightSide className="p-3">
            <div className="d-flex justify-content-between mb-3 flex-wrap">
              <span className="d-flex align-items-center gap-2">
                {FLOWVALIDATION_CONSTANTS.RULES}
                <div data-tooltip-id="rules-tooltip">
                  <InfoIcon />
                </div>
                <ReactTooltip
                  id="rules-tooltip"
                  place="right"
                  content="List of all validation rules. You can add, edit, or delete rules here"
                  style={{
                    width: '250px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    zIndex: 9999,
                  }}
                />
              </span>
              <Button
                type="button"
                className="w-auto"
                onClick={handleAddNewRule}
                disabled={selectedItem?.deletable === false}
              >
                {FLOWVALIDATION_CONSTANTS.ADD_NEW_RULE}
              </Button>
            </div>
            <ul className="list-group">
              {(fetchRules?.data || []).map((item, index) => (
                <li
                  key={item?.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    item?.active ? 'active' : ''
                  }`}
                  draggable
                  onDragStart={e => handleDragStart(e, index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDrop={e => handleDrop(e, index)}
                  style={{ cursor: 'move' }}
                >
                  <RadioContainer className="d-flex align-items-center gap-2 pe-2">
                    <RadioField
                      className="m-0"
                      name="rules"
                      checked={selectedRuleId === item?.id}
                      onChange={() => handleRuleSelection(item?.id)}
                    />
                    {item?.name}
                  </RadioContainer>
                  <button onClick={() => handleDelete(item?.id)}>
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
