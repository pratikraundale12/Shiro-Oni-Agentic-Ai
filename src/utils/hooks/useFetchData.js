import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    },
    [module]
  );

  const debouncedFetchData = useCallback(
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
    error,
    search,
    setSearch,
    page,
    setPage,
  };
};
