export const API_URL = 'http://localhost:8000';
export const ACCESS_TOKEN = 'access_token';

export const SEARCH_DELAY = 500;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export const REFRESH_OPTIONS = [
  { value: false, label: 'Off' },
  { value: 5000, label: '5 Seconds' },
  { value: 30000, label: '30 Seconds' },
  { value: 100000, label: '1 Minute' },
];

export const ACCESS_OPTIONS = [
  { value: 'cluster_access', label: 'Cluster Access' },
  { value: 'dfm_access', label: 'DFM Access' },
];

export const RegexConst = {
  NAME: /^[a-zA-Z0-9 ]{3,}$/,
  NIFI_URL: /^(https?:\/\/)/,
};
export * from './login';
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
