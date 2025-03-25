/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from './Title';
import ClusterSetupNavigationTab from './ClusterSetupNavigationTab';
import { Button } from '../../../shared';
import { KDFM } from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { history } from '../../../helpers/history';
import { ClustersActions } from '../../../store';
import { useDispatch } from 'react-redux';
import { IconButton, Table } from '../../../components';
import {
  CopyIcon,
  DeleteSmallIcon,
  PencilIcon,
  PlusCircleIcon,
} from '../../../assets';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const Container = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  overflow: auto;
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const TableContainer = styled.div`
  height: calc(100% - 130px);
`;
const ActionTd = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 6px;
  padding-right: 10px;
`;
const SetupClusterManageConfigWrapper = ({ activeTab }) => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    clusterName: yup.string().required('Cluster Name is required'),
    nifi_version: yup.string().required('Port is required'),
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleContinue = data => {
    console.log(data);
  };
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
      renderCell: () => (
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
      <Title title={'Add New Cluster Details'} />
      <Container>
        <ClusterSetupNavigationTab activeTab={activeTab} />
        <TableContainer>
          <div className="d-flex justify-content-end mt-3 mb-3">
            <div className="col-auto me-3">
              <Button
                size="md"
                onClick={() => {
                  history.push('/clusters/new-config-details');
                }}
                className="w-auto px-3"
                style={{ minWidth: 'auto' }}
              >
                <div
                  className="d-flex "
                  style={{ fontSize: '14px', fontWeight: '750' }}
                >
                  <PlusCircleIcon height={19} width={19} color={'#fff'} />
                  Add New Config
                </div>
              </Button>
            </div>
          </div>

          <Table
            data={mockData}
            columns={COLUMNS}
            customNoDataText="No Host IP Available"
            tableWithFullHeight={true}
          />
        </TableContainer>
      </Container>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              dispatch(
                ClustersActions.setActiveTabClusterSetup('getting_started')
              );
            }}
          >
            {KDFM.BACK}
          </Button>
          <Button variant="tertiary" type="button">
            {KDFM.SAVE}
          </Button>
          {/* <Button type="submit" onClick={handleSubmit(handleContinue)}> */}
          <Button
            type="submit"
            onClick={() => {
            //   history.push(`/clusters/manage-configuration-details`);
            }}
          >
            {KDFM.CONTINUE}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
SetupClusterManageConfigWrapper.propTypes = {
  children: PropTypes.object,
  activeTab: PropTypes.string,
};
export default SetupClusterManageConfigWrapper;
