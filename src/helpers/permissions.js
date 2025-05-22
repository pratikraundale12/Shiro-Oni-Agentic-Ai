export const getButtonPermissions = module => {
  switch (module) {
    case 'clusters':
      return 'add_cluster';
    case 'users':
      return 'add_user';
    case 'registry':
      return 'add_registry';
    default:
      return '';
  }
};
