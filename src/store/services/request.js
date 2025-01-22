import { toast } from 'react-toastify';

export const request = async (setState, path, api, data) => {
  try {
    setState(prev => ({
      ...prev,
      loaders: {
        ...prev.loaders,
        [path]: true,
      },
    }));
    const response = await api(data);
    if ([200, 201, 204].includes(response.status)) return response.data;
    throw response;
  } catch (error) {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [path]: error,
      },
    }));
    toast.error(error?.message || error?.data?.message);
  } finally {
    setState(prev => ({
      ...prev,
      loaders: {
        ...prev.loaders,
        [path]: false,
      },
    }));
  }
};
