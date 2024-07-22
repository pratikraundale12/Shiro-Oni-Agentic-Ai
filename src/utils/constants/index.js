export const API_URL = 'api';
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

export * from './login';
