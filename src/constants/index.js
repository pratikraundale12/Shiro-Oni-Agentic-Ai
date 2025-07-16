/* eslint-disable no-undef */
import { ACTIVITY_HISTORY_CONSTANTS } from './activityHistory.constant';
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
  { label: 'Local Changes', value: 'Local Changes' },
  { label: 'Audit', value: 'Audit' },
];

export const ACTIVITY_STATUS_OPTIONS = [
  { label: 'Success', value: 'Success' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Deployed', value: 'DEPLOYED' },
  { label: 'Upgraded', value: 'UPGRADED' },
  { label: 'Downgrade', value: 'DOWNGRADED' },
  { label: 'Started', value: 'STARTED' },
  { label: 'Stopped', value: 'STOPPED' },
  { label: 'Deployed With Errors', value: 'DEPLOYED_WITH_ERRORS' },
  { label: 'Upgraded With Errors', value: 'UPGRADED_WITH_ERRORS' },
  { label: 'Downgraded With Errors', value: 'DOWNGRADED_WITH_ERRORS' },
  { label: 'Started With Errors', value: 'STARTED_WITH_ERRORS' },
  { label: 'Stopped With Errors', value: 'STOPPED_WITH_ERRORS' },
];

export const ACTIVITY_EVENTS = [
  { label: 'Add', value: 'Add' },
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
  { label: 'Enable', value: 'Enable' },
  { label: 'Disable', value: 'Disable' },
  { label: 'Revert', value: 'Revert' },
  { label: 'Schedule Stop', value: 'Schedule Stop' },
  { label: 'Schedule Start', value: 'Schedule Start' },
  { label: 'Sanity Check', value: 'Sanity Check' },
  { label: 'Download', value: 'Download' },
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
  TO_EMAIL: 'To Email',
  SEND_EMAIL: 'Send Email',
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
  SCHEDULE_FLOW_CONTROL_WARNING:
    'The "Schedule Start" and "Schedule Stop" buttons will be hidden if all the processors are either invalid or disabled.',
  SCHEDULE_AUTOMATIC_START_FLOW:
    'The process group has been successfully deployed and is scheduled to start automatically at the specified date and time.',

  CHANGE_CONFIGURATION: 'Change Configuration',
  LAST_SYNC: 'Last Sync Time',
  SECHEDULED_TIME: 'Scheduled Time',
  FLOW_STATE_AFTER_DEPLOY: 'Flow state after deploy',
  SCHEDULE_UPGRADE: 'Schedule Upgrade',
  SCHEDULE_DOWNGRADE: 'Schedule Downgrade',

  DEPLOYMENT_SCHEDULE_LIST_REFRESH: 'Deployment Schedule List Refresh',
  ITEMS_PER_PAGE: 20,
  USER_STORY: 'User Story',
  CHANGE_REQUEST: 'Change Request',
  PLEASE_LOGIN_TO_CLUSTER: 'Please login to cluster',

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
];

export const PAGINATION_ITEM_OPTIONS = [10, 15, 20, 25, 50];
export const SEARCH_INPUT_ERROR = 'Please enter atleast 2 characters to search';
