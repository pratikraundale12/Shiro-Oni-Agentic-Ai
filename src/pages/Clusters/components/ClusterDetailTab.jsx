/* eslint-disable */
import React, { useEffect, useMemo } from 'react';
import {
  Button,
  CheckboxField,
  InputField,
  RadioField,
  SelectField,
} from '../../../shared';
import { PlusIcon, QRIcons } from '../../../assets';
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
  const deselectedNodes = listHostIpData.filter(staticItem => {
    const updatedItem = hostList.find(updated => updated.id === staticItem.id);
    return (
      staticItem.is_selected === true && updatedItem?.is_selected === false
    );
  });

  console.log('Deselected Nodes:', deselectedNodes);
  const newlySelectedNodes = listHostIpData.filter(staticItem => {
    const updatedItem = hostList.find(updated => updated.id === staticItem.id);
    return (
      staticItem.is_selected === false && updatedItem?.is_selected === true
    );
  });

  console.log('Newly Selected Nodes:', newlySelectedNodes);
  const itemsForList = useMemo(() => {
    return listHostIpData.filter(ele => !ele?.is_selected);
  }, [listHostIpData]);

  useEffect(() => {
    if (!isEmpty(listHostIpData) && !isEmpty(clusterIdForAnsible)) {
      setHostList(listHostIpData);
    }
  }, [listHostIpData]);
  console.log(hostList, 'hostList');

  useEffect(() => {
    if (!isEmpty(listHostIpData) && !isEmpty(nodesUpdateAnsbibleClusterId)) {
      // HERE
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
  }, [dispatch]);

  // const handleCheck = ele => {
  //   setHostList(prevData =>
  //     prevData.map(item =>
  //       item.id === ele?.id ? { ...item, is_selected: !item.is_selected } : item
  //     )
  //   );
  // };
  // ONY ONE LEST
  // const handleCheck = ele => {
  //   setHostList(prevData => {
  //     const updatedData = prevData.map(item =>
  //       item.id === ele?.id ? { ...item, is_selected: !item.is_selected } : item
  //     );

  //     const atLeastOneSelected = updatedData.some(item => item.is_selected);

  //     if (!atLeastOneSelected) {
  //       toast.error('All nodes can not be removed from cluster');

  //       return prevData;
  //     }

  //     return updatedData;
  //   });
  // };
  const handleCheck = ele => {
    setHostList(prevData => {
      const updatedData = prevData.map(item =>
        item.id === ele?.id ? { ...item, is_selected: !item.is_selected } : item
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
      renderCell: item => <>{item?.host_ip}</>,
      resize: true,
      width: '30%',
    },
    {
      label: 'Port No.',
      renderCell: item => <>{item?.port}</>,
      resize: true,
      width: '30%',
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
  // USED FOR CREATE CLUSTER
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
      // HERE
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

  return (
    <>
      <FullPageLoader loading={loading || loadingAddAPI} />
      <div className="row mt-2 ms-2 me-2">
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
      <div className="row mt-2 ms-2 me-2 mb-4">
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
      </div>
      <div className="col-auto ms-3">
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
      </div>
      <div
        className="mt-4 px-3"
        style={{ height: 'calc(100% - 360px)', overflow: 'auto' }}
      >
        <Table
          data={hostList || []}
          columns={COLUMNS}
          customNoDataText={KDFM.HOST_IP_NOT_AVAILABLE}
          tableWithFullHeight={true}
        />
      </div>
      <AddHostIPModal />
    </>
  );
};
export default ClusterDetailTab;
