export const schedularAPI = api => {
  const fetchSchedular = ({ params = {} }) =>
    api.get('/schedule-deployments', params);
  const createScheduleDeployment = ({ payload = {} }) =>
    api.post('/schedule-deployment', payload);
  const editScheduleDeployment = ({ schedularId, payloadData }) =>
    api.post(`/rechedule-job/${schedularId}`, payloadData);
  const editScheduleByRegistry = ({ schedularId, state }) =>
    api.get(`/namespace-schedule/${schedularId}/state/${state}`);

  const rejectScheduleDeployment = ({ schedularId, payload = {} }) =>
    api.post(`/cancel-scheduled/${schedularId}`, payload);

  const fetchDiffScheduleData = ({ schedularId, event }) =>
    event !== ''
      ? api.get(`/diff-schedule-deployment/${schedularId}/${event}`)
      : api.get(`/diff-schedule-deployment/${schedularId}`);
  const fetchGroupUserData = ({ groupId }) =>
    api.get(`/group-users/${groupId}`);
  const fetchScheduleDeploymentDetails = ({ schedularId }) =>
    api.get(`/schedule-deployment-details/${schedularId}`);
  const scheduleSanityAndDeploy = ({ schedularId, clusterId }) =>
    api.get(`/cluster/${clusterId}/schedule-sanity-and-deploy/${schedularId}`);
  return {
    fetchSchedular,
    createScheduleDeployment,
    editScheduleDeployment,
    editScheduleByRegistry,
    rejectScheduleDeployment,
    fetchDiffScheduleData,
    fetchGroupUserData,
    fetchScheduleDeploymentDetails,
    scheduleSanityAndDeploy,
  };
};
