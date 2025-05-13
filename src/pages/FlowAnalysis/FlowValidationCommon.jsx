import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { NoDataIcon, PropertyIcon } from '../../assets';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { Button } from '../../shared';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';

// Common styled components
export const FlowContainerDetail = styled.div`
  padding: 0px;
`;

export const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 14px;
`;

export const LabelSelectContent = styled.div`
  color: #7a7a7a;
  font-size: 18px;
  font-weight: 500;
`;

export const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

export const FlowcompareStyled = styled.div`
  height: 700px;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid #e0d3d3;
  padding: 1rem;
  margin-top: 1rem;
  background: #fbfcff;
`;

export const ClickableId = styled.div`
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    opacity: 0.8;
  }
`;

export const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

// Common table columns configuration
export const getCommonColumns = handleIdClick => [
  {
    label: 'Name',
    renderCell: item => <div>{item?.version || 'N/A'}</div>,
    width: '30%',
  },
  {
    label: 'ID',
    renderCell: item => (
      <ClickableId
        onClick={e => {
          e.preventDefault();
          handleIdClick?.(item?.displayValue);
        }}
      >
        {item?.displayValue || 'N/A'}
      </ClickableId>
    ),
    width: '35%',
  },
  {
    label: 'Message',
    renderCell: item => <div>{item?.comments || 'N/A'}</div>,
    width: '35%',
  },
];

// Common validation form section
export const ValidationFormSection = ({
  control,
  formattedOptions,
  handleValidateFlow,
}) => (
  <div className="d-flex justify-start align-center mb-4">
    <div style={{ width: '80%' }}>
      <LabelSelect>
        {FLOWVALIDATION_CONSTANTS.SELECT_RULE_TO_VALIDATE}
      </LabelSelect>
      <MultiSelectField
        enableCheckboxes
        control={control}
        name="select_property"
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
);

ValidationFormSection.propTypes = {
  control: PropTypes.object.isRequired,
  formattedOptions: PropTypes.array.isRequired,
  handleValidateFlow: PropTypes.func.isRequired,
};

// Common flow info section
export const FlowInfoSection = ({ currentData }) => (
  <FlowContainerDetail>
    <div className="row">
      <div className="col-md-6 mb-4 pb-md-2">
        <LabelSelect>{FLOWVALIDATION_CONSTANTS.FLOW_INFO}</LabelSelect>
        <LabelSelectContent>
          {currentData?.lableBody?.flowInfo || 'N/A'}
        </LabelSelectContent>
      </div>
      <div className="col-md-6 mb-4 pb-md-2">
        <LabelSelect>
          {FLOWVALIDATION_CONSTANTS.INVALID_PROCESSOR_COUNT}
        </LabelSelect>
        <LabelSelectContent>
          {currentData?.lableBody?.InvalidCount || 'N/A'}
        </LabelSelectContent>
      </div>
      <div className="col-md-6 mb-4 pb-md-2">
        <LabelSelect>{FLOWVALIDATION_CONSTANTS.REGISTRY_FLOW_INFO}</LabelSelect>
        <LabelSelectContent>
          {currentData?.lableBody?.registryFlowInfo || 'N/A'}
        </LabelSelectContent>
      </div>
      <div className="col-md-6 mb-4 pb-md-2">
        <LabelSelect>{FLOWVALIDATION_CONSTANTS.CURRENT_VERSION}</LabelSelect>
        <LabelSelectContent>
          {currentData?.lableBody?.currentVersion || 'N/A'}
        </LabelSelectContent>
      </div>
    </div>
    <div className="row align-items-center justify-content-between">
      <div className="col-md-6 mb-4 pb-md-2">
        <LabelSelect>{FLOWVALIDATION_CONSTANTS.STATE}</LabelSelect>
        <LabelSelectContent>
          {currentData?.lableBody?.state || 'N/A'}
        </LabelSelectContent>
      </div>
    </div>
  </FlowContainerDetail>
);

FlowInfoSection.propTypes = {
  currentData: PropTypes.object,
};

// Common no data section
export const NoDataSection = () => (
  <div className="d-flex flex-column align-items-center mt-5">
    <NoDataIcon width={130} />
    <NoDataText>No Data Found!!</NoDataText>
  </div>
);

// Common success message section
export const SuccessMessageSection = () => (
  <div className="row align-items-center justify-content-between">
    <div className="col-md-6 mb-4 pb-md-2">
      <LabelSelect>Result</LabelSelect>
      <LabelSelectContent>
        Flow successfully reviewed, no rule violated from the selected rules.
        Please perform manual checks now.
      </LabelSelectContent>
    </div>
  </div>
);
