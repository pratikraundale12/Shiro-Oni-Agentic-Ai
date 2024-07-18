import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { getUsersList } from '../services';
import { SEARCH_DELAY } from '../constants';

const fetchListData = {
  users: getUsersList,
};

export const useFetchData = module => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(
    async value => {
      try {
        const response = await fetchListData[module]({ search: value });
        setData(response.data);
      } catch (error) {
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    },
    [module]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchData = useCallback(
    debounce(term => fetchData(term), SEARCH_DELAY),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData(search);
  }, [debouncedFetchData, search]);

  return { data, loading, error, search, setSearch };
};
