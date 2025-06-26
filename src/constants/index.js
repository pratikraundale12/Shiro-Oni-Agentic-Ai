/* eslint-disable no-undef */
import { ACTIVITY_HISTORY_CONSTANTS } from './activityHistory.constant';
import { AI_FLOW_GENERATOR_CONSTANTS } from './aiFlowGenerator.constant';
import { CLUSTER_CONSTANTS } from './cluster.constant';
import { NAMESPACE_CONSTANTS } from './namespace.constant';
import { USER_CONSTANTS } from './user.constant';

// modules constants exports
export * from './login';

// generalconstants
export const API_URL =
  window.env?.REACT_APP_API_URL || process.env.REACT_APP_API_URL;
export const ACCESS_TOKEN = 'access_token';
export const CLUSTERS_TOKEN = 'clusters';

export const DEBOUNCE_DELAY = 500;

export const PREVIOUS_PATH = 'previous_path';
export const DEFAULT_ROUTE = 'dashboard';

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export const Cluster_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'connected', label: 'Connected' },
  { value: 'disconnected', label: 'Disconnected' },
  { value: 'deactivated', label: 'Deactivated' },
];

export const REFRESH_OPTIONS = [
  { value: false, label: 'Off' },
  { value: 5000, label: '5 Seconds' },
  { value: 30000, label: '30 Seconds' },
  { value: 60000, label: '1 Minute' },
];

export const ACCESS_OPTIONS = [
  { value: 'cluster_access', label: 'Cluster Access' },
  { value: 'dfm_access', label: 'DFM Access' },
];

export const RegexConst = {
  NAME: /^[a-zA-Z0-9 ]{3,}$/,
  NIFI_URL: /^https?:\/\/([a-zA-Z0-9.-]+)(:[0-9]{1,5})?(\/nifi)?\/?$/,
};

export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Make it true when working on local to make debugging easier
export const ENABLE_CONSOLE_LOGS = false;

export const STATUS_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export const RESPONSE_DATA_CODE = {
  TOKEN_NOT_VALID: 'token_not_valid',
};

export const CLUSTER_MODULE_TABS = {
  CLUSTER: 'cluster',
  REGISTRY: 'registry',
  SERVICE_ACCOUNT: 'service account',
};

export const CLUSTER_STATUS = {
  DEACTIVATED: 'Deactivated',
  DISCONNECTED: 'Disconnected',
  CONNECTED: 'Connected',
};

export const MODULE_LIST_MAP = [
  { label: 'All', value: 'all' },
  { label: 'Cluster', value: 'Cluster' },
  { label: 'Registry', value: 'Registry' },
  { label: 'Process Group', value: 'Process Group' },
  { label: 'Controller Services', value: 'Controller Services' },
  { label: 'User', value: 'User' },
  { label: 'LDAP', value: 'Ldap' },
  { label: 'Group Mapping', value: 'Group-mapping' },
  { label: 'Reschedule Job', value: 'Reschedule Job' },
  { label: 'Roles', value: 'Roles' },
  { label: 'Parameter Context', value: 'Parameter Context' },
  { label: 'Variable', value: 'Variable' },
  { label: 'Schedule Deployment', value: 'Schedule Deployment' },
  { label: 'AI Flows', value: 'AI Flows' },
  { label: 'Flow Validation', value: 'Flow Validation' },
  { label: 'Rule scope', value: 'Rule scope' },
  { label: 'Rule', value: 'Rule' },
  { label: 'Data Flow Inventory', value: 'Data Flow Inventory' },
];

export const ACTIVITY_STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Success', value: 'Success' },
  { label: 'Failed', value: 'Failed' },
];

