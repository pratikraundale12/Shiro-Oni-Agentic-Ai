import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { PropertyIcon } from '../../assets';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { Button, RadioSelectField } from '../../shared';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';

const FlowcompareStyled = styled.div`
  height: 700px;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid #e0d3d3;
  padding: 1rem;
  margin-top: 1rem;
  background: #fbfcff;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 14px;
`;
const FlowContainerDetail = styled.div`
  padding: 0px;
`;
const LabelSelectContent = styled.div`
  color: #7a7a7a;
  font-size: 18px;
  font-weight: 500;
`;

const DiffModalFlowValidation = () => {
  const { control, watch, register } = useForm({
    defaultValues: {
      user_validation: 'user validation',
    },
  });
  const dispatch = useDispatch();
  const selectedValidation = watch('user_validation');
  console.log(selectedValidation, 'selectedValidation');

  useEffect(() => {
    dispatch(FlowValidationActions.ruleScopeFetch({}));
  }, [dispatch]);

  const ruleScopes = useSelector(FlowValidationSelectors.getRuleScopes);
  const selectedRules = watch('select_property') || [];
  const ruleIds = selectedRules.map(rule => rule.value);
  console.log(ruleIds, 'ruleIds');
  const formattedOptions = ruleScopes?.data?.length
    ? ruleScopes?.data?.map(rule => ({
        label: rule?.header,
        value: rule?.id,
      }))
    : [];

  const handleValidateFlow = () => {
    console.log('49');
  };

  return (
    <FlowcompareStyled>
      <RadioSelectField
        control={control}
        name="user_validation"
        options={[
          { label: 'User Validation', value: 'user validation' },
          { label: 'Admin Validation', value: 'admin validation' },
        ]}
        register={register}
      />
      {selectedValidation === 'admin validation' && (
        <div className="d-flex justify-start align-center mb-4">
          <div style={{ width: '80%' }}>
            <LabelSelect>
              {FLOWVALIDATION_CONSTANTS.SELECT_RULE_TO_VALIDATE}
            </LabelSelect>
            <MultiSelectField
              enableCheckboxes
              control={control}
              name="select_property_0"
              placeholder={FLOWVALIDATION_CONSTANTS.SELECT_RULE_TO_VALIDATE}
              options={formattedOptions}
            />
          </div>

          <div className="mt-4 ml-2 d-flex align-center">
            <Button
              onClick={handleValidateFlow}
              className="w-auto mx-auto"
              icon={<PropertyIcon height={20} width={20} />}
            >
              {FLOWVALIDATION_CONSTANTS.VALIDATE_FLOW}
            </Button>
          </div>
        </div>
      )}
      <FlowContainerDetail>
        <div className="row">
          <div className="col-md-6 mb-4 pb-md-2">
            <LabelSelect>{FLOWVALIDATION_CONSTANTS.FLOW_INFO}</LabelSelect>
            <LabelSelectContent>Flow Info</LabelSelectContent>
          </div>
          <div className="col-md-6 mb-4 pb-md-2">
            <LabelSelect>
              {FLOWVALIDATION_CONSTANTS.INVALID_PROCESSOR_COUNT}
            </LabelSelect>
            <LabelSelectContent>0</LabelSelectContent>
          </div>
          <div className="col-md-6 mb-4 pb-md-2">
            <LabelSelect>
              {FLOWVALIDATION_CONSTANTS.REGISTRY_FLOW_INFO}
            </LabelSelect>
            <LabelSelectContent>Registry Flow Info</LabelSelectContent>
          </div>
          <div className="col-md-6 mb-4 pb-md-2">
            <LabelSelect>
              {FLOWVALIDATION_CONSTANTS.CURRENT_VERSION}
            </LabelSelect>
            <LabelSelectContent>3</LabelSelectContent>
          </div>
        </div>
        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 mb-4 pb-md-2">
            <LabelSelect>{FLOWVALIDATION_CONSTANTS.STATE}</LabelSelect>
            <LabelSelectContent>state</LabelSelectContent>
          </div>
        </div>

        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 mb-4 pb-md-2">
            <LabelSelect>Result</LabelSelect>
            <LabelSelectContent>
              Flow successfully reviewed, no rule violated from the selected
              rules. Please perform manual checks now.
            </LabelSelectContent>
          </div>
        </div>
      </FlowContainerDetail>
    </FlowcompareStyled>
  );
};

export default DiffModalFlowValidation;
