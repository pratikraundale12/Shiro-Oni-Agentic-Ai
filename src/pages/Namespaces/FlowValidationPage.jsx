import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { NoDataIcon, PropertyIcon, TodoIcon } from '../../assets';
import { FullPageLoader, Table } from '../../components';
import { KDFM } from '../../constants';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { history } from '../../helpers/history';
import { Button } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import MultiSelectField from '../../shared/FormInputs/components/MultiSelectField';
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
const FlowcompareStyled = styled.div`
  height: calc(100vh - 300px);
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
const ClickableId = styled.div`
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    opacity: 0.8;
  }
`;
const FlowContainerDetail = styled.div`
  padding: 0px;
`;
const LabelSelectContent = styled.div`
  color: #7a7a7a;
  font-size: 18px;
  font-weight: 500;
`;
const NoDataText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
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
  console.log(currentData, 'currentData');
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
  console.log(singleNameSpace, 'line 151');
  const versionSelected = useSelector(NamespacesSelectors.getVersionSelect);
  const savedPayload = useSelector(FlowValidationSelectors.getSavedPayload);
  const selectedItem = useSelector(FlowValidationSelectors.getselectedItem);
  console.log(versionSelected, 'line 153');
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
            // handleIdClick(item?.displayValue);
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
  console.log(selectedBucketName, 'selectedBucketName');

  const flowListData = useSelector(NamespacesSelectors.getFlowListRegistry);
  const selectedFlowName = flowListData?.flowsList?.filter(
    ele => ele?.flowId === versionSelected?.flowId
  );
  console.log(selectedFlowName, 'selectedBucketObj');

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
    console.log('handleBackClick');
    history.push('/process-group/config-details');
  };
  const handleContinue = () => {
    console.log('handleContinue');
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
                {!validationResult?.data?.tableBody?.length > 0 && (
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-6 mb-4 pb-md-2">
                      <LabelSelect>Result</LabelSelect>
                      <LabelSelectContent>
                        Flow successfully reviewed, no rule violated from the
                        selected rules. Please perform manual checks now.
                      </LabelSelectContent>
                    </div>
                  </div>
                )}
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
