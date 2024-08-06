import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Title } from './components/Title';
import { AddNewCluster } from './components/AddNewCluster';
import { AddRegistry } from './components/AddRegistry';
import { AddNewRegistry } from './components/AddNewRegistry';

const Wrapper = styled.div`
  margin-top: 4px;
`;

const Container = styled.div`
  border-radius: 20px;
  background-color: ${props => props.theme.colors.lightGrey};
  padding-top: 10px;
`;

const NavTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
`;

const NavButton = styled.button`
  border: 0;
  background: none;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontNato};
  color: ${props =>
    props.active ? props.theme.colors.error : props.theme.colors.darkGrey2};
  cursor: auto;
  transition:
    color 0.3s,
    border-bottom 0.3s;
  ${props =>
    props.active && `border-bottom: 1px solid ${props.theme.colors.error};`}
`;

export const AddCluster = () => {
  const location = useLocation();
  const data = location.state || {};

  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('cluster');
  const [newRegistry, setNewRegistry] = useState(false);
  const [registryId, setRegistryId] = useState();
  const [clusterId, setClusterId] = useState();
  const [clusterData, setClusterData] = useState({
    id: data?.id || '',
    name: data.name || '',
    nifi_url: data.nifi_url || '',
    username: data.username || '',
    password: data.password || '',
    file: data.file || '',
    passphrase: data.passphrase || '',
  });
  const [registryData, setRegistryData] = useState({
    name: '',
    regsitry_url: '',
    username: '',
    password: '',
    file: '',
    passphrase: '',
  });

  useEffect(() => {
    if (data?.id) {
      setIsEdit(true);
      setRegistryId(data?.registry_id || '');
      setClusterId(data?.id);
    }
  }, []);

  return (
    <Wrapper>
      <Title
        title={isEdit ? 'Edit Cluster Details' : 'Add New Cluster Details'}
      />
      <Container>
        <NavTabs>
          <NavButton active={activeTab === 'cluster'}>
            Cluster Details
          </NavButton>
          <NavButton active={activeTab === 'registry'}>
            Registry Details
          </NavButton>
        </NavTabs>
      </Container>

      {activeTab === 'cluster' && !newRegistry && (
        <AddNewCluster
          setActiveTab={setActiveTab}
          setClusterData={setClusterData}
          clusterData={clusterData}
          isEdit={isEdit}
          clusterId={clusterId}
        />
      )}
      {activeTab === 'registry' && !newRegistry && (
        <AddRegistry
          setNewRegistry={setNewRegistry}
          registryData={registryData}
          clusterData={clusterData}
          setRegistryData={setRegistryData}
          setActiveTab={setActiveTab}
          isEdit={isEdit}
          registry_id={registryId}
          clusterId={clusterId}
        />
      )}
      {newRegistry && (
        <AddNewRegistry
          setActiveTab={setActiveTab}
          setRegistryData={setRegistryData}
          registryData={registryData}
          setNewRegistry={setNewRegistry}
          clusterData={clusterData}
          isEdit={isEdit}
          clusterId={clusterId}
          registry_id={registryId}
        />
      )}
    </Wrapper>
  );
};
