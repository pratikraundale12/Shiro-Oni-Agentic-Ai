import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import * as yup from 'yup';
import { DuplicateIcon, QRIcons, TodoIcon } from '../../assets';
import { FullPageLoader, Table } from '../../components';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import {
  Button,
  CheckboxField,
  InputField,
  Modal,
  RadioField,
  SelectField,
} from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';

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
const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;
const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 22px 19px;
  border-radius: 20px;
`;
const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 324px);
  max-height: calc(100vh - 324px);
  overflow-x: hidden;
  overflow-y: auto;
`;
const RowConfig = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-right: calc(-0.5 * 1.5rem);
  margin-left: calc(-0.5 * 1.5rem);
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const StyledInputField = styled(InputField)`
  input {
    &:disabled {
      background-color: #ebf0f7;
      border-color: #ccc;
    }
  }
`;
const VersionDiv = styled.div`
  margin-bottom: 1rem;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
`;

const StyledTableCell = styled.div`
  cursor: pointer;
  padding: 6px 12px !important;
  // min-width: 4rem !important;
  &.p-0 {
    padding: 0px !important;
  }
`;

const CustomTable = styled(Table)`
  overflow-y: auto;
  overflow-x: auto;
  max-height: 34vh;
  width: 100%;
  td {
    height: auto !important;
    .td-text-wrap {
      word-wrap: normal;
      white-space: normal;
    }
  }
`;
const BucketDiv = styled.div`
  label {
    margin-bottom: 0px;
  }
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;

const FlowDescription = styled.div`
  color: ${props => props.theme.colors.darker};
`;
const Icon = styled.div`
  align-items: center !important;
  justify-content: center !important;
  display: flex !important;
`;
const Para = styled.p`
  text-align: center;
  margin-bottom: 0 !important;
  margin-top: 0;
  margin-bottom: 1rem;
  box-sizing: border-box;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-end: 0px;
  font-size: 20px;
  font-weight: 600;
