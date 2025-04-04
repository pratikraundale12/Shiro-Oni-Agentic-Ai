/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  CheckListIcon,
  LessArrowIcon,
  NotePadIcon,
  QRIcons,
} from '../../../assets';
import { Title } from './Title';
import { history } from '../../../helpers/history';
import {
  Button,
  InputField,
  RadioSelectField,
  SelectField,
} from '../../../shared';
import { theme } from '../../../styles';
import {
  ACCESS_CONTROL_OPTIONS,
  FLOW_ELECTION_MAX_WAIT_OPTIONS,
  KDFM,
  TRUE_FALSE_OPTIONS,
} from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { safeParseJSON } from '../../../helpers';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const OuterContainer = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 20px;
  padding-top: 10px;
  margin-bottom: 2rem;
  height: 88%;
`;

const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const DisplaySection = styled.div`
  height: calc(100% - 120px) !important;
  border-radius: 10px;
`;
const RightDisplaySection = styled.div`
  overflow: auto;
`;
const LeftDisplaySection = styled.div`
  background-color: #fff;
`;
const SectionHeading = styled.div`
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 1%;
  color: #ff7a00;
`;

export const List = styled.ul`
  max-height: calc(100vh - 250px);
  width: 100%;
  margin-top: 20px;
  padding-left: 0;
  overflow-y: auto;
`;
export const Item = styled.li`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 32px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.darker};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primaryFocus : 'transparent'};
  cursor: pointer;
  gap: 20px;

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
const TitleTab = styled.h3`
  font-family: Noto Sans;
  font-size: 20px;
  font-weight: 600;
  line-height: 27.24px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;
const TitleTabWrapper = styled.div`
  border-bottom: 2px solid #dde4f0;
  padding-bottom: 12px;
