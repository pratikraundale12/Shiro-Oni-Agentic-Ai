import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { TodoIcon } from '../../assets';
import { FullPageLoader, Table } from '../../components';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
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
import {
  FlowcompareStyled,
  FlowInfoSection,
  getCommonColumns,
  HeadingStyle,
  NoDataSection,
  SuccessMessageSection,
  ValidationFormSection,
} from './FlowValidationCommon';

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
        <ValidationFormSection
          control={control}
          formattedOptions={formattedOptions}
          handleValidateFlow={handleValidateFlow}
        />

        {!currentData || Object.keys(currentData).length === 0 ? (
          <NoDataSection />
        ) : (
          <>
            <FlowInfoSection currentData={currentData} />
            {!validationResult?.data?.tableBody?.length > 0 && (
              <SuccessMessageSection />
            )}

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
                  <Table
                    columns={getCommonColumns(handleIdClick)}
                    data={section?.data}
                  />
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
          {validationResult?.data?.tableBody?.length > 0 && (
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
