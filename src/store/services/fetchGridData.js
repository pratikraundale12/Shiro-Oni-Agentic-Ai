import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import {
  getClustersList,
  getNamespacesList,
  getNodeList,
  getUsersList,
} from '../apis';
import { SEARCH_DELAY } from '../../utils';

const fetchListData = {
  users: getUsersList,
  clusters: getClustersList,
  deploy: getNamespacesList,
  namespaces: getNamespacesList,
  nodeList: getNodeList,
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
      const clusterData = localStorage.getItem('clusters');
      const response = await fetchListData[module]({
        page,
        ...(search && { search }),
        ...(module === 'clusters' && {
          clusterData: JSON.parse(clusterData),
        }),
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
      if (
        (module === 'namespaces' || module === 'deploy') &&
        response.data &&
        response.data.length === 0
      ) {
        toast.info('No Data Found');
        return;
      }
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
