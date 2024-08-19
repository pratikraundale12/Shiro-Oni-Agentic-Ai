export const schedularAPI = api => {
  const fetchSchedular = ({ params = {} }) =>
    api.get('/schedule-deployment', params);

  return {
    fetchSchedular,
  };
};
