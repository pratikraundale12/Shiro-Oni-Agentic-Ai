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
        })
      );
    }
  }, [ansibleClusterDataForEdit]);

  const configVerionListData = useSelector(
    ClustersSelectors.getConfigVersionList
  );

  const nifiVersionsData = useSelector(ClustersSelectors.getNifiVersions);
  const listHostIpData = useSelector(ClustersSelectors.getHostIpList);
  const itemsForList = useMemo(() => {
    return listHostIpData.filter(ele => !ele?.is_selected);
  }, [listHostIpData]);

  useEffect(() => {
    if (!isEmpty(listHostIpData) && !isEmpty(clusterIdForAnsible)) {
      setHostList(listHostIpData);
    }
  }, [listHostIpData]);

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
        ClustersActions.fetchHostNodesList({ selected: false, clusterId: null })
      );
    }

    dispatch(ClustersActions.getNiFiVersions());
  }, [dispatch]);

  const handleCheck = ele => {
    setHostList(prevData =>
      prevData.map(item =>
        item.id === ele?.id ? { ...item, is_selected: !item.is_selected } : item
      )
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

  useEffect(() => {
    if (isEmpty(clusterIdForAnsible)) {
      setHostList(itemsForList);
    }
  }, [itemsForList]);

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
      !isEmpty(clusterIdForAnsible)
    ) {
      setValue('nifiVersion', ansibleClusterDataForEdit?.nifi_version);
      dispatch(
        ClustersActions.getConfigList(ansibleClusterDataForEdit.nifi_version)
      );
    }
  }, [nifiVerionsOptions, ansibleClusterDataForEdit]);

  useEffect(() => {
    if (!isEmpty(clusterIdForAnsible)) {
      dispatch(ClustersActions.fetchAnsibleClusterData(clusterIdForAnsible));
    }
  }, [clusterIdForAnsible]);
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
            disabled={!isEmpty(clusterIdForAnsible)}
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
