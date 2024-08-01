export const API_URL = 'http://localhost:8000';
export const ACCESS_TOKEN = 'access_token';

export const SEARCH_DELAY = 500;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const REFRESH_OPTIONS = [
  { value: null, label: 'Off' },
  { value: 5, label: '5 Seconds' },
  { value: 10, label: '10 Seconds' },
];

export const RegexConst = {
  NAME: /^[a-zA-Z0-9 ]{3,}$/,
  NIFI_URL: /^(https?:\/\/)/,
};
export * from './login';
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
