import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Button, CheckboxField, SelectField } from '../../../shared';
import { Table } from '../../../components';
import GroupUserIcon from '../../../assets/Icons/GroupUserIcon';
import NewUserIcon from '../../../assets/Icons/NewUserIcon';
import {
  GridActions,
  GridSelectors,
  NamespacesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentTextIcon } from '../../../assets';
import { isEmpty } from 'lodash';

const Container = styled.div`
  background-color: #fbfcff;
  overflow: hidden;
  border: 1px solid #dde4f0;
  padding: 20px 15px;
  border-radius: 20px;
`;

const MainContent = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  min-width: 280px;
  background-color: #f8f9fa;
  border: 1px solid #dde4f0;
  border-radius: 20px;
  padding: 14px 6px;
  overflow: hidden;
`;

const SidebarItem = styled.div`
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #444445;
  cursor: pointer;
  border-bottom: 1px solid #e9ecef;

  ${props =>
    props.active &&
    `
    background-color: #fff3e0;
    color: #ff6b35;
    font-weight: 500;
  `}

  &:hover {
    background-color: #f1f3f4;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 0;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
  background-color: white;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 18px 16px;
  font-size: 16px;
  cursor: pointer;
  color: #444445;
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  line-height: 24px;
  ${props =>
    props.active &&
    `
    color: #ff6b35;
    border-bottom-color: #ff6b35;
  `}
`;

const TabIcon = styled.span`
  font-size: 16px;
`;

const SearchContainer = styled.div`
  padding: 16px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;

  &::placeholder {
    color: #6c757d;
  }

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ButtonsContainer = styled(Flex)`
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  margin-left: 10px;
`;

const TableHeight = styled(Table)`
  height: calc(100vh - 410px);

  & thead th {
    text-align: center;
  }
  & thead th:first-child {
    text-align: left;
  }
`;
const LeftsidebarScroll = styled.div`
  max-height: calc(100vh - 370px);
`;

const NiFiProcessGroupAccessManagement = () => {
  // const [accessMode, setAccessMode] = useState('nifi-cluster');
  const [activeTab, setActiveTab] = useState('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState({});
  // Access the NiFi policies in your component
  const clusterNiFiPolicies = useSelector(
    RolesSelectors.getClusterNiFiPolicies
  );
  const policyList = [
    ...(clusterNiFiPolicies?.flowPolicies?.map(policy => ({
      value: policy.id,
      label: policy.descriptor,
      ...policy,
    })) || []),
  ];

  const handlePermissionChange = useCallback((sidebarItem, itemName) => {
    const permissionKey = `${sidebarItem}-${itemName}`;
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey],
    }));
  }, []);
  const processGroupList = useSelector(state =>
    GridSelectors.getGridData(state, 'namespaces')
  );
  const [activeSidebarItem, setActiveSidebarItem] = useState(
    processGroupList[0]
  );
  useEffect(() => {
    setActiveSidebarItem(processGroupList[0]);
  }, [processGroupList]);

  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const [selectedPolicy, setSelectedPolicy] = useState(policyList[0]?.value);
  useEffect(() => {
    if (selectedCluster?.value) {
      // Fetch users for a specific cluster
      dispatch(
        RolesActions.fetchClusterUsers({
          clusterId: selectedCluster?.value,
        })
      );
      // Fetch process groups for a specific cluster
      dispatch(
        GridActions.fetchGrid({
          module: 'namespaces',
          clusterId: selectedCluster?.value,
        })
      );
      // Fetch NiFi policies for a specific cluster
      dispatch(
        RolesActions.fetchClusterNiFiPolicies({
          clusterId: selectedCluster?.value,
        })
      );
    }
  }, [dispatch, selectedCluster]);

  useEffect(() => {
    if (
      selectedCluster?.value &&
      !isEmpty(activeSidebarItem) &&
      !isEmpty(selectedPolicy)
    ) {
      dispatch(
        RolesActions.fetchFlowPolicyDetails({
          clusterId: selectedCluster?.value,
          namespaceId: activeSidebarItem?.id,
          params: {
            action: selectedPolicy?.action,
            resource: selectedPolicy?.preProcessGroupSegment,
          },
        })
      );
    }
  }, [activeSidebarItem, selectedPolicy, selectedCluster, dispatch]);

  // Access the users in your component
  const clusterUsers = useSelector(RolesSelectors.getClusterUsers);
  const userIdentities = clusterUsers?.nifiUsers?.map(name => {
    return {
      name: name?.component?.identity,
      accessPolicies: name?.component?.accessPolicies,
      id: name?.component?.id,
    };
  });

  // const clusterUserGroups = useSelector(RolesSelectors.getClusterUserGroups);
  const userGroupIdentities = clusterUsers?.userGroups?.map(name => {
    return {
      name: name?.component?.identity,
      accessPolicies: name?.component?.accessPolicies,
      id: name?.component?.id,
    };
  });

  // const getFilteredData = (activeTab) => {
  //   activeTab === 'groups' ?
  // }
  //  const filteredData = fetchLocalChanges?.data?.changes?.filter(
  //     item =>
  //       item.componentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.componentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.difference?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  const COLUMN = [
    {
      label: activeTab === 'groups' ? 'All Groups' : 'All Users',
      renderCell: item => (
        <div style={{ fontSize: '14px', color: '#212529' }}>{item.name}</div>
      ),
      width: '50%',
    },
    {
      label: 'Permission',
      renderCell: item => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CheckboxField
            name={`${item?.id}`}
            checked={permissions[`${item?.id}`] || false}
            onChange={() => handlePermissionChange(item?.id)}
          />
        </div>
      ),
      width: '50%',
    },
  ];

  console.log('active--', activeSidebarItem);
  console.log('selectedpolicy', selectedPolicy);

  return (
    <>
      <Flex className="mb-4">
        <Flex>
          <Title>Cluster Access Management</Title>
        </Flex>
        <ButtonsContainer>
          <Button size="sm">Save Changes</Button>
        </ButtonsContainer>
      </Flex>
      <Container>
        <MainContent className="gap-3">
          <Sidebar>
            <LeftsidebarScroll className="overflow-y-auto">
              {processGroupList.map(item => (
                <SidebarItem
                  key={item?.id}
                  active={activeSidebarItem?.id === item?.id}
                  onClick={() => setActiveSidebarItem(item)}
                >
                  {item?.name}
                </SidebarItem>
              ))}
            </LeftsidebarScroll>
          </Sidebar>

          <ContentArea>
            <TabContainer>
              <div className="d-flex">
                <Tab
                  active={activeTab === 'groups'}
                  onClick={() => setActiveTab('groups')}
                >
                  <TabIcon>
                    <GroupUserIcon />
                  </TabIcon>
                  Groups
                </Tab>
                <Tab
                  active={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                >
                  <TabIcon>
                    <NewUserIcon />
                  </TabIcon>
                  Users
                </Tab>
              </div>
              <SelectField
                id="policy"
                className="w-25"
                name="policy"
                icon={<DocumentTextIcon />}
                options={policyList}
                value={selectedPolicy}
                placeholder="Select Policy"
                // disabled={isObject(clusterLogin)}
                showCircleIcon={true}
                sortAlphabetically={false}
                onChange={value => setSelectedPolicy(value)}
              />
            </TabContainer>
            {
              <>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder={`search ${activeTab}`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>

                <div>
                  <TableHeight
                    data={
                      activeTab === 'groups'
                        ? userGroupIdentities
                        : userIdentities
                    }
                    columns={COLUMN}
                    className={
                      activeTab === 'groups' ? 'groups-table' : 'users-table'
                    }
                  />
                </div>
              </>
            }
          </ContentArea>
        </MainContent>
      </Container>
    </>
  );
};

export default NiFiProcessGroupAccessManagement;
