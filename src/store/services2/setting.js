export const settingsAPI = api => {
  console.log('hhh');
  const fetchSettings = ({ params = {} }) => api.get('/settings', params);
  const createSettings = ({ payload = {} }) => api.patch('/settings', payload);
  return {
    createSettings,
    fetchSettings,
  };
};
