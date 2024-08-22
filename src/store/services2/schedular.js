export const schedularAPI = api => {
  const fetchSchedular = ({ params = {} }) =>
    api.get('/schedule-deployment', params);
  const createScheduleDeployment = ({ payload = {} }) =>
    api.post('/schedule-deployment', payload);
  return {
    fetchSchedular,
    createScheduleDeployment,
  };
};
