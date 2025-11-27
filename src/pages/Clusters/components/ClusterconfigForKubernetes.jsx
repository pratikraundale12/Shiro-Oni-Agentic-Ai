/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NotePadIcon, QRIcons } from '../../../assets';
import { Title } from './Title';
import { history } from '../../../helpers/history';
import { Button, InputField, Modal, SelectField } from '../../../shared';
import { KDFM } from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import EditorKubernetesConfig from './KubernetesConfigEditor';
import * as yup from 'yup';
import { FullPageLoader } from '../../../components';
import yaml from 'js-yaml';
import { toast } from 'react-toastify';
import { theme } from '../../../styles';
const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
  display: flex;
  flex-direction: column;
`;
const OuterContainer = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;

const DisplaySection = styled.div`
  flex-grow: 1;
  min-height: 0;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
`;
const RightDisplaySection = styled.div`
  overflow: auto;
  left: 20%;

  .monaco-editor .find-widget.visible {
    position: absolute;
    top: 24px !important;
    right: 40px !important;
  }
`;

export const List = styled.ul`
  max-height: calc(100vh - 250px);
  width: 100%;
  padding-left: 0;
  overflow-y: auto;
`;
export const Item = styled.li`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.darker};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primaryFocus : 'transparent'};
  cursor: pointer;

  ${props =>
    props.path === 'help-&-support' &&
    `
      position: absolute;
      bottom: 50px;
      width: 100%;
    `}

  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const BottomButtonDiv = styled.div`
  gap: 16px;
  align-items: center;
`;
const BottomButton = styled.div`
  align-items: center;
  justify-content: space-between !important;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const ClusterSetupNewConfigKubernetes = () => {
  const dispatch = useDispatch();
  const [errorsInEditor, setErrorsInEditor] = useState([]);
  const [yamlValue, setYamlValue] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const configDefaultValue = useSelector(
    ClustersSelectors.getKubernetesConfigFields
  );
  const recentSelectedCluster = useSelector(
    ClustersSelectors.getrecentClusterSelected
  );

  const [editorModal, setEditorModal] = useState(false);
  const [yamlEditorValue, setYamlEditorValue] = useState('');
  const configToEdit = useSelector(ClustersSelectors.getkubeCofigToEdit);
  const schema = yup.object().shape({
    configName: yup
      .string()
      .required('Config name is required')
      .test(
        'no-leading-trailing-spaces',
        'Config name must not start or end with a space',
        value => value === value?.trim()
      ),
    replicaCount: yup
      .number()
      .typeError('Replica count must be a number')
      .required('Replica count is required')
      .min(1, 'Replica count must be at least 1'),
    image_tag: yup.string().required('Image tag is required'),
    auth_singleUser_username: yup.string().required('Username is required'),
    auth_singleUser_password: yup
      .string()
      .required('Password is required')
      .min(12, 'Password must be at least 12 characters long'),

    auth_admin: yup.string().required('Admin auth is required'),
    persistence_enabled: yup
      .string()
      .required('Persistence enabled is required'),
    dataStorage_size: yup.string().required('Data storage size is required'),
    jvmMemory: yup.string().required('jvmMemory value is required'),
    // properties_webProxyHost: yup
    //   .string()
    //   .required('Web proxy host is required'),
    // ingress_hosts: yup
    //   .string()
    //   .transform(value => {
    //     if (Array.isArray(value)) {
    //       return value?.[0]?.[0]?.replace(/["']/g, '');
    //     }
    //     return value?.replace(/["']/g, '');
    //   })
    //   .required('Ingress host is required'),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const clusterType = watch('cluster_type');

  const handleAddConfig = async data => {
    if (!isEmpty(configToEdit)) {
      const payload = {
        configName: data?.configName,
        configVersion: configToEdit?.config_version + 1,
        valuesYaml: yamlEditorValue || '',
        type: clusterType,
      };
      dispatch(ClustersActions.createConfigForKubernetesCluster(payload));
      return;
    }
    const payload = {
      configName: data?.configName,
      configVersion: 1,
      valuesYaml: yamlEditorValue || '',
      type: clusterType,
    };
    dispatch(ClustersActions.createConfigForKubernetesCluster(payload));
  };

  const handleAddConfigByQuickEdits = data => {
    const payload = {
      configName: data?.configName,
      type: clusterType,
      configVersion: !isEmpty(configToEdit)
        ? configToEdit?.config_version + 1
        : 1,
      isQuickEdit: true,
      quickEditJson: {
        replicaCount: data?.replicaCount,
        image_tag: data?.image_tag,
        jvmMemory: data?.jvmMemory,
        auth_singleUser_username: data?.auth_singleUser_username,
        auth_singleUser_password: data?.auth_singleUser_password,
        auth_admin: data?.auth_admin,
        persistence_enabled: data?.persistence_enabled,
        persistence_dataStorage_size: data?.dataStorage_size,
        ...(!isEmpty(data?.properties_webProxyHost) && {
          properties_webProxyHost: data?.properties_webProxyHost,
        }),
        ...(!isEmpty(data?.ingress_hosts) && {
          ingress_hosts: [data?.ingress_hosts],
          ingress_tls_hosts: data?.ingress_hosts,
          certManager_additionalIpsAddresses: [data?.ingress_hosts],
          zookeeper_url: data?.ingress_hosts,
          registry_url: data?.ingress_hosts,
          registry_ingress_hosts_host: data?.ingress_hosts,
          registry_ingress_tls_hosts: data?.ingress_hosts,
          registry_certManager_additionalIpAddresses: [data?.ingress_hosts],
        }),
      },
      valuesYaml: !isEmpty(configToEdit)
        ? configToEdit?.config_json
        : configDefaultValue?.valuesYaml,
    };

    dispatch(ClustersActions.createConfigForKubernetesCluster(payload));
  };

  useEffect(() => {
    if (isEmpty(configToEdit) && !isEmpty(clusterType)) {
      dispatch(ClustersActions.fetchConfigFieldsForKubernetes(clusterType));
    }
  }, [dispatch, clusterType]);
  useEffect(() => {
    if (!isEmpty(configToEdit)) {
      setYamlValue(configToEdit?.config_json);
      setValue('configName', configToEdit?.config_name);
      setValue('cluster_type', configToEdit?.type);
    } else {
      setYamlValue(configDefaultValue?.valuesYaml || '');
    }
  }, [configToEdit, configDefaultValue, setValue]);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchConfigFieldsForKubernetes')
  );
  const updatedConfigKube = useSelector(ClustersSelectors.getUpdatedKubeConfig);
  const hasYamlChanged =
    yamlEditorValue &&
    updatedConfigKube?.updatedYaml &&
    yamlEditorValue.trim() !== updatedConfigKube?.updatedYaml.trim();
  useEffect(() => {
    if (!isEmpty(yamlValue)) {
      const value = yamlValue || configDefaultValue?.valuesYaml;
      if (!value) return;
      try {
        const docs = [];
        yaml.loadAll(value, doc => docs.push(doc));
        setParsedJson?.(docs.length === 1 ? docs[0] : docs);
        setErrorsInEditor([]);
      } catch (err) {
        setErrorsInEditor([err.message]);
        setParsedJson?.(null);
      }
    }
  }, [yamlValue, configDefaultValue?.valuesYaml]);

  useEffect(() => {
    if (!isEmpty(parsedJson)) {
      setValue('replicaCount', parsedJson?.replicaCount);
      setValue('image_tag', parsedJson?.image?.tag);
      setValue(
        'auth_singleUser_username',
        parsedJson?.auth?.singleUser?.username
      );
      setValue(
        'auth_singleUser_password',
        parsedJson?.auth?.singleUser?.password
      );
      setValue('auth_admin', parsedJson?.auth?.admin);
      setValue('persistence_enabled', parsedJson?.persistence?.enabled);
      setValue('dataStorage_size', parsedJson?.persistence?.dataStorage?.size);
      setValue('jvmMemory', parsedJson?.jvmMemory || parsedJson?.jvmMemory);
      setValue('properties_webProxyHost', parsedJson?.properties?.webProxyHost);
      setValue('ingress_hosts', parsedJson?.ingress?.hosts?.[0]);
    }
  }, [parsedJson]);

  const onError = errors => {
    if (isEmpty(errors)) {
      handleOpenEditor();
    }
  };
  const quickFieldChanged =
    parsedJson?.replicaCount == watch('replicaCount') &&
    parsedJson?.image?.tag == watch('image_tag') &&
    parsedJson?.auth?.singleUser?.username ==
      watch('auth_singleUser_username') &&
    parsedJson?.auth?.singleUser?.password ==
      watch('auth_singleUser_password') &&
    parsedJson?.auth?.admin == watch('auth_admin') &&
    parsedJson?.persistence?.enabled == watch('persistence_enabled') &&
    parsedJson?.persistence?.dataStorage?.size == watch('dataStorage_size') &&
    parsedJson?.jvmMemory == watch('jvmMemory') &&
    parsedJson?.properties?.webProxyHost == watch('properties_webProxyHost') &&
    parsedJson?.ingress?.hosts?.[0] == watch('ingress_hosts');

  const handleOpenEditor = () => {
    let createValue = dirtyFields.ingress_hosts
      ? watch('ingress_hosts')
      : watch('ingress_hosts');
    const commonValueIngress = isEmpty(configToEdit)
      ? createValue
      : Array.isArray(watch('ingress_hosts'))
        ? watch('ingress_hosts')?.[0]
        : watch('ingress_hosts');
    const fieldValues = {
      replicaCount: watch('replicaCount'),
      image_tag: watch('image_tag'),
      jvmMemory: watch('jvmMemory'),
      auth_singleUser_username: watch('auth_singleUser_username'),
      auth_singleUser_password: watch('auth_singleUser_password'),
      auth_admin: watch('auth_admin'),
      persistence_enabled: watch('persistence_enabled'),
      persistence_dataStorage_size: watch('dataStorage_size'),
      ...(!isEmpty(watch('properties_webProxyHost')) && {
        properties_webProxyHost: watch('properties_webProxyHost'),
      }),
      ...(!isEmpty(watch('ingress_hosts')) && {
        ingress_hosts: [watch('ingress_hosts')],
        ingress_tls_hosts: watch('ingress_hosts'),
        certManager_additionalIpsAddresses: [watch('ingress_hosts')],
        zookeeper_url: watch('ingress_hosts'),
        registry_url: watch('ingress_hosts'),
        registry_ingress_hosts_host: watch('ingress_hosts'),
        registry_ingress_tls_hosts: watch('ingress_hosts'),
        registry_certManager_additionalIpAddresses: [watch('ingress_hosts')],
      }),
      // ingress_hosts: [watch('ingress_hosts')],
      // ingress_tls_hosts: watch('ingress_hosts'),
      // certManager_additionalIpsAddresses: [watch('ingress_hosts')],
      // zookeeper_url: watch('ingress_hosts'),
      // registry_url: watch('ingress_hosts'),
      // registry_ingress_hosts_host: watch('ingress_hosts'),
      // registry_ingress_tls_hosts: watch('ingress_hosts'),
      // registry_certManager_additionalIpAddresses: [watch('ingress_hosts')],
    };
    const payload = { values: fieldValues, valuesYaml: yamlValue };
    setEditorModal(true);
    dispatch(ClustersActions.updateKubeConfigQuickEdit(payload));
  };
  const handleBack = () => {
    if (!isEmpty(errorsInEditor)) {
      toast.error('Please clear editor error');
      return;
    }
    const value = yamlEditorValue;
    let yamlParsedValue = {};
    if (!value) return;
    try {
      const docs = [];
      yaml.loadAll(value, doc => docs.push(doc));
      yamlParsedValue = docs.length === 1 ? docs[0] : docs;
      setErrorsInEditor([]);
    } catch (err) {
      setErrorsInEditor([err.message]);
      setParsedJson?.(null);
    }

    setValue('replicaCount', yamlParsedValue?.replicaCount);
    setValue('image_tag', yamlParsedValue?.image?.tag);
    setValue(
      'auth_singleUser_username',
      yamlParsedValue?.auth?.singleUser?.username
    );
    setValue(
      'auth_singleUser_password',
      yamlParsedValue?.auth?.singleUser?.password
    );
    setValue('auth_admin', yamlParsedValue?.auth?.admin);
    setValue('persistence_enabled', yamlParsedValue?.persistence?.enabled);
    setValue(
      'dataStorage_size',
      yamlParsedValue?.persistence?.dataStorage?.size
    );
    setValue('jvmMemory', yamlParsedValue?.jvmMemory);
    setValue(
      'properties_webProxyHost',
      yamlParsedValue?.properties?.webProxyHost
    );
    setValue('ingress_hosts', yamlParsedValue?.ingress?.hosts);

    setEditorModal(false);
  };

  useEffect(() => {
    if (isEmpty(configToEdit)) {
      if (!isEmpty(recentSelectedCluster) && isEmpty(configToEdit)) {
        setValue('cluster_type', recentSelectedCluster);
      } else {
        setValue('cluster_type', 'aks');
      }
    }
  }, [recentSelectedCluster]);

  return (
    <Wrapper>
      <FullPageLoader loading={loading} />
      <Title
        title={
          !isEmpty(configToEdit)
            ? KDFM.EDIT_CONFIG_DETAILS
            : KDFM.NEW_CONFIG_DETAILS
        }
        handleBackClick={() => {
          !isEmpty(configToEdit) &&
            dispatch(ClustersActions.updateConfigClusterSetup({}));
          history.push('/clusters/setup-cluster');
        }}
        displayBackButton={true}
      />
      <OuterContainer>
        <div className="row">
          {' '}
          <div className=" d-flex align-items-end justify-content-end">
            <div className="pb-2 me-2">
              {!editorModal && (
                <span
                  style={{
                    color: `${theme.colors.primary}`,
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  onClick={handleOpenEditor}
                >
                  Edit YAML
                </span>
              )}
              {editorModal && (
                <span
                  style={{
                    color: `${theme.colors.primary}`,
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setEditorModal(false);
                    handleBack();
                  }}
                >
                  Edit in Quick Editor
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="row px-3">
          <div className="col-8">
            <InputField
              label={KDFM.CONFIG_NAME}
              name="configName"
              type="text"
              placeholder={KDFM.ENTER_CONFIG_NAME}
              required
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
              disabled={!isEmpty(configToEdit)}
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">Cluster type</LabelSelect>
            <SelectField
              name="cluster_type"
              icon={<QRIcons />}
              register={register}
              errors={errors}
              control={control}
              options={
                [
                  { label: 'Amazon EKS', value: 'eks' },
                  {
                    label: 'Self-Managed Kubernetes',
                    value: 'ec2',
                  },
                  {
                    label: 'Azure Kubernetes Service',
                    value: 'aks',
                  },
                ] || []
              }
              placeholder={KDFM.SELECT_CONFIG_VERSION}
              required={true}
              disabled={!isEmpty(configToEdit)}
            />
          </div>
        </div>
        {!editorModal && (
          <div className="row px-3">
            <div className="col-4">
              <InputField
                label={'Pods count'}
                name="replicaCount"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'NiFi Version'}
                name="image_tag"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'Administrator Username'}
                name="auth_singleUser_username"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'Administrator Password'}
                name="auth_singleUser_password"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'Admin Authentication'}
                name="auth_admin"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'Enable Persistent Storage'}
                name="persistence_enabled"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'Allocated Storage/Storage Allocation'}
                name="dataStorage_size"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'JVM Heap Memory/JVM Resource Limit'}
                name="jvmMemory"
                type="text"
                required
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'Web Proxy Hostname/External Access URL'}
                name="properties_webProxyHost"
                type="text"
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>
            <div className="col-4">
              <InputField
                label={'Service URL/External Hostname'}
                name="ingress_hosts"
                type="text"
                register={register}
                errors={errors}
                icon={<NotePadIcon />}
              />
            </div>{' '}
          </div>
        )}

        {editorModal && (
          <DisplaySection className="px-3 row">
            <RightDisplaySection className="col-12 h-100">
              <EditorKubernetesConfig
                errorsInEditor={errorsInEditor}
                setErrorsInEditor={setErrorsInEditor}
                setYamlValue={setYamlValue}
                yamlValue={yamlValue}
                parsedJson={parsedJson}
                setParsedJson={setParsedJson}
                yamlEditorValue={yamlEditorValue}
                setYamlEditorValue={setYamlEditorValue}
              />
            </RightDisplaySection>
          </DisplaySection>
        )}
      </OuterContainer>
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
            data-tooltip-id={`tooltip-manage-config-from-add-new-config`}
            variant="secondary"
            type="button"
            onClick={() => {
              !isEmpty(configToEdit) &&
                dispatch(ClustersActions.updateConfigClusterSetup({}));
              history.push('/clusters/setup-cluster');
            }}
          >
            {KDFM.BACK}
          </Button>
          <ReactTooltip
            id={`tooltip-manage-config-from-add-new-config`}
            place="top"
            content={'Back to Manage Config'}
            style={{
              width: '170px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />

          {!editorModal && (
            <Button
              type="submit"
              onClick={handleSubmit(handleAddConfigByQuickEdits)}
              disabled={
                !isEmpty(errorsInEditor) ||
                (!isEmpty(configToEdit) && quickFieldChanged)
              }
            >
              {!isEmpty(configToEdit)
                ? 'Update Configuration'
                : 'Add Configuration'}
            </Button>
          )}
          {editorModal && (
            <Button
              type="submit"
              onClick={handleSubmit(handleAddConfig)}
              disabled={
                !isEmpty(errorsInEditor) ||
                (!isEmpty(configToEdit) && !hasYamlChanged)
              }
            >
              {!isEmpty(configToEdit)
                ? 'Update Configuration'
                : 'Add Configuration'}
            </Button>
          )}
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
export default ClusterSetupNewConfigKubernetes;
