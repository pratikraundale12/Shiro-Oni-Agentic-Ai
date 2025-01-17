/* eslint-disable */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SortDownIcon, SortUpIcon } from '../assets';
import { GridActions, GridSelectors } from '../store';

const SortingComponent = ({ sortProperty, module = '' }) => {
  const [isAscending, setIsAscending] = useState(true);
  const dispatch = useDispatch();

  // Get data from Redux store
  const gridData = useSelector(state =>
    GridSelectors.getGridData(state, module)
  );
  const gridDataAll = useSelector(state =>
    GridSelectors.getModuleAllData(state, module)
  );

  // Generic sort function
  const sortByProperty = (data, property, ascending = true) => {
    const clonedArray = [...data];
    return clonedArray.sort((a, b) => {
      const valueA = a[property] ? a[property].toLowerCase() : '';
      const valueB = b[property] ? b[property].toLowerCase() : '';
      if (!valueA && !valueB) return 0;
      if (!valueA) return ascending ? 1 : -1;
      if (!valueB) return ascending ? -1 : 1;

      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  // Handle toggle sort
  const handleToggleSort = () => {
    const sortedData = sortByProperty(gridData, sortProperty, isAscending);

    dispatch(
      GridActions.fetchGridSuccess({
        module,
        data: {
          data: sortedData,
          count: gridDataAll?.count,
          next: gridDataAll?.next,
          prev: gridDataAll?.prev,
        },
      })
    );

    setIsAscending(!isAscending);
  };

  return (
    <button onClick={handleToggleSort} style={{ border: 'none' }}>
      {isAscending ? <SortDownIcon /> : <SortUpIcon />}
    </button>
  );
};

export default SortingComponent;