export const ACTIVITY_EVENTS = [
  { label: 'All', value: 'all' },
  { label: 'Add', value: 'Add' },
  { label: 'Create', value: 'Create' },
  { label: 'Create Cluster', value: 'Create Cluster' },
  { label: 'Edit', value: 'Edit' },
  { label: 'Delete', value: 'Delete' },
  { label: 'Upgrade', value: 'Upgrade' },
  { label: 'Deploy', value: 'Deploy' },
  { label: 'Downgrade', value: 'downgrade' },
  { label: 'Schedule Deploy', value: 'Schedule Deploy' },
  { label: 'Schedule Upgrade', value: 'Schedule upgrade' },
  { label: 'Schedule Downgrade', value: 'Schedule downgrade' },
  { label: 'Update', value: 'Update' },
  { label: 'Reject', value: 'Reject' },
  { label: 'Stop', value: 'Stop' },
  { label: 'Login', value: 'Login' },
  { label: 'Logout', value: 'Logout' },
  { label: 'Reschedule', value: 'Reschedule' },
  { label: 'Approve', value: 'Approve' },
  { label: 'Add Flow', value: 'Add Flow' },
  { label: 'Add Bucket', value: 'Add Bucket' },
  { label: 'Generate Flow', value: 'Generate Flow' },
  { label: 'Comparison', value: 'Comparison' },
  { label: 'Validate', value: 'Validate' },
  { label: 'Comparison', value: 'Comparison' },
  { label: 'Add Data Flow Inventory', value: 'Add Data Flow Inventory' },
  { label: 'Start Cluster', value: 'Start Cluster' },
  { label: 'Update Nodes', value: 'Update Nodes' },
  { label: 'Add Nodes', value: 'Add Nodes' },
  { label: 'Remove Nodes', value: 'Remove Nodes' },
  { label: 'Upgrade Cluster', value: 'Upgrade Cluster' },
  { label: 'Associate Registry', value: 'Associate Registry' },
];
export const EMAIL_REMINDER_OPTIONS = [
  { label: '5 mins', value: '300000' },
  { label: '10 mins', value: '600000' },
  { label: '15 mins', value: '900000' },
  { label: '30 mins', value: '1800000' },
  { label: '1 hour', value: '3600000' },
];
export const SCHEDULE_LIST_REFRESH_OPTIONS = [
  { label: 'Stop', value: false },
  { label: '15 Sec', value: '15000' },
  { label: '30 Sec', value: '30000' },
  { label: '45 Sec', value: '45000' },
  { label: '1 min', value: '60000' },
  { label: '2 min', value: '120000' },
  { label: '3 min', value: '180000' },
  { label: '5 min', value: '300000' },
  { label: '10 min', value: '600000' },
];

export const SSO_LOGIN_TYPE = [
  { label: 'Azure', value: 'azure' },
  { label: 'Keycloak', value: 'keycloak' },
];

export const LICENSE_TYPE = {
  TRIAL: 'trial',
  PURCHASED: 'production',
};

export const LICENSE_DATE_ISO_FORMAT = 'MMMM D, YYYY [at] h:mm:ss A';
export const LICENSE_EXPIRE_PROMPT_DAYS = 30;

