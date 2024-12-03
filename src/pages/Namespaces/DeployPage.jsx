import React, { useState } from 'react';
import { KDFM } from '../../constants';
import { ToastContainer } from 'react-toastify';
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
import { Table } from '../../components';
import { theme } from '../../styles';

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
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  margin-bottom: 0.9rem;
  margin-top: 0.25rem;
  color: ${props => (props?.color ? props?.color : props.theme.colors.darker)};
`;

const StyledTableCell = styled.div`
  cursor: pointer;
  padding: 6px 12px !important;
`;

const CustomTable = styled(Table)`
  tr {
    padding: 0;
    height: 0;
  }
  overflow-y: auto;
  overflow-x: hidden;
`;

const breadcrumbData = [
  { label: 'Process Group List', path: '/process-group' },
  { label: 'Registry & Flow Name', path: '/process-group/DeployPage' },
];

// const bucketLabel = 'Bucket';

const flowOptions = [
  { label: 'Flow A', value: 'flow_a' },
  { label: 'Flow B', value: 'flow_b' },
  { label: 'Flow C', value: 'flow_c' },
];
const approverOptions = [
  { label: 'Group A', value: 'group_a' },
  { label: 'Group B', value: 'group_b' },
  { label: 'Group C', value: 'group_c' },
];

function DeployPage() {
  const [selectedVersion, setSelectedVersion] = useState(null);

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
            onChange={() => handleRadioChange(item)}
          />
        </StyledTableCell>
      ),
      width: '5%',
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
    },
  ];
  const handleRowClick = item => {
    setSelectedVersion(item.version);
  };

  const handleRadioChange = item => {
    setSelectedVersion(item.version);
  };

  const data = [
    {
      version: '1.0.0',
      createdAt: '2023-11-01T14:00:00Z',
      comments: 'Initial release',
      selected: true,
    },
    {
      version: '1.1.0',
      createdAt: '2023-12-01T10:30:00Z',
      comments: 'Bug fixes and improvements',
      selected: true,
    },
    {
      version: '2.0.0',
      createdAt: '2024-01-15T09:00:00Z',
      comments: 'Major upgrade with new features',
      selected: false,
    },
  ];

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
      <GreyBoxNamespace className="w-100  mb-3">
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <RowConfig>
            <div className="col-6 p-3">
              <StyledInputField
                name="registry"
                type="text"
                label="Registry"
                // value={selectedDestCluster?.label}
                icon={<QRIcons />}
                placeholder="Registry Name"
                disabled
                className="mb-0"
              />
            </div>
            <div className="col-6 p-3">
              <div>
                <div className="justify-content-between align-items-center">
                  <LabelSelect>Bucket</LabelSelect>
                  <SelectField
                    label="Approver Groups"
                    name="bucket"
                    icon={<QRIcons />}
                    title="Bucket"
                    // errors={errors}
                    options={approverOptions}
                    // defaultValue={clusterLogin}
                    placeholder="Data Analytics"
                    //required
                    // disabled={isObject(clusterLogin)}
                    // showCircleIcon={true}
                  />
                </div>
              </div>
            </div>
          </RowConfig>

          <RowConfig>
            <div className="col-6 p-3 mb-">
              <LabelSelect>Flow Label</LabelSelect>
              <SelectField
                label="Flow Name"
                name="flow_name"
                icon={<QRIcons />}
                options={flowOptions}
                // errors={errors}
                // defaultValue={clusterLogin}
                placeholder="ABC"
                required
                // disabled={isObject(clusterLogin)}
                // showCircleIcon={true}
              />
            </div>

            <div className="mt-3 col-6 p-3">
              <div className="mt-4">
                <div className="mt-5 d-flex justify-content-between align-items-center">
                  <CheckboxField
                    name="check"
                    label="Keep existing Parameter Contexts"
                    checked
                  />
                </div>
              </div>
            </div>
          </RowConfig>
          <LabelSelect color={theme.colors.darkGrey4}>Flow Name</LabelSelect>
          <LabelSelect className="mb-4">No Description Provided</LabelSelect>

          <VersionDiv>{KDFM.VERSION_CONTROL}</VersionDiv>
          <CustomTable data={data} columns={COLUMNS} />
        </ScrollSetGrey>
      </GreyBoxNamespace>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button variant="secondary">{KDFM.BACK}</Button>
          <Button>{KDFM.CONTINUE}</Button>
        </BottomButtonDiv>
      </BottomButton>
    </div>
  );
}
export default DeployPage;
