import API from './api';

export const fetchDefaultRecentFlows = async () => {
  try {
    return await API.get(`/default-recent-flows`);
  } catch (error) {
    return error?.response?.data;
  }
};
