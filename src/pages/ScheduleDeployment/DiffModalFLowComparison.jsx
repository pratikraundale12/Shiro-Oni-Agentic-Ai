import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { CompareIcon } from '../../assets';
import { CompareValidationIcon } from '../../assets/Icons/CompareValidationIcon';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { Button, RadioSelectField, SelectField } from '../../shared';
import { NamespacesSelectors } from '../../store';
import { SchedularSelectors } from '../../store/schedular';

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
const LabelRequiredContent = styled.div`
  color: #ce0303;
  margin-left: 3px;
`;
const LabelSelectContent = styled.div`
  color: #7a7a7a;
  font-size: 18px;
  font-weight: 500;
`;

const DiffModalFLowComparison = () => {
  const { control, watch, register } = useForm({
    defaultValues: {
      user_validation: 'user validation',
    },
  });
  const selectedValidation = watch('user_validation');
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  console.log(selectedSchedule, 'selectedSchedule');
  const versionListData = useSelector(NamespacesSelectors.getVersionListData);
  const versionOptions = Array.isArray(versionListData?.versionList)
    ? versionListData?.versionList?.map(version => ({
        label: String(version?.version),
        value: version?.version,
      }))
    : [];
  const selectedVersionA = watch('select_version_A');
  const selectedVersionB = watch('select_version_B');

  const getFilteredOptions = (currentValue, otherValue) => {
    return versionOptions.filter(
      option => !otherValue || option.value !== otherValue
    );
  };
  return (
    <FlowcompareStyled>
      <RadioSelectField
        name="user_validation"
        options={[
          { label: 'User Validation', value: 'user validation' },
          { label: 'Admin Validation', value: 'admin validation' },
        ]}
        register={register}
      />
      {selectedValidation === 'admin validation' && (
        <div>
          <div className="col-12 d-flex">
            <LabelSelect>
              {FLOWVALIDATION_CONSTANTS.COMPARE_VERSION}
            </LabelSelect>
            <LabelRequiredContent>*</LabelRequiredContent>
          </div>
          <div className="row align-items-center mb-4 mb-lg-5">
            <div className="col-md-3">
              <SelectField
                name="select_version_A"
                icon={<CompareIcon />}
                placeholder={FLOWVALIDATION_CONSTANTS.SELECT_VERSION}
                options={getFilteredOptions(selectedVersionA, selectedVersionB)}
                control={control}
                sortAlphabetically={false}
              />
            </div>
            <div className="col-md-3">
              <SelectField
                name="select_version_B"
                icon={<CompareIcon />}
                placeholder={FLOWVALIDATION_CONSTANTS.SELECT_VERSION}
                options={getFilteredOptions(selectedVersionB, selectedVersionA)}
                control={control}
                sortAlphabetically={false}
              />
            </div>
            <div className="col-md-auto">
              <Button
                // onClick={handleCompareFlow}
                disabled={!selectedVersionA || !selectedVersionB}
                icon={
                  <CompareValidationIcon
                    width="18px"
                    height="18px"
                    color="#fff"
                  />
                }
              >
                {FLOWVALIDATION_CONSTANTS.COMPARE}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="row align-items-center mb-4 mb-lg-5">
        <div className="col-md-3">
          <LabelSelect>{FLOWVALIDATION_CONSTANTS.LATEST_AUTHOR}</LabelSelect>
          <LabelSelectContent>Naman</LabelSelectContent>
        </div>
        <div className="col-md-3">
          <LabelSelect>
            {FLOWVALIDATION_CONSTANTS.LAST_COMMIT_COMMENT}
          </LabelSelect>
          <LabelSelectContent>shukla</LabelSelectContent>
        </div>
        <div className="col-md-3">
          <LabelSelect>{FLOWVALIDATION_CONSTANTS.COMPARED_VERSION}</LabelSelect>
          <LabelSelectContent>1 to 2</LabelSelectContent>
        </div>
      </div>
    </FlowcompareStyled>
  );
};

export default DiffModalFLowComparison;
