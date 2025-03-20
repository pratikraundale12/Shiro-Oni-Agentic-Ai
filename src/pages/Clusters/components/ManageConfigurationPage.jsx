import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import { IconButton, Table } from '../../../components';
import { CopyIcon, DeleteSmallIcon, PencilIcon } from '../../../assets';
import { KDFM } from '../../../constants';
import { Button } from '../../../shared';
import { history } from '../../../helpers/history';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const Container = styled.div`
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
  padding-right: 10px;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const ManageConfigurationPage = () => {
  const mockData = [
    {
      name: 'System Config',
      version: 'NiFi V12',
      comment: 'Configuration updated successfully',
    },
    {
      name: 'Network Settings',
      version: 'NiFi V3',
      comment: 'Performance improvements',
    },
    {
      name: 'Security Patch',
      version: 'NiFi V8',
      comment: 'Security patches included',
    },
    {
      name: 'Database Config',
      version: 'NiFi V15',
      comment: 'Minor bug fixes applied',
    },
    {
      name: 'User Preferences',
      version: 'NiFi V6',
      comment: 'Updated dependencies',
    },
    {
      name: 'Logging Settings',
      version: 'NiFi V9',
      comment: 'Initial version release',
    },
    {
      name: 'Access Control',
      version: 'NiFi V18',
      comment: 'Added new feature support',
    },
    {
      name: 'Service Configuration',
      version: 'NiFi V5',
      comment: 'Deprecated old methods',
    },
    {
      name: 'Backup Policy',
      version: 'NiFi V2',
      comment: 'Code refactored for better efficiency',
    },
    {
      name: 'Monitoring Setup',
      version: 'NiFi V14',
      comment: 'Security patches included',
    },
    {
      name: 'Cache Settings',
      version: 'NiFi V7',
      comment: 'Performance improvements',
    },
    {
      name: 'Data Retention',
      version: 'NiFi V10',
      comment: 'Minor bug fixes applied',
    },
    {
      name: 'Authentication Config',
      version: 'NiFi V20',
      comment: 'Configuration updated successfully',
    },
    {
      name: 'Firewall Rules',
      version: 'NiFi V11',
      comment: 'Initial version release',
    },
    {
      name: 'Load Balancer',
      version: 'NiFi V16',
      comment: 'Added new feature support',
    },
    {
      name: 'Integration Settings',
      version: 'NiFi V4',
      comment: 'Updated dependencies',
    },
    {
      name: 'Scheduler Config',
      version: 'NiFi V19',
      comment: 'Deprecated old methods',
    },
    {
      name: 'Encryption Policy',
      version: 'NiFi V13',
      comment: 'Code refactored for better efficiency',
    },
    {
      name: 'Storage Limits',
      version: 'NiFi V1',
      comment: 'Security patches included',
    },
    {
      name: 'API Gateway',
      version: 'NiFi V17',
      comment: 'Performance improvements',
    },
  ];
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <>{item.name}</>,
      resize: true,
    },
    {
      label: 'Config Version',
      renderCell: item => <>{item.version}</>,
      resize: true,
    },
    {
      label: 'Comments',
      renderCell: item => <>{item.comment}</>,
      resize: true,
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionTd>
          <IconButton
            onClick={event => {
              console.log(event);
            }}
            className="pencil-icon-schedule-list"
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
          <IconButton
            onClick={event => {
              console.log(event);
            }}
            className="pencil-icon-schedule-list"
          >
            <CopyIcon width={16} height={16} color="black" />
          </IconButton>
          <IconButton
            onClick={event => {
              console.log(event);
            }}
            className="pencil-icon-schedule-list"
          >
            <DeleteSmallIcon width={16} height={16} color="black" />
          </IconButton>
        </ActionTd>
      ),
      resize: true,
    },
  ];
  return (
    <Wrapper>
      <Title
        title={'Manage Configuration Details'}
        displayButton={true}
        handleButtonClick={() => {}}
      />
      <Container>
        <Table
          data={mockData}
          columns={COLUMNS}
          customNoDataText="No Host IP Available"
          tableWithFullHeight={true}
        />
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              history.push(`/clusters/setup-cluster`);
            }}
          >
            {KDFM.BACK}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              history.push(`/clusters/manage-configuration-details`);
            }}
          >
            Create
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
ManageConfigurationPage.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
  setAtiveTab: PropTypes.func,
};
export default ManageConfigurationPage;
