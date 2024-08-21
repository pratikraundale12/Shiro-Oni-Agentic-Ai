/* eslint-disable no-undef */
import { ACTIVITY_HISTORY_CONSTANTS } from './activityHistory.constant';
import { CLUSTER_CONSTANTS } from './cluster.constant';
import { NAMESPACE_CONSTANTS } from './namespace.constant';

// modules constants exports
export * from './login';

// generalconstants
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
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

export const REFRESH_OPTIONS = [
  { value: false, label: 'Off' },
  { value: 5000, label: '5 Seconds' },
  { value: 3000, label: '3 Seconds' },
  { value: 1000, label: '1 Seconds' },
];

export const ACCESS_OPTIONS = [
  { value: 'cluster_access', label: 'Cluster Access' },
  { value: 'dfm_access', label: 'DFM Access' },
];

export const RegexConst = {
  NAME: /^[a-zA-Z0-9 ]{3,}$/,
  NIFI_URL: /^(https?:\/\/)/,
};

export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

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
};

export const MODULE_LIST_MAP = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Clusters', value: 'cluster' },
  { label: 'Namespaces', value: 'namespace' },
  { label: 'User Management', value: 'user' },
  // ! Add More as needed
];

export const KDFM = {
  // Generic constants
  NIFI: 'NiFi',
  ADD: 'Add',
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
  USERNAME: 'Username',
  PASSWORD: 'Password',
  ENTER_USERNAME: 'Enter your Username',
  ENTER_PASSWORD: 'Enter your Password',
  NO_DATA_FOUND: 'No Data Found!!',
  NIFI_URL: 'NiFi URL',
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
  DESCRIPTION: 'Description',
  HELP_AND_SUPPORT: 'Help & Support',
  SOMETHING_WENT_WRONG: 'Something went wrong',

  // License constants
  TRIAL: 'Trial',
  PURCHASED: 'Purchased',
  LICENSE: 'License',
  TRIAL_EXPIRED_PROMPT: arg => `Trial: Your trial will expire on ${arg}.`,
  PURCHASED_EXPIRED_PROMPT: arg =>
    `Licensed: Your purchased license will expire on ${arg}. Please renew it to continue using the platform.`,

  // module specific constants
  ...CLUSTER_CONSTANTS,
  ...NAMESPACE_CONSTANTS,
  ...ACTIVITY_HISTORY_CONSTANTS,
};