`;

function DeployPage() {
  const dispatch = useDispatch();
  const versionSelected = useSelector(NamespacesSelectors.getVersionSelect);
  const [selectedVersion, setSelectedVersion] = useState(
    versionSelected.version
  );
  const bucketListData = useSelector(
    NamespacesSelectors.getBucketListDropDownData
  );

  const flowListData = useSelector(NamespacesSelectors.getFlowListRegistry);
  const registryData = useSelector(state =>
    GridSelectors.getNamespaceGridRegistry(state, 'namespaces')
  );
  const versionListData = useSelector(NamespacesSelectors.getVersionListData);
  const [successTest, setSuccessTest] = useState(false);
  const [proceedWithDispatch, setProceedWithDispatch] = useState(false);
  const formData = useSelector(NamespacesSelectors.getDeployFormData);
  const [keepParameter, setKeepParameter] = useState(true);
  const scheduleDeploymentFlow = useSelector(
    NamespacesSelectors.getScheduleByRegistry
  );
  const tableRef = useRef(null);

  const handleScrollOnClick = () => {
    if (!tableRef?.current) return;
    if (isEmpty(versionSelected)) {
      tableRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  };
  const breadcrumbData = [
    {
      label: KDFM.NIFI_FLOW,
      path: '/process-group',
      callback: () => {
        dispatch(NamespacesActions.setSelectedNamespace({}));
      },
    },
    { label: 'Registry & Flow Name', path: '/process-group/DeployPage' },
  ];
  const bucketListOptions = bucketListData?.bucketList?.map(item => ({
    label: item?.name,
    value: item?.id,
  }));
  const flowListOptions = flowListData?.flowsList?.map(item => ({
    label: item?.flowName,
    value: item?.flowId,
  }));
  const registrySchema = yup.object().shape({
    bucketId: yup.string().required('Select Bucket'),
    flow_name: yup.string().required('Select Flow'),
  });
  const {
    control,
    watch,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(registrySchema),
  });

  const convertDate = dateString => {
    const date = new Date(dateString);

    const pad = num => String(num).padStart(2, '0');

    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };
  const sortedData = versionListData?.versionList
    ?.slice()
    .sort((a, b) => b.version - a.version);

  const COLUMNS = [
    {
      label: '',
      renderCell: item => (
        <StyledTableCell
          role="button"
          tabIndex="0"
          onClick={() => handleRowClick(item)}
          onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
          style={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <RadioField
            name="upgrade"
            checked={item.version === selectedVersion}
            onChange={() => {
              handleRadioChange(item);
            }}
          />
        </StyledTableCell>
      ),
      width: '10%',
    },
    {
      label: KDFM.VERSION,
      renderCell: item => (
        <StyledTableCell
          role="button"
          tabIndex="0"
          onClick={() => handleRowClick(item)}
          onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
        >
          {item.version}
        </StyledTableCell>
      ),
      width: '12%',
    },
    {
      label: KDFM.CREATED,
      renderCell: item => (
        <StyledTableCell
          role="button"
          tabIndex="0"
          className="p-0"
          onClick={() => handleRowClick(item)}
          onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
        >
          {convertDate(item.createdAt)}
        </StyledTableCell>
      ),
      width: '28%',
    },
    {
      label: KDFM.COMMENT,
      renderCell: item => (
        <StyledTableCell
          role="button"
          tabIndex="0"
          className="td-text-wrap p-0"
          onClick={() => handleRowClick(item)}
          onKeyDown={e => e.key === 'Enter' && handleRowClick(item)}
        >
          {item.comments}
        </StyledTableCell>
      ),
      width: '50%',
    },
  ];
  const handleRowClick = item => {
    setSelectedVersion(item.version);
    dispatch(NamespacesActions.setVersionSelect(item));
    if (item?.version !== selectedVersion) {
      dispatch(NamespacesActions.setCsLocalData({}));
      dispatch(NamespacesActions.setIsLocalCsConfigured(false));
      dispatch(NamespacesActions.setPcLocalData({}));
      dispatch(NamespacesActions.setVariableLocalData([]));
      dispatch(NamespacesActions.setIsLocalPcUpdated(false));
      dispatch(NamespacesActions.setIsLocalVariableUpdated(false));
      dispatch(NamespacesActions.setRegistryDeployControllerService({}));
      dispatch(NamespacesActions.setRegistryDeployParameterContext([]));
      dispatch(NamespacesActions.setRegistryDeployVariable([]));
      dispatch(NamespacesActions.setVersionListReduxData([]));
      dispatch(NamespacesActions.setAlreadyFetchedLsIdentifierForUpgrade([]));
      dispatch(NamespacesActions.setLocalServiceInUpgrade([]));
      dispatch(NamespacesActions.setUserStory(null));
      dispatch(NamespacesActions.setChangeRequest(null));
    }
  };

  const handleRadioChange = item => {
    setSelectedVersion(item.version);
    if (item?.version !== selectedVersion) {
      dispatch(NamespacesActions.setCsLocalData({}));
      dispatch(NamespacesActions.setIsLocalCsConfigured(false));
      dispatch(NamespacesActions.setPcLocalData({}));
      dispatch(NamespacesActions.setVariableLocalData([]));
      dispatch(NamespacesActions.setIsLocalPcUpdated(false));
      dispatch(NamespacesActions.setIsLocalVariableUpdated(false));
      dispatch(NamespacesActions.setRegistryDeployControllerService({}));
      dispatch(NamespacesActions.setRegistryDeployParameterContext([]));
      dispatch(NamespacesActions.setRegistryDeployVariable([]));
      dispatch(NamespacesActions.setVersionListReduxData([]));
      dispatch(NamespacesActions.setAlreadyFetchedLsIdentifierForUpgrade([]));
      dispatch(NamespacesActions.setLocalServiceInUpgrade([]));
      dispatch(NamespacesActions.setUserStory(null));
      dispatch(NamespacesActions.setChangeRequest(null));
    }
  };

  const selectedValuebucketId = watch('bucketId');
  const selectedValueFlowId = watch('flow_name');
  const selectedBucketObj = flowListData?.flowsList?.filter(
    ele => ele?.flowId === selectedValueFlowId
  );

  useEffect(() => {
    if (selectedValuebucketId) {
      dispatch(NamespacesActions.fetchFlowNameList(selectedValuebucketId));
    }
  }, [selectedValuebucketId]);

  useEffect(() => {
    if (selectedValueFlowId) {
      dispatch(
        NamespacesActions.fetchVersionData({
          bucketId: selectedValuebucketId,
          flowId: selectedValueFlowId,
        })
      );
    }
  }, [selectedValueFlowId]);

  useEffect(() => {
    if (isEmpty(bucketListOptions)) {
      dispatch(NamespacesActions.fetchRegistryData());
    }
  }, [dispatch]);

  const hasRunOnce = useRef(false);
  useEffect(() => {
    if (!isEmpty(formData) && !hasRunOnce.current) {
      setValue('bucketId', formData?.bucketId);
      setValue('flow_name', formData?.flow_name);
      hasRunOnce.current = true;
    }
  }, [formData, setValue]);

  const handleBackAction = () => {
    history.push('/process-group');
    dispatch(NamespacesActions.setSelectedNamespace({}));
  };
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, 'namespaces')
  );
  const flowIdList = gridData?.map(item => item?.flowId);
  const handleContinue = () => {
    if (isEmpty(versionSelected)) {
      toast.error('Please select the version');
    } else {
      const duplicateDeploy = flowIdList.includes(selectedValueFlowId);
      if (duplicateDeploy && !proceedWithDispatch) {
        setSuccessTest(true);
        return;
      } else {
        handleContinueWithSame();
      }
    }
  };
  const handleContinueWithSame = () => {
    if (!isEmpty(versionSelected)) {
      const flowname = flowListOptions?.filter(
        item => item.value === selectedValueFlowId
      );
      dispatch(
        NamespacesActions.setDeployFormData({
          bucketId: selectedValuebucketId,
          flow_name: selectedValueFlowId,
          selectedFlowName: flowname?.[0]?.label,
          keepParameters: keepParameter,
        })
      );
      dispatch(NamespacesActions.fetchRegistryFlowDetails(versionSelected));
      history.push('/process-group/flow-details');
    } else {
      toast.error('Please select the version');
    }
  };

  const onBucketChange = value => {
    dispatch(
      NamespacesActions.setDeployFormData({
        bucketId: value.value,
        flow_name: '',
        selectedFlowName: '',
        keepParameters: keepParameter,
      })
    );
    dispatch(NamespacesActions.setVersionSelect(''));
    setSelectedVersion('');
    dispatch(NamespacesActions.setVersionListData({}));
  };

  const onFlowNameChange = () => {
    dispatch(NamespacesActions.setVersionSelect(''));
    setSelectedVersion('');
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryData')
  );
  const loadingFlow = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchFlowNameList')
  );
  const loadingVersion = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchVersionData')
  );
  return (
    <div>
      <FullPageLoader loading={loading || loadingFlow || loadingVersion} />

      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {`${scheduleDeploymentFlow ? 'Schedule' : ''} ${KDFM.DEPLOY} ${KDFM.NAMESPACE}`}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex  mb-3">
        <Breadcrumb module="upgrade" path={breadcrumbData} />
      </BreadcrumbContainer>
      <form onSubmit={handleSubmit(handleContinue)}>
        <GreyBoxNamespace className="w-100  mb-3">
          <ScrollSetGrey className="scroll-set-grey pe-1">
            <RowConfig>
              <div className="col-6 p-3">
                <StyledInputField
                  name="registry"
                  type="text"
                  label="Registry"
                  value={registryData?.name || ''}
                  icon={<QRIcons />}
                  placeholder="Registry Name"
                  disabled
                  className="mb-0"
                />
              </div>
              <div className="col-6 p-3">
                <div>
                  <BucketDiv className="justify-content-between align-items-center">
                    <SelectField
                      label="Bucket"
                      name="bucketId"
                      icon={<QRIcons />}
                      title="Bucket"
                      errors={errors}
                      options={bucketListOptions || []}
                      placeholder="Select Bucket"
                      control={control}
                      onChange={onBucketChange}
                    />
                  </BucketDiv>
                </div>
              </div>
            </RowConfig>

            <RowConfig>
              <div className="col-6 p-3 mb-0">
                <SelectField
                  label="Flow Name"
                  name="flow_name"
                  icon={<QRIcons />}
                  options={flowListOptions || []}
                  errors={errors}
                  control={control}
                  placeholder="Select Flow"
                  onChange={onFlowNameChange}
                />
              </div>

              <div className="mt-3 col-6 p-3">
                <div className="mt-4 pt-2">
                  <div className="pt-1 d-flex justify-content-between align-items-center">
                    <CheckboxField
                      name="check"
                      label="Keep existing Parameter Contexts"
                      checked={keepParameter}
                      onChange={e => setKeepParameter(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </RowConfig>

            <RowConfig>
              <div className="col-6 p-3 mb-3">
                <LabelSelect>Flow Description</LabelSelect>
                <FlowDescription className="mt-2 fw-semibold">
                  {selectedBucketObj?.[0]?.description || 'N/A'}
                </FlowDescription>
              </div>
            </RowConfig>

            <VersionDiv ref={tableRef}>{KDFM.VERSION_CONTROL}</VersionDiv>
            <CustomTable data={sortedData || []} columns={COLUMNS} />
          </ScrollSetGrey>
        </GreyBoxNamespace>
        <BottomButton className="bottom-button-divs d-flex">
          <BottomButtonDiv className="btn-div d-flex">
            <Button
              variant="secondary"
              type="button"
              onClick={handleBackAction}
            >
              {KDFM.BACK}
            </Button>
            <Button type="submit" onClick={handleScrollOnClick}>
              {KDFM.CONTINUE}
            </Button>
          </BottomButtonDiv>
        </BottomButton>
      </form>
      {successTest && (
        <Modal
          title="Duplicate Processor Groups"
          isOpen={successTest}
          onRequestClose={() => {
            setSuccessTest(false);
            history.push('/process-group');
          }}
          size="sm"
          secondaryButtonText="Cancel"
          primaryButtonText="Continue"
          onSubmit={() => {
            setSuccessTest(false);
            setProceedWithDispatch(true);
            handleContinueWithSame();
          }}
        >
          <>
            <Icon>
              <DuplicateIcon />
            </Icon>
            <Para>
              Are you sure you want to deploy? This action will duplicate the
              processor groups. Please confirm to proceed?
            </Para>
          </>
        </Modal>
      )}
    </div>
  );
}
export default DeployPage;
