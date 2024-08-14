export const usersAPI = api => {
  const fetchUsers = ({ params = {} }) => api.get('/users', params);

  return {
    fetchUsers,
  };
};