export const KDFM = {
  // Generic constants
  UPLOAD_P12_FILE: 'Upload P12 File',
  UPLOAD_FILE: 'Upload File',
  NIFI: 'NiFi',
  ADD: 'Add',
  ADD_NEW: 'Add New',
  BACK: 'Back',
  CONTINUE: 'Continue',
  EDIT: 'Edit',
  SAVE: 'Save',
  VIEW: 'View',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  YES: 'Yes',
  NO: 'No',
  UPGRADE: 'Upgrade',
  DEPLOY: 'Deploy',
  DOWNGRADE: 'Downgrade',
  USERNAME: 'Username',
  PASSWORD: 'Password',
  ENTER_USERNAME: 'Enter your Username',
  ENTER_PASSWORD: 'Enter your Password',
  NO_DATA_FOUND: 'No Data Found!!',
  NIFI_URL: 'NiFi URL',
  LOGS_URL: 'Logs URL',
  LOGS: 'Logs',
  METRICS_URL: 'Metrics URL',
  METRICS: 'Metrics',
  SEPARATOR: 'OR',
  SELECT: 'SELECT',
  TEST: 'Test',
  TESTED: 'Tested',
  TEST_SUCCEED: 'Test Succeeded',
  TEST_FAILED: 'Test Failed',
  TESTING_FAILED: 'Test Failed',
  REFRESH: 'Refresh',
  STATUS: 'Status',
  ACCESS: 'Access',
  VERSION: 'Version',
  CREATED: 'Created',
  COMMENT: 'Comment',
  SUMMARY: 'Summary',
  NAME: 'Name',
  VALUE: 'Value',
  NA: 'N/A',
  ACTIONS: 'Actions',
  DESCRIPTION: 'Description',
  HELP_AND_SUPPORT: 'Help & Support',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  SAVE_SETTINGS: 'Save Settings',
  EMAIL: 'Email',
  SUPPORT_EMAIL: 'Support Email',
  SMTP_SERVICE: 'SMTP  Service',
  SMTP_HOST: 'SMTP  Host',
  SMTP_PORT: 'SMTP  Port',
  SMTP_USER: 'SMTP  User',
  SMTP_PASS: 'SMTP  Password',
  FROM_EMAIL: 'From Email',
  META_TITLE: 'Meta Title',
  ACTIVATE: 'Activate',
  DEACTIVATE: 'Deactivate',
  ROLE: 'Role',
  PROFILE: 'Profile',
  LOADING: 'Loading...',
  NIFI_FLOW: 'NiFi Flow',
  OK: 'OK',
  KINDLY_SELECT_DESTINATION: 'Kindly select your destination cluster',
  NO_NAMESPACES_AVAILABLE: 'No Process Groups Available', // TODO: change it to Process Groups
  SEARCH_NODES: 'Search NodeId , Address',
  TAG: 'Tag',
  SELECTED_VERSION: 'Selected Version',
  GROUP_EMAIL: 'Group Email Id',
  ENTER_GROUP_EMAIL: 'Enter your Group Email',
  EMAIL_REMINDER: 'Email Reminder Time',
  REMINDER_EMPHASISED_TEXT: 'before deployment schedule time',
  CONFIGURE: 'Configure',
  APP: 'App',
  LDAP: 'Ldap',
  SCHEDULE_DIPLOYMENT: 'Deployment Schedule',
  SERVICE_ACCOUNT: 'Service Account',
  SSO_LoGIN: 'SSO Login',
  SSO_LOGIN_TYPE: 'Login Type',
  LOGIN_TYPE: 'SSO',
  CONTROLLER_SERVICE_DATA: 'External Controller Services',
  SMTP: 'Email Configuration',
  FLOW_CONTROL_WARNING:
    'The "Start" and "Stop" buttons will be hidden if all the processors are either invalid or disabled.',

  CHANGE_CONFIGURATION: 'Change Configuration',
  SECHEDULED_TIME: 'Scheduled Time',
  FLOW_STATE_AFTER_DEPLOY: 'Flow state after deploy',
  SCHEDULE_UPGRADE: 'Schedule Upgrade',
  SCHEDULE_DOWNGRADE: 'Schedule Downgrade',

  DEPLOYMENT_SCHEDULE_LIST_REFRESH: 'Deployment Schedule List Refresh',
  ITEMS_PER_PAGE: 20,
  USER_STORY: 'User Story',
  CHANGE_REQUEST: 'Change Request',

  // License constants
  TRIAL: 'Trial',
  PURCHASED: 'Purchased',
  LICENSE: 'License',
  LICENSE_DETAILS: 'Licensing Details',

  TRIAL_EXPIRED_PROMPT: arg =>
    `Trial: Your trial license will expire on ${arg}.`,
  PURCHASED_EXPIRED_PROMPT: arg =>
    `Licensed: Your license will expire on ${arg}. Please renew it to continue using the platform.`,

  // module specific constants
  ...CLUSTER_CONSTANTS,
  ...NAMESPACE_CONSTANTS,
  ...ACTIVITY_HISTORY_CONSTANTS,
  ...USER_CONSTANTS,
  ...AI_FLOW_GENERATOR_CONSTANTS,
};

export const SIDE_MENUS_DISPLAY = [
  { path: 'dashboard', label: 'Dashboard' },
  { path: 'clusters', label: 'Clusters' },
  { path: 'process-group', label: 'Process Groups' },
  { path: 'schedule-deployment', label: 'Deployment Schedule' },
  { path: 'user-management', label: 'Users' },
  { path: 'role-&-permission', label: 'Roles & Permissions' },
  { path: 'activity-history', label: 'Activity History' },
  { path: 'ldap-configuration', label: 'LDAP Configuration' },
  { path: 'controller-service', label: 'Controller Services' },
  { path: 'setting', label: 'Settings' },
  { path: 'licensing', label: 'Licensing' },
  { path: 'ai-flow-generator', label: 'AI-Powered Data Flow' },
  { path: 'flow-analysis', label: 'Flow Analysis' },
  { path: 'data-flow-inventory', label: 'Data Flow Inventory' },
];

