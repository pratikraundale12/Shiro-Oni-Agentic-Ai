import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, CheckboxField, SwitchButton } from '../../../shared';
import { Table } from '../../../components';
import GroupUserIcon from '../../../assets/Icons/GroupUserIcon';
import NewUserIcon from '../../../assets/Icons/NewUserIcon';
import {
  NamespacesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';

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
  const [activeSidebarItem, setActiveSidebarItem] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState({});

  // Access the NiFi policies in your component
  const clusterNiFiPolicies = useSelector(
    RolesSelectors.getClusterNiFiPolicies
  );

  console.log('clusterNiFiPolicies', clusterNiFiPolicies);

  const sidebarItems = [
    ...(clusterNiFiPolicies[0]?.accessPolicies?.map(policy => policy.name) ||
      []),
  ];

  const nameData = ['naman', 'adarsh', 'view', 'edit', 'delete', 'manage'];

  // Dynamic column definitions based on sidebar items
  const getDynamicColumns = nameColumnLabel => {
    const columns = [
      {
        label: nameColumnLabel,
        renderCell: item => (
          <div style={{ fontSize: '14px', color: '#212529' }}>{item.name}</div>
        ),
        width: '25%',
      },
    ];

    // Add dynamic columns for each sidebar item
    nameData.forEach(sidebarItem => {
      columns.push({
        label: sidebarItem,
        renderCell: item => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CheckboxField
              name={`${sidebarItem}-${item.name}`}
              checked={permissions[`${sidebarItem}-${item.name}`] || false}
              onChange={() => handlePermissionChange(sidebarItem, item.name)}
            />
          </div>
        ),
        width: '20%',
      });
    });

    return columns;
  };

  const GROUPS_COLUMNS = getDynamicColumns('All Groups');
  const USERS_COLUMNS = getDynamicColumns('All Users');

  const handlePermissionChange = (sidebarItem, itemName) => {
    const permissionKey = `${sidebarItem}-${itemName}`;
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey],
    }));
  };
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  console.log('selectedCluster', selectedCluster);

  useEffect(() => {
    // Fetch users for a specific cluster
    dispatch(
      RolesActions.fetchClusterUsers({
        clusterId: selectedCluster?.value,
      })
    );
    // Fetch user groups for a specific cluster
    dispatch(
      RolesActions.fetchClusterUserGroups({
        clusterId: selectedCluster?.value,
      })
    );

    // Fetch NiFi policies for a specific cluster
    dispatch(
      RolesActions.fetchClusterNiFiPolicies({
        clusterId: selectedCluster?.value,
      })
    );
  }, [dispatch, selectedCluster]);

  // Access the users in your component
  const clusterUsers = useSelector(RolesSelectors.getClusterUsers);
  const userIdentities = clusterUsers?.map(name => {
    return {
      name: name?.component?.identity,
    };
  });

  const clusterUserGroups = useSelector(RolesSelectors.getClusterUserGroups);
  const userGroupIdentities = clusterUserGroups?.map(name => {
    return {
      name: name?.component?.identity,
    };
  });

  return (
    <>
      <Flex className="mb-4">
        <Flex>
          <Title>Process Group Access Management</Title>
        </Flex>
        <div className="d-flex align-items-center justify-content-end gap-xl-3 gap-2">
          <div>
            <SwitchButton
              id="openModalInput1"
              name="NiFi Flow"
              // checked={}

              isDisabled={false}
            />
          </div>
          <ButtonsContainer>
            <Button size="sm">Save Changes</Button>
          </ButtonsContainer>
        </div>
      </Flex>
      <Container>
        <MainContent className="gap-3">
          <Sidebar>
            <LeftsidebarScroll className="overflow-y-auto">
              {sidebarItems.map(item => (
                <SidebarItem
                  key={item}
                  active={activeSidebarItem === item}
                  onClick={() => setActiveSidebarItem(item)}
                >
                  {item}
                </SidebarItem>
              ))}
            </LeftsidebarScroll>
          </Sidebar>

          <ContentArea>
            <TabContainer>
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
            </TabContainer>

            {activeTab === 'groups' && (
              <>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="Search Group Names"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>

                <div>
                  <TableHeight
                    data={userGroupIdentities}
                    columns={GROUPS_COLUMNS}
                    className="groups-table"
                  />
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    placeholder="Search User Names"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </SearchContainer>
                <div>
                  <TableHeight
                    data={userIdentities}
                    columns={USERS_COLUMNS}
                    className="users-table"
                  />
                </div>
              </>
            )}
          </ContentArea>
        </MainContent>
      </Container>
    </>
  );
};

export default NiFiProcessGroupAccessManagement;
