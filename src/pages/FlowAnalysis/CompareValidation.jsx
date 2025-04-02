import React, { useState } from 'react'; // ✅ Add useState
import styled from 'styled-components';
import { CompareFlowIcon, CompareIcon } from '../../../assets';
import { Table } from '../../../components';
import { Button, SelectField } from '../../../shared';

const CompareConteinter = styled.div`
  min-height: 58vh;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  margin-bottom: 14px;
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
  const [isCompared, setIsCompared] = useState(false); // ✅ ADD STATE

  return (
    <CompareConteinter>
      {!isCompared && ( // ✅ Show first block when false
        <div>
          <div className="text-center py-4">
            <CompareFlowIcon />
          </div>

          <div className="row justify-content-center col-md-4 mx-auto">
            <div className="col-12">
              <LabelSelect>Compare Versions</LabelSelect>
            </div>
            <div className="col-6">
              <SelectField
                label="Select Version"
                name="select_version"
                icon={<CompareIcon />}
                placeholder="Select Version"
                options={versionOptions}
              />
            </div>
            <div className="col-6">
              <SelectField
                label="Select Version"
                name="select_version"
                icon={<CompareIcon />}
                placeholder="Select Version"
                options={versionOptions}
              />
            </div>
          </div>
          <div className="text-center mt-4">
            {/* <button
              className="btn btn-primary"
              onClick={() => setIsCompared(true)}
            >
              Validate Flow
            </button> */}
            <Button
              onClick={() => setIsCompared(true)}
              className="w-auto mx-auto"
            >
              Validate Flow
            </Button>
          </div>
        </div>
      )}

      {isCompared && ( // ✅ Show second block when true
        <div className="">
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
          <Button onClick={() => setIsCompared(false)} className="w-auto mt-2">
            Back
          </Button>
        </div>
      )}
    </CompareConteinter>
  );
};

export default CompareValidation;