export const PAGINATION_ITEM_OPTIONS = [10, 15, 20, 25, 50];
export const SEARCH_INPUT_ERROR = 'Please enter atleast 2 characters to search';

export const TRUE_FALSE_OPTIONS = [
  { id: 1, value: 'true', label: 'True' },
  { id: 2, value: 'false', label: 'False' },
];

export const ZOOOKEEPER_EMBEDED_OPTIONS = [
  { id: 1, value: true, label: 'True' },
  { id: 2, value: false, label: 'False' },
];

export const ALWAYS_SYNC_OPTIONS = [
  { id: 1, value: 'true', label: 'True' },
  { id: 2, value: 'false', label: 'False' },
];

export const FLOW_ELECTION_MAX_WAIT_OPTIONS = [
  { label: '2 Min', value: '2 mins' },
  { label: '5 Min', value: '5 mins' },
  { label: '10 Min', value: '10 mins' },
];

export const ACCESS_CONTROL_OPTIONS = [
  { label: 'Open', value: 'Open' },
  { label: 'CreatorOnly', value: 'CreatorOnly' },
];

export const ZOOKEEPER_CONNECTION_TIMEOUT = [
  { label: '10 secs', value: '10 secs' },
  { label: '20 secs', value: '20 secs' },
  { label: '30 secs', value: '30 secs' },
  { label: '40 secs', value: '40 secs' },
  { label: '50 secs', value: '50 secs' },
  { label: '60 secs', value: '60 secs' },
];
export const CHECKPOINT_INTERVAL_OPTIONS = [
  { label: '2 Min', value: '2 mins' },
  { label: '4 Min', value: '4 mins' },
  { label: '6 Min', value: '6 mins' },
  { label: '8 Min', value: '8 mins' },
  { label: '10 Min', value: '10 mins' },
];

export const SESSION_TIMEOUT_OPTIONS = [
  { label: '10 seconds', value: '10 seconds' },
  { label: '20 seconds', value: '20 seconds' },
  { label: '30 seconds', value: '30 seconds' },
  { label: '40 seconds', value: '40 seconds' },
  { label: '50 seconds', value: '50 seconds' },
  { label: '60 seconds', value: '60 seconds' },
];

