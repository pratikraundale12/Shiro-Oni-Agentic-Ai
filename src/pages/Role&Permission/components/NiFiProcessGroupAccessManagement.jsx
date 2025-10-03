import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import {
  Button,
  CheckboxField,
  SelectField,
  SwitchButton,
} from '../../../shared';
import {
  FullPageLoader,
  IconButton,
  LoaderContainer,
  Table,
} from '../../../components';
import GroupUserIcon from '../../../assets/Icons/GroupUserIcon';
import NewUserIcon from '../../../assets/Icons/NewUserIcon';
import {
  GridActions,
  GridSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
  RolesActions,
  RolesSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import {
  DocumentTextIcon,
  Hierarchy,
  NoDataIcon,
  SmallSearchIcon,
} from '../../../assets';
import { isEmpty } from 'lodash';
import Breadcrumb from '../../../shared/Breadcrumb';
import { theme } from '../../../styles';

const Container = styled.div`
  background-color: #fbfcff;
  overflow: hidden;
  border: 1px solid #dde4f0;
  padding: 20px 15px;
  border-radius: 20px;
  height: 87%;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const Sidebar = styled.div`
  min-width: 280px;
  background-color: #fff;
  border: 1px solid #dde4f0;
  border-radius: 20px;
  padding: 14px 6px;
  overflow: hidden;
  height: 100%;
  min-height: 0;
`;

const SidebarItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #444445;
  cursor: pointer;

  ${props =>
    props.active &&
    `
    background-color: ${theme.colors.primary};
    color: #fff;
    font-weight: 500;
  `}

  ${props =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const NodataAvailable = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #444445;
`;
const ContentArea = styled.div`
  flex: 1;
  padding: 0;
  overflow: hidden;
  height: 100%;
  min-height: 0;
  border-radius: 20px;
  border-bottom: 1px solid #dde4f0;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
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
    color: #FF7A00;
    border-bottom-color: #FF7A00;
  `}
  &:hover {
    color: rgba(255, 122, 0, 1);
  }
`;

const TabIcon = styled.span`
  font-size: 16px;

  ${Tab}:hover & svg path {
    stroke: rgba(255, 122, 0, 1);
  }
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
  border-radius: 4px;
  padding: 12px 12px 12px 40px;
  font-size: 16px;
  margin: 14px 0;
  font-family: ${props => props.theme.fontRedHat};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.lightGrey};

  &:focus-visible {
    outline: none;
  }
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
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
  padding-bottom: 50px;

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

const BreadcrumbContainer = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #444445;
  align-items: center;
`;

const SidebarButton = styled.button`
  padding: 3px;
  border-radius: 100%;
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.lightGrey3};
  font-family: ${props => props.theme.fontNato};
  font-size: 28px;
  font-weight: 600;
  text-align: center;
