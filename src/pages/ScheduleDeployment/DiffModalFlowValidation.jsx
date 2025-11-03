import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, PropertyIcon } from '../../assets';
import { Table } from '../../components';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { Button, RadioSelectField } from '../../shared';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import Collapsible from '../Namespaces/Collapsible';

// Styled Components
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

const ClickableId = styled.div`
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    opacity: 0.8;
  }
`;

const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

// Reusable Components
const NoDataView = () => (
  <div className="d-flex flex-column align-items-center mt-5">
    <NoDataIcon width={130} />
    <NoDataText>No Data Found!!</NoDataText>
  </div>
);

const FlowInfoSection = ({ data }) => (
  <div className="row">
    <div className="col-md-6 mb-4 pb-md-2">
      <LabelSelect>{FLOWVALIDATION_CONSTANTS.FLOW_INFO}</LabelSelect>
      <LabelSelectContent>{data?.flowInfo || 'N/A'}</LabelSelectContent>
    </div>
    <div className="col-md-6 mb-4 pb-md-2">
      <LabelSelect>
        {FLOWVALIDATION_CONSTANTS.INVALID_PROCESSOR_COUNT}
      </LabelSelect>
      <LabelSelectContent>{data?.InvalidCount || 'N/A'}</LabelSelectContent>
    </div>
    <div className="col-md-6 mb-4 pb-md-2">
      <LabelSelect>{FLOWVALIDATION_CONSTANTS.REGISTRY_FLOW_INFO}</LabelSelect>
      <LabelSelectContent>{data?.registryFlowInfo || 'N/A'}</LabelSelectContent>
    </div>
    <div className="col-md-6 mb-4 pb-md-2">
      <LabelSelect>{FLOWVALIDATION_CONSTANTS.CURRENT_VERSION}</LabelSelect>
      <LabelSelectContent>{data?.currentVersion || 'N/A'}</LabelSelectContent>
    </div>
  </div>
);

FlowInfoSection.propTypes = {
  data: PropTypes.shape({
    flowInfo: PropTypes.string,
    InvalidCount: PropTypes.string,
    registryFlowInfo: PropTypes.string,
    currentVersion: PropTypes.string,
  }),
};

FlowInfoSection.defaultProps = {
  data: {},
};

const DiffModalFlowValidation = () => {
  const { control, watch, register } = useForm({
    defaultValues: {
      user_validation: 'user validation',
    },
  });

  const dispatch = useDispatch();
  const selectedValidation = watch('user_validation');
  const selectedRules = watch('select_property') || [];
  const ruleIds = selectedRules.map(rule => rule.value);

  // Selectors
  const ruleScopes = useSelector(FlowValidationSelectors.getRuleScopes);
  const selectedSchedule = useSelector(SchedularSelectors.getSelectedSchedule);
  const validationResult = useSelector(
    FlowValidationSelectors.getValidationResult
  );
  const details = useSelector(SchedularSelectors.getScheduleDeploymentDetails);

  const currentData = validationResult?.data;
  const reportvalidationDetails =
    details?.FlowAnalysisReport?.[0]?.report_json || {};

  // Effects
  useEffect(() => {
    dispatch(FlowValidationActions.ruleScopeFetch({}));
    dispatch(FlowValidationActions.validateRulesSuccess(null));
  }, [dispatch]);

  useEffect(() => {
    if (selectedValidation === 'user validation') {
      dispatch(
        SchedularActions.fetchScheduleDeploymentDetails(selectedSchedule?.id)
      );
    }
  }, [dispatch, selectedSchedule?.id, selectedValidation]);

  // Handlers
  const handleValidateFlow = () => {
    dispatch(
      FlowValidationActions.validateRules({
        clusterId: selectedSchedule?.cluster_id,
        namespaceId: selectedSchedule?.namespace_id,
        data: {
          generateVarList: false,
          rulesForValidation: ruleIds,
          scheduleId: selectedSchedule?.id,
        },
      })
    );
  };

  const handleIdClick = link => {
    window.open(link, '_blank');
  };

  // Table Configuration
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <div>{item?.version || 'N/A'}</div>,
      width: '30%',
    },
    {
      label: 'ID',
      renderCell: item => (
        <ClickableId onClick={() => handleIdClick(item?.link)}>
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

  // Data Processing
  const getTableBody = () => {
    if (selectedValidation === 'admin validation') {
      return validationResult?.data?.tableBody || [];
    }
    return details?.FlowAnalysisReport?.[0]?.report_json?.tableBody || [];
  };

  const tableBody = getTableBody();
  const sections = tableBody.map(section => ({
    title: section.label?.replace(/:$/, '') || 'Unknown Section',
    data: (section.values || []).map(value => ({
      version: value?.component_name,
      displayValue: value?.component_id,
      comments: value?.output_value,
      link: value?.link,
    })),
  }));

  const [openSections, setOpenSections] = useState(sections.map(() => false));
  const toggleCollapsible = index => {
    setOpenSections(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Render Helpers
  const renderValidationContent = data => {
    if (!data || Object.keys(data).length === 0) {
      return <NoDataView />;
    }

    return (
      <>
        <FlowContainerDetail>
          <FlowInfoSection data={data?.lableBody} />
          <div className="row align-items-center justify-content-between">
            <div className="col-md-6 mb-4 pb-md-2">
              <LabelSelect>{FLOWVALIDATION_CONSTANTS.STATE}</LabelSelect>
              <LabelSelectContent>
                {data?.lableBody?.state || 'N/A'}
              </LabelSelectContent>
            </div>
          </div>
          {!tableBody.length && (
            <div className="row align-items-center justify-content-between">
              <div className="col-md-6 mb-4 pb-md-2">
                <LabelSelect>Result</LabelSelect>
                <LabelSelectContent>
                  Flow successfully reviewed, no rule violated from the selected
                  rules. Please perform manual checks now.
                </LabelSelectContent>
              </div>
            </div>
          )}
        </FlowContainerDetail>

        {sections.map((section, index) => {
          if (!section?.data || section?.data?.length === 0) return null;
          return (
            <Collapsible
              key={index}
              title={section.title}
              isTableOpen={openSections[index]}
              toggleCollapsible={() => toggleCollapsible(index)}
              isAddBtnVisible={false}
            >
              <Table columns={COLUMNS} data={section?.data} />
            </Collapsible>
          );
        })}
      </>
    );
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
              options={
                ruleScopes?.data?.map(rule => ({
                  label: rule?.header,
                  value: rule?.id,
                })) || []
              }
            />
          </div>

          <div className="mt-4 ml-2 d-flex align-center">
            <Button
              onClick={handleValidateFlow}
              className="w-auto mx-auto"
              icon={<PropertyIcon height={20} width={20} />}
              type="button"
            >
              {FLOWVALIDATION_CONSTANTS.VALIDATE_FLOW}
            </Button>
          </div>
        </div>
      )}

      {selectedValidation === 'admin validation' &&
        renderValidationContent(currentData)}
      {selectedValidation === 'user validation' &&
        renderValidationContent(reportvalidationDetails)}
    </FlowcompareStyled>
  );
};

export default DiffModalFlowValidation;
