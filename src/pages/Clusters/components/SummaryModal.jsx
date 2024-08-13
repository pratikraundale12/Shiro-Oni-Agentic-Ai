import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from '../../../shared';
import {
  createCluster,
  createRegistry,
  updateCluster,
  updateRegistry,
} from '../../../store/index1';
import { toast, ToastContainer } from 'react-toastify';
import { history } from '../../../helpers/history';
// import { FileIcon } from '../../../assets';

const ClusterDetailsContainer = styled.div`
  background-color: #f5f7fa;
  border-radius: 16px;
  padding: 14px 16px;
  min-height: 120px;
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

// const Password = styled.div`
//   text-decoration: none;
//   margin-bottom: 0;
// `;

// const FileBox = styled.div`
//   margin-left: 5px;
// `;

// const FileDetails = styled.div`
//   align-items: center !important;
//   justify-content: space-between !important;
//   display: flex;
//   font-size: 14px;
//   font-weight: 700;
//   line-height: 14px;
//   letter-spacing: -0.01em;
//   color: #4b5564;
// `;

// const FileSize = styled.div`
//   text-align: end;
// `;

// const Files = styled.div`
//   display: flex;
// `;

// const FileIconStyle = styled.div`
//   margin-left: -9px;
//   margin-top: -14px;
// `;

const ModalBody = styled.div`
  // padding: 18px 0 0;
  position: relative;
  padding-bottom: 2px;
`;

// const FileName = styled.div`
//   white-space: nowrap;
//   font-size: 12px;
//   font-weight: 400;
//   line-height: 14.52px;
//   letter-spacing: -0.005em;
//   color: #7a7a7a;
//   margin-top: 0.5rem;
// `;

const DetailsTitle = styled.div`
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 600;
  line-height: 21.79px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #4b5564;
`;

const RowTwo = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;
const TextEllipses = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  width: 100%;
  align-items: center;
`;
export const SummaryModal = ({
  clusterData,
  registryData,
  openSummary,
  setOpenSummary,
  clusterId,
  registry_id,
  edit,
}) => {
  const [loading, setLoading] = useState(false);
  const addRegistry = async () => {
    const data = {
      name: registryData?.registryName,
      registry_url: registryData?.registryUrl,
    };

    const response = await createRegistry(data);
    console.log('REGISTRY ID RESPONSE', response);
    if (response?.status === 201) {
      addCluster({ registry_id: response.data.id });
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  };

  const addCluster = async ({ registry_id }) => {
    const data = {
      name: clusterData.clusterName,
      nifi_url: clusterData.nifiUrl,
      registry_id: registry_id,
    };
    const response = await createCluster(data);
    if (response?.status === 201) {
      setLoading(false);

      history.push('/clusters');
      toast.success(response.message);
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  };

  const editRegistryData = async () => {
    const payload = {
      name: registryData.registryName,
      registry_url: registryData.registryUrl,
    };
    const id = registry_id;
    const response = await updateRegistry(id, payload);
    if (response?.id) {
      setLoading(false);
      toast.success(response.message);
      history.push('/clusters');
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  };

  const editClusterData = async () => {
    const payload = {
      name: clusterData.clusterName,
      nifi_url: clusterData.nifiUrl,
    };

    const id = clusterId;
    const response = await updateCluster(id, payload);
    if (response?.id) {
      editRegistryData();
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    if (edit) {
      editClusterData();
    } else if (registry_id) {
      addCluster({ registry_id: registry_id });
    } else {
      addRegistry();
    }
  };

  return (
    <>
      <Modal
        title="Cluster Summary"
        isOpen={openSummary}
        onRequestClose={() => setOpenSummary(false)}
        size="sm"
        secondaryButtonText="Cancel"
        primaryButtonText="Save"
        loading={loading}
        onSubmit={handleSubmit}
      >
        <ModalBody>
          <ClusterDetailsContainer>
            <DetailsTitle>Cluster Details</DetailsTitle>
            <Row>
              <Col>
                <RowTwo>
                  <Info width="50%">
                    <Title>Cluster Name</Title>
                    <ClusterName>{clusterData.clusterName}</ClusterName>
                  </Info>
                  <Info width="50%">
                    <Title>Cluster URL</Title>
                    <TextEllipses>{clusterData.nifiUrl}</TextEllipses>
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
                  <Info width="50%">
                    <Title>Registry Name</Title>
                    <ClusterName>
                      {registryData?.registryName || registryData?.name}
                    </ClusterName>
                  </Info>
                  <Info width="50%">
                    <Title>Registry URL</Title>
                    <TextEllipses>
                      {registryData?.registryUrl || registryData?.registry_url}
                    </TextEllipses>
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

SummaryModal.propTypes = {
  clusterData: PropTypes.object,
  registryData: PropTypes.object,
  openSummary: PropTypes.bool,
  setOpenSummary: PropTypes.func,
  isEdit: PropTypes.bool,
  clusterId: PropTypes.string,
  registry_id: PropTypes.string,
  edit: PropTypes.bool,
};
