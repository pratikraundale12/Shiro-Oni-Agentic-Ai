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
  // updateRegistry,
} from '../../../store/index1';
import { FullPageLoader } from '../../../components';
import { isEmpty } from 'lodash';
import { LockIcon } from '../../../assets';
import { theme } from '../../../styles';

const ClusterDetailsContainer = styled.div`
  background-color: #f5f7fa;
  border-radius: 16px;
  padding: 14px 16px;
  width: 100%;
  margin-bottom: 18px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: column;
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
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ModalBody = styled.div`
  position: relative;
  padding-bottom: 2px;
`;

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
  max-width: ${props => (props.linkMaxWidth ? props.linkMaxWidth : '16rem')};
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #7a7a7a;
`;

export const SummaryModal = ({
  registryData,
  openSummary,
  setOpenSummary,
  clusterId,
  registry_id,
  edit,
  notificationEnable,
  approverEnable,
  approverEnableForStartAndStop,
  tags,
  changeRequestEnable,
  certificateOption,
  selectedRegistriesArray = [],
  registries,
  default_registry_data,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const clusterData = useSelector(ClustersSelectors.getAddEditClusterData);
  const certificateNodesData = useSelector(
    ClustersSelectors.getTestCertificateNodes
  );

  const clusterTestResponse = useSelector(ClustersSelectors.getClusterFormData);

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

  // eslint-disable-next-line no-unused-vars
  const addCluster = async ({ registry_id }) => {
    const selectedRegistriesId = selectedRegistriesArray?.map(
      item => item?.value
    );
    const formData = new FormData();

    formData.append('name', clusterData?.clusterName || '');
    formData.append('nifi_url', clusterData?.nifiUrl || '');
    formData.append('registry_ids', selectedRegistriesId);
    formData.append('tag', tags);
    formData.append('notification_enable', notificationEnable);
    formData.append('approver_enable', approverEnable);
    formData.append(
      'start_stop_requires_approval',
      approverEnableForStartAndStop
    );
    formData.append('is_certificate_based_service_account', certificateOption);
    formData.append('change_request_enable', changeRequestEnable);

    if (clusterData?.logs_url) {
      formData.append('logs_url', clusterData.logs_url);
    }

    if (clusterData?.metrics_url) {
      formData.append('metrics_url', clusterData.metrics_url);
    }

    if (clusterData?.service_account_certificate) {
      formData.append(
        'service_account_certificate',
        clusterData.service_account_certificate
      );
    }

    if (clusterData?.service_account_certificate_password) {
      formData.append(
        'service_account_certificate_password',
        clusterData.service_account_certificate_password
      );
    }

    formData.append(
      'nodes',
      certificateNodesData && certificateNodesData.length > 0
        ? certificateNodesData
        : []
    );

    if (clusterTestResponse?.clusterType) {
      formData.append('clusterType', clusterTestResponse?.clusterType);
    }

    formData.append(
      'default_registry_id',
      default_registry_data?.value || default_registry_data || null
    );

    const response = await createCluster(formData); // createCluster must handle FormData

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

  const editClusterData = async () => {
    const formdata = new FormData();
    formdata.append('name', clusterData.clusterName);
    formdata.append('nifi_url', clusterData.nifiUrl);
    formdata.append('tag', tags);
    formdata.append('notification_enable', notificationEnable);
    formdata.append('approver_enable', approverEnable);
    formdata.append('change_request_enable', changeRequestEnable);
    formdata.append('has_custom_service_account', false);
    formdata.append(
      'start_stop_requires_approval',
      approverEnableForStartAndStop
    );
    formdata.append('is_certificate_based_service_account', certificateOption);
    const selectedRegistriesId = selectedRegistriesArray?.map(
      item => item?.value
    );
    formdata.append('registry_ids', selectedRegistriesId);
    formdata.append(
      'default_registry_id',
      default_registry_data?.value || default_registry_data || null
    );

    formdata.append('registry_id', registryData.id);

    const id = clusterId;
    const response = await updateCluster(id, formdata);
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

      setLoading(false);
      toast.success('Cluster updated successfully');
      history.push('/clusters');
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

  const partialIds = selectedRegistriesArray.map(item => item.value);

  const selectedRegistriesWithAllData = registries.reduce((acc, item) => {
    if (partialIds.includes(item.value)) {
      acc.push({
        ...item,
        isDefault: item.value === default_registry_data,
      });
    }
    return acc;
  }, []);

  const registriesToDisplay = {
    title: KDFM.REGISTRY_DETAILS,
    entityNameLabel: KDFM.REGISTRY_NAME,
    entityNameValue: 'N/A',
    entityUrlLabel: KDFM.REGISTRY_URL,
    entityUrlValue: 'N/A',
    tooltipContent: 'Copy Registry URL',
    tooltipId: 'registry-url-tooltip-id',
    isMultipleData: true,
    elements:
      (!isEmpty(selectedRegistriesWithAllData) &&
        selectedRegistriesWithAllData?.map(ele => ({
          name: ele?.label,
          url: (ele?.registryUrl || ele?.registry_url)?.includes(
            '/nifi-registry'
          )
            ? ele?.registryUrl || ele?.registry_url
            : `${ele?.registryUrl || ele?.registry_url}/nifi-registry`,
          isDefault: ele.isDefault,
        }))) ||
      [],
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
      tooltipContent: 'Copy Cluster URL',
      tooltipId: 'cluster-url-tooltip-id',
    },
    ...[registriesToDisplay],
    ...(!isEmpty(clusterData?.metrics_url)
      ? [
          {
            entityUrlLabel: KDFM.METRICS_URL,
            entityUrlValue: clusterData.metrics_url,
            width: '100%',
            tooltipContent: 'Copy Metrics URL',
            linkMaxWidth: '24.3rem',
            tooltipId: 'metrics-url-tooltip-id',
          },
        ]
      : []),
    ...(!isEmpty(clusterData?.logs_url)
      ? [
          {
            entityUrlLabel: KDFM.LOGS_URL,
            entityUrlValue: clusterData.logs_url,
            width: '100%',
            tooltipContent: 'Copy Logs URL',
            linkMaxWidth: '24.3rem',
            tooltipId: 'logs-url-tooltip-id',
          },
        ]
      : []),
  ];

  return (
    <>
      <FullPageLoader loading={loading} />
      <Modal
        title={KDFM.CLUSTER_SUMMARY}
        isOpen={openSummary}
        onRequestClose={() => setOpenSummary(false)}
        size="sm"
        secondaryButtonText={KDFM.BACK}
        primaryButtonText={KDFM.SAVE}
        footerAlign="start"
        onSubmit={handleSubmit}
      >
        <ModalBody>
          {renderData.map(data => (
            <ClusterDetailsContainer key={data?.title}>
              <DetailsTitle>{data?.title}</DetailsTitle>
              {data?.isMultipleData ? (
                <>
                  <Row>
                    <Col>
                      <Info width="50%">
                        <Title>{data?.entityNameLabel}</Title>
                      </Info>
                      <Info width={data?.width || '40%'}>
                        <Title>{data?.entityUrlLabel}</Title>
                      </Info>
                    </Col>

                    {/*  */}
                    {data?.elements?.map(ele => (
                      <Col key={ele?.id || ele?.name}>
                        <Info width="50%">
                          <ClusterName>
                            {ele?.name} &nbsp;
                            {ele?.isDefault && (
                              <>
                                <span data-tooltip-id={`default-registry`}>
                                  <LockIcon
                                    color={theme.colors.primary}
                                    width={20}
                                    height={20}
                                  />
                                </span>
                                <ReactTooltip
                                  id={`default-registry`}
                                  place="right"
                                  effect="solid"
                                  content={'Default Registry'}
                                  style={{
                                    width: '140px',
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    zIndex: 10000,
                                  }}
                                />
                              </>
                            )}
                          </ClusterName>
                        </Info>
                        <Info width={data?.width || '40%'}>
                          <Flex className="d-flex align-items-center">
                            <TextEllipses
                              linkMaxWidth={data?.linkMaxWidth || '16rem'}
                              data-tooltip-id={ele?.url}
                            >
                              {ele?.url}
                            </TextEllipses>
                            <span data-tooltip-id={data?.tooltipId}>
                              <CopyToClipboard
                                className="copy-button"
                                copyItem={ele?.url}
                              />
                            </span>
                            <ReactTooltip
                              id={data?.tooltipId}
                              place="bottom"
                              effect="solid"
                              content={data?.tooltipContent}
                              style={{
                                width: '120px',
                                whiteSpace: 'normal',
                                wordWrap: 'break-word',
                                zIndex: 10000,
                              }}
                            />
                            <ReactTooltip
                              id={ele?.url}
                              content={ele?.url}
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
                    ))}
                  </Row>
                </>
              ) : (
                <Row>
                  <Col>
                    <Info width="50%">
                      <Title>{data?.entityNameLabel}</Title>
                      <ClusterName>{data?.entityNameValue}</ClusterName>
                    </Info>
                    <Info width={data?.width || '40%'}>
                      <Title>{data?.entityUrlLabel}</Title>
                      <Flex className="d-flex align-items-center">
                        <TextEllipses
                          linkMaxWidth={data?.linkMaxWidth || '16rem'}
                          data-tooltip-id={data?.entityUrlValue}
                        >
                          {data?.entityUrlValue}
                        </TextEllipses>
                        <span data-tooltip-id={data?.tooltipId}>
                          <CopyToClipboard
                            className="copy-button"
                            copyItem={data?.entityUrlValue}
                          />
                        </span>
                        <ReactTooltip
                          id={data?.tooltipId}
                          place="bottom"
                          effect="solid"
                          content={data?.tooltipContent}
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
              )}
            </ClusterDetailsContainer>
          ))}
        </ModalBody>
      </Modal>
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
  approverEnableForStartAndStop: PropTypes.bool,
  tags: PropTypes.string,
  changeRequestEnable: PropTypes.bool,
  certificateOption: PropTypes.bool,
  selectedRegistriesArray: PropTypes.array,
  registries: PropTypes.array,
  default_registry_data: PropTypes.any,
};
