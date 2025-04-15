import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, TodoIcon } from '../../assets';
import { FullPageLoader, Table } from '../../components';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';
import {
  GridSelectors,
  LoadingSelectors,
  NamespacesSelectors,
} from '../../store';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
import Collapsible from '../Namespaces/Collapsible';

const FlowContainerDetail = styled.div`
  padding: 0px;
`;

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 14px;
`;

const LabelSelectContent = styled.div`
  color: #7a7a7a;
  font-size: 18px;
  font-weight: 500;
`;

const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const FlowcompareStyled = styled.div`
  height: 700px;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid #e0d3d3;
  padding: 1rem;
  margin-top: 1rem;
  background: #fbfcff;
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

const FlowValidationDetails = () => {
  const { control, watch } = useForm();
  const dispatch = useDispatch();
  const ruleScopes = useSelector(FlowValidationSelectors.getRuleScopes);
  const selectedItem = useSelector(FlowValidationSelectors.getselectedItem);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const savedPayload = useSelector(FlowValidationSelectors.getSavedPayload);
  const selectedRules = watch('select_property') || [];
  const ruleIds = selectedRules.map(rule => rule.value);
  const validationResult = useSelector(
    FlowValidationSelectors.getValidationResult
  );
  const randomFlowValidationResult = useSelector(
    FlowValidationSelectors.getRandomFlowValidationResult
  );
  const getNifiUrl = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );

  const formattedOptions = ruleScopes?.data?.length
    ? ruleScopes?.data?.map(rule => ({
        label: rule?.header,
        value: rule?.id,
      }))
    : [];

  const handleValidateFlow = () => {
    dispatch(FlowValidationActions.validateRulesSuccess(null));
    dispatch(
      FlowValidationActions.validateRules({
        clusterId: selectedCluster?.value,
        namespaceId: selectedItem?.id || savedPayload?.namespaceId,
        data: {
          generateVarList: false,
          rulesForValidation: ruleIds,
        },
      })
    );

    dispatch(FlowValidationActions.addNewAnalysisModalOpen(false));
  };

  const path = [
    {
      label: 'Flow Analysis List',
      path: '/flow-analysis',
    },
    { label: 'Flow Validation' },
  ];

  useEffect(() => {
    dispatch(FlowValidationActions.ruleScopeFetch({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(FlowValidationActions.validateRulesSuccess(null));
  }, [dispatch]);

  const COLUMNS = [
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
            handleIdClick(item?.displayValue);
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

  const tableBody =
    validationResult?.data?.tableBody ||
    randomFlowValidationResult?.data?.tableBody ||
    [];

  const sections = tableBody.map(section => ({
    title: section.label?.replace(/:$/, '') || 'Unknown Section',
    data: (section.values || []).map(value => ({
      version: value?.component_name,
      displayValue: value?.component_id,
      comments: value?.output_value,
    })),
  }));

  const [openSections, setOpenSections] = useState(sections.map(() => false));

  const toggleCollapsible = index => {
    const updated = [...openSections];
    updated[index] = !updated[index];
    setOpenSections(updated);
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'validateRules')
  );
  const isloading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'emailReport')
  );

  const handleBackClick = () => {
    history.push('/flow-analysis');
  };
  const handleSendEmail = () => {
    const payload = {
      namespaceName:
        selectedItem?.name || validationResult?.data?.namespaceName,
      namespaceId: selectedItem?.id || savedPayload?.namespaceId,
      clusterId: selectedCluster?.value,
      rulesForValidation: ruleIds,
    };

    dispatch(FlowValidationActions.emailReport(payload));
  };

  const currentData =
    validationResult?.data || randomFlowValidationResult?.data;

  const handleIdClick = id => {
    const updatedUrl = getNifiUrl?.nifiUrl?.endsWith('/nifi')
      ? `${getNifiUrl?.nifiUrl}?processGroupId=${selectedItem?.id}&componentId=${id}`
      : `${getNifiUrl?.nifiUrl}/nifi?processGroupId=${selectedItem?.id}&componentId=${id}`;
    window.open(updatedUrl, '_blank');
    if (updatedUrl) {
      window.open(updatedUrl, '_blank');
    }
  };

  return (
    <div>
      <FullPageLoader loading={loading} />
      <FullPageLoader loading={isloading} />
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <TodoIcon width={22} height={24} />
            <HeadingStyle>
              {FLOWVALIDATION_CONSTANTS.PROCESS_GROUP_DETAILS} :{' '}
              {selectedItem?.name}
            </HeadingStyle>
          </div>
        </div>
      </div>
      <Breadcrumb module="path" path={path} />
      <FlowcompareStyled>
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
            <Button onClick={handleValidateFlow} className="w-auto mx-auto">
              {FLOWVALIDATION_CONSTANTS.VALIDATE_FLOW}
            </Button>
          </div>
        </div>

        {!currentData || Object.keys(currentData).length === 0 ? (
          <div className="d-flex flex-column align-items-center mt-5">
            <NoDataIcon width={130} />
            <NoDataText>No Data Found!!</NoDataText>
          </div>
        ) : (
          <>
            <FlowContainerDetail>
              <div className="row">
                <div className="col-md-6 mb-4 pb-md-2">
                  <LabelSelect>
                    {FLOWVALIDATION_CONSTANTS.FLOW_INFO}
                  </LabelSelect>
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
                  <LabelSelect>
                    {FLOWVALIDATION_CONSTANTS.REGISTRY_FLOW_INFO}
                  </LabelSelect>
                  <LabelSelectContent>
                    {currentData?.lableBody?.registryFlowInfo || 'N/A'}
                  </LabelSelectContent>
                </div>
                <div className="col-md-6 mb-4 pb-md-2">
                  <LabelSelect>
                    {FLOWVALIDATION_CONSTANTS.CURRENT_VERSION}
                  </LabelSelect>
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

            {sections.map((section, index) => {
              if (!section.data || section.data.length === 0) return null;
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
        )}
      </FlowcompareStyled>

      <div className="d-flex">
        <Button
          className="w-auto mt-2 mr-2"
          variant="secondary"
          onClick={handleBackClick}
        >
          {FLOWVALIDATION_CONSTANTS.BACK}
        </Button>
        <div className="col-md-auto mb-4 mt-2">
          {validationResult?.data && (
            <Button onClick={handleSendEmail}>
              {FLOWVALIDATION_CONSTANTS.SEND_EMAIL_REPORT}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

FlowValidationDetails.propTypes = {
  selectedItem: PropTypes.object,
};

export default FlowValidationDetails;
