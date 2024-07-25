import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';

import { getClustersList, getNamespacesList, getUsersList } from '../services';
import { SEARCH_DELAY } from '../constants';

const fetchListData = {
  users: getUsersList,
  clusters: getClustersList,
  namespaces: getNamespacesList,
};

export const useFetchData = module => {
  const [response, setResponse] = useState({
    count: 0,
    prev: null,
    next: null,
    data: [],
    breadcrumb: [],
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(
    async ({ searchTerm, page }) => {
      try {
        setLoading(true);
        const response = await fetchListData[module]({
          search: searchTerm,
          page,
        });
        setResponse(response);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Error fetching data'
        );
      } finally {
        setLoading(false);
      }
    },
    [module]
  );

  const debouncedFetchData = useMemo(
    () =>
      debounce(
        ({ searchTerm, page }) => fetchData({ searchTerm, page }),
        SEARCH_DELAY
      ),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData({ searchTerm: search, page });
  }, [search, page, debouncedFetchData]);

  return {
    response,
    loading,
    search,
    setSearch,
    page,
    setPage,
  };
};
