/* eslint-disable */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../../../shared';
import {
  createCluster,
  createRegistry,
  updateCluster,
  updateRegistry,
} from '../../../utils/services';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ClusterDetailsContainer = styled.div`
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Col = styled.div`
  flex: ${props => (props.size ? props.size : '1')};
  padding: 0 8px;
`;

const Title = styled.h4`
  margin-bottom: 8px;
`;

const Info = styled.div`
  width: ${props => (props.width ? props.width : '100%')};
`;

const ClusterName = styled.div`
  margin-bottom: 8px;
`;

const ClusterLink = styled.a`
  text-decoration: none;
`;

const Password = styled.div`
  text-decoration: none;
  margin-bottom: 0;
`;

const FileBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileIcon = styled.svg`
  width: 50px;
  height: 50px;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
`;

const FileSize = styled.div`
  text-align: end;
`;

const FileName = styled.div`
  margin-top: 8px;
`;

const FileInput = styled.input`
  display: none;
`;

export const SummaryModal = ({
  clusterData,
  registryData,
  openSummary,
  setOpenSummary,
  selectedRegistry = '',
  isEdit = false,
  clusterId,
  registry_id,
}) => {
  console.log('DATA..', clusterData);
  console.log('DATA..', registryData);

  const navigate = useNavigate();
  const [loadingPost, setLoadingPost] = useState(false);
  const addRegistry = async () => {
    const payload = new FormData();
    if (registryData?.registry_url)
      payload.append('registry_url', registryData.registry_url);

    if (registryData?.name) payload.append('name', registryData.name);

    if (registryData?.username)
      payload.append('username', registryData.username);

    if (registryData?.password)
      payload.append('password', registryData.password);

    if (registryData?.file) payload.append('file', registryData.file);

    if (registryData?.passphrase)
      payload.append('passphrase', registryData.passphrase);

    console.log(payload, '............>>>>>>>>>>>');
    const response = await createRegistry(payload);
    console.log('RES', response);
    if (response?.status === 201) {
      console.log('SUCCESS', response);
      addCluster({ registry_id: response?.data.id });
    } else {
      setLoadingPost(false);
      toast.error(response.message);
    }
  };

  const addCluster = async ({ registry_id }) => {
    // setLoading(true);
    const payload = new FormData();

    if (clusterData?.name) payload.append('name', clusterData.name);
    if (clusterData?.nifi_url) payload.append('nifi_url', clusterData.nifi_url);
    if (clusterData?.username) payload.append('username', clusterData.username);
    if (clusterData?.password) payload.append('password', clusterData.password);

    if (clusterData?.file) payload.append('file', clusterData?.file);
    if (clusterData?.passphrase)
      payload.append('passphrase', clusterData.passphrase);
    if (registry_id) payload.append('registry_id', registry_id);

    const response = await createCluster(payload);
    if (response?.status === 201) {
      navigate('/cluster');
      setLoadingPost(false);
      toast.success(response.message);
    } else {
      setLoadingPost(false);
      toast.error(response.message);
    }
  };

  const editRegistryData = async () => {
    // setLoading(true);
    console.log('reeeeeeeeeeee', registryData);
    const payload = new FormData();
    if (registryData?.name) payload.append('name', registryData.name);

    if (registryData?.username)
      payload.append('username', registryData.username);

    if (registryData?.passphrase)
      payload.append('passphrase', registryData.passphrase);

    if (registryData?.password)
      payload.append('password', registryData.password);

    registryData?.file.name && payload.append('file', registryData.file);

    const id = registry_id;
    const response = await updateRegistry(id, payload);
    console.log(response);
    if (response?.id) {
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrr');
      setLoadingPost(false);
      toast.success(response.message);
      navigate('/cluster');
    } else {
      setLoadingPost(false);
      toast.error(response.message);
    }
  };

  const editClusterData = async () => {
    console.log('clusteredit');
    // setLoading(true);
    const payload = new FormData();
    if (clusterData?.name) payload.append('name', clusterData.name);

    if (clusterData?.username) payload.append('username', clusterData.username);

    if (clusterData?.passphrase)
      payload.append('passphrase', clusterData.passphrase);

    if (clusterData?.password) payload.append('password', clusterData.password);

    clusterData?.file.name && payload.append('file', clusterData.file);

    const id = clusterId;
    const response = await updateCluster(id, payload);
    // setLoading(false);
    if (response?.id) {
      editRegistryData();
      console.log('succcccc');
    } else {
      console.log('errror');
      setLoadingPost(false);
      toast.error(response.message);
      // popup('error', error.data.message);
    }
  };

  const handleSubmit = () => {
    console.log(isEdit, 'editt');
    if (isEdit) {
      setLoadingPost(true);
      editClusterData();
    } else if (registryData.id) {
      setLoadingPost(true);
      addCluster({ registry_id: registryData.id });
    } else {
      setLoadingPost(true);
      addRegistry();
    }
  };

  return (
    <Modal
      title="Testing Successfull"
      isOpen={openSummary}
      onRequestClose={() => setOpenSummary(false)}
      size="lg"
      secondaryButtonText="Cancel"
      primaryButtonText="Continue"
      onSubmit={handleSubmit}
      isLoading={loadingPost}
    >
      <>
        <ClusterDetailsContainer>
          <Title>Cluster Details</Title>
          <Row>
            <Col size="6">
              <Row>
                <Info width="60%">
                  <Title>Cluster Name</Title>
                  <ClusterName>{clusterData.name}</ClusterName>
                </Info>
                <Info width="40%">
                  <Title>Cluster URL</Title>
                  <ClusterLink href="#">{clusterData.nifi_url}</ClusterLink>
                </Info>
              </Row>
              <Row>
                <Info width="60%">
                  <Title>Username</Title>
                  <ClusterName>{clusterData?.username || 'N/A'}</ClusterName>
                </Info>
                <Info width="40%">
                  <Title>Password</Title>
                  <Password>***********</Password>
                </Info>
              </Row>
              <Row>
                <Info width="60%">
                  <Title>PFX Passphrase</Title>
                  <ClusterName>{clusterData?.passphrase || 'N/A'}</ClusterName>
                </Info>
                <Info width="40%">
                  <Title>Nifi Certificate</Title>
                  <label
                    htmlFor="cluster-certificate"
                    style={{ position: 'relative' }}
                  >
                    <FileBox>
                      <FileIcon
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.4401 6.25H18.7493C14.821 6.25 12.8568 6.25 11.6364 7.47039C10.416 8.69078 10.416 10.655 10.416 14.5833V35.4167C10.416 39.345 10.416 41.3092 11.6364 42.5296C12.8568 43.75 14.821 43.75 18.7493 43.75H31.2494C35.1777 43.75 37.1419 43.75 38.3623 42.5296C39.5827 41.3092 39.5827 39.345 39.5827 35.4167V18.3926C39.5827 17.541 39.5827 17.1152 39.4241 16.7324C39.2655 16.3495 38.9644 16.0484 38.3623 15.4463L30.3864 7.47039C29.7843 6.86824 29.4832 6.56717 29.1003 6.40858C28.7175 6.25 28.2917 6.25 27.4401 6.25Z"
                          stroke="#33363F"
                          strokeWidth="2"
                        />
                        <path
                          d="M27.084 6.25V14.5833C27.084 16.5475 27.084 17.5296 27.6942 18.1398C28.3044 18.75 29.2865 18.75 31.2507 18.75H39.584"
                          stroke="#33363F"
                          strokeWidth="2"
                        />
                      </FileIcon>
                      <FileDetails>
                        <span className="me-2 pfx-file">PFX file</span>
                        <span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.99935 18.3327C5.39697 18.3327 1.66602 14.6017 1.66602 9.99935C1.66602 5.39697 5.39697 1.66602 9.99935 1.66602C14.6017 1.66602 18.3327 5.39697 18.3327 9.99935C18.3327 14.6017 14.6017 18.3327 9.99935 18.3327ZM9.16602 9.16602V14.166H10.8327V9.16602H9.16602ZM9.16602 5.83268V7.49935H10.8327V5.83268H9.16602Z"
                              fill="#DDE4F0"
                            />
                          </svg>
                        </span>
                      </FileDetails>
                      <FileSize>30MB</FileSize>
                    </FileBox>
                    <FileName>
                      {/* {clusterData?.file.name || clusterData?.file} */}
                      {/* {clusterData?.file
                        ? clusterData?.file || clusterData?.file.name
                        : 'N/A'} */}
                      {clusterData?.file
                        ? `${clusterData?.file?.name || clusterData?.file}`
                        : 'N/A'}
                    </FileName>
                    <FileInput type="file" id="cluster-certificate" />
                  </label>
                </Info>
              </Row>
            </Col>
          </Row>
        </ClusterDetailsContainer>
        {/* Repeat for the second cluster details */}
        <ClusterDetailsContainer>
          <Title>Registry Details</Title>
          <Row>
            <Col size="6">
              <Row>
                <Info width="60%">
                  <Title>Registry Name</Title>
                  <ClusterName>{registryData.name}</ClusterName>
                </Info>
                <Info width="40%">
                  <Title>Registry URL</Title>
                  <ClusterLink href="#">
                    {registryData.registry_url}
                  </ClusterLink>
                </Info>
              </Row>
              <Row>
                <Info width="60%">
                  <Title>Username</Title>
                  <ClusterName>{registryData?.username || 'N/A'}</ClusterName>
                </Info>
                <Info width="40%">
                  <Title>Password</Title>
                  <Password>
                    {registryData?.password ? '***********' : 'N/A'}
                  </Password>
                </Info>
              </Row>
              <Row>
                <Info width="60%">
                  <Title>PFX Passphrase</Title>
                  <ClusterName>
                    {registryData?.passphrase ? '***********' : 'N/A'}
                  </ClusterName>
                </Info>
                <Info width="40%">
                  <Title>Nifi Certificate</Title>
                  <label
                    htmlFor="cluster-certificate"
                    style={{ position: 'relative' }}
                  >
                    <FileBox>
                      <FileIcon
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.4401 6.25H18.7493C14.821 6.25 12.8568 6.25 11.6364 7.47039C10.416 8.69078 10.416 10.655 10.416 14.5833V35.4167C10.416 39.345 10.416 41.3092 11.6364 42.5296C12.8568 43.75 14.821 43.75 18.7493 43.75H31.2494C35.1777 43.75 37.1419 43.75 38.3623 42.5296C39.5827 41.3092 39.5827 39.345 39.5827 35.4167V18.3926C39.5827 17.541 39.5827 17.1152 39.4241 16.7324C39.2655 16.3495 38.9644 16.0484 38.3623 15.4463L30.3864 7.47039C29.7843 6.86824 29.4832 6.56717 29.1003 6.40858C28.7175 6.25 28.2917 6.25 27.4401 6.25Z"
                          stroke="#33363F"
                          strokeWidth="2"
                        />
                        <path
                          d="M27.084 6.25V14.5833C27.084 16.5475 27.084 17.5296 27.6942 18.1398C28.3044 18.75 29.2865 18.75 31.2507 18.75H39.584"
                          stroke="#33363F"
                          strokeWidth="2"
                        />
                      </FileIcon>
                      <FileDetails>
                        <span className="me-2 pfx-file">PFX file</span>
                        <span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.99935 18.3327C5.39697 18.3327 1.66602 14.6017 1.66602 9.99935C1.66602 5.39697 5.39697 1.66602 9.99935 1.66602C14.6017 1.66602 18.3327 5.39697 18.3327 9.99935C18.3327 14.6017 14.6017 18.3327 9.99935 18.3327ZM9.16602 9.16602V14.166H10.8327V9.16602H9.16602ZM9.16602 5.83268V7.49935H10.8327V5.83268H9.16602Z"
                              fill="#DDE4F0"
                            />
                          </svg>
                        </span>
                      </FileDetails>
                      <FileSize>30MB</FileSize>
                    </FileBox>
                    <FileName>
                      {/* {registryData?.file
                        ? registryData?.file || registryData?.file.name
                        : 'N/A'} */}
                      {registryData?.file
                        ? `${registryData?.file?.name || registryData?.file}`
                        : 'N/A'}
                    </FileName>
                    <FileInput type="file" id="cluster-certificate" />
                  </label>
                </Info>
              </Row>
            </Col>
          </Row>
        </ClusterDetailsContainer>

        <ToastContainer />
      </>
    </Modal>
  );
};
