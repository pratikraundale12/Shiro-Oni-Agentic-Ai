import { debounce, get, isEmpty } from 'lodash';
import { SEARCH_DELAY } from '../constants';
import { getClustersList, getNamespacesList, getUsersList } from '../services';
import { toast } from 'react-toastify';

export const hasError = (errors, name) => {
  const error = get(errors, name);
  return !isEmpty(error?.message);
};

const fetchListData = {
  users: getUsersList,
  clusters: getClustersList,
  deploy: getNamespacesList,
  namespaces: getNamespacesList,
};

export const fetchGridData = debounce(
  async ({
    setState = () => null,
    module = '',
    search = '',
    page = 1,
    selectedSourceClusterId = '',
    selectedNamespaceId = '',
    selectedDestinationClusterId = '',
    selectedDestinationNamespaceId = '',
    ...rest
  }) => {
    try {
      setState(prev => ({
        ...prev,
        loaders: {
          ...prev.loaders,
          [module]: true,
        },
      }));
      const response = await fetchListData[module]({
        page,
        ...(search && { search }),
        ...(selectedSourceClusterId && {
          clusterId: selectedSourceClusterId,
        }),
        ...(selectedDestinationClusterId && {
          clusterId: selectedDestinationClusterId,
        }),
        ...(selectedNamespaceId && { namespaceId: selectedNamespaceId }),
        ...(selectedDestinationNamespaceId && {
          namespaceId: selectedDestinationNamespaceId,
        }),
        ...rest,
      });
      setState(prev => ({
        ...prev,
        gridData: {
          ...prev.gridData,
          [module]: response,
        },
        ...(module === 'clusters' && {
          clusterList: response.data || [],
        }),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [module]: error,
        },
      }));
      toast.error(
        error?.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
      console.log(error, 'datttt');
    } finally {
      setState(prev => ({
        ...prev,
        loaders: {
          ...prev.loaders,
          [module]: false,
        },
      }));
    }
  },
  SEARCH_DELAY
);

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
    toast.error(error?.message || 'Something went wrong. Please try again.');
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
