import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, RadioField, SelectField } from '../../shared';
import { Table } from '../../components';
import styled from 'styled-components';
import { TodoIcon } from '../../assets';
import Breadcrumb from '../../shared/Breadcrumb';
import { SmallSearchIcon } from '../../assets';
import { theme } from '../../styles';
import { fetchGridData, useGlobalContext } from '../../utils';
import { checkCluster } from '../../utils/services';

const Container = styled.div`
  padding: 1.4rem;
  background-color: white !important;
`;

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

const handleKeyPress = event => {
  if (event.key === 'Enter' || event.key === ' ') {
    // handleName
  }
};

const breadcrumbData = [
  { id: '1', name: 'Namespace List' },
  { id: '2', name: 'Select Namespace' },
  { id: '3', name: 'Configuration Details' },
];

const handleBreadcrumbClick = breadcrumb => {
  console.log('Breadcrumb clicked:', breadcrumb);
};

const Deploy = () => {
  const {
    control,
    formState: { errors },
  } = useForm();
  const [search, setSearch] = useState('');
  const { state, setState } = useGlobalContext();
  const [selectedDestinationClusterId, setSelectedDestinationClusterId] =
    useState('');
  const [showDeployUI, setShowDeployUI] = useState(false);
  const navigate = useNavigate();

  console.log(selectedDestinationClusterId);

  useEffect(() => {
    handleSelectNamespace();
  }, [selectedDestinationClusterId]);

  const COLUMNS = [
    {
      label: 'Namespace',
      renderCell: item => (
        <div
          style={{ color: 'red', cursor: 'pointer' }}
          role="button"
          tabIndex="0"
          onClick={() => handleSelectNamespace(item.id)}
          onKeyPress={event => handleKeyPress(event, item.name)}
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
      renderCell: item => <div>{item?.flowName}</div>,
    },
    {
      label: 'Bucket Name',
      renderCell: item => <div>{item?.bucketName}</div>,
    },
    {
      label: 'Version',
      renderCell: item => <div>{item?.version}</div>,
    },
    {
      label: '',
      renderCell: item => (
        <RadioField
          name="select"
          onChange={() => console.log('Changed', item?.id)}
        />
      ),
      width: '10%',
    },
  ];

  function handleSelectNamespace(id) {
    setState(prev => ({
      ...prev,
      selectedNamespaceId: id,
      selectedPaths: [...prev.selectedPaths],
    }));
    fetchGridData({
      setState,
      module: 'deploy',
      selectedDestinationClusterId: selectedDestinationClusterId,
      selectedNamespaceId: id,
    });
  }

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
      // Implement the deploy functionality here
      console.log('Deploying with data:', state.deployData);
      // Navigate to the desired route after deploying
      navigate('/namespaces/upgrade', {
        state: {
          deployData: state.deployData,
          selectedClusterName: state.selectedClusterName,
          selectedClusterId: selectedDestinationClusterId,
        },
      });
    }
  };

  const handleBackClick = () => {
    navigate('/namespaces');
  };

  console.log({ selectedDestinationClusterId });
  const onClusterCheck = async e => {
    const selectedClusterId = e.value;
    setSelectedDestinationClusterId(e.value);
    const selectedClusterName = e.label;
    const ids = state?.selectedPaths.map(item => item?.flowId);

    try {
      const response = await checkCluster({
        clusterId: selectedClusterId,
        srcClusterId: state?.selectedSourceClusterId,
        path: ids,
      });

      if (response.mode === 'upgrade') {
        setState(prevState => ({
          ...prevState,
          selectedClusterId,
          upgradeData: response,
        }));
        navigate('/namespaces/upgrade', {
          state: {
            upgradeData: response,
            selectedClusterName,
            selectedClusterId,
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
    } catch (error) {
      console.error('Error checking cluster:', error);
    }
  };

  return (
    <Container>
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
              <Table data={state?.gridData?.deploy?.data} columns={COLUMNS} />
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
    </Container>
  );
};

export default Deploy;
