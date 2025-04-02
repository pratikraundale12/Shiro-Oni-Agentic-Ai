import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CompareIcon, FlowDetailIcon } from '../../../assets';
import { Table } from '../../../components';
import { Button, SelectField } from '../../../shared';
import { FlowValidationActions } from '../../../store/flowValidation';
import Collapsible from '../Collapsible';

// Styled Components
const FlowContainer = styled.div`
  min-height: 58vh;
`;

const FlowContainerDetail = styled.div`
  padding: 0px;
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

const FlowValidationDetails = () => {
  const [showDetail, setShowDetail] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FlowValidationActions.ruleScopeFetch({}));
    dispatch(FlowValidationActions.fetchRules());
  }, [dispatch]);

  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <div>{item.version}</div>,
      width: '30%',
    },
    {
      label: 'ID',
      renderCell: item => <div>{item.displayValue}</div>,
      width: '35%',
    },
    {
      label: 'Message',
      renderCell: item => <div>{item.comments}</div>,
      width: '35%',
    },
  ];

  const sections = [
    {
      title: 'Concurrent Task Value',
      data: [
        {
          version: 'v1.0',
          displayValue: 'ID-001',
          comments: 'Validation passed successfully',
        },
        {
          version: 'v1.1',
          displayValue: 'ID-002',
          comments: 'Missing required field: Email',
        },
      ],
    },
    {
      title: 'User Information Validation',
      data: [
        {
          version: 'v2.0',
          displayValue: 'ID-003',
          comments: 'Incorrect format in phone number',
        },
        {
          version: 'v2.1',
          displayValue: 'ID-004',
          comments: 'All validations passed',
        },
      ],
    },
    {
      title: 'System Rules Check',
      data: [
        {
          version: 'v3.0',
          displayValue: 'ID-005',
          comments: 'Field length exceeded limit',
        },
        {
          version: 'v3.1',
          displayValue: 'ID-006',
          comments: 'Duplicate entry found',
        },
      ],
    },
  ];

  const [openSections, setOpenSections] = useState(sections.map(() => false));

  const toggleCollapsible = index => {
    const updated = [...openSections];
    updated[index] = !updated[index];
    setOpenSections(updated);
  };

  return (
    <FlowContainer>
      {!showDetail ? (
        <div>
          <div className="text-center py-4">
            <FlowDetailIcon />
          </div>
          <div>
            <LabelSelect>Select Rules To Validate</LabelSelect>
            <SelectField
              label="Select Rules"
              name="select_property"
              icon={<CompareIcon />}
              placeholder="Select Property"
              options={[
                { label: 'Processor', value: 'Processor' },
                { label: 'Connection', value: 'Connection' },
              ]}
            />
          </div>
          <div className="text-center mt-4">
            {/* <button
              className="btn btn-primary"
              onClick={() => setShowDetail(true)}
            >
              Validate Flow
            </button> */}
            <Button
              onClick={() => setShowDetail(true)}
              className="w-auto mx-auto"
            >
              Validate Flow
            </Button>
          </div>
        </div>
      ) : (
        <>
          <FlowContainerDetail>
            <div className="row">
              <div className="col-md-6 mb-4 pb-md-2">
                <LabelSelect>Flow Info</LabelSelect>
                <LabelSelectContent>
                  MYSQL - 70103b83-0195-1000-f97f-a23ed92163e0 - 127.0.0.1
                </LabelSelectContent>
              </div>
              <div className="col-md-6 mb-4 pb-md-2">
                <LabelSelect>Invalid Processor Count</LabelSelect>
                <LabelSelectContent>0</LabelSelectContent>
              </div>
              <div className="col-md-6 mb-4 pb-md-2">
                <LabelSelect>Registry Flow Info</LabelSelect>
                <LabelSelectContent>
                  MySQL (TestBucket) - 52859810-0195-1000-f966-2707d02d1fdd
                </LabelSelectContent>
              </div>
              <div className="col-md-6 mb-4 pb-md-2">
                <LabelSelect>Current Version</LabelSelect>
                <LabelSelectContent>V3</LabelSelectContent>
              </div>
            </div>
            <div className="row align-items-center justify-content-between">
              <div className="col-md-6 mb-4 pb-md-2">
                <LabelSelect>State</LabelSelect>
                <LabelSelectContent>
                  LOCALLY_MODIFIED - Local changes have been made
                </LabelSelectContent>
              </div>
              <div className="col-md-auto mb-4">
                <Button>Send Email Report</Button>
              </div>
            </div>
          </FlowContainerDetail>

          {sections.map((section, index) => (
            <Collapsible
              key={index}
              title={section.title}
              isTableOpen={openSections[index]}
              toggleCollapsible={() => toggleCollapsible(index)}
              isAddBtnVisible={false}
            >
              <Table columns={COLUMNS} data={section.data} />
            </Collapsible>
          ))}
          <Button onClick={() => setShowDetail(false)} className="w-auto">
            Back
          </Button>
        </>
      )}
    </FlowContainer>
  );
};

export default FlowValidationDetails;