export const CLUSTER_ANSIBLE_DEFAULT_CONFIGURATION_VALUE = {
  nifi_cluster_flow_election_max_wait_time: '5 mins',
  nifi_zookeeper_connect_timeout: '10 secs',
  nifi_web_https_port: 8443,
  directory: './state/local',
  partitions: 16,
  root_node: '/nifi',
  session_timeout: '10 seconds',
  checkpoint_interval: '2 mins',
  java_arg_2: 0,
  java_arg_3: 0,
  always_sync: 'false',
  access_control: 'Open',
  loginProvider: 'single-user-provider',
  ldap_login_identity_strategy: 'USE_USERNAME',
  scope: 'SUBTREE',
  nifi_administrative_yield_duration: '30 sec',
  nifi_analytics_connection_model_implementation:
    'org.apache.nifi.controller.status.analytics.models.OrdinaryLeastSquares',
  nifi_analytics_connection_model_score_name: 'rSquared',
  nifi_analytics_connection_model_score_threshold: '.9',
  nifi_analytics_predict_enabled: 'false',
  nifi_analytics_predict_interval: '3 min',
  nifi_analytics_query_interval: '5 mins',
  nifi_authorizer_configuration_file: '',
  nifi_bored_yield_duration: '10 millis',
  nifi_cluster_load_balance_comms_timeout: '30s',
  nifi_cluster_node_event_history_size: '25',
  nifi_cluster_node_max_concurrent_requests: '100',
  nifi_cluster_node_protocol_threads: '50',
  nifi_cluster_node_read_timeout: '30 sec',
  nifi_cluster_protocol_heartbeat_interval: '5 sec',
  nifi_cluster_protocol_heartbeat_missable_max: '8',
  nifi_components_status_repository_buffer_size: '1440',
  nifi_components_status_repository_implementation:
    'org.apache.nifi.controller.status.history.VolatileComponentStatusRepository',
  nifi_components_status_snapshot_frequency: '1 min',
  nifi_content_claim_max_appendable_size: '1 MB',
  ///
  nifi_content_claim_max_flow_files: '100',
  nifi_content_repository_archive_max_retention_period: '12 hours',
  nifi_content_repository_archive_max_usage_percentage: '50%',
  nifi_content_repository_directory_default:
    '',
  nifi_content_repository_implementation:
    'org.apache.nifi.controller.repository.FileSystemRepository',
  nifi_content_viewer_url: '../nifi-content-viewer/',
  nifi_database_directory: '',
  nifi_documentation_working_directory:
    '',
  nifi_flow_configuration_archive_dir: '',
  nifi_flow_configuration_archive_max_count: '',
  nifi_flow_configuration_archive_max_storage: '500 MB',
  nifi_flow_configuration_archive_max_time: '30 days',
  nifi_flow_configuration_file: '',
  nifi_flowcontroller_graceful_shutdown_period: '10 sec',
  nifi_flowfile_repository_checkpoint_interval: '2 mins',
  nifi_flowfile_repository_directory: '',
  nifi_flowfile_repository_implementation:
    'org.apache.nifi.controller.repository.WriteAheadFlowFileRepository',
  nifi_flowfile_repository_partitions: '256',
  nifi_flowfile_repository_retain_orphaned_flowfiles: 'true',
  nifi_flowfile_repository_wal_implementation:
    'org.apache.nifi.wali.SequentialAccessWriteAheadLog',
  nifi_flowservice_writedelay_interval: '500 ms',
  nifi_h2_url_append: ';LOCK_TIMEOUT=25000;WRITE_DELAY=0;AUTO_SERVER=FALSE',
  nifi_kerberos_krb5_file: '',
  nifi_kerberos_service_keytab_location: '',
  nifi_kerberos_service_principal: '',
  nifi_kerberos_spnego_authentication_expiration: '12 hours',
  nifi_kerberos_spnego_keytab_location: '',
  nifi_kerberos_spnego_principal: '',
  nifi_login_identity_provider_configuration_file:
    '',
  nifi_nar_library_autoload_directory: '',
  nifi_nar_library_directory: '',
  nifi_nar_working_directory: '',
  nifi_provenance_repository_buffer_size: '100000',
  nifi_provenance_repository_concurrent_merge_threads: '2',
  nifi_provenance_repository_debug_frequency: '100',
  nifi_provenance_repository_directory_default:
    '{{nifi_provenance_repo_dir_default}}',
  nifi_provenance_repository_encryption_key: '',
  nifi_provenance_repository_encryption_key_id: '',
  nifi_provenance_repository_encryption_key_provider_implementation: '',
  nifi_provenance_repository_encryption_key_provider_location: '',
  nifi_provenance_repository_implementation:
    'org.apache.nifi.provenance.WriteAheadProvenanceRepository',
  nifi_provenance_repository_index_shard_size: '500 MB',
  nifi_provenance_repository_index_threads: '1',
  nifi_provenance_repository_indexed_attributes: '',
  nifi_provenance_repository_indexed_fields:
    'EventType, FlowFileUUID, Filename, ProcessorID, Relationship',
  nifi_provenance_repository_journal_count: '16',
  nifi_provenance_repository_max_attribute_length: '65536',
  nifi_provenance_repository_max_storage_size: '10 GB',
  nifi_provenance_repository_max_storage_time: '30 days',
  nifi_provenance_repository_query_threads: '2',
  nifi_provenance_repository_rollover_size: '100 MB',
  nifi_provenance_repository_rollover_time: '10 mins',
  nifi_provenance_repository_warm_cache_frequency: '1 hour',
  nifi_queue_backpressure_count: '10000',
  nifi_queue_backpressure_size: '1 GB',
  nifi_queue_swap_threshold: '20000',
  nifi_remote_contents_cache_expiration: '30 secs',
  nifi_remote_input_http_transaction_ttl: '30 sec',
  nifi_security_allow_anonymous_authentication: 'true',
  nifi_security_group_mapping_pattern_anygroup: '',
  nifi_security_group_mapping_transform_anygroup: '',
  nifi_security_group_mapping_value_anygroup: '',
  nifi_security_identity_mapping_pattern_dn: '',
  nifi_security_identity_mapping_pattern_kerb: '',
  nifi_security_identity_mapping_transform_dn: '',
  nifi_security_identity_mapping_transform_kerb: '',
  nifi_security_identity_mapping_value_dn: '',
  nifi_security_identity_mapping_value_kerb: '',
  nifi_security_keystore: '{{nifi_keystore}}',
  nifi_security_truststore: '{{nifi_truststore}}',
  nifi_security_truststoreType: '{{nifi_truststoreType}}',
  nifi_security_user_authorizer: '{{nifi_authorizer}}',
  nifi_security_ocsp_responder_certificate: '',
  nifi_security_ocsp_responder_url: '',
  nifi_security_user_knox_audiences: '',
  nifi_security_user_knox_cookieName: 'hadoop-jwt',
  nifi_security_user_knox_publicKey: '',
  nifi_security_user_knox_url: '',
  nifi_security_user_oidc_additional_scopes: '',
  nifi_security_user_oidc_claim_identifying_user: '',
  nifi_security_user_oidc_client_id: '',
  nifi_security_user_oidc_client_secret: '',
  nifi_security_user_oidc_connect_timeout: '5 secs',
  nifi_security_user_oidc_discovery_url: '',
  nifi_security_user_oidc_preferred_jwsalgorithm: '',
  nifi_security_user_oidc_read_timeout: '5 secs',
  nifi_sensitive_props_additional_keys: '',
  nifi_sensitive_props_algorithm: 'NIFI_PBKDF2_AES_GCM_256',
  nifi_sensitive_props_key: '{{nifi_sensitive_props_key}}',
  nifi_state_management_configuration_file:
    '{{nifi_config_dir}}/state-management.xml',
  nifi_state_management_provider_cluster: 'zk-provider',
  nifi_state_management_embedded_zookeeper_properties:
    '{{nifi_config_dir}}/zookeeper.properties',
  nifi_state_management_provider_local: 'local-provider',
  nifi_swap_in_period: '5 sec',
  nifi_swap_in_threads: '1',
  nifi_swap_manager_implementation:
    'org.apache.nifi.controller.FileSystemSwapManager',
  nifi_swap_out_period: '5 sec',
  nifi_swap_out_threads: '4',
  nifi_templates_directory: '{{nifi_internal_dir}}/templates',
  nifi_ui_autorefresh_interval: '30 sec',
  nifi_ui_banner_text: '',
  nifi_variable_registry_properties: '',
  nifi_version: '1.27.0.{{stack_version_buildnum}}',
  nifi_web_http_host: '{{nifi_node_nonssl_host}}',
  nifi_web_http_network_interface_default: '',
  nifi_web_http_port: '{{nifi_node_port}}',
  nifi_web_https_host: '{{nifi_node_ssl_host}}',
  // nifi_web_https_port: '{{nifi_node_ssl_port}}',
  nifi_web_https_network_interface_default: '',
  nifi_web_jetty_threads: '200',
  nifi_web_jetty_working_directory: '{{nifi_internal_dir}}/work/jetty',
  nifi_web_max_content_size: '',
  nifi_web_max_header_size: '16 KB',
  nifi_web_max_requests_per_second: '30000',
  nifi_web_proxy_context_path: '',
  nifi_web_should_send_server_version: 'true',
  nifi_web_war_directory: '{{nifi_install_dir}}/lib',
  nifi_zookeeper_connect_string: '{{zookeeper_quorum}}',
  // nifi_zookeeper_connect_timeout: '60 secs',
  nifi_zookeeper_root_node: '{{nifi_znode}}',
  nifi_zookeeper_session_timeout: '60 secs',
};
export const scopeOptions = [
  {
    label: 'Subtree',
    value: 'SUBTREE',
  },
  {
    label: 'One Level',
    value: 'ONE_LEVEL',
  },
  {
    label: 'Object',
    value: 'OBJECT',
  },
];
export const loginIdentityStrategy = [
  {
    label: 'USE_USERNAME',
    value: 'USE_USERNAME',
  },
  {
    label: 'USE_DN',
    value: 'USE_DN',
  },
];