`;
const ClusterSetupNewConfigDetailsPage = () => {
  const dispatch = useDispatch();
  const [selectedProperty, setSelectedProperty] = useState('nifi_properties');
  const nifiVersionsData = useSelector(ClustersSelectors.getNifiVersions);
  const configToEdit = useSelector(
    ClustersSelectors.getUpdateConfigClusterSetupData
  );

  const nifiVerionsOptions =
    !isEmpty(nifiVersionsData) &&
    nifiVersionsData?.map(ele => ({
      label: ele?.nifi_version,
      value: ele?.nifi_version,
    }));

  const schema = yup.object().shape({
    configName: yup.string().required('Config Name is required'),
    nifiVersion: yup.string().required('NiFi version is required'),
    comments: yup.string().required('Comment is required'),
    nifi_cluster_node_protocol_max_threads: yup
      .number()
      .typeError('Protocol Max thread must be a number')
      .integer('Protocol Max thread must be an integer')
      .positive('Protocol Max thread must be a positive number')
      .required('Protocol Max thread is required'),
    nifi_web_https_port: yup
      .number()
      .typeError('Web http port must be a number')
      .integer('Web http port must be an integer')
      .positive('Web http port must be a positive number')
      .required('Web http port is required'),
    username: yup.string().required('Userame is required'),
    password: yup.string().required('Password is required'),
    java_arg_2: yup.string().required('Initial heap size is required'),
    java_arg_3: yup.string().required('Maximum heap size is required'),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nifi_cluster_flow_election_max_wait_time: '5 mins',
      nifi_zookeeper_connect_timeout: '10 secs',
      nifi_web_https_port: 8443,
      directory: './state/local',
      partitions: 16,
      root_node: '/nifi',
      session_timeout: '10 seconds',
      checkpoint_interval: '2 mins',
    },
  });

  const sidebarItems = [
    {
      name: 'NiFi Properties',
      path: 'nifi_properties',
      icon: CheckListIcon,
    },
    {
      name: 'Bootstrap.config',
      path: 'bootstrap_config',
      icon: CheckListIcon,
    },
    {
      name: 'Login-identity-providers.xml',
      path: 'login_identity_provider',
      icon: CheckListIcon,
    },
    {
      name: 'state-management.xml',
      path: 'state_management_xml',
      icon: CheckListIcon,
    },
  ];

  const selectedTitle = sidebarItems.filter(
    element => element?.path === selectedProperty
  );

  const populateFormWithConfigData = () => {
    if (isEmpty(configToEdit)) return;

    // Base fields
    const { config_name, nifi_version, comments } = configToEdit;
    setValue('configName', config_name);
    setValue('nifiVersion', nifi_version);
    setValue('comments', comments);

    const nifiProps = safeParseJSON(configToEdit.nifi_properties);
    const bootstrap = safeParseJSON(configToEdit.bootstrap);
    const loginProviders = safeParseJSON(configToEdit.login_identity_providers);
    const stateManagement = safeParseJSON(configToEdit.state_management);

    // Set NiFi properties
    setValue('nifi_cluster_is_node', nifiProps.nifi_cluster_is_node);
    setValue(
      'nifi_cluster_node_protocol_max_threads',
      nifiProps.nifi_cluster_node_protocol_max_threads
    );
    setValue(
      'nifi_cluster_flow_election_max_wait_time',
      nifiProps.nifi_cluster_flow_election_max_wait_time
    );
    setValue(
      'nifi_state_management_embedded_zookeeper_start',
      nifiProps.nifi_state_management_embedded_zookeeper_start
    );
    setValue(
      'nifi_zookeeper_connect_timeout',
      nifiProps.nifi_zookeeper_connect_timeout
    );
    setValue('nifi_web_https_port', nifiProps.nifi_web_https_port);

    // Set Bootstrap values
    setValue('java_arg_2', bootstrap.java_arg_2);
    setValue('java_arg_3', bootstrap.java_arg_3);

    // Set Login Provider values
    setValue('username', loginProviders.username);
    setValue('password', loginProviders.password);

    // Set State Management values
    setValue('directory', stateManagement.directory);
    setValue('always_sync', stateManagement.always_sync);
    setValue('partitions', stateManagement.partitions);
    setValue('checkpoint_interval', stateManagement.checkpoint_interval);
    setValue('root_node', stateManagement.root_node);
    setValue('session_timeout', stateManagement.session_timeout);

    // Handle select field
    if (stateManagement.access_control) {
      const accessControlOption = ACCESS_CONTROL_OPTIONS.find(
        option => option.value === stateManagement.access_control
      );
      setValue(
        'access_control',
        accessControlOption || {
          value: stateManagement.access_control,
          label: stateManagement.access_control,
        }
      );
    }
  };

  const handleAddConfig = data => {
    const nifiPropertyPayload = {
      nifi_cluster_is_node: data?.nifi_cluster_is_node,
      nifi_cluster_node_protocol_max_threads:
        data?.nifi_cluster_node_protocol_max_threads,
      nifi_cluster_flow_election_max_wait_time:
        data?.nifi_cluster_flow_election_max_wait_time,
      nifi_state_management_embedded_zookeeper_start:
        data?.nifi_state_management_embedded_zookeeper_start,
      nifi_zookeeper_connect_timeout: data?.nifi_zookeeper_connect_timeout,
      nifi_web_https_port: data?.nifi_web_https_port,
    };
    const bootstrapPayload = {
      java_arg_2: data?.java_arg_2,
      java_arg_3: data?.java_arg_3,
    };
    const loginPayload = {
      username: data?.username,
      password: data?.password,
    };
    const statePayload = {
      directory: data?.directory,
      always_sync: data?.always_sync,
      partitions: data?.partitions,
      checkpoint_interval: data?.checkpoint_interval,
      root_node: data?.root_node,
      session_timeout: data?.session_timeout,
      access_control: data?.access_control?.value || data?.access_control,
    };
    const payload = new FormData();
    payload.append('configName', data?.configName);
    payload.append('nifiVersion', data?.nifiVersion);
    payload.append('comments', data?.comments);
    payload.append('nifi_properties', JSON.stringify(nifiPropertyPayload));
    payload.append('bootstrap_configuration', JSON.stringify(bootstrapPayload));
    payload.append('login_identity_provider', JSON.stringify(loginPayload));
    payload.append('state_management', JSON.stringify(statePayload));
    if (isEmpty(configToEdit)) {
      dispatch(ClustersActions.addConfigClusterSetup(payload));
    } else {
      payload.append('configVersion', configToEdit?.max_version + 1);
      dispatch(ClustersActions.addConfigClusterSetup(payload));
    }
  };

  useEffect(() => {
    populateFormWithConfigData();
  }, [configToEdit]);

  useEffect(() => {
    dispatch(ClustersActions.getNiFiVersions());
  }, [dispatch]);

  return (
    <Wrapper>
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
        <div className="row px-3">
          <div className="col-4">
            <LabelSelect className="mb-3">{KDFM.CONFIG_NAME}</LabelSelect>
            <InputField
              name="configName"
              type="text"
              placeholder={KDFM.ENTER_CONFIG_NAME}
              required
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
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
            />
          </div>
          <div className="col-4">
            <LabelSelect className="mb-3">{KDFM.COMMENTS}</LabelSelect>

            <InputField
              name="comments"
              type="text"
              placeholder={KDFM.ENTER_YOUR_COMMENTS}
              required
              register={register}
              errors={errors}
              icon={<NotePadIcon />}
            />
          </div>
        </div>
        <DisplaySection className="px-3 row">
          <LeftDisplaySection className="col-3 h-100">
            <List className="sidebar-navigation">
              {' '}
              {sidebarItems.map(item => (
                <Item
                  key={item.name}
                  active={item?.path === selectedTitle?.[0]?.path}
                  onClick={() => {
                    setSelectedProperty(item.path);
                  }}
                >
                  <div>
                    <item.icon
                      color={
                        item?.path === selectedTitle?.[0]?.path
                          ? theme.colors.white
                          : 'black'
                      }
                    />
                    <span className="nav-text ms-3">{item.name}</span>
                  </div>

                  <LessArrowIcon
                    color={
                      item?.path === selectedTitle?.[0]?.path
                        ? theme.colors.white
                        : 'black'
                    }
                  />
                </Item>
              ))}
            </List>
          </LeftDisplaySection>
          <RightDisplaySection className="col-9 h-100">
            <SectionHeading>{selectedTitle?.[0]?.name}</SectionHeading>
            {selectedProperty === 'nifi_properties' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">Core Configuration</TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        Protocol Max Threads
                      </LabelSelect>

                      <InputField
                        name="nifi_cluster_node_protocol_max_threads"
                        type="text"
                        placeholder="Enter Protocol Max Threads"
                        required
                        register={register}
                        errors={errors}
                        defaultValue={50}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        Flow Election Max Wait Time
                      </LabelSelect>

                      <SelectField
                        name="nifi_cluster_flow_election_max_wait_time"
                        icon={<QRIcons />}
                        errors={errors}
                        control={control}
                        options={FLOW_ELECTION_MAX_WAIT_OPTIONS}
                        placeholder="Select Flow Election Max Wait Time"
                        sortAlphabetically={false}
                        defaultValue="5"
                      />
                    </div>
                    <div className="col-2">
                      <RadioSelectField
                        name="nifi_cluster_is_node"
                        options={TRUE_FALSE_OPTIONS}
                        label="NiFi Cluster Node"
                        register={register}
                        defaultValue={'false'}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">
                      Zookeeper Configuration
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        Zookeeper Connection Timeout (eg. 5 secs)
                      </LabelSelect>

                      <InputField
                        name="nifi_zookeeper_connect_timeout"
                        type="text"
                        placeholder="Enter Zookeeper Connection Timeout"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>{' '}
                    <div className="col-2">
                      <RadioSelectField
                        name="nifi_state_management_embedded_zookeeper_start"
                        options={TRUE_FALSE_OPTIONS}
                        label="Embedded  Node"
                        register={register}
                        defaultValue={'true'}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">
                      Web Server Configuration
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">Web Http Port</LabelSelect>

                      <InputField
                        name="nifi_web_https_port"
                        type="text"
                        placeholder="Enter Http Port"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedProperty === 'bootstrap_config' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">Java Memory Settings</TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        java.arg.2 (Initial Heap Size)
                      </LabelSelect>

                      <InputField
                        name="java_arg_2"
                        type="text"
                        placeholder="Enter java.arg.2"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">
                        java.arg.3 (Maximum Heap Size)
                      </LabelSelect>

                      <InputField
                        name="java_arg_3"
                        type="text"
                        placeholder="Enter java.arg.3"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedProperty === 'login_identity_provider' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">
                      Single User Login Identity Provider
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-5">
                      <LabelSelect className="mb-3">Username</LabelSelect>

                      <InputField
                        name="username"
                        type="text"
                        placeholder="Enter Username"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-5">
                      <LabelSelect className="mb-3">Password</LabelSelect>

                      <InputField
                        name="password"
                        type="text"
                        placeholder="Enter Password"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedProperty === 'state_management_xml' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">Local State Provider</TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-4">
                      <LabelSelect className="mb-3">Directory</LabelSelect>

                      <InputField
                        name="directory"
                        type="text"
                        placeholder="Enter Directory"
                        required
                        register={register}
                        errors={errors}
                        defaultValue={50}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-3">
                      <LabelSelect className="mb-3">Partitions</LabelSelect>

                      <InputField
                        name="partitions"
                        type="text"
                        placeholder="Enter Partitions"
                        required
                        register={register}
                        errors={errors}
                        defaultValue={16}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-3">
                      <LabelSelect className="mb-3">
                        Checkpoint Intervalitions (eg. 5 min)
                      </LabelSelect>

                      <InputField
                        name="checkpoint_interval"
                        type="text"
                        placeholder="Enter Checkpoint Interval"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>
                    <div className="col-2">
                      <RadioSelectField
                        name="always_sync"
                        options={TRUE_FALSE_OPTIONS}
                        label="Always Sync"
                        register={register}
                        defaultValue={'false'}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <TitleTabWrapper className="mt-4">
                    <TitleTab className="ms-2">
                      ZooKeeper Cluster State Provider
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-4">
                    <div className="col-4">
                      <LabelSelect className="mb-3">Root Node</LabelSelect>

                      <InputField
                        name="root_node"
                        type="text"
                        placeholder="Enter Root Node"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>{' '}
                    <div className="col-4">
                      <LabelSelect className="mb-3">
                        Session Timeout (eg. 5 seconds)
                      </LabelSelect>

                      <InputField
                        name="session_timeout"
                        type="text"
                        placeholder="Enter Session Timeout"
                        required
                        register={register}
                        errors={errors}
                        icon={<NotePadIcon />}
                      />
                    </div>{' '}
                    <div className="col-4">
                      <LabelSelect className="mb-3">Access Control</LabelSelect>

                      <SelectField
                        name="access_control"
                        icon={<QRIcons />}
                        errors={errors}
                        control={control}
                        options={ACCESS_CONTROL_OPTIONS}
                        placeholder="Select Access Control "
                        sortAlphabetically={false}
                        defaultValue="Open"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </RightDisplaySection>
        </DisplaySection>
      </OuterContainer>
      {/*  */}
      <BottomButton className="bottom-button-divs d-flex">
        <BottomButtonDiv className="btn-div d-flex">
          <Button
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

          <Button type="submit" onClick={handleSubmit(handleAddConfig)}>
            {!isEmpty(configToEdit) ? 'Update Config' : 'Add Config'}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
export default ClusterSetupNewConfigDetailsPage;
