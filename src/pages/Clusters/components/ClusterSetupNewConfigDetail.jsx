/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  CheckListIcon,
  LessArrowIcon,
  LinkIcon,
  NotePadIcon,
  QRIcons,
  TagIcon,
} from '../../../assets';
import { Title } from './Title';
import { history } from '../../../helpers/history';
import {
  Button,
  InputField,
  PasswordField,
  RadioSelectField,
  SelectField,
} from '../../../shared';
import { theme } from '../../../styles';
import {
  ACCESS_CONTROL_OPTIONS,
  CHECKPOINT_INTERVAL_OPTIONS,
  CLUSTER_ANSIBLE_DEFAULT_CONFIGURATION_VALUE,
  FLOW_ELECTION_MAX_WAIT_OPTIONS,
  KDFM,
  loginIdentityStrategy,
  scopeOptions,
  SESSION_TIMEOUT_OPTIONS,
  TRUE_FALSE_OPTIONS,
  ZOOKEEPER_CONNECTION_TIMEOUT,
} from '../../../constants';
import { useForm } from 'react-hook-form';
import { isEqual, sortBy } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ClustersActions, ClustersSelectors } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { safeParseJSON } from '../../../helpers';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { testConfigApi } from '../../../store/apis/ldap';
import { SuccessTestModal } from './SuccessTestModal';
import { toast } from 'react-toastify';
import BootstrapConfig from './BootstrapConfig';
import AuthorizersXml from './AuthorizersXml';
import LogbackXml from './LogbackXml';
import NifiConfigTabFieldsContainer from './NifiConfigTabFieldsConatiner';

const StyledSelectField = styled(SelectField)`
  /* Container styling */
  & > div {
    margin-bottom: ${props => props.marginBottom || '1rem'};
  }

  & label {
    margin-bottom: ${props => props.labelMargin || '2px'} !important;
  }

  /* Control styling (the main input area) */
  & .react-select__control {
    height: ${props => props.height || 'auto'};
    min-height: ${props => props.height || '54px'};
    border-radius: ${props => props.borderRadius || '4px'};
    margin-top: ${props => props.marginTop || '10px'};
    margin-left: ${props => props.marginLeft || '0'};
    margin-right: ${props => props.marginRight || '0'};
  }

  /* Value container styling */
  & .react-select__value-container {
    padding: ${props => props.innerPadding || props.padding || '0 8px'};
  }

  /* Menu styling */
  & .react-select__menu {
    border-radius: ${props => props.menuBorderRadius || '4px'};
  }

  /* Option styling */
  & .react-select__option {
    padding: ${props => props.optionPadding || '8px 12px'};
    font-size: ${props => props.fontSize || '14px'};
  }
`;

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
  display: inline-block;
`;
const DisplaySection = styled.div`
  height: calc(100% - 120px) !important;
  border-radius: 10px;
`;
const RightDisplaySection = styled.div`
  overflow: auto;
  left: 20%;
`;
const LeftDisplaySection = styled.div`
  border-radius: 20px;
  background-color: #fff;
  overflow-y: hidden;
  overflow-x: auto;
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 12px;
  width: 22%;
  flex: 0 0 22%;
`;
const SectionHeading = styled.div`
  font-family: Red Hat Display;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 1%;
  color: #ff7a00;
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
const TitleTab = styled.h3`
  font-family: Noto Sans;
  font-size: 17px;
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

const LabelWarning = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  font-style: italic;
`;
const ButtonFlex = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 25px;
`;

const TagLable = styled.label`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #444445;
`;

const TagsInputContainer = styled.div`
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  border-radius: 3px;
  width: 100%;
  font-size: 14px;
  color: #444445;
  margin-top: 10px;
  display: flex;
  align-items: center;
  overflow: auto;
  gap: 0.5em;
  margin-bottom: 40px;
  input::placeholder {
    color: ${props => props.theme.colors.grey};
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
  }
  input:focus-visible {
    outline: none;
  }
  input:focus {
    border: none;
  }
`;

const IconTag = styled.span`
  position: sticky;
  top: 2px;
  left: 2px;
  bottom: 2px;
  z-index: 1;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
`;
const TagItem = styled.div`
  background-color: rgb(218, 216, 216);
  display: flex;
  padding: 0.5em 0.75em;
  border-radius: 20px;
`;
const CloseButton = styled.span`
  padding-top: 3px;
  height: 20px;
  width: 20px;
  background-color: rgb(48, 48, 48);
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  font-size: 18px;
  cursor: pointer;
`;
const CharacterCount = styled.span`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
`;
const TagsInput = styled.input`
  flex-grow: 1;
  padding: 0.5em 0;
  border: none;
  outline: none;
