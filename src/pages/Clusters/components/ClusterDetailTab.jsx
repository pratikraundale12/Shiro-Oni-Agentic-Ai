/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  CheckboxField,
  InputField,
  Modal,
  ModalWithIcon,
  RadioSelectField,
  SelectField,
} from '../../../shared';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  InfoIcon,
  NotePadIcon,
  PlusIcon,
  QRIcons,
} from '../../../assets';
import styled from 'styled-components';
import { FullPageLoader, StatusRender, Table } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { AddHostIPModal } from './AddHostIPModal';
import { isEmpty } from 'lodash';
import { KDFM } from '../../../constants';
import { toast } from 'react-toastify';
import CopyToClipboard from '../../../shared/CopyToClipboard';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { theme } from '../../../styles';

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;

const ClusterDetailTab = ({
  control,
  errors,
  register,
  watch,
  hostList,
  setHostList,
  setValue,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [deleteNodes, setDeleteNodes] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'getNiFiVersions')
  );
  const loadingAddAPI = useSelector(state =>
    LoadingSelectors.getLoading(state, 'checkCredentialsClusterSetup')
  );
  const configListData = useSelector(ClustersSelectors.getConfigNameList);
  const clusterIdForAnsible = useSelector(
    ClustersSelectors.getansibleClucterToEdit
  );
  const ansibleClusterDataForEdit = useSelector(
    ClustersSelectors.getAnsibleClusterData
  );
  const nodesUpdateAnsbibleClusterId = useSelector(
    ClustersSelectors.getAnsibleClusterNodeUpdate
  );

  const handleSetValue = () => {
    if (ansibleClusterDataForEdit) {
      setValue('clusterName', ansibleClusterDataForEdit?.name);
    }
  };
  useEffect(() => {
    if (!isEmpty(ansibleClusterDataForEdit) && !isEmpty(clusterIdForAnsible)) {
      handleSetValue();
      dispatch(
        ClustersActions.fetchHostNodesList({
          selected: false,
          clusterId: clusterIdForAnsible,
          update_node: false,
        })
      );
    } else if (
      !isEmpty(ansibleClusterDataForEdit) &&
      !isEmpty(nodesUpdateAnsbibleClusterId)
    ) {
      handleSetValue();
      dispatch(
        ClustersActions.fetchHostNodesList({
          selected: false,
          clusterId: nodesUpdateAnsbibleClusterId,
          update_node: true,
        })
      );
    }
  }, [ansibleClusterDataForEdit, nodesUpdateAnsbibleClusterId]);

  const configVerionListData = useSelector(
    ClustersSelectors.getConfigVersionList
  );

  const nifiVersionsData = useSelector(ClustersSelectors.getNifiVersions);
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);
  const selectedNiFiVersion = useSelector(
    ClustersSelectors.getClusterSetupSelectedNiFiVersion
  );
  const isAddTrustoreCert = watch('isTruststoreCertificateAdd');
  const itemsForList = useMemo(() => {
    return listHostIpData.filter(ele => !ele?.is_selected);
  }, [listHostIpData]);

  useEffect(() => {
    if (!isEmpty(listHostIpData) && !isEmpty(clusterIdForAnsible)) {
      setHostList(listHostIpData);
    }
  }, [listHostIpData]);

  useEffect(() => {
    if (!isEmpty(listHostIpData) && !isEmpty(nodesUpdateAnsbibleClusterId)) {
      setHostList(listHostIpData);
    }
  }, [listHostIpData, nodesUpdateAnsbibleClusterId]);

  const configVersionOptions = useMemo(() => {
    if (isEmpty(configVerionListData)) return [];

    return configVerionListData.map(ele => ({
      label: String(ele?.config_version),
      value: String(ele?.config_version),
    }));
  }, [configVerionListData]);

  const configNameOptions = useMemo(() => {
    if (isEmpty(configListData)) return [];

    return configListData.map(ele => ({
      label: ele?.config_name,
      value: ele?.config_name,
    }));
  }, [configListData]);

  const nifiVerionsOptions = useMemo(() => {
    if (isEmpty(nifiVersionsData)) return [];

    return nifiVersionsData.map(ele => ({
      label: ele?.nifi_version,
      value: ele?.nifi_version,
    }));
  }, [nifiVersionsData]);

  const nifiVersion = watch('nifiVersion');
  const configName = watch('configName');

  useEffect(() => {
    if (!isEmpty(selectedNiFiVersion) && !isEmpty(nifiVerionsOptions)) {
      setValue('nifiVersion', selectedNiFiVersion);
    }
  }, [selectedNiFiVersion, nifiVerionsOptions]);

  useEffect(() => {
    if (nifiVersion) {
      if (
        !isEmpty(clusterIdForAnsible) &&
        parseFloat(nifiVersion) <
          parseFloat(ansibleClusterDataForEdit?.nifi_version)
      ) {
        toast.error('Please select upper version');
        setValue('nifiVersion', ansibleClusterDataForEdit?.nifi_version);
      } else {
        dispatch(ClustersActions.getConfigList(nifiVersion));
        setValue('configName', '');
        setValue('configVersion', '');
      }
    }
  }, [nifiVersion]);

  useEffect(() => {
    if (configName) {
      dispatch(ClustersActions.getConfigVersions(configName));
      setValue('configVersion', '');
    }
  }, [configName]);

  useEffect(() => {
    if (isEmpty(clusterIdForAnsible)) {
      dispatch(
        ClustersActions.fetchHostNodesList({
          selected: false,
          clusterId: null,
          update_node: false,
        })
      );
    }

    dispatch(ClustersActions.getNiFiVersions());
    return () => {
      dispatch(ClustersActions.setLastVisitedTab('cluster_details'));
    };
  }, [dispatch]);

  const handleCheck = ele => {
    if (!isEmpty(nodesUpdateAnsbibleClusterId)) {
      setHostList(prevData => {
        const updatedData = prevData.map(item =>
          item.id === ele?.id
            ? { ...item, is_selected: !item.is_selected }
            : item
        );
        const atLeastOneStillSelected = listHostIpData.some(staticItem => {
          const updatedItem = updatedData.find(u => u.id === staticItem.id);
          return staticItem.is_selected && updatedItem?.is_selected;
        });
        if (!atLeastOneStillSelected) {
          toast.error(
            'At least one previously selected node must remain selected'
          );
          return prevData;
        }
        return updatedData;
      });
    } else {
      setHostList(prevData =>
        prevData.map(item =>
          item.id === ele?.id
            ? { ...item, is_selected: !item.is_selected }
            : item
        )
      );
    }
  };
  const checkDisabledCheckbox = item => {
    const currentItem = listHostIpData?.filter(ele => ele?.id === item?.id);
    if (currentItem?.[0]?.is_selected) {
      return true;
    } else {
      return false;
    }
  };

  const handleDeleteNodeCheck = ele => {
    const targetItem = deleteNodes.find(item => item.id === ele?.id);

    if (!targetItem.hasToDelete) {
      const alreadyMarked = deleteNodes.filter(item => item.hasToDelete);

      if (alreadyMarked.length === deleteNodes.length - 1) {
        toast.error(
          'At least one existing associated node must remain in cluster'
        );
        return;
      }
    }
    const updatedData = deleteNodes.map(item =>
      item.id === ele?.id ? { ...item, hasToDelete: !item.hasToDelete } : item
    );
    setDeleteNodes(updatedData);
  };
  const handleDeleteNodes = () => {
    if (isEmpty(deleteNodes.filter(item => item.hasToDelete))) {
      toast.error('No node selected');
    } else {
      setDeleteConfirmationModalOpen(true);
    }
  };
  const handleConfirmDelete = () => {
    const alreadyMarked = deleteNodes.filter(item => item.hasToDelete);
    const deselectedNodesIds = alreadyMarked.map(ele => ele?.id);
    dispatch(
      ClustersActions.updateNodesAnsibleCluster({
        clusterId: nodesUpdateAnsbibleClusterId,
        payload: {
          nodeIdsToRemove: deselectedNodesIds,
          nodeIdsToAdd: [],
        },
      })
    );
  };
  const COLUMNS = [
    {
      label: <></>,
      renderCell: item => (
        <div className="d-flex justify-content-center">
          {isEmpty(clusterIdForAnsible) ? (
            <CheckboxField
              name="check"
              checked={item?.is_selected}
              disabled={
                !isEmpty(nodesUpdateAnsbibleClusterId)
                  ? checkDisabledCheckbox(item)
                  : false
              }
              onChange={() => {
                handleCheck(item);
              }}
            />
          ) : (
            <></>
          )}
        </div>
      ),
      resize: true,
      width: '5%',
    },
    {
      label: 'Available Host IP',
      renderCell: item => (
        <>
          <div className="d-flex gap-2">
            {item?.host_ip}
            <span data-tooltip-id={`copy-${item?.host_ip}-host-url`}>
              <CopyToClipboard copyItem={item?.host_ip} />
            </span>
            <ReactTooltip
              id={`copy-${item?.host_ip}-host-url`}
              place="bottom"
              effect="solid"
              content={'Copy URL'}
              style={{
                width: '100px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                zIndex: 10000,
              }}
            />
          </div>
        </>
      ),
      resize: true,
      width: '45%',
    },
    {
      label: 'Host',
      renderCell: item => <>{item?.host_name || 'N/A'}</>,
      resize: true,
      width: '10%',
    },
    {
      label: 'Port No.',
      renderCell: item => <>{item?.port}</>,
      resize: true,
      width: '15%',
    },
    {
      label: 'Username',
      renderCell: item => (
        <>
          {' '}
          <NotePadIcon
            height="21"
            width="21"
            color={item?.has_certificate ? theme.colors.primary : '#fff'}
          />
          {item?.username}
        </>
      ),
      resize: true,
      width: '15%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusRender
          status={item?.status === 'Active' ? 'Active' : 'Inactive'}
          redColor="#FF0000"
        />
      ),
      resize: true,
      width: '10%',
    },
  ];
  const COLUMNS_FOR_DELETE_NODE = [
    {
      label: <></>,
      renderCell: item => (
        <div className="d-flex justify-content-center">
          {isEmpty(clusterIdForAnsible) ? (
            <CheckboxField
              name="check_delete"
              checked={item?.hasToDelete}
              onChange={() => {
                handleDeleteNodeCheck(item);
              }}
            />
          ) : (
            <></>
          )}
        </div>
      ),
      resize: true,
      width: '5%',
    },
    {
      label: 'Available Host IP',
      renderCell: item => (
        <>
          <div className="d-flex gap-2">
            {item?.host_ip}
            <span data-tooltip-id={`copy-${item?.host_ip}-host-url`}>
              <CopyToClipboard copyItem={item?.host_ip} />
            </span>
            <ReactTooltip
              id={`copy-${item?.host_ip}-host-url`}
              place="bottom"
              effect="solid"
              content={'Copy URL'}
              style={{
                width: '100px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                zIndex: 10000,
              }}
            />
          </div>
        </>
      ),
      resize: true,
      width: '45%',
    },
    {
      label: 'Port No.',
      renderCell: item => <>{item?.port}</>,
      resize: true,
      width: '15%',
    },
    {
      label: 'Username',
      renderCell: item => <>{item?.username}</>,
      resize: true,
      width: '25%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <StatusRender
          status={item?.status === 'Active' ? 'Active' : 'Inactive'}
          redColor="#FF0000"
        />
      ),
      resize: true,
      width: '10%',
    },
  ];
  useEffect(() => {
    dispatch(ClustersActions.setConfigNameList([]));
  }, [dispatch]);
  useEffect(() => {
    if (isEmpty(clusterIdForAnsible) || isEmpty(nodesUpdateAnsbibleClusterId)) {
      setHostList(itemsForList);
    }
  }, [itemsForList]);

  useEffect(() => {
    if (
      ansibleClusterDataForEdit?.config_version &&
      !isEmpty(configVersionOptions) &&
      !isEmpty(nodesUpdateAnsbibleClusterId) &&
      configVersionOptions.some(
        user => user?.value == ansibleClusterDataForEdit?.config_version
      )
    ) {
      setValue(
        'configVersion',
        String(ansibleClusterDataForEdit?.config_version)
      );
      setHostList(listHostIpData);
    }
  }, [configVersionOptions, ansibleClusterDataForEdit]);

  useEffect(() => {
    if (
      ansibleClusterDataForEdit?.config_version &&
      !isEmpty(configVersionOptions) &&
      !isEmpty(clusterIdForAnsible) &&
      configVersionOptions.some(
        user => user?.value == ansibleClusterDataForEdit?.config_version
      )
    ) {
      setValue(
        'configVersion',
        String(ansibleClusterDataForEdit?.config_version)
      );
      setHostList(listHostIpData);
    }
  }, [configVersionOptions, ansibleClusterDataForEdit]);

  useEffect(() => {
    if (
      ansibleClusterDataForEdit?.config_name &&
      !isEmpty(configNameOptions) &&
      !isEmpty(nodesUpdateAnsbibleClusterId) &&
      configNameOptions.some(
        user => user?.value === ansibleClusterDataForEdit?.config_name
      )
    ) {
      setValue('configName', ansibleClusterDataForEdit?.config_name);
      dispatch(
        ClustersActions.getConfigVersions(
          ansibleClusterDataForEdit?.config_name
        )
      );
    }
  }, [configNameOptions, ansibleClusterDataForEdit]);

  useEffect(() => {
    if (
      ansibleClusterDataForEdit?.config_name &&
      !isEmpty(configNameOptions) &&
      !isEmpty(clusterIdForAnsible) &&
      configNameOptions.some(
        user => user?.value === ansibleClusterDataForEdit?.config_name
      )
    ) {
      setValue('configName', ansibleClusterDataForEdit?.config_name);
      dispatch(
        ClustersActions.getConfigVersions(
          ansibleClusterDataForEdit?.config_name
        )
      );
    }
  }, [configNameOptions, ansibleClusterDataForEdit]);

  useEffect(() => {
    if (
      ansibleClusterDataForEdit?.nifi_version &&
      (!isEmpty(clusterIdForAnsible) || !isEmpty(nodesUpdateAnsbibleClusterId))
    ) {
      setValue('nifiVersion', ansibleClusterDataForEdit?.nifi_version);
      dispatch(
        ClustersActions.getConfigList(ansibleClusterDataForEdit.nifi_version)
      );
    }
  }, [
    nifiVerionsOptions,
    ansibleClusterDataForEdit,
    nodesUpdateAnsbibleClusterId,
  ]);

  useEffect(() => {
    if (!isEmpty(clusterIdForAnsible)) {
      dispatch(ClustersActions.fetchAnsibleClusterData(clusterIdForAnsible));
    } else if (!isEmpty(nodesUpdateAnsbibleClusterId)) {
      dispatch(
        ClustersActions.fetchAnsibleClusterData(nodesUpdateAnsbibleClusterId)
      );
    }
  }, [clusterIdForAnsible, nodesUpdateAnsbibleClusterId]);

  const handleNiFiVersionChange = () => {
    setValue('configName', '');
    setValue('configVersion', '');
  };
  useEffect(() => {
    if (!isEmpty(hostList) && !isEmpty(nodesUpdateAnsbibleClusterId)) {
      const hostListForDeleteNodes = hostList?.filter(ele => ele?.is_selected);
      const deleteKeyArray = hostListForDeleteNodes?.map(item => ({
        ...item,
        hasToDelete: false,
      }));
      setDeleteNodes(deleteKeyArray);
    }
  }, [hostList]);
  const KEYSTORE_SELECTION_OPTIONS = [
    { id: 1, value: 'true', label: 'True' },
    { id: 2, value: 'false', label: 'False' },
  ];
  return (
    <>
      <FullPageLoader loading={loading || loadingAddAPI} />
      <div className="row mt-3 ms-2 me-2">
        {' '}
        <div className="col-6">
          <LabelSelect className="mb-3">{KDFM.CLUSTER_NAME}</LabelSelect>
          <InputField
            name="clusterName"
            type="text"
            placeholder={KDFM.ENTER_YOUR_CLUSTER_NAME}
            required
            register={register}
            errors={errors}
            icon={<QRIcons />}
            disabled={
              !isEmpty(clusterIdForAnsible) ||
              !isEmpty(nodesUpdateAnsbibleClusterId)
            }
          />
        </div>
      </div>
      <div className="row mt-1 ms-2 me-2 mb-2">
        <div className="col-4">
          <LabelSelect className="mb-3">{KDFM.NIFI_VERSION}</LabelSelect>
          <SelectField
            name="nifiVersion"
            icon={<QRIcons />}
            register={register}
            errors={errors}
            control={control}
            options={nifiVerionsOptions || []}
            placeholder={KDFM.SELECT_NIFI_VERSION}
            onChange={handleNiFiVersionChange}
            disabled={!isEmpty(nodesUpdateAnsbibleClusterId)}
          />
        </div>
        <div className="col-4">
          <LabelSelect className="mb-3">{KDFM.CONFIG_NAME}</LabelSelect>
          <SelectField
            name="configName"
            icon={<QRIcons />}
            register={register}
            errors={errors}
            control={control}
            options={configNameOptions || []}
            placeholder={KDFM.SELECT_CONFIG_NAME}
            disabled={!isEmpty(nodesUpdateAnsbibleClusterId)}
          />
        </div>
        <div className="col-4">
          <LabelSelect className="mb-3">{KDFM.CONFIG_VERSION}</LabelSelect>
          <SelectField
            name="configVersion"
            icon={<QRIcons />}
            register={register}
            errors={errors}
            control={control}
            options={configVersionOptions || []}
            placeholder={KDFM.SELECT_CONFIG_VERSION}
            disabled={!isEmpty(nodesUpdateAnsbibleClusterId)}
          />
        </div>
        <>
          {!(
            !isEmpty(clusterIdForAnsible) ||
            !isEmpty(nodesUpdateAnsbibleClusterId)
          ) && (
            <>
              <div className="mt-3">
                {
                  <>
                    <InfoIcon color={theme.colors.primary} /> &nbsp; Keystore
                    holds this NiFi node’s own security certificate (its
                    identity), while Truststore contains certificates of trusted
                    systems. Together, they enable secure communication within
                    the NiFi cluster.
                  </>
                }
              </div>
              <div className="col-4 mt-2">
                <RadioSelectField
                  name="isTruststoreCertificateAdd"
                  options={KEYSTORE_SELECTION_OPTIONS}
                  register={register}
                  defaultValue={'false'}
                  label={'Add Certificates'}
                />
              </div>
            </>
          )}
        </>
      </div>
      <div className="row mx-auto">
        <div className="col-auto ms-2">
          <Button
            size="md"
            onClick={() =>
              dispatch(ClustersActions.setActiveTabClusterSetup('manage_host'))
            }
            className="w-auto px-3"
            style={{ minWidth: 'auto' }}
          >
            <div
              className="d-flex "
              style={{ fontSize: '14px', fontWeight: '750' }}
            >
              <PlusIcon height={19} width={19} color={'#fff'} />
              {KDFM.MANAGE_HOST}
            </div>
          </Button>
        </div>{' '}
        {!isEmpty(nodesUpdateAnsbibleClusterId) && (
          <div className="col-auto ms-1">
            <Button
              size="md"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-auto px-3"
              style={{ minWidth: 'auto' }}
            >
              <div
                className="d-flex "
                style={{ fontSize: '14px', fontWeight: '750' }}
              >
                <DeleteSmallIcon color={'#fff'} height={18} width={18} />
                Delete Nodes
              </div>
            </Button>
          </div>
        )}
      </div>
      <div
        className="mt-4 px-3"
        style={{ height: 'calc(100% - 264px)', overflow: 'auto' }}
      >
        <Table
          data={hostList || []}
          columns={COLUMNS}
          customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
          tableWithFullHeight={true}
        />
      </div>
      <AddHostIPModal />
      <Modal
        title="Existing Associated Nodes"
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        size="sm"
        loading={loading}
        secondaryButtonText="Back"
        primaryButtonText={'Delete Nodes'}
        onSubmit={() => {
          handleDeleteNodes();
        }}
        footerAlign="start"
        contentStyles={{ minWidth: '75%' }}
        primaryButtonProps={{ id: 'enable-cluster-submit-btn' }}
      >
        <div style={{ color: theme.colors.primary }} className="mb-2">
          *All selected nodes will be deleted
        </div>
        <Table
          data={deleteNodes || []}
          columns={COLUMNS_FOR_DELETE_NODE}
          customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
          tableWithFullHeight={true}
        />
      </Modal>{' '}
      <ModalWithIcon
        title={'Delete Host IP'}
        primaryButtonText={'Delete'}
        secondaryButtonText={'Cancel'}
        icon={<DeleteDustbinIcon />}
        isOpen={deleteConfirmationModalOpen}
        onSubmit={() => {
          handleConfirmDelete();
        }}
        onRequestClose={() => {
          setDeleteConfirmationModalOpen(false);
        }}
        primaryText={`Are you sure you want to delete`}
      />
    </>
  );
};
export default ClusterDetailTab;
