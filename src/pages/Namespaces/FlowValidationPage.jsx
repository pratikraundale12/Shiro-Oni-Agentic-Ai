import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { TodoIcon } from '../../assets';
import { FullPageLoader, Table } from '../../components';
import { KDFM } from '../../constants';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';
import { SchedularSelectors } from '../../store/schedular';
import {
  FlowcompareStyled,
  FlowInfoSection,
  getCommonColumns,
  NoDataSection,
  SuccessMessageSection,
  ValidationFormSection,
} from '../FlowAnalysis/FlowValidationCommon';
import Collapsible from './Collapsible';

const TopTitleBar = styled.div`
  height: 37px;
  align-items: center;
  justify-content: space-between !important;
`;
const MainTitleDiv = styled.div`
  gap: 10px;
  align-items: center;
`;
const MainTitleHfour = styled.h4`
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  color: #444445;
  text-transform: capitalize;
  @media screen and (max-width: 1400px) {
    font-size: 16px !important;
  }
`;
const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
  @media screen and (max-width: 1400px) {
    & svg {
      height: 20px;
    }
  }
`;

const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 5px 10px 0px 10px;
  border-radius: 20px;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;

const FlowValidationPage = () => {
  const dispatch = useDispatch();
  const isUpgrade = useSelector(NamespacesSelectors.getDeployRegistryFlow);
  const { control, watch } = useForm();
  const ruleScopes = useSelector(FlowValidationSelectors.getRuleScopes);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const selectedRules = watch('select_property') || [];
  const ruleIds = selectedRules.map(rule => rule.value);
  const validationResult = useSelector(
    FlowValidationSelectors.getDeploymentFlowValidation
  );
  const randomFlowValidationResult = useSelector(
    FlowValidationSelectors.getRandomFlowValidationResult
  );
  const currentData =
    validationResult?.data || randomFlowValidationResult?.data;
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
  const selectedNameSpace = useSelector(
    NamespacesSelectors.getSelectedNamespace
  );
  const formDataRegistry = useSelector(NamespacesSelectors.getDeployFormData);
  const scheduleDeploymentFlow = useSelector(
    NamespacesSelectors.getScheduleByRegistry
  );
  const scheduleUpgradeFromList = useSelector(
    SchedularSelectors.getScheduleFromList
  );
  const singleNameSpace = useSelector(NamespacesSelectors.getSelectedNamespace);
  const versionSelected = useSelector(NamespacesSelectors.getVersionSelect);
  const savedPayload = useSelector(FlowValidationSelectors.getSavedPayload);
  const selectedItem = useSelector(FlowValidationSelectors.getselectedItem);

  let type = '';
  if (versionSelected?.version > singleNameSpace?.version) {
    type = 'upgrade';
  } else {
    type = 'downgrade';
  }
  const formattedType =
    type.charAt(0).toUpperCase() + type.slice(1) + ' Process Group';

  useEffect(() => {
    dispatch(FlowValidationActions.ruleScopeFetch({}));
  }, [dispatch]);

  const breadcrumbDataOnDeploy = [
    {
      label: KDFM.NIFI_FLOW,
      path: '/process-group',
      callback: () => {
        dispatch(NamespacesActions.setSelectedNamespace({}));
      },
    },
    { label: 'Registry & Flow Name', path: '/process-group/deployPage' },
    { label: 'Flow Details', path: '/process-group/flow-details' },
    { label: 'Configuration Details', path: '/process-group/config-details' },
    { label: 'Flow Validation' },
  ];
  const breadcrumbDataOnUpgrade = [
    {
      label: KDFM.NIFI_FLOW,
      path: '/process-group',
      callback: () => {
        dispatch(NamespacesActions.setSelectedNamespace({}));
      },
    },
    { label: 'Flow Details', path: '/process-group/flow-details' },
    { label: 'Configuration Details', path: '/process-group/config-details' },
    { label: 'Flow Validation' },
  ];

  const bucketListData = useSelector(
    NamespacesSelectors.getBucketListDropDownData
  );
  const selectedBucketName = bucketListData?.bucketList?.filter(
    ele => ele?.id === versionSelected?.bucketId
  );

  const flowListData = useSelector(NamespacesSelectors.getFlowListRegistry);
  const selectedFlowName = flowListData?.flowsList?.filter(
    ele => ele?.flowId === versionSelected?.flowId
  );

  const handleValidateFlow = () => {
    dispatch(FlowValidationActions.validateRulesSuccess(null));
    dispatch(
      FlowValidationActions.validateDeploymentFlow({
        clusterId: selectedCluster?.value,
        data: {
          version: versionSelected?.version,
          flowId: singleNameSpace?.flowId || versionSelected?.flowId,
          bucketId: singleNameSpace?.bucketId || versionSelected?.bucketId,
          registryId:
            singleNameSpace?.registryId || versionSelected?.registriesId,
          namespaceId: singleNameSpace?.id,
          bucketName:
            singleNameSpace?.bucketName || selectedBucketName[0]?.name,
          flowName: singleNameSpace?.flowName || selectedFlowName[0]?.flowName,
          rulesForValidation: ruleIds,
        },
      })
    );

    dispatch(FlowValidationActions.addNewAnalysisModalOpen(false));
  };
  const formattedOptions = ruleScopes?.data?.length
    ? ruleScopes?.data?.map(rule => ({
        label: rule?.header,
        value: rule?.id,
      }))
    : [];
  const handleBackClick = () => {
    history.push('/process-group/config-details');
  };
  const handleContinue = () => {
    history.push('/process-group/summary');
  };
  const toggleCollapsible = index => {
    const updated = [...openSections];
    updated[index] = !updated[index];
    setOpenSections(updated);
  };
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'validateDeploymentFlow')
  );
  const isloading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'emailReport')
  );

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

  return (
    <div>
      <FullPageLoader loading={loading} />
      <FullPageLoader loading={isloading} />
      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {scheduleDeploymentFlow || scheduleUpgradeFromList
              ? 'Schedule '
              : ''}
            {!isUpgrade ? formattedType : KDFM.DEPLOY_NAMESPACE}
          </MainTitleHfour>{' '}
          :
          <MainTitleHfour className="mb-0">
            {!isUpgrade
              ? selectedNameSpace.label
              : formDataRegistry?.selectedFlowName}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb
          module="upgrade"
          path={!isUpgrade ? breadcrumbDataOnUpgrade : breadcrumbDataOnDeploy}
        />
      </BreadcrumbContainer>

      <GreyBoxNamespace className="w-100  mb-3">
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
                    <Table columns={getCommonColumns()} data={section?.data} />
                  </Collapsible>
                );
              })}
            </>
          )}
        </FlowcompareStyled>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary" onClick={handleBackClick}>
            {KDFM.BACK}
          </Button>
          <Button
            id="configuration-details-continue-btn"
            onClick={handleContinue}
          >
            {KDFM.CONTINUE}
          </Button>
          {validationResult?.data?.tableBody?.length > 0 && (
            <Button onClick={handleSendEmail}>
              {FLOWVALIDATION_CONSTANTS.SEND_EMAIL_REPORT}
            </Button>
          )}
        </BottomButtonDiv>
      </BottomButton>
    </div>
  );
};

export default FlowValidationPage;
