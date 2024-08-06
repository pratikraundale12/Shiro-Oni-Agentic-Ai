import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, RadioField, SelectField } from '../../shared';
import { FullPageLoader, Table } from '../../components';
import styled from 'styled-components';
import { TodoIcon, WhiteBoradIcon } from '../../assets';
import Breadcrumb from '../../shared/Breadcrumb';
import { SmallSearchIcon } from '../../assets';
import { theme } from '../../styles';
import { fetchGridData, useGlobalContext } from '../../utils';
import { checkCluster } from '../../utils/services';

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
  { id: '1', name: 'Namespace List', path: '/namespaces' },
  { id: '2', name: 'Select Namespace', path: '/namespaces/deploy' },
];

const Deploy = () => {
  const {
    control,
    formState: { errors },
  } = useForm();
  const [search, setSearch] = useState('');
  const { state, setState } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [showDeployUI, setShowDeployUI] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    handleSelectNamespace();
  }, [state.selectedDestinationClusterId]);

  const location = useLocation();

  const handleBreadcrumbClick = breadcrumb => {
    navigate(breadcrumb.path);
  };
  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => (
        <div
          style={{ color: '#C52B2B', cursor: 'pointer' }}
          role="button"
          tabIndex="0"
          onClick={() => handleSelectNamespace(item.id)}
          onKeyDown={event => handleKeyPress(event, item.name)}
        >
          {item?.name}
        </div>
      ),
    },
    {
      label: 'Namespace ID',
      renderCell: item => <div>{item?.id}</div>,
    },
    {
      label: 'Flow Name',
      renderCell: item => <div>{item?.flowName || 'N/A'}</div>,
    },
    {
      label: 'Bucket Name',
      renderCell: item => <div>{item?.bucketName || 'N/A'}</div>,
    },
    {
      label: 'Version',
      renderCell: item => <div>{item?.version || 'N/A'}</div>,
    },
    {
      label: '',
      renderCell: item => (
        <RadioField
          name="select"
          onChange={() => handleNamespaceSelect(item)}
        />
      ),
      width: '10%',
    },
  ];

  const handleNamespaceSelect = item => {
    setState(prevState => ({
      ...prevState,
      deployNamespaceId: item,
    }));
  };

  function handleSelectNamespace(id) {
    setState(prev => ({
      ...prev,
      selectedNamespaceId: id,
    }));
    fetchGridData({
      setState,
      module: 'deploy',
      selectedDestinationClusterId: state.selectedDestinationClusterId,
      selectedNamespaceId: id,
    });
  }

  useEffect(() => {
    fetchGridData({
      setState,
      module: 'deploy',
      search: search,
      ...(state.selectedDestinationClusterId && {
        selectedDestinationClusterId: state.selectedDestinationClusterId,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setState, search]);

  useEffect(() => {
    fetchGridData({
      setState,
      module: 'clusters',
    });
  }, [setState]);

  const options = state.clusterList
    .filter(cluster => cluster?.id !== state.selectedSourceClusterId)
    .map(cluster => ({
      value: cluster?.id,
      label: cluster?.name,
    }));

  const handleClick = () => {
    if (state.deployData) {
      navigate('/namespaces/upgrade');
    }
  };
  const handleBackClick = () => {
    navigate('/namespaces');
  };

  const onClusterCheck = async e => {
    setLoading(true);
    const selectedClusterId = e.value;
    setState(prevState => ({
      ...prevState,
      selectedDestinationClusterId: e.value,
    }));
    const selectedClusterName = e.label;
    let ids = [];
    for (const a of state.tempNamespacesData) {
      if (location.state.id === a.id) {
        ids.push(a.flowId);
      }
    }

    for (const a of state.gridData.namespaces.breadcrumb) {
      for (const b of state.tempNamespacesData) {
        if (a.id === b.id) {
          ids.push(b.flowId);
        }
      }
    }
    const arrayWithoutNullsAndUndefineds = ids.filter(item => item != null);

    try {
      const response = await checkCluster({
        clusterId: selectedClusterId,
        srcClusterId: state?.selectedSourceClusterId,
        path: arrayWithoutNullsAndUndefineds,
      });

      if (response.mode === 'upgrade') {
        setState(prevState => ({
          ...prevState,
          selectedClusterId,
          upgradeData: response,
          selectedClusterName,
        }));
        navigate('/namespaces/upgrade', {
          state: {
            upgradeData: response,
            // selectedClusterName,
            // selectedClusterId,
          },
        });
      } else if (response.mode === 'deploy') {
        setState(prevState => ({
          ...prevState,
          selectedClusterId,
          deployData: response,
          selectedClusterName,
        }));
        setShowDeployUI(true);
      } else {
        setShowDeployUI(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking cluster:', error);
    }
  };

  return (
    <div>
      <FullPageLoader loading={loading} />
      <TopTitleBar className="d-flex mb-3">
        <MainTitleDiv className="d-flex">
          <div>
            <TodoIcon />
          </div>
          <MainTitleHfour className="mb-0">Deploy Namespace</MainTitleHfour>
        </MainTitleDiv>
      </TopTitleBar>
      <BreadcrumbContainer className="d-flex mb-3">
        <Breadcrumb
          breadcrumbs={breadcrumbData}
          onBreadcrumbClick={handleBreadcrumbClick}
        />
      </BreadcrumbContainer>
      <GreyBoxNamespace className="w-100 mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <form>
            <SelectField
              name="selectOption"
              label="Select Cluster"
              control={control}
              options={options}
              errors={errors}
              onChange={onClusterCheck}
            />
          </form>
          {!showDeployUI && (
            <NoDataContainer>
              <WhiteBoradIcon width={200} height={195} />
              <NoDataText>No data found</NoDataText>
            </NoDataContainer>
          )}
          {showDeployUI && (
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
                  placeholder="Search Namespace, Flow Name, Bucket Name, Version"
                  onChange={e => setSearch(e.target.value)}
                />
              </SearchContainer>
              <Table
                data={state?.gridData?.deploy?.data}
                columns={COLUMNS}
                breadcrumb={state?.gridData?.deploy?.breadcrumb}
                onBreadcrumbClick={e => handleSelectNamespace(e.id)}
              />
            </>
          )}
        </ScrollSetGrey>
      </GreyBoxNamespace>
      {showDeployUI && (
        <BottomButton className="bottom-button-divs d-flex">
          <BottomButtonDiv className="btn-div d-flex">
            <Button variant="secondary" onClick={handleBackClick}>
              Back
            </Button>
            <Button onClick={handleClick}>Deploy</Button>
          </BottomButtonDiv>
        </BottomButton>
      )}
    </div>
  );
};

export default Deploy;
