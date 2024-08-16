/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  ClusterIcon,
  QRIcons,
  SmallSearchIcon,
  TodoIcon,
  WhiteBoradIcon,
} from '../../assets';
import {
  ClusterSelect,
  FullPageLoader,
  Table,
  TextRender,
} from '../../components';
import { CLUSTERS_TOKEN, KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, RadioField, SelectField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';
import {
  ClustersActions,
  ClustersSelectors,
  GridActions,
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';

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
  overflow-y: auto;
`;

const SearchContainer = styled.div`
  position: relative;
  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
  }
`;

const Search = styled.input`
  width: 100%;
  border-radius: 2px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.white};
  &:focus-visible {
    outline: none;
  }
`;

const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;

const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  margin-top: 15%;
`;

const NoDataText = styled.div`
  margin-top: 10px;
  font-size: 30px;
  color: #666;
`;

const handleKeyPress = event => {
  console.log(event);
};

const breadcrumbData = [
  { label: KDFM.NAMESPACE_LIST, path: '/namespaces' },
  { label: KDFM.SELECT_NAMESPACE, path: '/namespaces/deploy' },
];

const MODULE = 'destNamespaces';

const Deploy = () => {
  const dispatch = useDispatch();
  const selectedDestCluster = useSelector(
    NamespacesSelectors.getSelectedDestCluster
  );
  const selectedDestNamespace = useSelector(
    NamespacesSelectors.getSelectedDestNamespace
  );
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkDestCluster')
  );
  const tokens = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const tokenIds = tokens.map(item => item.id);
  const clusters = useSelector(ClustersSelectors.getClusters);
  const filteredClusters = clusters.filter(
    item => !tokenIds.includes(item.value)
  );
  const checkDestCluster = useSelector(NamespacesSelectors.getCheckDestCluster);
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, MODULE)
  );
  const formData = useSelector(NamespacesSelectors.getFormData);
  const {
    control,
    formState: { errors },
  } = useForm();
  const [search, setSearch] = useState('');
  const { state, setState } = useGlobalContext();
  const [showDeployUI, setShowDeployUI] = useState(false);

  const location = useLocation();

  const handleBreadcrumbClick = breadcrumb => {
    history.push(breadcrumb.path);
  };
  const COLUMNS = [
    {
      label: KDFM.NAMESPACE,
      renderCell: item => (
        <div
          style={{
            color: '#FF7A00',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          role="button"
          tabIndex="0"
          onClick={() => handleSelectNamespace(item)}
          onKeyDown={event => handleKeyPress(event, item.name)}
        >
          {item?.name}
        </div>
      ),
    },
    {
      label: KDFM.NAMESPACE_ID,
      renderCell: item => <TextRender text={item.id} />,
      width: '26%',
    },
    {
      label: KDFM.FLOW_NAME,
      renderCell: item => <TextRender text={item?.flowName || 'N/A'} />,
    },
    {
      label: KDFM.BUCKET_NAME,
      renderCell: item => <TextRender text={item?.bucketName || 'N/A'} />,
    },
    {
      label: KDFM.VERSION,
      renderCell: item => <TextRender text={item?.version || 'N/A'} />,
    },
    {
      label: '',
      renderCell: item => {
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <RadioField
              defaultChecked={formData.namespaceId}
              onChange={() =>
                dispatch(NamespacesActions.setNamespaceId(item.id))
              }
            />
          </div>
        );
      },
      width: '10%',
    },
  ];

  function handleSelectNamespace(item) {
    dispatch(
      NamespacesActions.setSelectedDestNamespace({
        label: item.name,
        value: item.id,
      })
    );
  }

  const handleClick = () => {
    history.push('/namespaces/upgrade');
  };
  const handleBackClick = () => {
    history.push('/namespaces');
  };

  const onClusterCheck = value => {
    dispatch(NamespacesActions.checkDestCluster());
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
  }, [dispatch]);

  useEffect(() => {
    if (
      !isEmpty(checkDestCluster) &&
      checkDestCluster.mode === 'deploy' &&
      !isEmpty(selectedDestCluster)
    ) {
      dispatch(GridActions.fetchGrid({ module: MODULE }));
    }
  }, [dispatch, checkDestCluster, selectedDestCluster, selectedDestNamespace]);

  if (checkDestCluster.mode === 'upgrade') history.push('/namespaces/upgrade');

  return (
    <div>
      <FullPageLoader loading={loading} />
      <TopTitleBar className="d-flex mb-3">
        <MainTitleDiv className="d-flex">
          <div>
            <TodoIcon />
          </div>
          <MainTitleHfour className="mb-0">
            {KDFM.DEPLOY_NAMESPACE}
          </MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex mb-3">
        <Breadcrumb module="deploy" path={breadcrumbData} />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100 mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <ClusterSelect
            label={KDFM.SELECT_CLUSTER}
            icon={<QRIcons />}
            placeholder={KDFM.SELECT_CLUSTER}
            isDestination
            onChange={onClusterCheck}
            required
            // disabled={isObject(clusterLogin)}
          />
          {/* <SelectField
            name="selectOption"
            label="Select Cluster"
            options={clusters}
            defaultValue={
              checkDestCluster.mode === 'deploy'
                ? {
                    label: selectedDestCluster?.label,
                    value: selectedDestCluster?.value,
                  }
                : null
            }
            onChange={onClusterCheck}
            icon={<QRIcons />}
          /> */}
          {isEmpty(checkDestCluster) && (
            <NoDataContainer>
              <WhiteBoradIcon width={200} height={195} />
              <NoDataText>{KDFM.NO_DATA_FOUND}</NoDataText>
            </NoDataContainer>
          )}
          {checkDestCluster.mode === 'deploy' && (
            <>
              <SearchContainer>
                <SmallSearchIcon
                  width={18}
                  height={18}
                  color={theme.colors.darkGrey1}
                />
                <Search
                  type="search"
                  value={search}
                  placeholder={KDFM.SELECT_NAMESPACE_FLOW_BUCKET_NAME}
                  onChange={e => setSearch(e.target.value)}
                />
              </SearchContainer>
              <Breadcrumb module={MODULE} />
              <Table
                data={gridData}
                columns={COLUMNS}
                breadcrumb={state?.gridData?.deploy?.breadcrumb}
                onBreadcrumbClick={e => handleSelectNamespace(e.id)}
              />
            </>
          )}
        </ScrollSetGrey>
      </GreyBoxNamespace>
      {checkDestCluster.mode === 'deploy' && (
        <BottomButton className="bottom-button-divs d-flex">
          <BottomButtonDiv className="btn-div d-flex">
            <Button variant="secondary" onClick={handleBackClick}>
              {KDFM.BACK}
            </Button>
            <Button onClick={handleClick}>{KDFM.DEPLOY}</Button>
          </BottomButtonDiv>
        </BottomButton>
      )}
    </div>
  );
};

export default Deploy;