`;

const NiFiProcessGroupAccessManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [grpsData, setGrpsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const clusterNiFiPolicies = useSelector(
    RolesSelectors.getClusterNiFiPolicies
  );
  const processGroupList = useSelector(state =>
    GridSelectors.getGridData(state, 'namespaces')
  );
  const [activeSidebarItem, setActiveSidebarItem] = useState(
    processGroupList[0]
  );
  const namespaces = useSelector(NamespacesSelectors.getNamespacesAllData);
  const clusterUsers = useSelector(RolesSelectors.getClusterUsers);
  const groupsPerPolicies = useSelector(RolesSelectors.getFlowPolicyDetails);
  const [selectedGroupDropdown, setSelectedGroupDropdown] = useState({
    label: 'All',
    value: 'all',
  });
  const [initialGrpsData, setInitialGrpsData] = useState([]);
  const [initialUsersData, setInitialUsersData] = useState([]);
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('');
  const [groupsAssignedChanged, setGroupsAssignedChanged] = useState(false);
  const [usersAssignedChanged, setUsersAssignedChanged] = useState(false);

  useEffect(() => {
    if (processGroupList && processGroupList.length > 0 && !activeSidebarItem) {
      setActiveSidebarItem(processGroupList[0]);
      // Clear any existing checkbox data when component first loads
      setGrpsData([]);
      setUsersData([]);
      setInitialGrpsData([]);
      setInitialUsersData([]);
      setSelectedPolicy(null);
    }
  }, [processGroupList, activeSidebarItem]);

  useEffect(() => {
    if (selectedCluster?.value) {
      dispatch(
        RolesActions.fetchClusterNiFiPolicies({
          clusterId: selectedCluster?.value,
        })
      );
    }
  }, [dispatch, selectedCluster?.value]);

  useEffect(() => {
    // Only set data if a policy is selected
    if (selectedPolicy && !isEmpty(groupsPerPolicies?.userGroups)) {
      setGrpsData(groupsPerPolicies?.userGroups);
      setInitialGrpsData(groupsPerPolicies?.userGroups);
      setGroupsAssignedChanged(false);
    } else {
      setGrpsData([]);
      setInitialGrpsData([]);
      setGroupsAssignedChanged(false);
    }
  }, [groupsPerPolicies?.userGroups, selectedPolicy]);

  useEffect(() => {
    if (selectedPolicy && !isEmpty(groupsPerPolicies?.users)) {
      setUsersData(groupsPerPolicies?.users);
      setInitialUsersData(groupsPerPolicies?.users);
      setUsersAssignedChanged(false);
    } else {
      setUsersData([]);
      setInitialUsersData([]);
      setUsersAssignedChanged(false);
    }
  }, [groupsPerPolicies?.users, selectedPolicy]);

  const arraysDifferById = (a = [], b = []) => {
    if (a.length !== b.length) return true;
    const aIds = new Set(a.map(x => x.id));
    const bIds = new Set(b.map(x => x.id));
    if (aIds.size !== bIds.size) return true;
    for (const id of aIds) {
      if (!bIds.has(id)) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!selectedPolicy) {
      setGroupsAssignedChanged(false);
      return;
    }
    const changed = arraysDifferById(grpsData, initialGrpsData);
    setGroupsAssignedChanged(changed);
  }, [grpsData, initialGrpsData, selectedPolicy]);

  useEffect(() => {
    if (!selectedPolicy) {
      setUsersAssignedChanged(false);
      return;
    }
    const changed = arraysDifferById(usersData, initialUsersData);
    setUsersAssignedChanged(changed);
  }, [usersData, initialUsersData, selectedPolicy]);

  // Filter policies based on selected process group
  const getFilteredPolicies = useCallback(() => {
    if (!activeSidebarItem?.id || !clusterNiFiPolicies?.flowPolicies) {
      return [];
    }

    const processGroupPolicies = clusterNiFiPolicies.flowPolicies.find(
      policyGroup => policyGroup['process-group-id'] === activeSidebarItem.id
    );

    return (
      processGroupPolicies?.policies?.map(policy => ({
        value: policy.id,
        label: policy.descriptor,
        ...policy,
      })) || []
    );
  }, [activeSidebarItem?.id, clusterNiFiPolicies?.flowPolicies]);

  const getRootFilteredPolicies = useCallback(() => {
    const parentGroupId = processGroupList?.[0]?.parentGroupId;
    if (!parentGroupId || !clusterNiFiPolicies?.flowPolicies) {
      return [];
    }

    const processGroupPolicies = clusterNiFiPolicies.flowPolicies.find(
      policyGroup => policyGroup['process-group-id'] === parentGroupId
    );

    return (
      processGroupPolicies?.policies?.map(policy => ({
        value: policy.id,
        label: policy.descriptor,
        ...policy,
      })) || []
    );
  }, [processGroupList, clusterNiFiPolicies?.flowPolicies]);

  const policyList = isSwitchEnabled
    ? getRootFilteredPolicies()
    : getFilteredPolicies();

  const handleSidebarClick = item => {
    setActiveSidebarItem(item);
    setSelectedPolicy(null);
    setSelectedGroupDropdown({ label: 'All', value: 'all' });
    // Clear checkbox data when switching process groups
    setGrpsData([]);
    setUsersData([]);
    setInitialGrpsData([]);
    setInitialUsersData([]);
    setGroupsAssignedChanged(false);
    setUsersAssignedChanged(false);
    dispatch(
      RolesActions.fetchClusterNiFiPolicies({
        clusterId: selectedCluster?.value,
      })
    );
  };

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
    }
  }, [dispatch, selectedCluster]);

  const handlePolicyChange = value => {
    setSelectedPolicy(value);
    setGroupsAssignedChanged(false);
    setUsersAssignedChanged(false);

    dispatch(
      RolesActions.fetchFlowPolicyDetails({
        clusterId: selectedCluster?.value,
        namespaceId:
          isSwitchEnabled === true
            ? processGroupList?.[0]?.parentGroupId
            : activeSidebarItem?.id,

        params: {
          action: value?.action,
          resource: value?.preProcessGroupSegment,
        },
      })
    );
  };

  // Access the users in your component
  const userIdentities = clusterUsers?.nifiUsers?.map(name => {
    return {
      identity: name?.identity,
      id: name?.id,
    };
  });
  // const filteredDataUsers = userIdentities?.filter(item =>
  //   item?.identity.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const groupOptions = [
    { label: 'All', value: 'all' },
    ...(clusterUsers?.userGroups?.map(ele => ({
      label: ele?.identity,
      value: ele?.id,
    })) || []),
  ];

  const specificGroupByDropdown = clusterUsers?.userGroups?.filter(
    ele => ele?.id === selectedGroupDropdown?.value
  );
  const usersOfSelectedGroup =
    Array.isArray(specificGroupByDropdown?.[0]?.users) &&
    specificGroupByDropdown?.[0]?.users?.map(name => {
      return {
        identity: name?.identity,
        id: name?.id,
      };
    });

  const userGroupIdentities = clusterUsers?.userGroups?.map(name => {
    return {
      identity: name?.identity,
      id: name?.id,
    };
  });
  const userList =
    selectedGroupDropdown?.value === 'all'
      ? userIdentities
      : usersOfSelectedGroup;

  const filteredDataUsers = userList?.filter(item =>
    item?.identity?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const filteredDataUsersGrp = userGroupIdentities?.filter(item =>
    item?.identity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter process groups based on sidebar search term
  const filteredProcessGroupList = processGroupList?.filter(item =>
    item?.name?.toLowerCase()?.includes(sidebarSearchTerm?.toLowerCase())
  );

  const filteredNamespacesData = namespaces?.data?.filter(item =>
    item?.name?.toLowerCase()?.includes(sidebarSearchTerm?.toLowerCase())
  );

  // Check if all items are selected
  const isAllSelected = () => {
    if (!selectedPolicy) return false;
    const currentData =
      activeTab === 'groups' ? filteredDataUsersGrp : filteredDataUsers;
    const currentSelectedData = activeTab === 'groups' ? grpsData : usersData;
    return (
      currentData.length > 0 &&
      currentData.every(item =>
        currentSelectedData.some(selected => selected.id === item.id)
      )
    );
  };

  // Handle select all functionality
  const handleSelectAll = checked => {
    if (!selectedPolicy) {
      toast.info('Please select a policy.');
      return;
    }

    const currentData =
      activeTab === 'groups' ? filteredDataUsersGrp : filteredDataUsers;

    if (checked) {
      // Add all filtered items to selected data
      if (activeTab === 'groups') {
        setGrpsData(prev => {
          const newItems = currentData.filter(
            item => !prev.some(existing => existing.id === item.id)
          );
          return [...prev, ...newItems];
        });
      } else {
        setUsersData(prev => {
          const newItems = currentData.filter(
            item => !prev.some(existing => existing.id === item.id)
          );
          return [...prev, ...newItems];
        });
      }
    } else {
      // Remove all filtered items from selected data
      if (activeTab === 'groups') {
        setGrpsData(prev =>
          prev.filter(
            item => !currentData.some(filtered => filtered.id === item.id)
          )
        );
      } else {
        setUsersData(prev =>
          prev.filter(
            item => !currentData.some(filtered => filtered.id === item.id)
          )
        );
      }
    }
  };

  const COLUMN = [
    {
      label: activeTab === 'groups' ? 'All Groups' : 'All Users',
      renderCell: item => (
        <div style={{ fontSize: '14px', color: '#212529' }}>
          {item.identity}
        </div>
      ),
      width: '50%',
    },
    {
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <CheckboxField
            name="selectAll"
            checked={isAllSelected()}
            onChange={e => handleSelectAll(e.target.checked)}
            style={{ margin: 0 }}
            data-tooltip-id={`tooltip-id`}
          />
          <ReactTooltip
            id={`tooltip-id`}
            place="bottom"
            effect="solid"
            content="Select"
            style={{
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          <span>Permission</span>
        </div>
      ),
      renderCell: item => {
        const isChecked = selectedPolicy
          ? activeTab === 'groups'
            ? grpsData.some(ele => ele?.id === item?.id)
            : usersData.some(ele => ele?.id === item?.id)
          : false;

        const handleChangeCheck = (checked, item) => {
          if (checked && !selectedPolicy) {
            toast.info('Please select a policy.');
            return;
          }

          if (activeTab === 'groups') {
            if (checked) {
              setGrpsData(prev =>
                prev.some(p => p.id === item.id) ? prev : [...prev, item]
              );
            } else {
              setGrpsData(prev => prev.filter(ele => ele.id !== item.id));
            }
          } else {
            if (checked) {
              setUsersData(prev =>
                prev.some(p => p.id === item.id) ? prev : [...prev, item]
              );
            } else {
              setUsersData(prev => prev.filter(ele => ele.id !== item.id));
            }
          }
        };

        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CheckboxField
              name={`${item?.id}`}
              checked={isChecked}
              onChange={e => {
                handleChangeCheck(e.target.checked, item);
              }}
              data-tooltip-id={`name-${item.id}`}
            />
            <ReactTooltip
              id={`name-${item?.id}`}
              place="bottom"
              effect="solid"
              content="Select"
              style={{
                width: 'auto',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
          </div>
        );
      },
      width: '50%',
    },
  ];
  const handleSavePermission = () => {
    const { policyId, revision } = groupsPerPolicies;
    const selectedPolicyName =
      selectedPolicy?.label ?? selectedPolicy?.descriptor ?? null;
    const subPayload = {
      policyId,
      revision,
      users: usersData,
      userGroups: grpsData,
    };

    const descriptionPayload = {
      policies: [subPayload],
      resource: selectedPolicy?.resource,
    };
    const payload = {
      id: selectedCluster?.value,
      descriptionPayload,
      selectedPolicy,
      activeSidebarItem,
      isSwitchEnabled,
      changeFlags: {
        groupsAssignedChanged,
        usersAssignedChanged,
      },
      selectedPolicyName,
    };
    dispatch(RolesActions.updateClusterPermissionsAndActions(payload));
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchClusterUsers')
  );
  const loading2 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchClusterNiFiPolicies')
  );
  const loading3 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchFlowPolicyDetails')
  );
  const loading4 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'updateClusterPermissionsAndActions')
  );
  const loading5 = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchNamespaces')
  );

  const handleSwitchChange = e => {
    setActiveSidebarItem(null);
    setIsSwitchEnabled(e.target.checked);
    if (!isSwitchEnabled) {
      dispatch(
        RolesActions.fetchClusterNiFiPolicies({
          clusterId: selectedCluster?.value,
        })
      );
    }
  };

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab, activeSidebarItem]);

  useEffect(() => {
    setSidebarSearchTerm('');
  }, [activeSidebarItem]);

  // Clear checkbox data when no policy is selected
  useEffect(() => {
    if (!selectedPolicy) {
      setGrpsData([]);
      setUsersData([]);
      setInitialGrpsData([]);
      setInitialUsersData([]);
      setGroupsAssignedChanged(false);
      setUsersAssignedChanged(false);
    }
  }, [selectedPolicy]);

  // Show toast message when no cluster is selected
  useEffect(() => {
    if (!selectedCluster?.value) {
      toast.info('Please login to the cluster.');
    }
  }, [selectedCluster]);

  const handleChildProcessGroupClick = (e, item) => {
    e.stopPropagation();
    setSelectedGroupDropdown({ label: 'All', value: 'all' });
    dispatch(
      NamespacesActions.setSelectedNamespace({
        label: item.name,
        value: item.id,
      })
    );
    dispatch(NamespacesActions.fetchNamespaces());
  };

  // Check if any changes have been made to the checkbox data
  const hasChanges = () => {
    if (!selectedPolicy) return false;

    // Compare current groups data with initial groups data
    const groupsChanged =
      grpsData.length !== initialGrpsData.length ||
      !grpsData.every(item =>
        initialGrpsData.some(initial => initial.id === item.id)
      ) ||
      !initialGrpsData.every(item =>
        grpsData.some(current => current.id === item.id)
      );

    // Compare current users data with initial users data
    const usersChanged =
      usersData.length !== initialUsersData.length ||
      !usersData.every(item =>
        initialUsersData.some(initial => initial.id === item.id)
      ) ||
      !initialUsersData.every(item =>
        usersData.some(current => current.id === item.id)
      );

    return groupsChanged || usersChanged;
  };

  return (
    <>
      <FullPageLoader
        loading={loading || loading2 || loading3 || loading4 || loading5}
      />
      <Flex className="mb-4">
        <Flex>
          <Title>Process Group Access Management</Title>
        </Flex>
        {selectedCluster?.value && (
          <div className="d-flex align-items-center justify-content-end gap-xl-3 gap-2">
            <div>
              <SwitchButton
                id="openModalInput1"
                name="NiFi Root Policy"
                checked={isSwitchEnabled}
                onChange={handleSwitchChange}
                isDisabled={false}
              />
            </div>
            <ButtonsContainer>
              <Button
                size="sm"
                onClick={() => {
                  handleSavePermission();
                }}
                disabled={!hasChanges()}
              >
                Save Changes
              </Button>
            </ButtonsContainer>
          </div>
        )}
      </Flex>
      <Container>
        {selectedCluster?.value ? (
          <MainContent className="gap-3">
            <Sidebar>
              <SearchContainer>
                <SmallSearchIcon
                  width={18}
                  height={18}
                  color={theme.colors.darkGrey1}
                />
                <Search
                  type="search"
                  placeholder="Search process groups"
                  value={sidebarSearchTerm}
                  onChange={e => setSidebarSearchTerm(e.target.value)}
                />
              </SearchContainer>
              <LeftsidebarScroll className="overflow-y-auto">
                {isEmpty(namespaces?.data) && (
                  <>
                    {filteredProcessGroupList.length > 0 ? (
                      filteredProcessGroupList.map(item => (
                        <SidebarItem
                          key={item?.id}
                          active={activeSidebarItem?.id === item?.id}
                          disabled={isSwitchEnabled}
                          onClick={() =>
                            !isSwitchEnabled && handleSidebarClick(item)
                          }
                        >
                          {item?.name}
                          <SidebarButton
                            type="button"
                            onClick={e => handleChildProcessGroupClick(e, item)}
                            className="ml-2"
                            style={{
                              backgroundColor:
                                activeSidebarItem?.id === item?.id
                                  ? '#FF7A00'
                                  : '#fff',
                            }}
                          >
                            <IconButton
                              style={{
                                backgroundColor:
                                  activeSidebarItem?.id === item?.id
                                    ? '#FF7A00'
                                    : '#fff',
                                border:
                                  activeSidebarItem?.id === item?.id
                                    ? '1px solid #fff'
                                    : '1px solid #CCC',
                                padding: '5px',
                              }}
                            >
                              <Hierarchy
                                color={
                                  activeSidebarItem?.id === item?.id
                                    ? '#fff'
                                    : '#444445'
                                }
                                plusSignBackground={
                                  activeSidebarItem?.id === item?.id
                                    ? '##FF7A00'
                                    : '#444445'
                                }
                              />
                            </IconButton>
                          </SidebarButton>
                        </SidebarItem>
                      ))
                    ) : sidebarSearchTerm ? (
                      <NodataAvailable>No Process Groups Found</NodataAvailable>
                    ) : (
                      <NodataAvailable>
                        No Process Group Available!!
                      </NodataAvailable>
                    )}
                  </>
                )}
                {!isEmpty(namespaces?.data) && (
                  <>
                    {filteredNamespacesData?.length ===
                    filteredNamespacesData?.filter(item => item?.isProcessor)
                      ?.length ? (
                      sidebarSearchTerm ? (
                        <NodataAvailable>
                          No Process Groups Found
                        </NodataAvailable>
                      ) : (
                        <NodataAvailable>
                          No Process Group Available!!
                        </NodataAvailable>
                      )
                    ) : (
                      <>
                        {filteredNamespacesData?.map(item => (
                          <span key={item?.id}>
                            {!item?.isProcessor && (
                              <SidebarItem
                                active={activeSidebarItem?.id === item?.id}
                                disabled={isSwitchEnabled}
                                onClick={() =>
                                  !isSwitchEnabled && handleSidebarClick(item)
                                }
                              >
                                {item?.name}
                                <SidebarButton
                                  type="button"
                                  onClick={e =>
                                    handleChildProcessGroupClick(e, item)
                                  }
                                  className="ml-2"
                                  style={{
                                    backgroundColor:
                                      activeSidebarItem?.id === item?.id
                                        ? '#FF7A00'
                                        : '#fff',
                                  }}
                                >
                                  <IconButton
                                    style={{
                                      backgroundColor:
                                        activeSidebarItem?.id === item?.id
                                          ? '#FF7A00'
                                          : '#fff',
                                      border:
                                        activeSidebarItem?.id === item?.id
                                          ? '1px solid #fff'
                                          : '1px solid #CCC',
                                      padding: '5px',
                                    }}
                                  >
                                    <Hierarchy
                                      color={
                                        activeSidebarItem?.id === item?.id
                                          ? '#fff'
                                          : '#444445'
                                      }
                                      plusSignBackground={
                                        activeSidebarItem?.id === item?.id
                                          ? '##FF7A00'
                                          : '#444445'
                                      }
                                    />
                                  </IconButton>
                                </SidebarButton>
                              </SidebarItem>
                            )}
                          </span>
                        ))}
                      </>
                    )}
                  </>
                )}
              </LeftsidebarScroll>
            </Sidebar>

            <ContentArea>
              <BreadcrumbContainer className="d-flex  mb-3 mt-3">
                <Breadcrumb
                  module="role_permission"
                  path={
                    namespaces?.breadcrumb?.map(item => ({
                      label: item.name,
                      value: item.id,
                      id: item.id,
                    })) || []
                  }
                  activeSidebarItem={activeSidebarItem}
                />
              </BreadcrumbContainer>
              <TabContainer>
                <div className="d-flex">
                  <Tab
                    active={activeTab === 'groups'}
                    onClick={() => setActiveTab('groups')}
                  >
                    <TabIcon>
                      <GroupUserIcon
                        color={activeTab === 'groups' ? '#f0701a' : '#6c757d'}
                      />
                    </TabIcon>
                    Groups
                  </Tab>
                  <Tab
                    active={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                  >
                    <TabIcon>
                      <NewUserIcon
                        color={activeTab === 'users' ? '#f0701a' : '#6c757d'}
                      />
                    </TabIcon>
                    Users
                  </Tab>
                </div>
                <div className="d-flex align-items-center gap-3 w-100 justify-content-end">
                  {activeTab !== 'groups' && (
                    <SelectField
                      id="policy"
                      className="w-25 mb-0"
                      name="policy"
                      icon={<DocumentTextIcon />}
                      options={groupOptions || []}
                      value={selectedGroupDropdown}
                      placeholder={'Select Group'}
                      showCircleIcon={true}
                      sortAlphabetically={false}
                      onChange={e => {
                        setSelectedGroupDropdown(e);
                      }}
                    />
                  )}
                  <SelectField
                    id="policy"
                    className="w-25 mb-0"
                    name="policy"
                    icon={<DocumentTextIcon />}
                    options={policyList}
                    value={selectedPolicy}
                    placeholder={
                      policyList.length === 0
                        ? 'No policies available'
                        : 'Select Policy'
                    }
                    disabled={policyList.length === 0}
                    showCircleIcon={true}
                    sortAlphabetically={false}
                    onChange={handlePolicyChange}
                  />
                </div>
              </TabContainer>
              {
                <>
                  <SearchContainer>
                    <SmallSearchIcon
                      width={18}
                      height={18}
                      color={theme.colors.darkGrey1}
                    />
                    <Search
                      type="search"
                      placeholder={`search ${activeTab}`}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </SearchContainer>

                  <div>
                    <TableHeight
                      data={
                        activeTab === 'groups'
                          ? filteredDataUsersGrp
                          : filteredDataUsers
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
        ) : (
          <LoaderContainer>
            <NoDataIcon width={140} />
            <LoadingText>No Policies Available</LoadingText>
          </LoaderContainer>
        )}
      </Container>
    </>
  );
};

export default NiFiProcessGroupAccessManagement;
