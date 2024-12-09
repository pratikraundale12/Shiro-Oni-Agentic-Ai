import React, { useEffect, useRef, useState } from 'react';
import { KDFM } from '../../constants';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import { QRIcons, TodoIcon } from '../../assets';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  Button,
  CheckboxField,
  InputField,
  RadioField,
  SelectField,
} from '../../shared';
import { FullPageLoader, Table } from '../../components';
import { history } from '../../helpers/history';
import { useDispatch, useSelector } from 'react-redux';
import {
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';

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
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: hidden;
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
  min-width: 4rem !important;
`;

const CustomTable = styled(Table)`
  overflow-y: auto;
  overflow-x: auto;
  max-height: 15rem;
  width: 100%;
`;

const breadcrumbData = [
  { label: 'Process Group List', path: '/process-group' },
  { label: 'Registry & Flow Name', path: '/process-group/DeployPage' },
];

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

  const formData = useSelector(NamespacesSelectors.getDeployFormData);
  const [keepParameter, setKeepParameter] = useState(false);
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
    .sort((a, b) => a.version - b.version);

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
            justifyContent: 'flex-end',
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
  };

  const handleRadioChange = item => {
    setSelectedVersion(item.version);
  };

  const selectedValuebucketId = watch('bucketId');
  const selectedValueFlowId = watch('flow_name');

  useEffect(() => {
    if (selectedValuebucketId) {
      dispatch(NamespacesActions.fetchFlowNameList(selectedValuebucketId));
    }
  }, [selectedValuebucketId]);

  useEffect(() => {
    if (selectedValueFlowId) {
      dispatch(
        NamespacesActions.fetchVerionData({
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
  };

  const handleContinue = () => {
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
      toast.error('Please select any version');
    }
  };
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchRegistryData')
  );
  const loadingFlow = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchFlowNameList')
  );
  const loadingVersion = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchVerionData')
  );
  //fetchRegistryFlowDetails
  return (
    <div>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
      <FullPageLoader loading={loading || loadingFlow || loadingVersion} />

      <TopTitleBar className=" d-flex  mb-3">
        <MainTitleDiv className="d-flex">
          <ImageContainer>
            <TodoIcon />
          </ImageContainer>
          <MainTitleHfour className="mb-0">
            {`${KDFM.DEPLOY} ${KDFM.NAMESPACE}`}
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
                  <div className="justify-content-between align-items-center">
                    <SelectField
                      label="Bucket"
                      name="bucketId"
                      icon={<QRIcons />}
                      title="Bucket"
                      errors={errors}
                      options={bucketListOptions || []}
                      placeholder="Select Bucket"
                      control={control}
                    />
                  </div>
                </div>
              </div>
            </RowConfig>

            <RowConfig>
              <div className="col-6 p-3 mb-">
                <SelectField
                  label="Flow Name"
                  name="flow_name"
                  icon={<QRIcons />}
                  options={flowListOptions || []}
                  errors={errors}
                  control={control}
                  placeholder="Select Flow"
                />
              </div>

              <div className="mt-3 col-6 p-3">
                <div className="mt-4">
                  <div className="mt-5 d-flex justify-content-between align-items-center">
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

            <VersionDiv>{KDFM.VERSION_CONTROL}</VersionDiv>
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
            <Button type="submit">{KDFM.CONTINUE}</Button>
          </BottomButtonDiv>
        </BottomButton>
      </form>
    </div>
  );
}
export default DeployPage;
