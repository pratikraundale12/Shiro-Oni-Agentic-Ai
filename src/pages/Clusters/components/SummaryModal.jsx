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
import { FileIcon } from '../../../assets';

const ClusterDetailsContainer = styled.div`
  background-color: #f5f7fa;
  border-radius: 16px;
  padding: 14px 16px;
  min-height: 290px;
  width: 100%;
  margin-bottom: 18px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
`;

const Col = styled.div`
flex: 0 0 auto;
    width: 50%;
}
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #2d343f;
  margin-bottom: 0.5rem;
`;

const Info = styled.div`
  width: ${props => (props.width ? props.width : '100%')};
`;

const ClusterName = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 18.52px;
  letter-spacing: -0.005em;
  color: #7a7a7a;
  white-space: nowrap;
`;

const ClusterLink = styled.a`
  text-decoration: none;
  white-space: nowrap;
`;

const Password = styled.div`
  text-decoration: none;
  margin-bottom: 0;
`;

const FileBox = styled.div`
  margin-left: 5px;
`;

const FileDetails = styled.div`
  align-items: center !important;
  justify-content: space-between !important;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #4b5564;
`;

const FileSize = styled.div`
  text-align: end;
`;

const Files = styled.div`
  display: flex;
`;

const FileIconStyle = styled.div`
  margin-left: -9px;
  margin-top: -14px;
`;

const ModalBody = styled.div`
  // padding: 18px 0 0;
  position: relative;
`;

const FileName = styled.div`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 400;
  line-height: 14.52px;
  letter-spacing: -0.005em;
  color: #7a7a7a;
  margin-top: 0.5rem;
`;

const DetailsTitle = styled.div`
  font-family: noto sans;
  font-size: 16px;
  font-weight: 600;
  line-height: 21.79px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #4b5564;
  margin-bottom: 20px;
`;

const RowTwo = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
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
  console.log('CLUSTERDATA..', clusterData);
  console.log('REGISTRYDATA..', registryData);

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

    registryData?.file?.name && payload.append('file', registryData.file.name);

    const id = registry_id;
    const response = await updateRegistry(id, payload);
    console.log(response);
    if (response?.id) {
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

    if (clusterData?.username != '') {
      payload.append('username', clusterData.username);
    } else {
      payload.append('username', null);
    }

    // if (clusterData?.file != '') {
    //   payload.append('file', clusterData?.file);
    // } else {
    //   payload.append('file', null);
    // }

    if (clusterData?.passphrase != '') {
      payload.append('passphrase', clusterData.passphrase);
    } else {
      payload.append('passphrase', null);
    }

    if (clusterData?.password != '') {
      payload.append('password', clusterData.password);
    } else {
      payload.append('password', null);
    }

    clusterData?.file?.name && payload.append('file', clusterData.file);

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
    <>
      <Modal
        title="Cluster Summary"
        isOpen={openSummary}
        onRequestClose={() => setOpenSummary(false)}
        size="lg"
        secondaryButtonText="Cancel"
        primaryButtonText="Continue"
        onSubmit={handleSubmit}
        isLoading={loadingPost}
      >
        <ModalBody>
          <ClusterDetailsContainer>
            <DetailsTitle>Cluster Details</DetailsTitle>
            <Row>
              <Col>
                <RowTwo>
                  <Info width="60%">
                    <Title>Cluster Name</Title>
                    <ClusterName>{clusterData.name}</ClusterName>
                  </Info>
                  <Info width="40%">
                    <Title>Cluster URL</Title>
                    <ClusterName href="#">{clusterData.nifi_url}</ClusterName>
                  </Info>
                </RowTwo>
                <RowTwo>
                  <Info width="60%">
                    <Title>Username</Title>
                    <ClusterName>{clusterData?.username || 'N/A'}</ClusterName>
                  </Info>
                  <Info width="40%">
                    <Title>Password</Title>
                    <Password>
                      {clusterData?.password ? '***********' : 'N/A'}
                    </Password>
                  </Info>
                </RowTwo>
                <RowTwo>
                  <Info width="60%">
                    <Title>PFX Passphrase</Title>
                    <ClusterName>
                      {' '}
                      {clusterData?.passphrase ? '**********' : 'N/A'}
                    </ClusterName>
                  </Info>
                  <Info width="40%">
                    <Title>Nifi Certificate</Title>
                    <Files>
                      <FileIconStyle>
                        <FileIcon width={30} height={70} />
                      </FileIconStyle>
                      <FileBox>
                        <FileDetails>
                          <span>PFX file</span>
                          {clusterData?.file && <FileSize>3.7KB</FileSize>}
                        </FileDetails>

                        <FileName>
                          {clusterData?.file
                            ? `${clusterData?.file?.name || clusterData?.file}`
                            : 'N/A'}
                        </FileName>
                      </FileBox>
                    </Files>
                  </Info>
                </RowTwo>
              </Col>
            </Row>
          </ClusterDetailsContainer>

          <ClusterDetailsContainer>
            <DetailsTitle>Registry Details</DetailsTitle>
            <Row>
              <Col>
                <RowTwo>
                  <Info width="60%">
                    <Title>Registry Name</Title>
                    <ClusterName>{registryData.name}</ClusterName>
                  </Info>
                  <Info width="40%">
                    <Title>Registry URL</Title>
                    <ClusterName href="#">
                      {registryData.registry_url}
                    </ClusterName>
                  </Info>
                </RowTwo>
                <RowTwo>
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
                </RowTwo>
                <RowTwo>
                  <Info width="60%">
                    <Title>PFX Passphrase</Title>
                    <ClusterName>
                      {' '}
                      {registryData?.passphrase ? '**********' : 'N/A'}
                    </ClusterName>
                  </Info>
                  <Info width="40%">
                    <Title>Nifi Certificate</Title>
                    <Files>
                      <FileIconStyle>
                        <FileIcon width={30} height={70} />
                      </FileIconStyle>
                      <FileBox>
                        <FileDetails>
                          <span>PFX file</span>
                          {registryData?.file && <FileSize>3.7KB</FileSize>}
                        </FileDetails>

                        <FileName>
                          {registryData?.file
                            ? `${registryData?.file?.name || registryData?.file}`
                            : 'N/A'}
                        </FileName>
                      </FileBox>
                    </Files>
                  </Info>
                </RowTwo>
              </Col>
            </Row>
          </ClusterDetailsContainer>
        </ModalBody>
      </Modal>
      <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};