`;

const ClusterSetupNewConfigDetailsPage = () => {
  const [originalValues, setOriginalValues] = useState({});
  const [formChanged, setFormChanged] = useState(false);
  const [initialHeapSize, setInitialHeapSize] = useState(0);
  const [tags, setTags] = useState([]);
  const [methodForLoginIdentity, setMethodForLoginIdentity] = useState(
    'single-user-provider'
  );
  const [loading, setLoading] = useState(false);
  const [successTest, setSuccessTest] = useState(false);
  const [ldapConnectionData, setLdapConnectData] = useState({});
  const dispatch = useDispatch();
  const [selectedProperty, setSelectedProperty] = useState('nifi_properties');
  const nifiVersionsData = useSelector(ClustersSelectors.getNifiVersions);
  const configToEdit = useSelector(
    ClustersSelectors.getUpdateConfigClusterSetupData
  );
  const [ldapTested, setLdapTested] = useState(false);
  const [originalLoginValues, setOriginalLoginValues] = useState({});

  const nifiVerionsOptions =
    !isEmpty(nifiVersionsData) &&
    nifiVersionsData?.map(ele => ({
      label: ele?.nifi_version,
      value: ele?.nifi_version,
    }));

  const schemaUserPassword = yup.object().shape({
    configName: yup
      .string()
      .required('Config name is required')
      .test(
        'no-leading-trailing-spaces',
        'Config name must not start or end with a space',
        value => value === value?.trim()
      ),
    nifiVersion: yup.string().required('NiFi version is required'),
    comments: yup
      .string()
      .required('Comment is required')
      .test(
        'no-leading-trailing-spaces',
        'Username must not start or end with a space',
        value => value === value?.trim()
      ),
    username: yup
      .string()
      .required('Username is required')
      .test(
        'no-leading-trailing-spaces',
        'Username must not start or end with a space',
        value => value === value?.trim()
      )
      .min(3, 'Username must be minimum 3 in length'),
    password: yup
      .string()
      .required('Password is required')
      .test(
        'no-leading-trailing-spaces',
        'Password must not start or end with a space',
        value => value === value?.trim()
      )
      .min(10, 'Password must be minimum 10 in length'),
    directory: yup
      .string()
      .required('Directory is required')
      .matches(/^\S+$/, 'Directory cannot contain spaces'),
    partitions: yup.string().required('Partitions is required'),
    root_node: yup
      .string()
      .required('Root node is required')
      .matches(/^\S+$/, 'Root node cannot contain spaces'),
    nifi_administrative_yield_duration: yup
      .string()
      .required('nifi.administrative.yield.duration is required'),

    nifi_analytics_connection_model_implementation: yup
      .string()
      .required('nifi.analytics.connection.model.implementation is required'),

    nifi_zookeeper_connect_string: yup
      .string()
      .required('nifi.zookeeper.connect.string is required'),

    nifi_web_https_port: yup
      .string()
      .required('nifi.web.https.port is required'),

    nifi_cluster_node_protocol_port: yup
      .string()
      .required('nifi.cluster.node.protocol.port is required'),

    nifi_cluster_load_balance_port: yup
      .string()
      .required('nifi.cluster.load.balance.port is required'),

    nifi_cluster_node_address: yup
      .string()
      .required('nifi.cluster.node.address is required'),

    nifi_cluster_load_balance_host: yup
      .string()
      .required('nifi.cluster.load.balance.host is required'),

    nifi_remote_input_host: yup
      .string()
      .required('nifi.remote.input.host is required'),

    nifi_remote_input_http_transaction_ttl: yup
      .string()
      .required('nifi.remote.input.http.transaction.ttl is required'),

    nifi_remote_input_secure: yup
      .string()
      .required('nifi.remote.input.secure is required'),

    nifi_remote_input_socket_port: yup
      .string()
      .required('nifi.remote.input.socket.port is required'),

    nifi_cluster_flow_election_max_wait_time: yup
      .string()
      .required('nifi.cluster.flow.election.max.wait.time is required'),

    nifi_cluster_is_node: yup
      .string()
      .required('nifi.cluster.is.node is required'),

    nifi_security_truststore: yup
      .string()
      .required('nifi.security.truststore is required'),

    nifi_security_truststoreType: yup
      .string()
      .required('nifi.security.truststoreType is required'),

    nifi_security_user_authorizer: yup
      .string()
      .required('nifi.security.user.authorizer is required'),

    nifi_security_user_login_identity_provider: yup
      .string()
      .required('nifi.security.user.login.identity.provider is required'),

    nifi_security_keystoreType: yup
      .string()
      .required('nifi.security.keystoreType is required'),

    nifi_web_https_host: yup
      .string()
      .required('nifi.web.https.host is required'),

    nifi_web_proxy_host: yup
      .string()
      .required('nifi.web.proxy.host is required'),
    bootstrap_config: yup.string().required('Bootstrap config is required'),
    authorizers_xml: yup.string().required('Authorizers.xml is required'),
    logback_xml: yup.string().required('logback.xml is required'),
  });
  const schemaLDAPlogin = yup.object().shape({
    configName: yup
      .string()
      .required('Config name is required')
      .test(
        'no-leading-trailing-spaces',
        'Config name must not start or end with a space',
        value => value === value?.trim()
      ),
    nifiVersion: yup.string().required('NiFi version is required'),
    comments: yup
      .string()
      .required('Comment is required')
      .test(
        'no-leading-trailing-spaces',
        'Username must not start or end with a space',
        value => value === value?.trim()
      ),
    directory: yup
      .string()
      .required('Directory is required')
      .matches(/^\S+$/, 'Directory cannot contain spaces'),
    partitions: yup.string().required('Partitions is required'),
    root_node: yup
      .string()
      .required('Root node is required')
      .matches(/^\S+$/, 'Root node cannot contain spaces'),
    nifi_administrative_yield_duration: yup
      .string()
      .required('nifi.administrative.yield.duration is required'),

    nifi_analytics_connection_model_implementation: yup
      .string()
      .required('nifi.analytics.connection.model.implementation is required'),

    nifi_zookeeper_connect_string: yup
      .string()
      .required('nifi.zookeeper.connect.string is required'),

    nifi_web_https_port: yup
      .string()
      .required('nifi.web.https.port is required'),

    nifi_cluster_node_protocol_port: yup
      .string()
      .required('nifi.cluster.node.protocol.port is required'),

    nifi_cluster_load_balance_port: yup
      .string()
      .required('nifi.cluster.load.balance.port is required'),

    nifi_cluster_node_address: yup
      .string()
      .required('nifi.cluster.node.address is required'),

    nifi_cluster_load_balance_host: yup
      .string()
      .required('nifi.cluster.load.balance.host is required'),

    nifi_remote_input_host: yup
      .string()
      .required('nifi.remote.input.host is required'),

    nifi_remote_input_http_transaction_ttl: yup
      .string()
      .required('nifi.remote.input.http.transaction.ttl is required'),

    nifi_remote_input_secure: yup
      .string()
      .required('nifi.remote.input.secure is required'),

    nifi_remote_input_socket_port: yup
      .string()
      .required('nifi.remote.input.socket.port is required'),

    nifi_cluster_flow_election_max_wait_time: yup
      .string()
      .required('nifi.cluster.flow.election.max.wait.time is required'),

    nifi_cluster_is_node: yup
      .string()
      .required('nifi.cluster.is.node is required'),

    nifi_security_truststore: yup
      .string()
      .required('nifi.security.truststore is required'),

    nifi_security_truststoreType: yup
      .string()
      .required('nifi.security.truststoreType is required'),

    nifi_security_user_authorizer: yup
      .string()
      .required('nifi.security.user.authorizer is required'),

    nifi_security_user_login_identity_provider: yup
      .string()
      .required('nifi.security.user.login.identity.provider is required'),

    nifi_security_keystoreType: yup
      .string()
      .required('nifi.security.keystoreType is required'),

    nifi_web_https_host: yup
      .string()
      .required('nifi.web.https.host is required'),

    nifi_web_proxy_host: yup
      .string()
      .required('nifi.web.proxy.host is required'),
    bootstrap_config: yup.string().required('Bootstrap config is required'),
    authorizers_xml: yup.string().required('Authorizers.xml is required'),
    logback_xml: yup.string().required('logback.xml is required'),
  });
  const schemaConnectionCheck = yup.object().shape({
    url: yup.string().required('LDAP URL is required'),
    loginDn: yup.string().required('Login DN is required'),
    password2: yup.string().required('Password is required'),
  });
  const {
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1 },
    reset: reset1,
    setValue: setValueForm1,
    watch: watchForm1,
  } = useForm({
    resolver: yupResolver(schemaConnectionCheck),
  });

  const watchedFields = watchForm1(['url', 'loginDn', 'password2']);

  useEffect(() => {
    const [url, loginDn, password2] = watchedFields;

    const ldapData = safeParseJSON(configToEdit?.login_identity_providers);
    if (!ldapData) return;

    const { ldap_login_dn, ldap_login_password, ldap_url } = ldapData;

    const isMatch =
      ldap_login_dn === loginDn &&
      ldap_login_password === password2 &&
      ldap_url === url;

    setLdapTested(isMatch);
    if (!isMatch) {
      setFormChanged(true);
    }
  }, [
    watchedFields[0],
    watchedFields[1],
    watchedFields[2],
    configToEdit?.login_identity_providers,
  ]);

  const schema =
    methodForLoginIdentity === 'single-user-provider'
      ? schemaUserPassword
      : schemaLDAPlogin;
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
      ...CLUSTER_ANSIBLE_DEFAULT_CONFIGURATION_VALUE,
    },
  });

  const handleKeyDown = e => {
    const value = e.target.value.trim();

    if (e.key === 'Enter' || e.key === ',' || (e.type === 'blur' && value)) {
      if (tags.length >= 5) {
        toast.error('Maximum 5 tags allowed');
        e.target.value = '';
        return;
      }
      if (!tags.includes(value)) {
        setTags([...tags, value]);
        e.target.value = '';
      } else {
        toast.error('Tag already exists');
      }
    } else if (e.key === 'Backspace' && !value) {
      removeTag(tags[tags.length - 1]);
    }
  };
  const removeTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formValues = watch();

  useEffect(() => {
    if (formValues?.java_arg_2) {
      setInitialHeapSize(Number(formValues?.java_arg_2));
    } else {
      setInitialHeapSize(0);
    }
  }, [formValues?.java_arg_2]);

  useEffect(() => {
    if (!isEmpty(originalValues)) {
      // Create copies for comparison that exclude loginProvider
      const formValuesForComparison = { ...formValues };
      const originalValuesForComparison = { ...originalValues };

      // Don't consider loginProvider changes when determining if form has changed
      delete formValuesForComparison.loginProvider;
      delete originalValuesForComparison.loginProvider;

      const hasChanged = Object.keys(formValuesForComparison).some(key => {
        // Skip loginProvider comparison
        if (key === 'loginProvider') return false;

        if (
          typeof formValuesForComparison[key] === 'object' &&
          formValuesForComparison[key] !== null
        ) {
          return (
            JSON.stringify(formValuesForComparison[key]) !==
            JSON.stringify(originalValuesForComparison[key])
          );
        }

        return (
          formValuesForComparison[key] !== originalValuesForComparison[key]
        );
      });

      // Compare tags separately
      const isSameTags = isEqual(
        sortBy(tags),
        sortBy(originalValues?.groupObjectClass || [])
      );

      setFormChanged(hasChanged || !isSameTags);
    }
  }, [formValues, originalValues, tags]);

  useEffect(() => {
    return () => {
      reset();
      dispatch(ClustersActions.updateConfigClusterSetup({}));
      setOriginalValues({});
      setFormChanged(false);
      setSelectedProperty('nifi_properties');
    };
  }, []);

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
      name: 'Authorizers.xml',
      path: 'authorizers_xml',
      icon: CheckListIcon,
    },
    {
      name: 'Logback.xml',
      path: 'logback_xml',
      icon: CheckListIcon,
    },
    {
      name: 'State-management.xml',
      path: 'state_management_xml',
      icon: CheckListIcon,
    },
  ];

  const selectedTitle = sidebarItems.filter(
    element => element?.path === selectedProperty
  );

  const getMemoryValue = arg => {
    if (!arg) return '';
    const match = arg.match(/-Xm[xs](\d+)g/);
    return match ? match[1] : '';
  };

  const populateFormWithConfigData = () => {
    if (isEmpty(configToEdit)) return;

    const {
      config_name,
      nifi_version,
      comments,
      nifi_properties,
      bootstrap,
      login_identity_providers,
      state_management,
      authorizers,
      lockback,
    } = configToEdit;

    const nifiProps = safeParseJSON(nifi_properties) || {};
    const bootstrapConfig = bootstrap || '';
    const loginProviders = safeParseJSON(login_identity_providers) || {};
    const stateManagement = safeParseJSON(state_management) || {};
    const authorizersXml = authorizers || '';
    const logbackXml = lockback || '';

    setValue('configName', config_name);
    setValue('nifiVersion', nifi_version);
    setValue('comments', comments);

    const {
      nifi_user_login_provider,
      nifi_cluster_is_node,
      nifi_cluster_node_protocol_max_threads,
      nifi_cluster_flow_election_max_wait_time,
      nifi_zookeeper_connect_timeout,
      nifi_web_https_port,
    } = nifiProps;

    const isLdapProvider = nifi_user_login_provider === 'ldap-provider';

    setValue(
      'loginProvider',
      nifi_user_login_provider ?? 'single-user-provider'
    );
    setValue('nifi_cluster_is_node', nifi_cluster_is_node);
    setValue(
      'nifi_cluster_node_protocol_max_threads',
      nifi_cluster_node_protocol_max_threads
    );
    setValue(
      'nifi_cluster_flow_election_max_wait_time',
      nifi_cluster_flow_election_max_wait_time
    );
    setValue('nifi_zookeeper_connect_timeout', nifi_zookeeper_connect_timeout);
    setValue('nifi_web_https_port', nifi_web_https_port);
    setValue('bootstrap_config', bootstrapConfig);
    setValue('authorizers_xml', authorizersXml);
    setValue('logback_xml', logbackXml);
    // setValue('java_arg_2', getMemoryValue(bootstrapProps.java_arg_2));
    // setValue('java_arg_3', getMemoryValue(bootstrapProps.java_arg_3));

    if (isLdapProvider) {
      const groupObjectClass =
        loginProviders?.ldap_group_object_class?.split(',') ?? [];

      const ldapFields = {
        userDn: loginProviders.ldap_users_dn,
        usernameIdentifier: loginProviders.ldap_user_username_identifier,
        userUniqueIdentifier: loginProviders.ldap_user_unique_identifier,
        groupDn: loginProviders.ldap_groups_dn,
        groupObjectClass,
        groupUniqueIdentifier: loginProviders.ldap_group_unique_identifier,
        filter: loginProviders.ldap_group_filter,
        InitialAdminIdentity: loginProviders.ldap_initial_admin_identity,
        ldap_login_identity_strategy:
          loginProviders.ldap_login_identity_strategy,
        scope: loginProviders.ldap_select_scope,
        ldap_login_user_filter: loginProviders.ldap_login_user_filter,
      };

      Object.entries(ldapFields).forEach(([key, value]) =>
        setValue(key, value)
      );

      setValueForm1('loginDn', loginProviders.ldap_login_dn);
      setValueForm1('password2', loginProviders.ldap_login_password);
      setValueForm1('url', loginProviders.ldap_url);

      setTags(groupObjectClass);
      setLdapConnectData({
        loginDn: loginProviders.ldap_login_dn,
        password2: loginProviders.ldap_login_password,
        url: loginProviders.ldap_url,
      });
      setLdapTested(true);
    } else {
      setValue('username', loginProviders.username);
      setValue('password', loginProviders.password);
    }

    const {
      directory,
      always_sync,
      partitions,
      checkpoint_interval,
      root_node,
      session_timeout,
      access_control,
    } = stateManagement;

    setValue('directory', directory);
    setValue('always_sync', always_sync);
    setValue('partitions', partitions);
    setValue('checkpoint_interval', checkpoint_interval);
    setValue('root_node', root_node);
    setValue('session_timeout', session_timeout);

    if (access_control) {
      const accessControlOption = ACCESS_CONTROL_OPTIONS.find(
        option => option.value === access_control
      ) ?? { value: access_control, label: access_control };

      setValue('access_control', accessControlOption);
    }

    const originalLoginData = isLdapProvider
      ? {
          ...loginProviders,
          groupObjectClass:
            loginProviders.ldap_group_object_class?.split(',') ?? [],
        }
      : {
          username: loginProviders.username,
          password: loginProviders.password,
        };

    setOriginalLoginValues(originalLoginData);

    setTimeout(() => {
      setOriginalValues({ ...watch() });
      setFormChanged(false);
    }, 0);
  };

  const handleAddConfig = async data => {
    if (
      !isEmpty(configToEdit) &&
      methodForLoginIdentity === 'ldap-provider' &&
      !ldapTested
    ) {
      toast.error('Please test LDAP credentials before Proceeding');
      return;
    }
    const nifiPropertyPayload = {
      nifi_administrative_yield_duration:
        data?.nifi_administrative_yield_duration,
      nifi_analytics_connection_model_implementation:
        data?.nifi_analytics_connection_model_implementation,
      nifi_zookeeper_connect_string: data?.nifi_zookeeper_connect_string,
      nifi_web_https_port: data?.nifi_web_https_port,
      nifi_cluster_node_protocol_port: data?.nifi_cluster_node_protocol_port,
      nifi_cluster_load_balance_port: data?.nifi_cluster_load_balance_port,
      nifi_cluster_node_address: data?.nifi_cluster_node_address,
      nifi_cluster_load_balance_host: data?.nifi_cluster_load_balance_host,
      nifi_remote_input_host: data?.nifi_remote_input_host,
      nifi_remote_input_http_transaction_ttl:
        data?.nifi_remote_input_http_transaction_ttl,
      nifi_remote_input_secure: data?.nifi_remote_input_secure,
      nifi_remote_input_socket_port: data?.nifi_remote_input_socket_port,
      nifi_cluster_flow_election_max_wait_time:
        data?.nifi_cluster_flow_election_max_wait_time,
      nifi_cluster_is_node: data?.nifi_cluster_is_node,
      nifi_security_truststore: data?.nifi_security_truststore,
      nifi_security_truststoreType: data?.nifi_security_truststoreType,
      nifi_security_user_authorizer: data?.nifi_security_user_authorizer,
      nifi_security_user_login_identity_provider:
        data?.nifi_security_user_login_identity_provider,
      nifi_security_keystoreType: data?.nifi_security_keystoreType,
      nifi_web_https_host: data?.nifi_web_https_host,
      nifi_web_proxy_host: data?.nifi_web_proxy_host,
      nifi_analytics_connection_model_score_name:
        data?.nifi_analytics_connection_model_score_name,
      nifi_analytics_connection_model_score_threshold:
        data?.nifi_analytics_connection_model_score_threshold,
      nifi_analytics_predict_enabled: data?.nifi_analytics_predict_enabled,
      nifi_analytics_predict_interval: data?.nifi_analytics_predict_interval,
      nifi_analytics_query_interval: data?.nifi_analytics_query_interval,
      nifi_authorizer_configuration_file:
        data?.nifi_authorizer_configuration_file,
      nifi_bored_yield_duration: data?.nifi_bored_yield_duration,
      nifi_cluster_firewall_file: data?.nifi_cluster_firewall_file,
      fi_cluster_flow_election_max_candidates:
        data?.fi_cluster_flow_election_max_candidates,
      nifi_cluster_load_balance_comms_timeout:
        data?.nifi_cluster_load_balance_comms_timeout,
      nifi_cluster_load_balance_connections_per_node:
        data?.nifi_cluster_load_balance_connections_per_node,
      nifi_cluster_load_balance_max_thread_count:
        data?.nifi_cluster_load_balance_max_thread_count,
      nifi_cluster_node_connection_timeout:
        data?.nifi_cluster_node_connection_timeout,
      nifi_cluster_node_event_history_size:
        data?.nifi_cluster_node_event_history_size,
      nifi_cluster_node_max_concurrent_requests:
        data?.nifi_cluster_node_max_concurrent_requests,
      nifi_cluster_node_protocol_max_threads:
        data?.nifi_cluster_node_protocol_max_threads,
      nifi_cluster_node_protocol_threads:
        data?.nifi_cluster_node_protocol_threads,
      nifi_cluster_node_read_timeout: data?.nifi_cluster_node_read_timeout,
      nifi_cluster_protocol_heartbeat_interval:
        data?.nifi_cluster_protocol_heartbeat_interval,
      nifi_cluster_protocol_heartbeat_missable_max:
        data?.nifi_cluster_protocol_heartbeat_missable_max,
      nifi_cluster_protocol_is_secure: data?.nifi_cluster_protocol_is_secure,
      nifi_components_status_repository_buffer_size:
        data?.nifi_components_status_repository_buffer_size,
      nifi_components_status_repository_implementation:
        data?.nifi_components_status_repository_implementation,
      nifi_components_status_snapshot_frequency:
        data?.nifi_components_status_snapshot_frequency,
      nifi_content_claim_max_appendable_size:
        data?.nifi_content_claim_max_appendable_size,
      nifi_content_claim_max_flow_files:
        data?.nifi_content_claim_max_flow_files,
      nifi_content_repository_archive_max_retention_period:
        data?.nifi_content_repository_archive_max_retention_period,
      nifi_content_repository_archive_max_usage_percentage:
        data?.nifi_content_repository_archive_max_usage_percentage,
      nifi_content_repository_directory_default:
        data?.nifi_content_repository_directory_default,
      nifi_content_repository_implementation:
        data?.nifi_content_repository_implementation,
      nifi_content_viewer_url: data?.nifi_content_viewer_url,
      nifi_database_directory: data?.nifi_database_directory,
      nifi_documentation_working_directory:
        data?.nifi_documentation_working_directory,
      nifi_flow_configuration_archive_dir:
        data?.nifi_flow_configuration_archive_dir,
      nifi_flow_configuration_archive_max_count:
        data?.nifi_flow_configuration_archive_max_count,
      nifi_flow_configuration_archive_max_storage:
        data?.nifi_flow_configuration_archive_max_storage,
      nifi_flow_configuration_archive_max_time:
        data?.nifi_flow_configuration_archive_max_time,
      nifi_flow_configuration_file: data?.nifi_flow_configuration_file,
      nifi_flowcontroller_graceful_shutdown_period:
        data?.nifi_flowcontroller_graceful_shutdown_period,
      nifi_flowfile_repository_checkpoint_interval:
        data?.nifi_flowfile_repository_checkpoint_interval,
      nifi_flowfile_repository_directory:
        data?.nifi_flowfile_repository_directory,
      nifi_flowfile_repository_implementation:
        data?.nifi_flowfile_repository_implementation,
      nifi_flowfile_repository_partitions:
        data?.nifi_flowfile_repository_partitions,
      nifi_flowfile_repository_retain_orphaned_flowfiles:
        data?.nifi_flowfile_repository_retain_orphaned_flowfiles,
      nifi_flowfile_repository_wal_implementation:
        data?.nifi_flowfile_repository_wal_implementation,
      nifi_flowservice_writedelay_interval:
        data?.nifi_flowservice_writedelay_interval,
      nifi_h2_url_append: data?.nifi_h2_url_append,
      nifi_kerberos_krb5_file: data?.nifi_kerberos_krb5_file,
      nifi_kerberos_service_keytab_location:
        data?.nifi_kerberos_service_keytab_location,
      nifi_kerberos_service_principal: data?.nifi_kerberos_service_principal,
      nifi_kerberos_spnego_authentication_expiration:
        data?.nifi_kerberos_spnego_authentication_expiration,
      nifi_kerberos_spnego_keytab_location:
        data?.nifi_kerberos_spnego_keytab_location,
      nifi_kerberos_spnego_principal: data?.nifi_kerberos_spnego_principal,
      nifi_login_identity_provider_configuration_file:
        data?.nifi_login_identity_provider_configuration_file,
      nifi_nar_library_autoload_directory:
        data?.nifi_nar_library_autoload_directory,
      nifi_nar_library_directory: data?.nifi_nar_library_directory,
      nifi_nar_working_directory: data?.nifi_nar_working_directory,
      nifi_provenance_repository_buffer_size:
        data?.nifi_provenance_repository_buffer_size,
      nifi_provenance_repository_concurrent_merge_threads:
        data?.nifi_provenance_repository_concurrent_merge_threads,
      nifi_provenance_repository_debug_frequency:
        data?.nifi_provenance_repository_debug_frequency,
      nifi_provenance_repository_directory_default:
        data?.nifi_provenance_repository_directory_default,
      nifi_provenance_repository_encryption_key:
        data?.nifi_provenance_repository_encryption_key,
      nifi_provenance_repository_encryption_key_id:
        data?.nifi_provenance_repository_encryption_key_id,
      nifi_provenance_repository_encryption_key_provider_implementation:
        data?.nifi_provenance_repository_encryption_key_provider_implementation,
      nifi_provenance_repository_encryption_key_provider_location:
        data?.nifi_provenance_repository_encryption_key_provider_location,
      nifi_provenance_repository_implementation:
        data?.nifi_provenance_repository_implementation,
      nifi_provenance_repository_index_shard_size:
        data?.nifi_provenance_repository_index_shard_size,
      nifi_provenance_repository_index_threads:
        data?.nifi_provenance_repository_index_threads,
      nifi_provenance_repository_indexed_attributes:
        data?.nifi_provenance_repository_indexed_attributes,
      nifi_provenance_repository_indexed_fields:
        data?.nifi_provenance_repository_indexed_fields,
      nifi_provenance_repository_journal_count:
        data?.nifi_provenance_repository_journal_count,
      nifi_provenance_repository_max_attribute_length:
        data?.nifi_provenance_repository_max_attribute_length,
      nifi_provenance_repository_max_storage_size:
        data?.nifi_provenance_repository_max_storage_size,
      nifi_provenance_repository_max_storage_time:
        data?.nifi_provenance_repository_max_storage_time,
      nifi_provenance_repository_query_threads:
        data?.nifi_provenance_repository_query_threads,
      nifi_provenance_repository_rollover_size:
        data?.nifi_provenance_repository_rollover_size,
      nifi_provenance_repository_rollover_time:
        data?.nifi_provenance_repository_rollover_time,
      nifi_provenance_repository_warm_cache_frequency:
        data?.nifi_provenance_repository_warm_cache_frequency,
      nifi_queue_backpressure_count: data?.nifi_queue_backpressure_count,
      nifi_queue_backpressure_size: data?.nifi_queue_backpressure_size,
      nifi_queue_swap_threshold: data?.nifi_queue_swap_threshold,
      nifi_remote_contents_cache_expiration:
        data?.nifi_remote_contents_cache_expiration,
      nifi_security_allow_anonymous_authentication:
        data?.nifi_security_allow_anonymous_authentication,
      nifi_security_group_mapping_pattern_anygroup:
        data?.nifi_security_group_mapping_pattern_anygroup,
      nifi_security_group_mapping_transform_anygroup:
        data?.nifi_security_group_mapping_transform_anygroup,
      nifi_security_group_mapping_value_anygroup:
        data?.nifi_security_group_mapping_value_anygroup,
      nifi_security_identity_mapping_pattern_dn:
        data?.nifi_security_identity_mapping_pattern_dn,
      nifi_security_identity_mapping_pattern_kerb:
        data?.nifi_security_identity_mapping_pattern_kerb,
      nifi_security_identity_mapping_transform_dn:
        data?.nifi_security_identity_mapping_transform_dn,
      nifi_security_identity_mapping_transform_kerb:
        data?.nifi_security_identity_mapping_transform_kerb,
      nifi_security_identity_mapping_value_dn:
        data?.nifi_security_identity_mapping_value_dn,
      nifi_security_identity_mapping_value_kerb:
        data?.nifi_security_identity_mapping_value_kerb,
      nifi_security_keystore: data?.nifi_security_keystore,
      nifi_security_ocsp_responder_certificate:
        data?.nifi_security_ocsp_responder_certificate,
      nifi_security_ocsp_responder_url: data?.nifi_security_ocsp_responder_url,
      nifi_security_user_knox_audiences:
        data?.nifi_security_user_knox_audiences,
      nifi_security_user_knox_cookieName:
        data?.nifi_security_user_knox_cookieName,
      nifi_security_user_knox_publicKey:
        data?.nifi_security_user_knox_publicKey,
      nifi_security_user_knox_url: data?.nifi_security_user_knox_url,
      nifi_security_user_oidc_additional_scopes:
        data?.nifi_security_user_oidc_additional_scopes,
      nifi_security_user_oidc_claim_identifying_user:
        data?.nifi_security_user_oidc_claim_identifying_user,
      nifi_security_user_oidc_client_id:
        data?.nifi_security_user_oidc_client_id,
      nifi_security_user_oidc_client_secret:
        data?.nifi_security_user_oidc_client_secret,
      nifi_security_user_oidc_connect_timeout:
        data?.nifi_security_user_oidc_connect_timeout,
      nifi_security_user_oidc_discovery_url:
        data?.nifi_security_user_oidc_discovery_url,
      nifi_security_user_oidc_preferred_jwsalgorithm:
        data?.nifi_security_user_oidc_preferred_jwsalgorithm,
      nifi_security_user_oidc_read_timeout:
        data?.nifi_security_user_oidc_read_timeout,
      nifi_sensitive_props_additional_keys:
        data?.nifi_sensitive_props_additional_keys,
      nifi_sensitive_props_algorithm: data?.nifi_sensitive_props_algorithm,
      nifi_sensitive_props_key: data?.nifi_sensitive_props_key,
      nifi_state_management_configuration_file:
        data?.nifi_state_management_configuration_file,
      nifi_state_management_provider_cluster:
        data?.nifi_state_management_provider_cluster,
      nifi_state_management_provider_local:
        data?.nifi_state_management_provider_local,
      nifi_swap_in_period: data?.nifi_swap_in_period,
      nifi_swap_in_threads: data?.nifi_swap_in_threads,
      nifi_swap_manager_implementation: data?.nifi_swap_manager_implementation,
      nifi_swap_out_period: data?.nifi_swap_out_period,
      nifi_swap_out_threads: data?.nifi_swap_out_threads,
      nifi_templates_directory: data?.nifi_templates_directory,
      nifi_ui_autorefresh_interval: data?.nifi_ui_autorefresh_interval,
      nifi_ui_banner_text: data?.nifi_ui_banner_text,
      nifi_variable_registry_properties:
        data?.nifi_variable_registry_properties,
      nifi_version: data?.nifi_version,
      nifi_web_http_host: data?.nifi_web_http_host,
      nifi_web_http_network_interface_default:
        data?.nifi_web_http_network_interface_default,
      nifi_web_http_port: data?.nifi_web_http_port,
      nifi_web_https_network_interface_default:
        data?.nifi_web_https_network_interface_default,
      nifi_web_jetty_threads: data?.nifi_web_jetty_threads,
      nifi_web_jetty_working_directory: data?.nifi_web_jetty_working_directory,
      nifi_web_max_content_size: data?.nifi_web_max_content_size,
      nifi_web_max_header_size: data?.nifi_web_max_header_size,
      nifi_web_max_requests_per_second: data?.nifi_web_max_requests_per_second,
      nifi_web_proxy_context_path: data?.nifi_web_proxy_context_path,
      nifi_web_should_send_server_version:
        data?.nifi_web_should_send_server_version,
      nifi_web_war_directory: data?.nifi_web_war_directory,
      nifi_zookeeper_connect_timeout: data?.nifi_zookeeper_connect_timeout,
      nifi_zookeeper_root_node: data?.nifi_zookeeper_root_node,
      nifi_zookeeper_session_timeout: data?.nifi_zookeeper_session_timeout,
      nifi_state_management_embedded_zookeeper_properties:
        data?.nifi_state_management_embedded_zookeeper_properties,
      nifi_user_login_provider:
        methodForLoginIdentity === 'single-user-provider'
          ? 'single-user-provider'
          : 'ldap-provider',
    };
    const bootstrapPayload = data?.bootstrap_config;
    const authorizersXmlPayload = data?.authorizers_xml;
    const logbackXmlPayload = data?.logback_xml;
    const loginLDAPdata = {
      ldap_login_dn: ldapConnectionData?.loginDn,
      ldap_login_password: ldapConnectionData?.password2,
      ldap_url: ldapConnectionData?.url,

      ldap_users_dn: data?.userDn,
      ldap_user_username_identifier: data?.usernameIdentifier,
      ldap_user_unique_identifier: data?.userUniqueIdentifier,
      ldap_groups_dn: data?.groupDn,
      ldap_group_object_class: tags.join(','),
      ldap_select_scope: data?.scope,
      ldap_group_unique_identifier: data?.groupUniqueIdentifier,
      ldap_group_filter: data?.filter,
      ldap_initial_admin_identity: data?.InitialAdminIdentity,
      ldap_login_user_filter: data?.ldap_login_user_filter,
      ldap_login_identity_strategy: data?.ldap_login_identity_strategy,
    };
    const loginUserPassData = {
      username: data?.username,
      password: data?.password,
    };

    const loginPayload =
      methodForLoginIdentity === 'single-user-provider'
        ? loginUserPassData
        : loginLDAPdata;

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
    payload.append('bootstrap_configuration', bootstrapPayload);
    payload.append('login_identity_provider', JSON.stringify(loginPayload));
    payload.append('authorizers_xml', authorizersXmlPayload);
    payload.append('logback_xml', logbackXmlPayload);
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

  const onError = errors => {
    if (
      errors?.nifi_cluster_node_protocol_max_threads ||
      errors?.nifi_web_https_port ||
      errors?.nifi_cluster_node_protocol_port ||
      errors?.nifi_cluster_load_balance_port ||
      errors?.nifi_administrative_yield_duration ||
      errors?.nifi_analytics_connection_model_implementation ||
      errors?.nifi_zookeeper_connect_string ||
      errors?.nifi_cluster_node_address ||
      errors?.nifi_cluster_load_balance_host ||
      errors?.nifi_remote_input_host ||
      errors?.nifi_remote_input_http_transaction_ttl ||
      errors?.nifi_remote_input_secure ||
      errors?.nifi_remote_input_socket_port ||
      errors?.nifi_cluster_flow_election_max_wait_time ||
      errors?.nifi_cluster_is_node ||
      errors?.nifi_security_truststore ||
      errors?.nifi_security_truststoreType ||
      errors?.nifi_security_user_authorizer ||
      errors?.nifi_security_user_login_identity_provider ||
      errors?.nifi_security_keystoreType ||
      errors?.nifi_web_https_host ||
      errors?.nifi_web_proxy_host
    ) {
      setSelectedProperty('nifi_properties');
      return;
    }
    if (errors?.bootstrap_config) {
      setSelectedProperty('bootstrap_config');
      return;
    }
    if (errors?.username || errors?.password) {
      setSelectedProperty('login_identity_provider');
      return;
    }
    if (errors?.authorizers_xml) {
      setSelectedProperty('authorizers_xml');
      return;
    }
    if (errors?.logback_xml) {
      setSelectedProperty('logback_xml');
      return;
    }

    if (errors?.directory || errors?.partitions || errors?.root_node) {
      setSelectedProperty('state_management_xml');
      return;
    }
  };
  const methodForLogin = watch('loginProvider');
  const bootstrapConfig = watch('bootstrap_config');
  useEffect(() => {
    if (methodForLogin) {
      // Store current form state before changing authentication method
      const currentFormValues = { ...watch() };

      setMethodForLoginIdentity(methodForLogin);

      if (methodForLogin === 'ldap-provider') {
        // Reset username/password fields without triggering form changes
        setValue('username', originalLoginValues.username || undefined, {
          shouldDirty: false,
        });
        setValue('password', originalLoginValues.password || undefined, {
          shouldDirty: false,
        });
      } else if (methodForLogin === 'single-user-provider') {
        // Reset LDAP fields without triggering form changes
        setValue('userDn', originalLoginValues.userDn || undefined, {
          shouldDirty: false,
        });
        setValue(
          'usernameIdentifier',
          originalLoginValues.usernameIdentifier || undefined,
          { shouldDirty: false }
        );
        setValue(
          'userUniqueIdentifier',
          originalLoginValues.userUniqueIdentifier || undefined,
          { shouldDirty: false }
        );
        setValue('groupDn', originalLoginValues.groupDn || undefined, {
          shouldDirty: false,
        });
        setValue(
          'groupUniqueIdentifier',
          originalLoginValues.groupUniqueIdentifier || undefined,
          {
            shouldDirty: false,
          }
        );
        setValue('filter', originalLoginValues.filter || undefined, {
          shouldDirty: false,
        });
        setValue(
          'InitialAdminIdentity',
          originalLoginValues.InitialAdminIdentity || undefined,
          { shouldDirty: false }
        );
        setValue(
          'ldap_login_user_filter',
          originalLoginValues.ldap_login_user_filter || undefined,
          {
            shouldDirty: false,
          }
        );

        // Reset tags to original state
        setTags(originalLoginValues.groupObjectClass || []);
      }

      // After switching, update originalValues to reflect the new authentication method
      setTimeout(() => {
        const newFormValues = { ...watch() };
        setOriginalValues(prev => ({
          ...prev,
          ...newFormValues,
          loginProvider: methodForLogin,
        }));
      }, 0);
    }
  }, [methodForLogin, setValue, originalLoginValues]);

  useEffect(() => {
    if (methodForLogin) {
      setMethodForLoginIdentity(methodForLogin);
    }
  }, [methodForLogin]);

  useEffect(() => {
    if (formValues.username === '') {
      setValue('username', undefined);
    }
    if (formValues.password === '') {
      setValue('password', undefined);
    }
  }, [formValues.username, formValues.password, setValue]);
  const onSubmitConnectionCheck = async data => {
    setLoading(true);
    setLdapConnectData(data);
    const payload = {
      url: data.url,
      password: data.password2,
      loginDn: data.loginDn,
    };

    try {
      const response = await testConfigApi(payload);
      if (response?.status === 200) {
        setSuccessTest(true);
        setLdapTested(true);
        toast.success('LDAP connection successful');
      } else {
        toast.error(
          response?.message ||
            response?.data?.message ||
            'LDAP connection failed'
        );
      }
    } catch (error) {
      toast.error('Failed to connect to LDAP server');
      console.error('LDAP Connection Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <StyledSelectField
              label={KDFM.NIFI_VERSION}
              name="nifiVersion"
              icon={<QRIcons />}
              register={register}
              required
              errors={errors}
              control={control}
              options={nifiVerionsOptions || []}
              placeholder={KDFM.SELECT_NIFI_VERSION}
              height="54px"
              labelMargin="0px"
            />
          </div>
          <div className="col-4">
            <InputField
              label={KDFM.COMMENTS}
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
          <LeftDisplaySection className="col-2 h-100">
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
                    <span className="nav-text ms-1">{item.name}</span>
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
                <NifiConfigTabFieldsContainer
                  register={register}
                  errors={errors}
                  control={control}
                  watch={watch}
                />
              </div>
            )}
            {selectedProperty === 'bootstrap_config' && (
              <div>
                <BootstrapConfig
                  register={register}
                  errors={errors}
                  rows={21}
                />
              </div>
            )}
            {selectedProperty === 'login_identity_provider' && (
              <div>
                <div>
                  <RadioSelectField
                    key={`loginProvider-${selectedProperty}-${watch('loginProvider')}`}
                    name="loginProvider"
                    register={register}
                    errors={errors}
                    defaultValue={
                      watch('loginProvider') || 'single-user-provider'
                    }
                    options={[
                      {
                        label: 'Single User Login Identity Provider',
                        value: 'single-user-provider',
                      },
                      {
                        label: 'LDAP Configuration Provider',
                        value: 'ldap-provider',
                      },
                    ]}
                  />
                </div>
                {watch('loginProvider') === 'single-user-provider' && (
                  <div>
                    <TitleTabWrapper className="mt-3">
                      <TitleTab className="ms-3">
                        Single User Login Identity Provider
                      </TitleTab>
                    </TitleTabWrapper>
                    <div className="row mt-3">
                      <div className="col-4">
                        <InputField
                          label="Username"
                          name="username"
                          type="text"
                          placeholder="Enter Username"
                          required
                          register={register}
                          errors={errors}
                          icon={<NotePadIcon />}
                        />
                      </div>
                      <div className="col-4">
                        <PasswordField
                          name="password"
                          label="Password"
                          placeholder="Enter Password"
                          required
                          watch={watch}
                          register={register}
                          errors={errors}
                          icon={<NotePadIcon />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {watch('loginProvider') === 'ldap-provider' && (
                  <div>
                    <TitleTabWrapper className="mt-3">
                      <TitleTab className="ms-3">
                        LDAP Configuration Provider
                      </TitleTab>
                    </TitleTabWrapper>

                    <div className="row mt-3">
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="url"
                          type="text"
                          register={registerForm1}
                          label="LDAP URL"
                          placeholder="Enter your LDAP URL"
                          icon={<LinkIcon />}
                          errors={errorsForm1}
                          required
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="loginDn"
                          type="text"
                          register={registerForm1}
                          label="Login DN"
                          placeholder="Enter your Login DN"
                          icon={<QRIcons />}
                          errors={errorsForm1}
                          required
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <PasswordField
                          name="password2"
                          register={registerForm1}
                          errors={errorsForm1}
                          required
                          watch={watchForm1}
                          label="Password"
                        />
                      </div>
                      <ButtonFlex>
                        <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                          <Button
                            size="md"
                            onClick={handleSubmitForm1(onSubmitConnectionCheck)}
                            loading={loading}
                            disabled={ldapTested}
                          >
                            Connect
                          </Button>
                        </div>
                      </ButtonFlex>
                      {/* /// */}
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="groupDn"
                          type="text"
                          register={register}
                          label="Groups DN"
                          placeholder="Enter your Groups DN"
                          icon={<QRIcons />}
                          errors={errors}
                          required
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="userDn"
                          type="text"
                          watch={watch}
                          register={register}
                          label="Users DN"
                          placeholder="Enter your Users DN"
                          icon={<QRIcons />}
                          errors={errors}
                          required
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="userUniqueIdentifier"
                          type="text"
                          watch={watch}
                          register={register}
                          errors={errors}
                          label="User Unique Identifier"
                          placeholder="Enter User Identifier"
                          icon={<QRIcons />}
                          required
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="groupUniqueIdentifier"
                          type="text"
                          watch={watch}
                          register={register}
                          errors={errors}
                          label="Group Unique Identifier"
                          placeholder="Enter Group Identifier"
                          icon={<QRIcons />}
                          required
                          disabled={!ldapTested}
                        />
                      </div>
                      <div
                        className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele"
                        style={{
                          pointerEvents: !ldapTested ? 'none' : 'auto',
                          cursor: !ldapTested ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <TagLable
                          htmlFor="tags-input"
                          className="tags-input-label"
                        >
                          Group Object Class
                        </TagLable>
                        <TagsInputContainer>
                          <IconTag>
                            <TagIcon />
                          </IconTag>
                          {!isEmpty(tags) &&
                            tags?.map((tag, index) => (
                              <TagItem key={index}>
                                <CharacterCount>
                                  {!isEmpty(tags) && tag?.length > 10
                                    ? `${tag.substring(0, 10)}...`
                                    : tag}
                                </CharacterCount>
                                <CloseButton onClick={() => removeTag(tag)}>
                                  &times;
                                </CloseButton>
                              </TagItem>
                            ))}
                          <TagsInput
                            type="text"
                            name="groupObjectClass"
                            onKeyDown={handleKeyDown}
                            placeholder={
                              tags.length === 0 ? 'Group Object Class' : ''
                            }
                            onBlur={handleKeyDown}
                            aria-label="Group Object Class"
                            disabled={!ldapTested}
                            register={register}
                          />
                        </TagsInputContainer>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="usernameIdentifier"
                          type="text"
                          watch={watch}
                          register={register}
                          label="Username identifier"
                          placeholder="Enter Username identifier"
                          icon={<QRIcons />}
                          errors={errors}
                          // errors={errorsForm2}
                          required
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="filter"
                          type="text"
                          watch={watch}
                          register={register}
                          label={
                            <>
                              Group Filter{' '}
                              <em>ex: (|(cn=admin)(cn=developer))</em>
                            </>
                          }
                          placeholder="Enter Filter"
                          icon={<QRIcons />}
                          errors={errors}
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="InitialAdminIdentity"
                          type="text"
                          watch={watch}
                          register={register}
                          label="Initial Admin Identity"
                          placeholder="Enter Admin identifier"
                          icon={<QRIcons />}
                          errors={errors}
                          required
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele">
                        <InputField
                          name="ldap_login_user_filter"
                          type="text"
                          watch={watch}
                          register={register}
                          label="Login User search filter"
                          placeholder="Enter Login User search filter"
                          icon={<QRIcons />}
                          errors={errors}
                          required
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele mb-2">
                        <LabelSelect>Select Scope</LabelSelect>
                        <StyledSelectField
                          name="scope"
                          size="sm"
                          options={scopeOptions || []}
                          watch={watch}
                          register={register}
                          placeholder="Select Scope"
                          title="Select Scope"
                          control={control}
                          disabled={!ldapTested}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele mb-2">
                        <LabelSelect>Login identity strategy</LabelSelect>
                        <StyledSelectField
                          name="ldap_login_identity_strategy"
                          size="sm"
                          options={loginIdentityStrategy || []}
                          watch={watch}
                          register={register}
                          placeholder="Select Login identity strategy"
                          title="Login identity strategy"
                          control={control}
                          disabled={!ldapTested}
                        />
                      </div>
                    </div>
                    <SuccessTestModal
                      successTest={successTest}
                      setSuccessTest={setSuccessTest}
                      name="Connected with LDAP successfully"
                      text="Continue with the next steps"
                      title="Connection Successful"
                    />
                  </div>
                )}
              </div>
            )}
            {selectedProperty === 'authorizers_xml' && (
              <AuthorizersXml register={register} errors={errors} />
            )}
            {selectedProperty === 'logback_xml' && (
              <LogbackXml register={register} errors={errors} />
            )}
            {selectedProperty === 'state_management_xml' && (
              <div>
                <div>
                  <TitleTabWrapper className="mt-3">
                    <TitleTab className="ms-3">Local State Provider</TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-3">
                    <div className="col-4">
                      <LabelSelect>Directory</LabelSelect>

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
                    <div className="col-4">
                      <LabelSelect>Partitions</LabelSelect>

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
                    <div className="col-4">
                      <StyledSelectField
                        label="Checkpoint Interval"
                        name="checkpoint_interval"
                        icon={<QRIcons />}
                        errors={errors}
                        control={control}
                        options={CHECKPOINT_INTERVAL_OPTIONS}
                        placeholder="Select Checkpoint Interval"
                        sortAlphabetically={false}
                        height="54px"
                        labelMargin="0px"
                      />
                    </div>
                    <div>
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
                  <TitleTabWrapper className="mt-3">
                    <TitleTab className="ms-3">
                      ZooKeeper Cluster State Provider
                    </TitleTab>
                  </TitleTabWrapper>
                  <div className="row mt-3">
                    <div className="col-4">
                      <LabelSelect>Root Node</LabelSelect>

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
                      <StyledSelectField
                        label="Session Timeout"
                        name="session_timeout"
                        icon={<QRIcons />}
                        errors={errors}
                        control={control}
                        options={SESSION_TIMEOUT_OPTIONS}
                        placeholder="Select Session Timeout"
                        sortAlphabetically={false}
                        height="54px"
                        labelMargin="0px"
                      />
                    </div>{' '}
                    <div className="col-4">
                      <StyledSelectField
                        label="Access Control"
                        name="access_control"
                        icon={<QRIcons />}
                        errors={errors}
                        control={control}
                        options={ACCESS_CONTROL_OPTIONS}
                        placeholder="Select Access Control "
                        sortAlphabetically={false}
                        defaultValue="Open"
                        height="54px"
                        labelMargin="0px"
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

          <Button
            type="submit"
            onClick={handleSubmit(handleAddConfig, onError)}
            disabled={!isEmpty(configToEdit) && !formChanged}
          >
            {!isEmpty(configToEdit) ? 'Update Config' : 'Add Config'}
          </Button>
        </BottomButtonDiv>
      </BottomButton>
    </Wrapper>
  );
};
export default ClusterSetupNewConfigDetailsPage;
