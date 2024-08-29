export const schedularAPI = api => {
  const fetchSchedular = ({ params = {} }) =>
    api.get('/schedule-deployment', params);
  const createScheduleDeployment = ({ payload = {} }) =>
    api.post('/schedule-deployment', payload);
  const editScheduleDeployment = ({ schedularId, payloadData }) =>
    api.patch(`/schedule-deployment/${schedularId}`, payloadData);
  return {
    fetchSchedular,
    createScheduleDeployment,
    editScheduleDeployment,
  };
};
