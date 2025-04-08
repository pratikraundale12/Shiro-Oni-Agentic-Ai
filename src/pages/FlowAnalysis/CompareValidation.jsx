import { isEmpty } from 'lodash';
import React, { useEffect } from 'react'; // ✅ Add useState
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { CompareIcon, TodoIcon } from '../../assets';
import { FullPageLoader, Table } from '../../components';
import { FLOWVALIDATION_CONSTANTS } from '../../constants/flowValidation.constant';
import { history } from '../../helpers/history';
import { Button, SelectField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import { LoadingSelectors, NamespacesSelectors } from '../../store';
import {
  FlowValidationActions,
  FlowValidationSelectors,
} from '../../store/flowValidation';

const HeadingStyle = styled.h3`
  font-family: 'Nato Sans', sans-serif;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 14px;
`;
const FlowcompareStyled = styled.div`
  height: 100%;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid #e0d3d3;
  padding: 1rem;
  margin-top: 1rem;
  background: #fbfcff;
`;

const LabelSelectContent = styled.div`
  color: #7a7a7a;
  font-size: 18px;
  font-weight: 500;
`;
const CompareDifferencesTitle = styled.div`
  font-size: 20px;
  color: #444445;
  font-weight: 600;
`;

const CompareValidation = () => {
  const dispatch = useDispatch();
  const { control, watch } = useForm();
  const versionListData = useSelector(NamespacesSelectors.getVersionListData);
  const selectedItem = useSelector(FlowValidationSelectors.getselectedItem);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const versionOptions = Array.isArray(versionListData?.versionList)
    ? versionListData?.versionList?.map(version => ({
        label: String(version?.version),
        value: version?.version,
      }))
    : [];
  const compareResult = useSelector(FlowValidationSelectors.getCompareResult);
  const selectedVersionA = watch('select_version_A');
  const selectedVersionB = watch('select_version_B');
  const handleCompareFlow = () => {
    dispatch(
      FlowValidationActions.compareRules({
        clusterId: selectedCluster?.value,
        namespaceId: selectedItem?.id,
        data: {
          bucket_name: selectedItem?.bucketName,
          bucket_id: selectedItem?.bucketId,
          flow_name: selectedItem?.flowName,
          flow_id: selectedItem?.flowId,
          versionA: selectedVersionA,
          versionB: selectedVersionB,
        },
      })
    );
  };

  const path = [
    {
      label: 'Flow Analysis List',
      path: '/flow-analysis',
    },
    { label: 'Flow Comparison' },
  ];
  const COLUMNS = [
    {
      label: 'Type',
      renderCell: item => <div>{item?.componentType || 'N/A'}</div>,
      width: '20%',
    },
    {
      label: 'Name',
      renderCell: item => <div>{item.componentName || 'N/A'}</div>,
      width: '20%',
    },
    {
      label: 'ID',
      renderCell: item => <div>{item?.componentId || 'N/A'}</div>,
      width: '30%',
    },
    {
      label: 'Message',
      renderCell: item => <div>{item?.differenceTypeDescription || 'N/A'}</div>,
      width: '30%',
    },
  ];
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'compareRules')
  );
  useEffect(() => {
    dispatch(FlowValidationActions.compareRulesSuccess(null));
  }, [dispatch]);
  const handleBackClick = () => {
    history.push('/flow-analysis');
  };
  return (
    <div>
      <FullPageLoader loading={loading} />
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <TodoIcon width={22} height={24} />
            <HeadingStyle>Procress Group Details</HeadingStyle>
          </div>
        </div>
      </div>
      <Breadcrumb module="path" path={path} />
      <FlowcompareStyled>
        <div className="col-12">
          <LabelSelect>{FLOWVALIDATION_CONSTANTS.COMPARE_VERSION}</LabelSelect>
        </div>
        <div className="row align-items-center mb-4 mb-lg-5">
          <div className="col-md-3">
            <SelectField
              label={FLOWVALIDATION_CONSTANTS.SELECT_VERSION}
              name="select_version_A"
              icon={<CompareIcon />}
              placeholder={FLOWVALIDATION_CONSTANTS.SELECT_VERSION}
              options={versionOptions}
              control={control}
            />
          </div>
          <div className="col-md-3">
            <SelectField
              label={FLOWVALIDATION_CONSTANTS.SELECT_VERSION}
              name="select_version_B"
              icon={<CompareIcon />}
              placeholder={FLOWVALIDATION_CONSTANTS.SELECT_VERSION}
              options={versionOptions}
              control={control}
            />
          </div>
          <div className="col-md-auto pt-2 mt-3">
            <Button onClick={handleCompareFlow}>
              {FLOWVALIDATION_CONSTANTS.COMPARE}
            </Button>
          </div>
        </div>
        {!isEmpty(compareResult?.data) && (
          <>
            <div className="row align-items-center mb-4 mb-lg-5">
              <div className="col-md-3">
                <LabelSelect>
                  {FLOWVALIDATION_CONSTANTS.LATEST_AUTHOR}
                </LabelSelect>
                <LabelSelectContent>
                  {compareResult?.data?.latest_author || 'N/A'}
                </LabelSelectContent>
              </div>
              <div className="col-md-3">
                <LabelSelect>
                  {FLOWVALIDATION_CONSTANTS.LAST_COMMIT_COMMENT}
                </LabelSelect>
                <LabelSelectContent>
                  {compareResult?.data?.last_commit || 'N/A'}
                </LabelSelectContent>
              </div>
              <div className="col-md-3">
                <LabelSelect>
                  {FLOWVALIDATION_CONSTANTS.COMPARED_VERSION}
                </LabelSelect>
                <LabelSelectContent>
                  {compareResult?.data?.versionA || 'N/A'} to{' '}
                  {compareResult?.data?.versionB || 'N/A'}
                </LabelSelectContent>
              </div>
            </div>
            <CompareDifferencesTitle className="mb-3">
              {FLOWVALIDATION_CONSTANTS.DIFFERENCES}
            </CompareDifferencesTitle>
            <Table columns={COLUMNS} data={compareResult?.data?.changes} />
          </>
        )}
      </FlowcompareStyled>
      <Button
        className="w-auto mt-2"
        variant="secondary"
        onClick={handleBackClick}
      >
        {FLOWVALIDATION_CONSTANTS.BACK}
      </Button>
    </div>
  );
};

export default CompareValidation;
