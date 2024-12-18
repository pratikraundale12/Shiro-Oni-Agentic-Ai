export const schedularAPI = api => {
  const fetchSchedular = ({ params = {} }) =>
    api.get('/schedule-deployments', params);
  const createScheduleDeployment = ({ payload = {} }) =>
    api.post('/schedule-deployment', payload);
  const editScheduleDeployment = ({ schedularId, payloadData }) =>
    api.patch(`/schedule-deployment/${schedularId}`, payloadData);
  const checkApproverToken = ({ params }) => {
    return api.get('/schedule-deployment/token', params);
  };
  const editScheduleByRegistry = ({ schedularId, state }) =>
    api.get(`/namespace-schedule/${schedularId}/state/${state}`);

  const rejectScheduleDeployment = ({ schedularId, payload = {} }) =>
    api.post(`/cancel-scheduled/${schedularId}`, payload);

  return {
    fetchSchedular,
    createScheduleDeployment,
    editScheduleDeployment,
    checkApproverToken,
    editScheduleByRegistry,
    rejectScheduleDeployment,
  };
};
