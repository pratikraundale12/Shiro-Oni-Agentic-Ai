import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, RadioField, SelectField } from '../../shared';
import { Table } from '../../components';
import styled from 'styled-components';
import { TodoIcon } from '../../assets';
import Breadcrumb from '../../shared/Breadcrumb';
import { SmallSearchIcon } from '../../assets';
import { theme } from '../../styles';

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

const handleNameClick = name => {
  console.log('Name clicked:', name);
  // Perform your navigation or other actions here
};

const handleKeyPress = (event, name) => {
  if (event.key === 'Enter' || event.key === ' ') {
    handleNameClick(name);
  }
};

const COLUMNS = [
  {
    label: 'Namespace',
    renderCell: item => (
      <div
        style={{ color: 'red', cursor: 'pointer' }}
        role="button"
        tabIndex="0"
        onClick={() => handleNameClick(item.name)}
        onKeyPress={event => handleKeyPress(event, item.name)}
      >
        {item.name}
      </div>
    ),
  },
  {
    label: 'Namespace ID',
    renderCell: item => <div>{item.id}</div>,
  },
  {
    label: 'Flow Name',
    renderCell: item => <div>{item.flowName}</div>,
  },
  {
    label: 'Bucket Name',
    renderCell: item => <div>{item.bucketName}</div>,
  },
  {
    label: 'Version',
    renderCell: item => <div>{item.version}</div>,
  },
  {
    label: '',
    renderCell: item => (
      <RadioField
        name="select"
        onChange={() => console.log('Changed', item.id)}
      />
    ),
    width: '10%',
  },
];

const DATA = [
  {
    id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
    name: 'Group 1',
    flowName: 'Flow Name',
    bucketName: 'Bucket Name',
    version: 'V1',
  },
  {
    id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
    name: 'Group 2',
    flowName: 'Flow Name',
    bucketName: 'Bucket Name',
    version: 'V1',
  },
  {
    id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
    name: 'Group 3',
    flowName: 'Flow Name',
    bucketName: 'Bucket Name',
    version: 'V1',
  },
  {
    id: 'ffb8931b-50eb-471d-a974-b6ad1254344f',
    name: 'Group 4',
    flowName: 'Flow Name',
    bucketName: 'Bucket Name',
    version: 'V1',
  },
];

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
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [search, setSearch] = useState('');

  const filteredData = DATA.filter(
    item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.flowName.toLowerCase().includes(search.toLowerCase()) ||
      item.bucketName.toLowerCase().includes(search.toLowerCase()) ||
      item.version.toLowerCase().includes(search.toLowerCase())
  );

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const onSubmit = data => {
    console.log('Form Data:', data);
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <SelectField
              name="selectOption"
              label="Select Cluster"
              control={control}
              options={options}
              errors={errors}
            />
          </form>
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
          <Breadcrumb
            breadcrumbs={breadcrumbData}
            onBreadcrumbClick={handleBreadcrumbClick}
          />
          <Table data={filteredData} columns={COLUMNS} />
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary">Back</Button>
          <Button onClick={handleSubmit(onSubmit)}>Deploy</Button>
        </BottomButtonDiv>
      </BottomButton>
    </Container>
  );
};

export default Deploy;
