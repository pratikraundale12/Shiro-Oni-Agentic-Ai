import React from 'react'; // ✅ Add useState
import styled from 'styled-components';
import { CompareIcon, TodoIcon } from '../../assets';
import { Table } from '../../components';
import { Button, SelectField } from '../../shared';
import Breadcrumb from '../../shared/Breadcrumb';

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
      renderCell: item => <div>{item.version}</div>,
      width: '20%',
    },
    {
      label: 'Name',
      renderCell: item => <div>{item.version}</div>,
      width: '20%',
    },
    {
      label: 'ID',
      renderCell: item => <div>{item.displayValue}</div>,
      width: '30%',
    },
    {
      label: 'Message',
      renderCell: item => <div>{item.comments}</div>,
      width: '30%',
    },
  ];
  // ✅ Dummy data for the table
  const DATA = [
    {
      version: 'Processor',
      displayValue: 'ID-001',
      comments: 'Updated validation logic',
    },
    {
      version: 'Task',
      displayValue: 'ID-002',
      comments: 'Removed unused parameters',
    },
    {
      version: 'Flow',
      displayValue: 'ID-003',
      comments: 'Added new branching condition',
    },
    {
      version: 'Processor',
      displayValue: 'ID-004',
      comments: 'Refactored error handler',
    },
  ];
  const versionOptions = [
    { label: 'V1', value: '1.0' },
    { label: 'V2', value: '2.0' },
    { label: 'V3', value: '3.0' },
    { label: 'V4', value: '4.0' },
  ];

  return (
    <div>
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
          <LabelSelect>Compare Versions</LabelSelect>
        </div>
        <div className="row align-items-center mb-4 mb-lg-5">
          <div className="col-md-3">
            <SelectField
              label="Select Version"
              name="select_version"
              icon={<CompareIcon />}
              placeholder="Select Version"
              options={versionOptions}
            />
          </div>
          <div className="col-md-3">
            <SelectField
              label="Select Version"
              name="select_version"
              icon={<CompareIcon />}
              placeholder="Select Version"
              options={versionOptions}
            />
          </div>
          <div className="col-md-auto pt-2">
            <Button>Compare</Button>
          </div>
        </div>
        <div className="row align-items-center  mb-4 mb-lg-5">
          <div className="col-md-3">
            <LabelSelect>Latest Author</LabelSelect>
            <LabelSelectContent>Anonymous</LabelSelectContent>
          </div>
          <div className="col-md-3">
            <LabelSelect>Last commit comments</LabelSelect>
            <LabelSelectContent>New Processor added</LabelSelectContent>
          </div>
          <div className="col-md-3">
            <LabelSelect>Compared version</LabelSelect>
            <LabelSelectContent>1 to 3</LabelSelectContent>
          </div>
          <div className="col-md-3">
            <Button className="w-auto">Compare</Button>
          </div>
        </div>
        <CompareDifferencesTitle className="mb-3">
          Differences
        </CompareDifferencesTitle>
        <Table columns={COLUMNS} data={DATA} />
      </FlowcompareStyled>
      <Button className="w-auto mt-2">Back</Button>
    </div>
  );
};

export default CompareValidation;
