export const usersAPI = api => {
  const fetchUsers = ({ params = {} }) => api.get('/users', params);
  const fetchUsersWithAdminId = ({ params = {}, admin_role_id = '' }) =>
    api.get(`/users?role_id=${admin_role_id}`, params);

  return {
    fetchUsers,
    fetchUsersWithAdminId,
  };
};
