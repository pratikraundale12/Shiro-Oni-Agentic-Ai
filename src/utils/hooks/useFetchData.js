import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { getUsersList } from '../services';
import { SEARCH_DELAY } from '../constants';

const fetchListData = {
  users: getUsersList,
};

export const useFetchData = module => {
  const [dataCount, setDataCount] = useState(0);
  const [data, setData] = useState([]);
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
        setDataCount(response.count);
        setData(response.data);
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
    dataCount,
    data,
    loading,
    error,
    search,
    setSearch,
    setPage,
    page,
  };
};
