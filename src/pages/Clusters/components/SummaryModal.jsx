import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { KDFM } from '../../../constants';
import { history } from '../../../helpers/history';
import { Modal } from '../../../shared';
import CopyToClipboard from '../../../shared/CopyToClipboard';
import {
  ClustersActions,
  ClustersSelectors,
  NamespacesActions,
} from '../../../store';
import {
  createCluster,
  createRegistry,
  updateCluster,
  updateRegistry,
} from '../../../store/index1';

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
  width: 100%;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Col = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 0.625rem;
  margin-bottom: 1rem;
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
  max-width: 100%;
  margin-top: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
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

const TextEllipses = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: #7a7a7a;
  white-space: nowrap;
  max-width: 16rem;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #7a7a7a;
`;

export const SummaryModal = ({
  // clusterData,
  registryData,
  openSummary,
  setOpenSummary,
  clusterId,
  registry_id,
  edit,
  notificationEnable,
  approverEnable,
  tags,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const clusterData = useSelector(ClustersSelectors.getAddEditClusterData);
  const addRegistry = async () => {
    const data = {
      name: registryData?.registryName,
      registry_url: registryData?.registryUrl,
    };

    const response = await createRegistry(data);
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
      name: clusterData?.clusterName,
      nifi_url: clusterData?.nifiUrl,
      registry_id: registry_id,
      tag: tags,
      notification_enable: notificationEnable,
      approver_enable: approverEnable,
    };
    const response = await createCluster(data);
    if (response?.status === 201) {
      setLoading(false);
      history.push('/clusters');
      dispatch(ClustersActions.updateClusterSuccessModal(true));
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
      tag: tags,
      notification_enable: notificationEnable,
    };
    const id = clusterId;
    const response = await updateCluster(id, payload);
    if (response?.id) {
      const cluster = localStorage.getItem('selected_cluster');

      // Check if the cluster exists in localStorage
      if (cluster) {
        const parsedCluster = JSON.parse(cluster); // Parse the string into an object

        // Now you can safely check if the value matches clusterId
        if (parsedCluster.value === clusterId) {
          localStorage.setItem(
            'selected_cluster',
            JSON.stringify({
              label: response.name,
              value: response.id,
            })
          );
          dispatch(
            NamespacesActions.setSelectedCluster({
              label: response.name,
              value: response.id,
            })
          );
        }
      }

      await editRegistryData();
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (edit) {
      editClusterData();
    } else if (registry_id) {
      addCluster({ registry_id: registry_id });
    } else {
      addRegistry();
    }
  };

  const renderData = [
    {
      title: KDFM.CLUSTER_DETAILS,
      entityNameLabel: KDFM.CLUSTER_NAME,
      entityNameValue: clusterData.clusterName,
      entityUrlLabel: KDFM.CLUSTER_URL,
      entityUrlValue: clusterData?.nifiUrl?.includes('/nifi')
        ? clusterData.nifiUrl
        : `${clusterData.nifiUrl}/nifi`,
    },
    {
      title: KDFM.REGISTRY_DETAILS,
      entityNameLabel: KDFM.REGISTRY_NAME,
      entityNameValue: registryData?.registryName || registryData?.name,
      entityUrlLabel: KDFM.REGISTRY_URL,
      entityUrlValue: (
        registryData?.registryUrl || registryData?.registry_url
      )?.includes('/nifi-registry')
        ? registryData?.registryUrl || registryData?.registry_url
        : `${registryData?.registryUrl || registryData?.registry_url}/nifi-registry`,
    },
  ];

  return (
    <>
      <Modal
        title={KDFM.CLUSTER_SUMMARY}
        isOpen={openSummary}
        onRequestClose={() => setOpenSummary(false)}
        size="sm"
        secondaryButtonText={KDFM.BACK}
        primaryButtonText={KDFM.SAVE}
        loading={loading}
        footerAlign="start"
        onSubmit={handleSubmit}
      >
        <ModalBody>
          {renderData.map(data => (
            <ClusterDetailsContainer key={data?.title}>
              <DetailsTitle>{data?.title}</DetailsTitle>
              <Row>
                <Col>
                  <Info width="50%">
                    <Title>{data?.entityNameLabel}</Title>
                    <ClusterName>{data?.entityNameValue}</ClusterName>
                  </Info>
                  <Info width="50%">
                    <Title>{data?.entityUrlLabel}</Title>
                    <Flex className="d-flex align-items-center">
                      <TextEllipses data-tooltip-id={data?.entityUrlValue}>
                        {data?.entityUrlValue}
                      </TextEllipses>
                      <span
                        data-tooltip-id={`copy-board-summary-modal${data?.entityUrlValue}`}
                      >
                        <CopyToClipboard
                          className="copy-button"
                          copyItem={data?.entityUrlValue}
                        />
                      </span>
                      <ReactTooltip
                        id={`copy-board-summary-modal${data?.entityUrlValue}`}
                        place="bottom"
                        effect="solid"
                        // content={'Copy URL'}
                        content={`${data?.title == 'Registry Details' ? 'Copy registry URL' : 'Copy cluster URL'}`}
                        style={{
                          width: '120px',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          zIndex: 10000,
                        }}
                      />
                      <ReactTooltip
                        id={data?.entityUrlValue}
                        content={data?.entityUrlValue}
                        place="bottom-start"
                        style={{
                          fontSize: '12px',
                          maxWidth: '20rem',
                          textAlign: 'center',
                        }}
                      />
                    </Flex>
                  </Info>
                </Col>
              </Row>
            </ClusterDetailsContainer>
          ))}
        </ModalBody>
      </Modal>
      {/* <ToastContainer
        theme="colored"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      /> */}
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
  notificationEnable: PropTypes.bool,
  approverEnable: PropTypes.bool,
  tags: PropTypes.string,
};
